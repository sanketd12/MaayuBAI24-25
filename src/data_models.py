from pydantic import BaseModel, Field
from typing import Optional, List


# Define data models for structured responses
class UserDetails(BaseModel):
    name: str = Field(description="Name of the user")
    education: str = Field(description="Education details")
    experience: List[str] = Field(default=[], description="List of experiences")
    skills: List[str] = Field(default=[], description="List of technical skills")
    company: str = Field(description="Current company name if any")
    role: str = Field(description="Role at this company")


class EducationDetails(BaseModel):
    institution: str = Field(description="Name of institution")
    graduation: str = Field(description="Expected graduation date or date graduated if already graduated")
    gpa: float = Field(description="GPA of the student")


class ExperienceDetails(BaseModel):
    company: str = Field(description="Company name")
    role: str = Field(description="Role or Title at the company")
    tenure: List[str] = Field(description="Time Spent at the company")
    responsibilities: List[str] = Field(description="List of specific responsibilities or accomplishments of user at the company")


class ExperiencesList(BaseModel):
    experiences: Optional[List[ExperienceDetails]] = Field(description="List of experiences")


class ProjectDetails(BaseModel):
    project: str = Field(description="Name or Title of Project")
    skills: List[str] = Field(description="List of skills involved with this project")
    description: List[str] = Field(description="Description of project and responsibilities of user in project")

class ProjectsList(BaseModel):
    projects: Optional[List[ProjectDetails]] = Field(description="List of projects")


class ActivityDescriptions(BaseModel):
    activity: str = Field(description="Name of club or organization")
    role: str = Field(description="Role at the club or organization")
    responsibility: List[str] = Field(description="List of responsibilities or accomplishments at club or organization")


class ActivitiesList(BaseModel):
    activities: Optional[List[ActivityDescriptions]] = Field(description="List of extracurricular activities like clubs and organizations")


class HonorsDetails(BaseModel):
    honors: Optional[List[str]] = Field(description="Title of Honor or Awards Received")


class CertificationDetails(BaseModel):
    certifications: Optional[List[str]] = Field(description="Name of Certification or License")
