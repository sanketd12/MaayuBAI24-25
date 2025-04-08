from abc import ABC, abstractmethod

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
    async def upload_object(self, file_path: str, bucket_name: str, key: str):
        raise NotImplementedError()
    
    @abstractmethod
    async def get_object(self, bucket_name: str, key: str):
        raise NotImplementedError()
    
    @abstractmethod
    async def delete_object(self, bucket_name: str, key: str):
        raise NotImplementedError()
    
