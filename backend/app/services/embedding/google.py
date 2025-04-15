import structlog

from app.settings import settings
from app.services.embedding.embedding_service import EmbeddingServiceBase
from langchain_google_genai import GoogleGenerativeAIEmbeddings

logger = structlog.get_logger(__name__)

class GoogleEmbeddingService(EmbeddingServiceBase):
    def __init__(self):
        self.client = GoogleGenerativeAIEmbeddings(
            google_api_key=settings.GOOGLE_API_KEY,
            model=f"models/{settings.GOOGLE_EMBEDDING_MODEL}",
        )

    async def embed(self, text: str, **kwargs) -> list[float]:
        return self.client.embed_query(text)