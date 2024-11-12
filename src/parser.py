from langchain_community.document_loaders import PyPDFLoader
from spire.doc import Document
from os import path, listdir, environ
import json
import openai
from data_models import UserInformation
from dotenv import load_dotenv

# Load .env file
load_dotenv()

# Define the OpenAI client with an API key from environment variables
client = openai.OpenAI(
    base_url="https://api.together.xyz/v1",
    api_key=environ["TOGETHER_API_KEY"],
)


# Function to call the LLM and get structured data
def get_user_details(content, ObjOutput):
    chat_completion = client.chat.completions.create(
        model="mistralai/Mixtral-8x7B-Instruct-v0.1",
        response_format={"type": "json_object", "schema": ObjOutput.model_json_schema()},
        messages=[
            {"role": "system", "content": "You are a helpful assistant that answers in JSON. You are analyzing a resume and returning relevant information in a concise manner."},
            {"role": "user", "content": content},
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
    document = Document()
    document.LoadFromFile(doc_path)
    content = document.GetText()
    return content


def generate_json(content: str, output_json_path: str) -> None:
    # Generate structured JSON for each page of the resume (or multiple REMOVED_BUCKET_NAME)
    user_info = json.loads(get_user_details(content, UserInformation))
    
    # Save to JSON file
    with open(output_json_path, 'w', encoding='utf-8') as f:
        json.dump(user_info, f, ensure_ascii=False, indent=4)


def load_users(resume_folder_path: str, json_folder_path: str) -> None:
    resume_list = listdir(resume_folder_path)
    for resume in resume_list:
        resume_path = path.join(resume_folder_path, resume)
        if resume.lower().endswith('.pdf'):
            content = parse_pdf(resume_path)
            resume_name = resume[:-4] + '.json'
            generate_json(content, path.join(json_folder_path, resume_name))
        elif resume.lower().endswith('.docx'):
            content = parse_doc(resume_path)
            resume_name = resume[:-5] + '.json'
            generate_json(content, path.join(json_folder_path, resume_name))
        elif resume.lower().endswith('.doc'):
            content = parse_doc(resume_path)
            resume_name = resume[:-4] + '.json'
            generate_json(content, path.join(json_folder_path, resume_name))
    

def main():
    # Define path to PDF content
    resume_folder_path = path.join(path.dirname(__file__), 'resume_folder')
    json_folder_path = path.join(path.dirname(path.dirname(__file__)), 'json')
    
    load_users(resume_folder_path, json_folder_path)


if __name__ == '__main__':
    main()
