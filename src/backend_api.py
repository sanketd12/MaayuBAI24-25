import os
import openai
import chromadb
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma

# --- Load Together API Key ---
api_key = os.environ.get("TOGETHER_API_KEY")
if not api_key:
    raise ValueError("API key is missing. Set TOGETHER_API_KEY as an environment variable.")

# --- Initialize Together AI client ---
client = openai.OpenAI(
    base_url="https://api.together.xyz/v1",
    api_key=api_key,
)

# --- Initialize ChromaDB and Embedding Model ---
db_file = chromadb.PersistentClient(path="chromadb")
collection = db_file.get_or_create_collection(name="resume_embeddings")
embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

# --- FastAPI App Setup ---
app = FastAPI()

# Enable CORS so frontend can communicate
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can change this to your frontend URL for security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Request and Response Models ---
class QueryRequest(BaseModel):
    query: str

class QueryResponse(BaseModel):
    results: list[str]

# --- Query Endpoint ---
@app.post("/query", response_model=QueryResponse)
def query_backend(request: QueryRequest):
    query = request.query
    print(f"🔍 Searching for candidates with: {query}")

    try:
        # Embed the query using HF model
        query_embedding = embedding_model.embed_query(query)

        # Query ChromaDB
        most_sim = collection.query(query_embeddings=[query_embedding], n_results=5)

        # Format matching candidates
        matched = []
        for doc, meta in zip(most_sim["documents"][0], most_sim["metadatas"][0]):
            name = meta.get("name", "Unknown")
            match_type = meta.get("type", "N/A")
            details = f"👤 {name} - ({match_type})\n{doc}"
            matched.append(details)

        if not matched:
            matched = ["No matching candidates found."]

        return {"results": matched}

    except Exception as e:
        print("❌ Error:", e)
        return {"results": [f"Backend error: {str(e)}"]}
