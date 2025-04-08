from fastapi import APIRouter, HTTPException, UploadFile, File
from app.depends.candidate_finder_agent import get_candidate_finder_agent
import structlog

router = APIRouter(prefix="/ingestion", tags=["ingestion"])

logger = structlog.get_logger(__name__)

@router.post("/add-resume")
async def add_resume(resume: UploadFile = File(...)):
    try:
        return await candidate_finder_agent.ainvoke({"job_description": job_description})
    except Exception as e:
        logger.error(f"Error in find candidate: {e}")
        raise HTTPException(status_code=500, detail=str(e))