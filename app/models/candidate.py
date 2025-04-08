from pydantic import BaseModel, Field

class Candidate(BaseModel):
    name: str = Field(description="The name of the best candidate for this role")
    reasoning: str = Field(description="The reasoning for why this candidate is the best fit for the role. Cite exact details from the resume and job description.")