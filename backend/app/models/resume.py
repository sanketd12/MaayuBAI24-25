from pydantic import BaseModel, Field
from app.models.skill import Skill
from typing import Optional

class EducationExperience(BaseModel):
    institution_name: str = Field(description="The name of the educational institution as it appears on the resume - e.g. 'University of Virginia'")
    start_year: Optional[str]
    end_year: Optional[str]

class WorkExperience(BaseModel):
    organization_name: str = Field("The organization/company/nonprofit that this individual worked at")
    start_year: Optional[str]
    end_year: Optional[str]
    description: str = Field("What the user accomplished at this job. Do not make anything up")

class Honor(BaseModel):
    name: str = Field(description="The name of the award/honor that was bestowed on this person")
    year: Optional[str] = Field(description="The year in which this was awarded")

class Certificate(BaseModel):
    name: str = Field(description="The name of the certificate obtained")
    year: Optional[str] = Field(description="The year in which the certificate was obtained")

class Resume(BaseModel):
    name: str = Field(description="The full name of the candidate")
    summary: str = Field(description="A concise, entity-dense summary of this candidate and his/her qualifications")
    education: list[EducationExperience]
    work_experience: list[WorkExperience]
    skills: list[Skill]
    honors: list[Honor]
    certificates: list[Certificate]
    miscellaneous: Optional[str] = Field(description="OPTIONAL - anything else included in the resume that doesn't fall into one of these categories")

class ResumeWithMetadata(Resume):
    aws_key: str = Field(description="The AWS key for the resume")