from flask import Flask, request, jsonify
import os
import openai
import chromadb
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow frontend requests

# Load API Key from environment variable
api_key = os.environ.get("TOGETHER_API_KEY")
if not api_key:
    raise ValueError("API key is missing. Set TOGETHER_API_KEY as an environment variable.")


# Initialize OpenAI client (Together AI)
client = openai.OpenAI(
    base_url="https://api.together.xyz/v1",
    api_key=api_key,
)

# Load ChromaDB collection
db_file = chromadb.PersistentClient(path="chromadb")
collection = db_file.get_collection(name="resume_embeddings")

# Get user query
query = input("Query: ")

# response = client.embeddings.create(
#   model = "togethercomputer/m2-bert-80M-8k-retrieval",
#   input = query
# )
# Embed the query
embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
query_embedding = embedding_model.embed_query(query)

# Search for the most similar documents in ChromaDB
# most_sim = collection.query(query_embeddings=[query_embedding], n_results=3)  # Get top 3 matches

# # Extract relevant text from the results
# relevant_contexts = "\n".join([doc for doc in most_sim["documents"][0]])

# # Construct the prompt
# prompt = f"Answer the following question: {query}\nGiven the following relevant information:\n{relevant_contexts}"

# # Send prompt to LLM
# response = client.completions.create(
#     model="meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
#     prompt=prompt,
#     max_tokens=200
# )

# # Print response
# print("\nResponse:\n", response.choices[0].text.strip())

@app.route("/query", methods=["POST"])
def query_rag():
    data = request.json
    query = data.get("query")
    
    if not query:
        return jsonify({"error": "Query is required"}), 400

    # Embed the query
    query_embedding = embedding_model.embed_query(query)

    # Search for similar documents in ChromaDB
    most_sim = collection.query(query_embeddings=[query_embedding], n_results=3)  

    # Extract relevant text from results
    relevant_contexts = "\n".join([doc for doc in most_sim["documents"][0]])

    # Construct prompt
    prompt = f"Answer the following question: {query}\nGiven the following relevant information:\n{relevant_contexts}"

    # Get response from LLM
    response = client.completions.create(
        model="meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
        prompt=prompt,
        max_tokens=200
    )

    return jsonify({"response": response.choices[0].text.strip()})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)