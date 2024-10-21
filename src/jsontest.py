from langchain_community.document_loaders import PyPDFLoader
import os
import json
import openai
from pydantic import BaseModel, Field
from dotenv import load_dotenv
import os

load_dotenv()

# Load PDF content
loader = PyPDFLoader("src/pdf_folder/ResumeSanketDoddabendigere.pdf")
pages = loader.load_and_split()
content = pages[0].page_content

# Define the OpenAI client with an API key from environment variables
client = openai.OpenAI(
    base_url="https://api.together.xyz/v1",
    api_key=os.environ["TOGETHER_API_KEY"],
)

#Define data models for structured responses
class EducationDetails(BaseModel):
    gpa: float = Field(description="GPA of the student")

class ExperienceDetails(BaseModel):
    company: str = Field(description="Company name")
    role: str = Field(description="Role at the company")
    tenure: list[str] = Field(description="Time Spent at the company")

class UserDetails(BaseModel):
    name: str = Field(description="Name of the user")
    education: str = Field(description="Education details")
    experience: list[str] = Field(default=[], description="List of experiences")
    skills: list[str] = Field(default=[], description="List of technical skills")
    company: str = Field(description="Company name")
    role: str = Field(description="Role at the company")

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
outPutSchema = [UserDetails,EducationDetails,ExperienceDetails]
for page in pages:
    for schema in outPutSchema:
        user_details = json.loads(get_user_details(page.page_content, schema))
        all_users.append(user_details)

# Save to JSON file
with open('users_data.json', 'w', encoding='utf-8') as f:
    json.dump(all_users, f, ensure_ascii=False, indent=4)

# Print structured data
print(json.dumps(all_users, indent=2))