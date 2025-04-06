import os
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma
import chromadb
import logging

from config import (
    API_CONFIG,
    DB_CONFIG,
    CORS_CONFIG,
    OPENAI_CONFIG,
    logger
)

# --- Initialize FastAPI App ---
app = FastAPI(**API_CONFIG)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    **CORS_CONFIG
)

# --- Initialize ChromaDB and Embedding Model ---
try:
    db_file = chromadb.PersistentClient(path=DB_CONFIG["chroma_path"])
    collection = db_file.get_or_create_collection(name=DB_CONFIG["collection_name"])
    embedding_model = HuggingFaceEmbeddings(model_name=DB_CONFIG["embedding_model"])
    logger.info("Successfully initialized ChromaDB and embedding model")
except Exception as e:
    logger.error(f"Failed to initialize ChromaDB: {str(e)}")
    raise

# --- Request and Response Models ---
class QueryRequest(BaseModel):
    """Request model for querying REMOVED_BUCKET_NAME."""
    query: str = Field(..., description="The search query to find matching REMOVED_BUCKET_NAME")
    limit: Optional[int] = Field(5, description="Maximum number of results to return", ge=1, le=20)

class QueryResponse(BaseModel):
    """Response model for query results."""
    results: List[str] = Field(..., description="List of matching resume results")
    count: int = Field(..., description="Number of results returned")

# --- Health Check Endpoint ---
@app.get("/health")
async def health_check() -> dict:
    """Health check endpoint to verify API status."""
    return {"status": "healthy", "version": API_CONFIG["version"]}

# --- Query Endpoint ---
@app.post("/query", response_model=QueryResponse)
async def query_backend(request: QueryRequest) -> QueryResponse:
    """
    Query the resume database for matching candidates.
    
    Args:
        request: QueryRequest containing the search query and result limit
        
    Returns:
        QueryResponse containing matching results and count
        
    Raises:
        HTTPException: If there's an error processing the query
    """
    logger.info(f"Processing query: {request.query}")
    
    try:
        # Embed the query
        query_embedding = embedding_model.embed_query(request.query)
        
        # Query ChromaDB
        results = collection.query(
            query_embeddings=[query_embedding],
            n_results=request.limit
        )
        
        # Format results
        matched = []
        for doc, meta in zip(results["documents"][0], results["metadatas"][0]):
            name = meta.get("name", "Unknown")
            match_type = meta.get("type", "N/A")
            details = f"👤 {name} - ({match_type})\n{doc}"
            matched.append(details)
        
        if not matched:
            matched = ["No matching candidates found."]
        
        logger.info(f"Query completed successfully. Found {len(matched)} results")
        return QueryResponse(results=matched, count=len(matched))
        
    except Exception as e:
        error_msg = f"Error processing query: {str(e)}"
        logger.error(error_msg)
        raise HTTPException(status_code=500, detail=error_msg)

# --- Error Handlers ---
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler for unhandled errors."""
    logger.error(f"Unhandled error: {str(exc)}")
    return {"detail": "An unexpected error occurred"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
