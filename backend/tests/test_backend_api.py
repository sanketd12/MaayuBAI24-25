import pytest
from fastapi.testclient import TestClient
from src.backend_api import app
from src.config import logger

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert data["status"] == "healthy"
    assert "version" in data

def test_query_endpoint():
    test_query = {
        "query": "Python developer with AWS experience",
        "limit": 3
    }
    
    response = client.post("/query", json=test_query)
    assert response.status_code == 200
    data = response.json()
    assert "results" in data
    assert "count" in data
    assert isinstance(data["results"], list)
    assert isinstance(data["count"], int)
    assert data["count"] <= test_query["limit"]

def test_query_endpoint_invalid_limit():
    test_query = {
        "query": "Python developer",
        "limit": 0  # Invalid limit
    }
    
    response = client.post("/query", json=test_query)
    assert response.status_code == 422  # Validation error

def test_query_endpoint_missing_query():
    test_query = {
        "limit": 5
    }
    
    response = client.post("/query", json=test_query)
    assert response.status_code == 422  # Validation error

@pytest.mark.asyncio
async def test_query_endpoint_error_handling():
    # Test error handling by temporarily disabling ChromaDB
    original_collection = app.state.collection
    app.state.collection = None
    
    test_query = {
        "query": "Python developer",
        "limit": 5
    }
    
    response = client.post("/query", json=test_query)
    assert response.status_code == 500
    
    # Restore original collection 