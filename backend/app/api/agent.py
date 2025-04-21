from fastapi import Depends, APIRouter, HTTPException
from app.depends.candidate_finder_agent import get_candidate_finder_agent
from pydantic import BaseModel
import structlog

# 🔧 Define your request body schema
class JobDescriptionInput(BaseModel):
    job_description: str

agent_router = APIRouter(prefix="/agent", tags=["agent"])
logger = structlog.get_logger(__name__)

# ✅ Accept the input as a model from the request body
@agent_router.post("/find-candidate")
async def find_candidate(
    input: JobDescriptionInput,
    candidate_finder_agent = Depends(get_candidate_finder_agent)
):
    try:
        return await candidate_finder_agent.ainvoke({"job_description": input.job_description})
    except Exception as e:
        logger.error(f"Error in find candidate: {e}")
        raise HTTPException(status_code=500, detail=str(e))
