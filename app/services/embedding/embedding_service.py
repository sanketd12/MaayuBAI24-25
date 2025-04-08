from abc import ABC, abstractmethod

class EmbeddingServiceBase(ABC):
    @abstractmethod
    async def embed(self, text: str, **kwargs) -> list[float]:
        pass

    @abstractmethod
    async def embed_batch(self, texts: list[str], **kwargs) -> list[list[float]]:
        pass