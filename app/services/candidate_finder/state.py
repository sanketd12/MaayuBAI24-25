from dataclasses import dataclass, field
from app.models.job_criteria import JobCriteria
from app.models.candidate import Candidate

@dataclass(kw_only=True)
class CandidateFinderState:
    job_description: str = field(default=None) # Job description
    job_criteria: JobCriteria = field(default=None) # Job criteria (added once the agent extracted the appropriate information)
    candidates: str = field(default=None) # Candidates (added once the agent found the candidates)
    best_candidate: Candidate = field(default=None) # Best candidate (added once the agent decided on the best candidate)

@dataclass(kw_only=True)
class CandidateFinderStateInput:
    job_description: str = field(default=None) # Job description

@dataclass(kw_only=True)
class CandidateFinderStateOutput:
    final_response: str = field(default=None) # Final response