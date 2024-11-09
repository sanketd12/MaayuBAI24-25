from langchain_community.document_loaders import PyPDFLoader
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


def parse_pdf(pdf_path: str, output_json_path: str) -> None:
    # Load PDF content
    loader = PyPDFLoader(pdf_path)
    pages = loader.load_and_split()
    content = ''
    for page in pages:
        content += page.page_content

    # Generate structured JSON for each page of the resume (or multiple resumes)
    user_info = json.loads(get_user_details(content, UserInformation))
    
    # Save to JSON file
    with open(output_json_path, 'w', encoding='utf-8') as f:
        json.dump(user_info, f, ensure_ascii=False, indent=4)
    

def main():
    # Define path to PDF content
    pdf_folder_path = path.join(path.dirname(__file__), 'pdf_folder')
    pdf_list = listdir(pdf_folder_path)
    pdf_path = path.join(pdf_folder_path, pdf_list[0])

    # Define path to output JSON file
    rootdir_path = path.dirname(path.dirname(__file__))
    json_folder_path = path.join(rootdir_path, 'json')
    json_path = path.join(json_folder_path, 'users_data.json')

    parse_pdf(pdf_path, json_path)


if __name__ == '__main__':
    main()
