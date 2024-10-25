from langchain_community.document_loaders import PyPDFLoader
import os, json
import openai
from pydantic import BaseModel, Field
from dotenv import load_dotenv

# Load .env file
load_dotenv()

# Define the OpenAI client with an API key from environment variables
client = openai.OpenAI(
    base_url="https://api.together.xyz/v1",
    api_key=os.environ["TOGETHER_API_KEY"],
)


def parse_pdf(pdf_path: str, output_json_path: str) -> None:
    # Load PDF content
    loader = PyPDFLoader(pdf_path)
    pages = loader.load_and_split()
    content = ''
    for page in pages:
        content += page.page_content

    # Define data models for structured responses
    class UserDetails(BaseModel):
        name: str = Field(description="Name of the user")
        education: str = Field(description="Education details")
        experience: list[str] = Field(default=[], description="List of experiences")
        skills: list[str] = Field(default=[], description="List of technical skills")
        company: str = Field(description="Current company name if any")
        role: str = Field(description="Role at this company")

    class EducationDetails(BaseModel):
        gpa: float = Field(description="GPA of the student")

    class ExperienceDetails(BaseModel):
        company: str = Field(description="Company name")
        role: str = Field(description="Role at the company")
        tenure: list[str] = Field(description="Time Spent at the company")

    class UserExperiences(BaseModel):
        experiences: list[ExperienceDetails] = Field(description="List of experiences")

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

    # Generate structured JSON for each page of the resume (or multiple REMOVED_BUCKET_NAME)
    all_users = []
    outPutSchema = [UserDetails, EducationDetails, UserExperiences]
    for page in pages:
        for schema in outPutSchema:
            user_details = json.loads(get_user_details(page.page_content, schema))
            all_users.append(user_details)

    # Save to JSON file
    with open(output_json_path, 'w', encoding='utf-8') as f:
        json.dump(all_users, f, ensure_ascii=False, indent=4)
    
    # Print structured data
    # print(json.dumps(all_users, indent=2))


def main():
    # Define path to PDF content
    pdf_folder_path = os.path.join(os.path.dirname(__file__), 'pdf_folder')
    pdf_list = os.listdir(pdf_folder_path)
    pdf_path = os.path.join(pdf_folder_path, pdf_list[0])

    # Define path to output JSON file
    rootdir_path = os.path.dirname(os.path.dirname(__file__))
    json_folder_path = os.path.join(rootdir_path, 'json')
    json_path = os.path.join(json_folder_path, 'users_data.json')

    parse_pdf(pdf_path, json_path)


if __name__ == '__main__':
    main()
