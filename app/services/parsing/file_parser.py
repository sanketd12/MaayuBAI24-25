from fastapi import UploadFile
from langchain_google_genai import ChatGoogleGenerativeAI
import structlog
from app.settings import settings
import asyncio
import base64
import fitz
from app.models.resume import Resume
from langchain_core.messages import HumanMessage

logger = structlog.get_logger(__name__)

def get_langchain_message(image_url: str) -> HumanMessage:
    return HumanMessage(
        content=[
            {"type": "image_url", "image_url": {"url": image_url}},
        ],
    )

class FileProcessor:
    def __init__(self):
        llm = ChatGoogleGenerativeAI(model=settings.GOOGLE_PARSING_MODEL, api_key=settings.GOOGLE_API_KEY)
        self.client = llm.with_structured_output(Resume)

    async def parse(self, file: UploadFile) -> Resume:
        try:
            # Read uploaded file into memory
            pdf_data = await file.read()

            # Open PDF with PyMuPDF
            pdf_document = fitz.open(stream=pdf_data, filetype="pdf")

            async def fitz_image_conversion(page_num):
                page = pdf_document[page_num]

                # Convert page to image pixels
                pix = page.get_pixmap()

                # Convert to PNG format and then to base64
                img_bytes = pix.tobytes("png")
                base64_string = base64.b64encode(img_bytes).decode("utf-8")

                # Add the required data URI prefix
                return f"data:image/png;base64,{base64_string}"

            # Process all pages concurrently using asyncio.gather
            page_images = await asyncio.gather(
                *[fitz_image_conversion(page_num) for page_num in range(len(pdf_document))]
            )

            messages = [HumanMessage(
                content="Extract all appropriate information from this resume. Do not make anything up"
            )]

            for image_url in page_images:
                messages.append(get_langchain_message(image_url))

            return await self.client.ainvoke(messages)

        except Exception as e:
            logger.error(f"Error parsing file {file.filename}: {e}")
            raise e