import os
from pathlib import Path
from dotenv import load_dotenv
import logging
from typing import Dict, Any
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Base directory
BASE_DIR = Path(__file__).parent.parent

# Configure logging
def setup_logging() -> None:
    """Configure logging for the application."""
    log_dir = BASE_DIR / "logs"
    log_dir.mkdir(exist_ok=True)
    
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler(log_dir / "app.log"),
            logging.StreamHandler()
        ]
    )

# API Configuration
API_CONFIG = {
    "title": "Maayu Resume Analysis API",
    "description": "API for analyzing and querying resume data",
    "version": "1.0.0",
    "docs_url": "/docs",
    "redoc_url": "/redoc",
}

# Database Configuration
DB_CONFIG = {
    "chroma_path": str(BASE_DIR / "chromadb"),
    "collection_name": "resume_embeddings",
    "embedding_model": "sentence-transformers/all-MiniLM-L6-v2",
}

# AWS Configuration
AWS_CONFIG = {
    "region_name": "us-east-1",
    "bucket_name": os.getenv("AWS_BUCKET_NAME", "maayuresumebank"),
}

# OpenAI/Together AI Configuration
OPENAI_CONFIG = {
    "base_url": "https://api.together.xyz/v1",
    "api_key": os.getenv("TOGETHER_API_KEY"),
    "model": "mistralai/Mixtral-8x7B-Instruct-v0.1",
}
# CORS Configuration
CORS_CONFIG = {
    "allow_origins": os.getenv("ALLOWED_ORIGINS", "*").split(","),
    "allow_credentials": True,
    "allow_methods": ["*"],
    "allow_headers": ["*"],
}

# Validate required environment variables
def validate_config() -> None:
    """Validate that all required environment variables are set."""
    required_vars = {
        "TOGETHER_API_KEY": "Together AI API key",
        "AWS_ACCESS_KEY_ID": "AWS Access Key ID",
        "AWS_SECRET_ACCESS_KEY": "AWS Secret Access Key",
    }
    
    missing_vars = []
    for var, description in required_vars.items():
        if not os.getenv(var):
            missing_vars.append(f"{var} ({description})")
    
    if missing_vars:
        raise ValueError(
            f"Missing required environment variables: {', '.join(missing_vars)}"
        )

# Initialize logging
setup_logging()
logger = logging.getLogger(__name__)

# Validate configuration on import
validate_config() 