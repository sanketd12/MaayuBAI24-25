from fastapi import Depends, APIRouter, HTTPException
from app.depends.candidate_finder_agent import get_candidate_finder_agent
from app.depends.llm import get_llm
import structlog
from pydantic import BaseModel
from langchain_core.messages import HumanMessage
from app.models.email import Email

agent_router = APIRouter(prefix="/agent", tags=["agent"])

logger = structlog.get_logger(__name__)

class JobDescriptionRequest(BaseModel):
    job_description: str

@agent_router.post("/find-candidate")
async def find_candidate(request: JobDescriptionRequest, candidate_finder_agent = Depends(get_candidate_finder_agent)):
    try:
        graph_output_state = await candidate_finder_agent.ainvoke({"job_description": request.job_description})
        return graph_output_state["best_candidate"]
    except Exception as e:
        logger.error(f"Error in find candidate: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    
class GenerateOutreachEmailRequest(BaseModel):
    job_description: str
    candidate_name: str
    reasoning: str

@agent_router.post("/generate-outreach-email")
async def generate_outreach_email(request: GenerateOutreachEmailRequest, llm = Depends(get_llm)):
    try:
        structured_llm = llm.with_structured_output(Email)
        return await structured_llm.ainvoke([HumanMessage(content=f"""
        Generate a friendly and professional outreach email to the candidate {request.candidate_name} for the job described below.
        Job Description: {request.job_description}
        Reasoning: {request.reasoning}. You should ask the candidate when they're free to interview, and also compliment them (not excessively, but politely) on their skills and experience.
        """), HumanMessage(content=f"""
        Title:
        Body:
        """)])
    except Exception as e:
        logger.error(f"Error in generate outreach email: {e}")