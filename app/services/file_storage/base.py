from abc import ABC, abstractmethod
from fastapi import UploadFile
from app.utils.singleton import AbstractSingleton


class BaseFileStorageService(ABC, metaclass=AbstractSingleton):
    client = None

    @abstractmethod
    async def _connect(self, **kwargs):
        raise NotImplementedError()

    async def connect(self):
        if self.client is None:
            return await self._connect()
        return self.client
    
    @abstractmethod
    async def upload_object(self, file_obj: UploadFile, key: str, content_type: str):
        raise NotImplementedError()
    
    @abstractmethod
    async def get_object(self, key: str):
        raise NotImplementedError()
    
    @abstractmethod
    async def delete_object(self, key: str):
        raise NotImplementedError()
    
