from abc import ABC, abstractmethod
from app.models.resume import Resume

class VectorDBServiceBase(ABC):
    @abstractmethod
    async def upsert_resume(self, resume: Resume, **kwargs) -> bool:
        pass