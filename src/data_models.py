from pydantic import BaseModel, Field
from typing import Optional, List


# Define data models for structured responses
class UserDetails(BaseModel):
    name: str = Field(description="Name of the user")
    skills: List[str] = Field(default=[], description="List of technical skills")


class EducationDetails(BaseModel):
    institution: str = Field(description="Name of institution of most recent education")
    degree: str = Field(description="Degree pursued at this institution")
    graduation: str = Field(description="Expected graduation date or date graduated if already graduated")
    gpa: float = Field(description="GPA of the candidate at this institution")
    courses: Optional[List[str]] = Field(description="List of relevant courses user has taken in this institution")


class ExperienceDetails(BaseModel):
    company: str = Field(description="Company name")
    role: str = Field(description="Role or Title at the company")
    tenure: List[str] = Field(description="Time Spent at the company")
    responsibilities: List[str] = Field(description="List of specific responsibilities or accomplishments of user at the company")


class ProjectDetails(BaseModel):
    project: str = Field(description="Name or Title of Project")
    skills: List[str] = Field(description="List of skills involved with this project")
    description: List[str] = Field(description="Description of project and responsibilities of user in project")


class ActivityDescriptions(BaseModel):
    activity: str = Field(description="Name of club or organization")
    role: str = Field(description="Role at the club or organization")
    responsibility: List[str] = Field(description="List of responsibilities or accomplishments at club or organization")


# Necessary User Information in Single Class
class UserInformation(BaseModel):
    userDetails: UserDetails = Field(description="User Details")
    education: EducationDetails = Field(description="Education Details")
    experiences: Optional[List[ExperienceDetails]] = Field(description="List of experiences")
    projects: Optional[List[ProjectDetails]] = Field(description="List of projects")
    activities: Optional[List[ActivityDescriptions]] = Field(description="List of extracurricular activities like clubs and organizations")
    honors: Optional[List[str]] = Field(description="Title of Honor or Awards Received")
    certifications: Optional[List[str]] = Field(description="Name of Certification or License")
