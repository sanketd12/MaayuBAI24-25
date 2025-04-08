from fastapi import Depends, APIRouter, HTTPException
from app.depends.job_extraction_agent import get_job_extraction_agent
import structlog
from typing import Any

router = APIRouter(prefix="/extraction", tags=["extraction"])

logger = structlog.get_logger(__name__)

@router.post("/job-criteria")
async def extract_job_criteria(job_description: str, job_extraction_agent: Any = Depends(get_job_extraction_agent)):
    try:
        return job_extraction_agent.invoke(job_description)
    except Exception as e:
        logger.error(f"Error in rephrase: {e}")
        raise HTTPException(status_code=500, detail=str(e))