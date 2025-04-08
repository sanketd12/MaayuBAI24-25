from fastapi import APIRouter, HTTPException, UploadFile, File, Depends
from app.depends.candidate_finder_agent import get_candidate_finder_agent
from app.depends.file_processor import get_file_processor
from app.services.parsing.file_parser import FileProcessor
import structlog

router = APIRouter(prefix="/ingestion", tags=["ingestion"])

logger = structlog.get_logger(__name__)

@router.post("/add-resume")
async def add_resume(resume: UploadFile = File(...), file_processor: FileProcessor = Depends(get_file_processor)):
    try:
        parsed_resume = await file_processor.parse(resume)
        return parsed_resume
    except Exception as e:
        logger.error(f"Error in find candidate: {e}")
        raise HTTPException(status_code=500, detail=str(e))