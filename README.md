# Maayu Resume Analysis System

A comprehensive system for analyzing and processing REMOVED_BUCKET_NAME using AI and vector databases.

## Features

- Resume parsing (PDF and DOCX formats)
- AI-powered resume analysis
- Vector database storage and retrieval
- RESTful API for querying REMOVED_BUCKET_NAME
- S3 integration for document storage
- Modern web frontend

## Prerequisites

- Python 3.9+
- AWS account with S3 access
- Together AI API key

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/maayu-resume-analysis.git
cd maayu-resume-analysis
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
Create a `.env` file in the project root with the following variables:
```env
TOGETHER_API_KEY=your_together_api_key
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_BUCKET_NAME=your_s3_bucket_name
```

## Project Structure

```
maayu-resume-analysis/
├── src/
│   ├── backend_api.py      # FastAPI backend
│   ├── parser.py           # Resume parsing
│   ├── data_models.py      # Pydantic models
│   ├── config.py           # Configuration
│   └── maayu-frontend/     # Frontend code
├── tests/                  # Test files
├── json/                   # Processed JSON files
├── chromadb/              # Vector database storage
└── logs/                  # Application logs
```

## Usage

### Processing Resumes

1. Place REMOVED_BUCKET_NAME in your S3 bucket
2. Run the parser:
```bash
python src/parser.py
```

### Running the API

1. Start the FastAPI server:
```bash
uvicorn src.backend_api:app --reload
```

2. Access the API documentation at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Running Tests

```bash
pytest tests/
```

## API Endpoints

### Health Check
- `GET /health`
- Returns API status and version

### Query Resumes
- `POST /query`
- Request body:
```json
{
    "query": "Python developer with AWS experience",
    "limit": 5
}
```

## Development

### Code Style
- Follow PEP 8 guidelines
- Use type hints
- Document all functions and classes

### Testing
- Write unit tests for new features
- Run tests before committing
- Maintain test coverage

### Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Together AI for the LLM API
- ChromaDB for vector storage
- FastAPI for the web framework
