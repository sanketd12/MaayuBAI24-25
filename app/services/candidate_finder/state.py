from dataclasses import dataclass, field
from app.models.job_criteria import JobCriteria

@dataclass(kw_only=True)
class CandidateFinderState:
    job_description: str = field(default=None) # Job description
    job_criteria: JobCriteria = field(default=None) # Job criteria (added once the agent extracted the appropriate information)

@dataclass(kw_only=True)
class CandidateFinderStateInput:
    job_description: str = field(default=None) # Job description

@dataclass(kw_only=True)
class CandidateFinderStateOutput:
    final_response: str = field(default=None) # Final response