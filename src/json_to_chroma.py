from langchain_community.document_loaders import JSONLoader
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_chroma import Chroma
import os
import chromadb

#Define jq schema to pull experiences and projects directly
jq_schema = '''
{
    "experiences": .experiences[] | {content: (.role + " at " + .company + ": " + (.responsibilities | join(" "))), metadata: {type: "experience", company: .company}},
    "projects": .projects[] | {content: (.project + ": " + (.description | join(" "))), metadata: {type: "project", project_name: .project}}
}
'''

#Set up the file path and load the JSON data
data_file_path = os.path.join(os.path.dirname(__file__), '..', 'json', 'users_data.json')
json_loader = JSONLoader(file_path=data_file_path, jq_schema=jq_schema, text_content=False)
data = json_loader.load()

documents = []
for item in data:
    documents.append({
        "content": item.page_content,
        "metadata": item.metadata
    })

#Initialize the Hugging Face embedding model
embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
texts = [doc['content'] for doc in documents]
embeddings = embedding_model.embed_documents(texts)

#Store embeddings in ChromaDB
chroma_db = Chroma(collection_name="resume_embeddings", embedding_function=embedding_model, persist_directory="./chromadb")
for doc, embedding in zip(documents, embeddings):
    chroma_db.add_texts([doc['content']], embeddings=[embedding], metadatas=[doc['metadata']])

print("Done.")