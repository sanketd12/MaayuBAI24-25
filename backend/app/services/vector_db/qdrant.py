import structlog

from qdrant_client import AsyncQdrantClient
from qdrant_client.models import PointStruct
from uuid import uuid4

from app.settings import settings
from app.services.vector_db.base import VectorDBServiceBase
from app.models.resume import Resume
from app.services.embedding.embedding_service import EmbeddingServiceBase
from app.services.embedding.openai import OpenAIEmbeddingService
from app.services.embedding.google import GoogleEmbeddingService
from typing import Literal

logger = structlog.get_logger(__name__)

class QdrantVectorDBService(VectorDBServiceBase):
    def __init__(self, embedding_provider: Literal["openai", "google"] = "google"):
        self.client = AsyncQdrantClient(
            url=settings.QDRANT_URL, 
            api_key=settings.QDRANT_API_KEY,
        )
        self.embedder: EmbeddingServiceBase = OpenAIEmbeddingService() if embedding_provider == "openai" else GoogleEmbeddingService()

    def _resume_to_string(self, resume: Resume) -> str:
        parts = [
            f"Name: {resume.name}",
            f"Summary: {resume.summary}",
            "\nEducation:",
        ]
        for edu in resume.education:
            edu_year = f" ({edu.start_year} - {edu.end_year})" if edu.start_year and edu.end_year else ""
            parts.append(f"- {edu.institution_name}{edu_year}")

        parts.append("\nWork Experience:")
        for work in resume.work_experience:
            work_year = f" ({work.start_year} - {work.end_year})" if work.start_year and work.end_year else ""
            parts.append(f"- {work.organization_name}{work_year}: {work.description}")

        parts.append("\nSkills:")
        # Assuming Skill model has a 'name' attribute based on common patterns
        parts.extend([f"- {skill.name}" for skill in resume.skills]) # You might need to adjust if Skill model is different

        parts.append("\nHonors:")
        for honor in resume.honors:
            honor_year = f" ({honor.year})" if honor.year else ""
            parts.append(f"- {honor.name}{honor_year}")

        parts.append("\nCertificates:")
        for cert in resume.certificates:
            cert_year = f" ({cert.year})" if cert.year else ""
            parts.append(f"- {cert.name}{cert_year}")

        if resume.miscellaneous:
            parts.append("\nMiscellaneous:")
            parts.append(resume.miscellaneous)

        return "\n".join(parts)

    async def upsert_resume(self, resume: Resume, **kwargs) -> bool:
        try:
            resume_string = self._resume_to_string(resume)
            logger.info(f"Upserting resume: {resume_string}")
            embedding = await self.embedder.embed(resume_string)
            await self.client.upsert(
                collection_name=settings.QDRANT_COLLECTION_NAME,
                points=[PointStruct(
                    id=str(uuid4()),
                    vector=embedding,
                    payload={"resume": resume},
                )],
            )
            return True
        except Exception as e:
            logger.error(f"Error upserting resume: {e}")
            raise e
        
    async def retrieve_REMOVED_BUCKET_NAME(self, query: str, num_REMOVED_BUCKET_NAME: int = 10, stringify: bool = False) -> list[Resume] | str:
        try:
            embedded_query = await self.embedder.embed(query)
            results = await self.client.search(
                collection_name=settings.QDRANT_COLLECTION_NAME,
                query_vector=embedded_query,
                limit=num_REMOVED_BUCKET_NAME,
                with_payload=True
            )
            REMOVED_BUCKET_NAME: list[Resume] = []
            for result in results:
                if result.payload and "resume" in result.payload:
                    try:
                        resume_obj = Resume.model_validate(result.payload["resume"])
                        REMOVED_BUCKET_NAME.append(resume_obj)
                    except Exception as parse_error:
                        logger.error(f"Failed to parse resume payload: {result.payload.get('resume')}, Error: {parse_error}")
                else:
                     logger.warning(f"Found result with missing or empty payload: {result.id}")

            if stringify:
                resume_strings = []
                for resume in REMOVED_BUCKET_NAME:
                    resume_string = self._resume_to_string(resume)
                    resume_strings.append(resume_string)
                return "\n\n ---------- \n\n".join(resume_strings)
            else:
                return REMOVED_BUCKET_NAME
        except Exception as e:
            logger.error(f"Error retrieving REMOVED_BUCKET_NAME: {e}")
            raise e
