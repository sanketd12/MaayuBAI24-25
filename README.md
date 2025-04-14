# Maayu FastAPI Candidate Selection System

To run this FastAPI app:

1. Install `uv`:
https://docs.astral.sh/uv/getting-started/installation/

2. Create a virtual environment:
`uv venv --python=3.12`

3. Activate the virtual environment

4. Install dependencies
`uv sync`

5. Add the .env variables (all of this is free so no worry about sharing them):

GOOGLE_API_KEY=REMOVED_GOOGLE_KEY

QDRANT_URL=REMOVED_QDRANT_URL
QDRANT_API_KEY=REMOVED_QDRANT_KEY
QDRANT_COLLECTION_NAME=REMOVED_BUCKET_NAME

AWS_ACCESS_KEY_ID=REMOVED_AWS_KEY_ID
AWS_SECRET_ACCESS_KEY=REMOVED_AWS_SECRET
AWS_REGION=us-east-1
AWS_S3_BUCKET=REMOVED_BUCKET_NAME


6. Run the FastAPI server:
`uv run fastapi dev`

7. Navigate to `http://127.0.0.1:8000/docs` in your browser to test out the apps