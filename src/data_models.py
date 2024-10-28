from pydantic import BaseModel, Field


# Define data models for structured responses
class UserDetails(BaseModel):
    name: str = Field(description="Name of the user")
    education: str = Field(description="Education details")
    experience: list[str] = Field(default=[], description="List of experiences")
    skills: list[str] = Field(default=[], description="List of technical skills")
    company: str = Field(description="Current company name if any")
    role: str = Field(description="Role at this company")


class EducationDetails(BaseModel):
    gpa: float = Field(description="GPA of the student")


class ExperienceDetails(BaseModel):
    company: str = Field(description="Company name")
    role: str = Field(description="Role at the company")
    tenure: list[str] = Field(description="Time Spent at the company")


class UserExperiences(BaseModel):
    experiences: list[ExperienceDetails] = Field(description="List of experiences")
