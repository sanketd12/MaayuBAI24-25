from docling.document_converter import DocumentConverter
from fastapi import UploadFile

import structlog

logger = structlog.get_logger(__name__)

class FileProcessor:
    def __init__(self):
        self.converter = DocumentConverter()

    async def parse(self, file: UploadFile) -> str:
        parsed_document = await self.converter.convert(file)
        return parsed_document.document.export_to_markdown()
    
    async def batch_parse(self, files: list[UploadFile]) -> list[str]:
        conv_results = self.converter.convert_all(
            [file.file for file in files],
            raises_on_error=False,  # to let conversion run through all and examine results at the end
        )
        return [conv_result.document.export_to_markdown() for conv_result in conv_results]