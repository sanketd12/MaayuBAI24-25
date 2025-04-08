from qdrant_client import QdrantClient
from app.settings import settings

qdrant_client = QdrantClient(
    url=settings.QDRANT_URL, 
    api_key=settings.QDRANT_API_KEY,
)

print(qdrant_client.get_collections())