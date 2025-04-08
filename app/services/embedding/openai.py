import openai
import structlog

from app.settings import settings
from app.services.embedding.embedding_service import EmbeddingServiceBase

logger = structlog.get_logger(__name__)

class OpenAIEmbeddingService(EmbeddingServiceBase):
    def __init__(self):
        self.client = openai.AsyncClient(api_key=settings.OPENAI_API_KEY)
        self.embedding_model = settings.OPENAI_EMBEDDING_MODEL

    async def embed(self, text: str, **kwargs) -> list[float]:
        response = await self.client.embeddings.create(
            model=self.embedding_model,
            input=text,
        )
        return response.data[0].embedding