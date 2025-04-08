from abc import ABC, abstractmethod

class EmbeddingServiceBase(ABC):
    @abstractmethod
    async def embed(self, text: str | list[str], **kwargs) -> list[float]:
        pass