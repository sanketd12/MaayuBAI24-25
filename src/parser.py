from langchain_community.document_loaders import PyPDFLoader
from docx import Document
from os import path, listdir, environ, makedirs
import pdfplumber
import json
import openai
from data_models import UserInformation
from dotenv import load_dotenv
import boto3
from io import BytesIO

# Load .env file
load_dotenv()

# Define the OpenAI client with an API key from environment variables
client = openai.OpenAI(
    base_url="https://api.together.xyz/v1",
    api_key=environ["TOGETHER_API_KEY"],
)

s3_client = boto3.client(
    's3',
    aws_access_key_id=environ.get('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=environ.get('AWS_SECRET_ACCESS_KEY'),
    region_name='us-east-1'
)


# Function to call the LLM and get structured data
def get_user_details(content, ObjOutput):
    cleaned_content = ''.join(char for char in content if ord(char) >= 32 or char in '\n\r\t') # removes invalid control characters that disrupt json format
    print(content)
    chat_completion = client.chat.completions.create(
        model="mistralai/Mixtral-8x7B-Instruct-v0.1",
        response_format={"type": "json_object", "schema": ObjOutput.model_json_schema()},
        messages=[
            {"role": "system", "content": "You are a helpful assistant that answers in JSON. You are analyzing a resume and returning relevant information in a concise manner."},
            {"role": "user", "content": cleaned_content},
        ],
    )
    raw_content = chat_completion.choices[0].message.content # Print the raw API response
    return raw_content


def parse_pdf(pdf_path: str) -> str:
    # Load PDF content
    loader = PyPDFLoader(pdf_path)
    pages = loader.load_and_split()
    content = ''
    for page in pages:
        content += page.page_content
    return content


def parse_doc(doc_path: str) -> str:
    # Loads DOC or DOCX content
    doc = Document(doc_path)
    return "\n".join([para.text for para in doc.paragraphs]).strip()

def parse_doc_from_s3(bucket_name: str, file_key: str) -> str:
    try:
        # Create a temporary file
        temp_file_path = f"temp_{path.basename(file_key)}"
        
        # Download the file from S3 to a temporary file
        s3_client.download_file(bucket_name, file_key, temp_file_path)
        
        # Load the document using the file path
        doc = Document(temp_file_path)
        content = "\n".join([para.text for para in doc.paragraphs]).strip()
        
        # Clean up the temporary file
        if path.exists(temp_file_path):
            import os
            os.remove(temp_file_path)
            
        return content
        
    except Exception as e:
        print(f"Error processing file {file_key}: {str(e)}")
        return ""

def generate_json(content: str, output_json_path: str) -> None:
    # Generate structured JSON for each page of the resume (or multiple REMOVED_BUCKET_NAME)
    user_info = json.loads(get_user_details(content, UserInformation))
    makedirs(path.dirname(output_json_path), exist_ok=True)
    
    # Save to JSON file
    with open(output_json_path, 'w', encoding='utf-8') as f:
        json.dump(user_info, f, ensure_ascii=False, indent=4)
    print(f'{output_json_path} is outputted to json')

def load_users(resume_folder_path: str, json_folder_path: str) -> None:
    resume_list = listdir(resume_folder_path)
    already_used = set()


    def generate_json_unique_name(resume_name: str):
        if '.docx' in resume_name:
            resume_name.replace('.docx', '')
            
        original = resume_name
        n = 1
        while resume_name in already_used:
            resume_name = f'{original} ({n})'
            n += 1
        already_used.add(resume_name)
        generate_json(content, path.join(json_folder_path, resume_name + '.json'))


    for resume in resume_list:
        resume_path = path.join(resume_folder_path, resume)
        if resume.lower().endswith('.pdf'):
            content = parse_pdf(resume_path)
            resume_name = resume[:-4]
            generate_json_unique_name(resume_name)
        elif resume.lower().endswith('.docx'):
            content = parse_doc(resume_path)
            resume_name = resume[:-5] if resume.lower().endswith(".docx") else resume[:-4]
            generate_json_unique_name(resume_name)
        elif resume.lower().endswith('.doc'):
            content = parse_doc(resume_path)
            resume_name = resume[:-4]
            generate_json_unique_name(resume_name)
    

def load_users_from_s3(bucket_name: str, json_folder_path: str) -> None:
    # Print attempt to access bucket
    print(f"\nAttempting to access S3 bucket: {bucket_name}")
    
    try:
        # List all objects in the S3 bucket
        response = s3_client.list_objects_v2(Bucket=bucket_name)
        print(f"Successfully connected to bucket: {bucket_name}\n")
        
        already_used = set()

        def generate_json_unique_name(resume_name, content):
            original = resume_name
            n = 1
            while resume_name in already_used:
                resume_name = f'{original} ({n})'
                n += 1
            already_used.add(resume_name)
            generate_json(content, path.join(json_folder_path, resume_name + '.json'))

        if 'Contents' in response:
            print(f"Found {len(response['Contents'])} files in bucket")
            for obj in response['Contents']:
                file_key = obj['Key']
                if file_key.lower().endswith(('.doc', '.docx')):
                    print(f"Processing file: {file_key}")
                    try:
                        content = parse_doc_from_s3(bucket_name, file_key)
                        resume_name = path.splitext(path.basename(file_key))[0]
                        generate_json_unique_name(resume_name, content)
                        print(f"Successfully processed: {file_key}\n")
                    except Exception as e:
                        print(f"Error processing file {file_key}: {str(e)}\n")
        else:
            print("No files found in bucket")
            
    except Exception as e:
        print(f"Error accessing bucket {bucket_name}: {str(e)}")



def main():
    # Define path to PDF content
    # resume_folder_path = path.join(path.dirname(__file__), 'resume_folder')
    bucket_name = 'maayuresumebank'
    json_folder_path = path.join(path.dirname(path.dirname(__file__)), 'json')
    load_users_from_s3(bucket_name, json_folder_path)

    
    # load_users(resume_folder_path, json_folder_path)
    

if __name__ == '__main__':
    main()
