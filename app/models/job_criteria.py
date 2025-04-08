from pydantic import BaseModel, Field
from typing import Literal
from app.models.skill import Skill

class JobCriteria(BaseModel):
    """Always use this tool to extract the relevant job criteria from this job description"""
    title: str = Field(description="The title of this job")
    description: str = Field(description="A concise 1-2 sentence summary of this job role")
    role_level: Literal["entry", "mid", "senior", "executive"] = Field(description="The experience level of this job")
    skills: list[Skill] = Field(description="The skills required for this job")
    industry: str = Field(description="The industry of this job - e.g. 'Healthcare'")