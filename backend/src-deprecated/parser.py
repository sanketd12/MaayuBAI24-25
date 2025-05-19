from typing import Optional, List
from pathlib import Path
import json
import openai
from docx import Document
from langchain_community.document_loaders import PyPDFLoader
import boto3
from io import BytesIO
import logging
from tenacity import retry, stop_after_attempt, wait_exponential

from config import (
    AWS_CONFIG,
    OPENAI_CONFIG,
    logger,
    BASE_DIR
)
from data_models import UserInformation

# Initialize AWS client
s3_client = boto3.client(
    's3',
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
    region_name=AWS_CONFIG['region_name']
)

# Initialize OpenAI client
client = openai.OpenAI(**OPENAI_CONFIG)

@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
def get_user_details(content: str, ObjOutput: type) -> str:
    """
    Call the LLM to get structured data from resume content.
    
    Args:
        content: The resume content to analyze
        ObjOutput: The Pydantic model class to validate against
        
    Returns:
        str: JSON string containing the structured data
        
    Raises:
        Exception: If the API call fails after retries
    """
    try:
        cleaned_content = ''.join(char for char in content if ord(char) >= 32 or char in '\n\r\t')
        logger.debug(f"Processing content of length: {len(cleaned_content)}")
        
        chat_completion = client.chat.completions.create(
            model=OPENAI_CONFIG["model"],
            response_format={"type": "json_object", "schema": ObjOutput.model_json_schema()},
            messages=[
                {"role": "system", "content": "You are a helpful assistant that answers in JSON. You are analyzing a resume and returning relevant information in a concise manner."},
                {"role": "user", "content": cleaned_content},
            ],
        )
        return chat_completion.choices[0].message.content
    except Exception as e:
        logger.error(f"Error in get_user_details: {str(e)}")
        raise

def parse_pdf(pdf_path: str) -> str:
    """
    Parse a PDF file and extract its content.
    
    Args:
        pdf_path: Path to the PDF file
        
    Returns:
        str: Extracted text content
        
    Raises:
        Exception: If the PDF cannot be parsed
    """
    try:
        logger.info(f"Parsing PDF: {pdf_path}")
        loader = PyPDFLoader(pdf_path)
        pages = loader.load_and_split()
        content = ''.join(page.page_content for page in pages)
        logger.debug(f"Successfully parsed PDF: {pdf_path}")
        return content
    except Exception as e:
        logger.error(f"Error parsing PDF {pdf_path}: {str(e)}")
        raise

def parse_doc(doc_path: str) -> str:
    """
    Parse a DOC/DOCX file and extract its content.
    
    Args:
        doc_path: Path to the DOC/DOCX file
        
    Returns:
        str: Extracted text content
        
    Raises:
        Exception: If the document cannot be parsed
    """
    try:
        logger.info(f"Parsing document: {doc_path}")
        doc = Document(doc_path)
        content = "\n".join([para.text for para in doc.paragraphs]).strip()
        logger.debug(f"Successfully parsed document: {doc_path}")
        return content
    except Exception as e:
        logger.error(f"Error parsing document {doc_path}: {str(e)}")
        raise

def parse_doc_from_s3(bucket_name: str, file_key: str) -> str:
    """
    Parse a document from S3 storage.
    
    Args:
        bucket_name: Name of the S3 bucket
        file_key: Key of the file in S3
        
    Returns:
        str: Extracted text content
        
    Raises:
        Exception: If the document cannot be downloaded or parsed
    """
    try:
        logger.info(f"Processing file from S3: {file_key}")
        temp_file_path = BASE_DIR / f"temp_{Path(file_key).name}"
        
        # Download the file from S3
        s3_client.download_file(bucket_name, file_key, str(temp_file_path))
        
        # Parse the document
        content = parse_doc(str(temp_file_path))
        
        # Clean up
        if temp_file_path.exists():
            temp_file_path.unlink()
            
        logger.info(f"Successfully processed file from S3: {file_key}")
        return content
        
    except Exception as e:
        logger.error(f"Error processing S3 file {file_key}: {str(e)}")
        raise

def generate_json(content: str, output_json_path: str) -> None:
    """
    Generate JSON from resume content and save to file.
    
    Args:
        content: The resume content
        output_json_path: Path to save the JSON file
        
    Raises:
        Exception: If JSON generation or file writing fails
    """
    try:
        logger.info(f"Generating JSON for: {output_json_path}")
        user_info = json.loads(get_user_details(content, UserInformation))
        
        # Ensure output directory exists
        output_path = Path(output_json_path)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        
        # Save to JSON file
        with open(output_json_path, 'w', encoding='utf-8') as f:
            json.dump(user_info, f, ensure_ascii=False, indent=4)
        logger.info(f"Successfully generated JSON: {output_json_path}")
        
    except Exception as e:
        logger.error(f"Error generating JSON for {output_json_path}: {str(e)}")
        raise

def load_users_from_s3(bucket_name: str, json_folder_path: str) -> None:
    """
    Process all documents in an S3 bucket and generate JSON files.
    
    Args:
        bucket_name: Name of the S3 bucket
        json_folder_path: Path to save JSON files
        
    Raises:
        Exception: If bucket access or processing fails
    """
    try:
        logger.info(f"Starting S3 processing for bucket: {bucket_name}")
        already_used = set()

        def generate_json_unique_name(resume_name: str, content: str) -> None:
            original = resume_name
            n = 1
            while resume_name in already_used:
                resume_name = f'{original} ({n})'
                n += 1
            already_used.add(resume_name)
            generate_json(content, str(Path(json_folder_path) / f"{resume_name}.json"))

        # List and process objects in bucket
        response = s3_client.list_objects_v2(Bucket=bucket_name)
        if 'Contents' not in response:
            logger.warning(f"No files found in bucket: {bucket_name}")
            return

        logger.info(f"Found {len(response['Contents'])} files in bucket")
        for obj in response['Contents']:
            file_key = obj['Key']
            if file_key.lower().endswith(('.doc', '.docx')):
                try:
                    logger.info(f"Processing file: {file_key}")
                    content = parse_doc_from_s3(bucket_name, file_key)
                    resume_name = Path(file_key).stem
                    generate_json_unique_name(resume_name, content)
                    logger.info(f"Successfully processed: {file_key}")
                except Exception as e:
                    logger.error(f"Error processing file {file_key}: {str(e)}")
                    
    except Exception as e:
        logger.error(f"Error accessing bucket {bucket_name}: {str(e)}")
        raise

def main() -> None:
    """Main function to process REMOVED_BUCKET_NAME from S3."""
    try:
        bucket_name = AWS_CONFIG['bucket_name']
        json_folder_path = BASE_DIR / 'json'
        load_users_from_s3(bucket_name, str(json_folder_path))
    except Exception as e:
        logger.error(f"Error in main: {str(e)}")
        raise

if __name__ == '__main__':
    main()
