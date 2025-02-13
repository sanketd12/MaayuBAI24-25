from langchain_chroma import Chroma
import chromadb
import openai


# client = openai.OpenAI(
#     base_url="https://api.together.xyz/v1",
#     api_key= environ["TOGETHER_API_KEY"],
# )

db_file = chromadb.PersistentClient(path = "chromadb")

collection = db_file.get_collection(name = "resume_embeddings")

query = input("Query: ")

#Embed the query for chroma


#input embedded query here
most_sim = collection.query()

prompt = f"Answer {query}, given {most_sim}"
#client.prompt(prompt) // not correct syntax but right idea


#prompt LLM with prompt
response = ""


#Print Response