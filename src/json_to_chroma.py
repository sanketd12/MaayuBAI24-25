from langchain_community.document_loaders import JSONLoader
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_chroma import Chroma
import os
import chromadb
from data_models import UserInformation

#Define jq schema to pull experiences and projects directly
jq_schema = UserInformation.model_json_schema()

#Set up the file path and load the JSON data
import os
import json
from langchain.schema import Document



# Define the directory path
data_dir_path = os.path.join(os.path.dirname(__file__), '..', 'json')

# Get all JSON files in the directory
json_files = [f for f in os.listdir(data_dir_path) if f.endswith('.json')]

# Load data from all JSON files
data = []
documents = []
for json_file in json_files:
    try:
        print(f"Processing {json_file}")
        file_path = os.path.join(data_dir_path, json_file)
    except Exception as e:
        print(f"❌ Failed to process {json_file}: {e}")
        continue
    #file_path = os.path.join(data_dir_path, json_file)
    with open(file_path, "r") as f:
        try:
            json_data = json.load(f)
        except Exception as e:
            print(f"❌ Failed to load JSON data from {json_file}: {e}")
            continue

        try:
            user_info = UserInformation(**json_data)
        except Exception as e:
            print(f"Skipping {json_file} due to error: {e}")
            continue

        section_content = []
         # User Details
        section_content.append(Document(
            page_content=f"User: {user_info.userDetails.name}\nSkills: {', '.join(user_info.userDetails.skills)}",
            metadata={"type": "userDetails"}
        ))

        # Education
        section_content.append(Document(
            page_content=(
                f"Education at {user_info.education.institution}, "
                f"Degree: {user_info.education.degree}, "
                f"Graduation: {user_info.education.graduation}, "
                f"GPA: {user_info.education.gpa or 'N/A'}, "
                f"Courses: {', '.join(user_info.education.courses or [])}"
            ),
            metadata={"type": "education", "institution": user_info.education.institution}
        ))

        # Experiences
        for exp in user_info.experiences or []:
            section_content.append(Document(
                page_content=f"{exp.role} at {exp.company} ({', '.join(exp.dates)}): {' '.join(exp.responsibilities)}",
                metadata={"type": "experience", "company": exp.company}
            ))

        # Projects
        for proj in user_info.projects or []:
            section_content.append(Document(
                page_content=f"{proj.project}: {' '.join(proj.description)} (Skills: {', '.join(proj.skills)})",
                metadata={"type": "project", "project_name": proj.project}
            ))

        # Activities
        for act in user_info.activities or []:
            section_content.append(Document(
                page_content=f"{act.role} at {act.activity}: {' '.join(act.responsibility)}",
                metadata={"type": "activity", "organization": act.activity}
            ))

        # Honors
        for honor in user_info.honors or []:
            section_content.append(Document(
                page_content=f"Honor: {honor}",
                metadata={"type": "honor"}
            ))

        # Certifications
        for cert in user_info.certifications or []:
            section_content.append(Document(
                page_content=f"Certification: {cert}",
                metadata={"type": "certification"}
            ))

        full_content = "\n".join([doc.page_content for doc in section_content])
        if not section_content:
            print(f"⚠️ No content extracted from {json_file}")
            continue

        documents.append(Document(
            page_content=full_content,
            metadata={"type": "resume", "source": json_file}
        ))


embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

# Extract content from Document objects
texts = [doc.page_content for doc in documents]
embeddings = embedding_model.embed_documents(texts)

# Store embeddings in ChromaDB
chroma_db = Chroma(
    collection_name="resume_embeddings",
    embedding_function=embedding_model,
    persist_directory="./chromadb"
)

# Use `add_texts` to store content + embeddings + metadata
chroma_db.add_texts(
    texts=texts,
    embeddings=embeddings,
    metadatas=[doc.metadata for doc in documents]
)

print("Done.")