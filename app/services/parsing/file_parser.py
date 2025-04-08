from io import BytesIO
from docling.datamodel.base_models import DocumentStream
from docling.document_converter import DocumentConverter
from fastapi import UploadFile

import structlog

logger = structlog.get_logger(__name__)

class FileProcessor:
    def __init__(self):
        self.converter = DocumentConverter()

    async def parse(self, file: UploadFile) -> str:
        try:
            content = await file.read()
            file_stream = BytesIO(content)
            doc_stream = DocumentStream(name=file.filename, stream=file_stream)
            # Ensure convert is awaited if it's async, otherwise remove await
            # Assuming convert might not be async based on common usage, let's remove await first.
            # If it fails, we know convert is indeed async.
            parsed_document_result = self.converter.convert(doc_stream)
            return parsed_document_result.document.export_to_markdown()
        except Exception as e:
            logger.error(f"Error parsing file {file.filename}: {e}")
            # Re-raise the exception or handle it as appropriate
            raise e
        finally:
            # Ensure the file cursor is reset if needed, though UploadFile handles this.
            # Close the BytesIO stream
            if 'file_stream' in locals() and file_stream:
                 file_stream.close()

    async def batch_parse(self, files: list[UploadFile]) -> list[str]:
        conv_results = self.converter.convert_all(
            [file.file for file in files],
            raises_on_error=False,  # to let conversion run through all and examine results at the end
        )
        return [conv_result.document.export_to_markdown() for conv_result in conv_results]