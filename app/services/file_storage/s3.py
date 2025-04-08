from app.services.file_storage.base import BaseFileStorageService
from app.settings import settings

import boto3
from typing import BinaryIO
import uuid
import structlog
import os

from fastapi import UploadFile

logger = structlog.get_logger(__name__)
class S3FileStorageService(BaseFileStorageService):
    _client = None

    async def _connect(self):
        if not self._client:
            self._client = boto3.client(
                "s3",
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                region_name=settings.AWS_REGION,
            )
        return self._client
    
    async def _convert_file_obj(self, file_obj: UploadFile) -> BinaryIO:
        """
        Converts/prepares a FastAPI UploadFile for S3 upload.

        Args:
            file_obj: The UploadFile object from the FastAPI request.

        Returns:
            A file-like object (BinaryIO) ready for upload.
        """
        await file_obj.seek(0)
        return file_obj.file
    
    async def upload_object(self, file_obj: UploadFile, filename: str, content_type: str):
        try:
            # convert file_obj
            file_obj = await self._convert_file_obj(file_obj)
            
            key = f"{uuid.uuid4()}/{filename}"
            self._client.upload_fileobj(
                file_obj,
                settings.AWS_S3_BUCKET,
                key,
                ExtraArgs={"ContentType": content_type}
            )
            return key
        except Exception as e:
            logger.error(f"Error uploading object to S3: {e}")
            raise e
    
    async def get_object(self, key: str):
        try:
            response = self._client.get_object(Bucket=settings.AWS_S3_BUCKET, Key=key)
            return response["Body"].read()
        except Exception as e:
            logger.error(f"Error getting object from S3: {e}")
            raise e
    
    async def delete_object(self, key: str):
        try:
            self._client.delete_object(Bucket=settings.AWS_S3_BUCKET, Key=key)
        except Exception as e:
            logger.error(f"Error deleting object from S3: {e}")
            raise e
