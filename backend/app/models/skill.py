from pydantic import BaseModel, Field
from typing import Literal

class Skill(BaseModel):
    name: str = Field(description="The name of the skill - e.g. 'Kubernetes'")
    proficiency_level: Literal["not_specified", "beginner", "intermediate", "advanced", "expert"] = Field(description="The proficiency level of the skill")