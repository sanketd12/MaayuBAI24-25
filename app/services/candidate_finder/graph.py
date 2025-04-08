from langgraph.graph import StateGraph, START, END
from langchain_core.runnables import RunnableConfig

from app.services.candidate_finder.config import Configuration
from app.services.candidate_finder.state import CandidateFinderState, CandidateFinderStateInput, CandidateFinderStateOutput
from rich import print

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage

from app.settings import settings
from app.models.job_criteria import JobCriteria
from app.services.vector_db.qdrant import QdrantVectorDBService
from app.models.candidate import Candidate

vector_db = QdrantVectorDBService()

llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", api_key=settings.GOOGLE_API_KEY)

async def extract_job_criteria(state: CandidateFinderState, config: RunnableConfig) -> CandidateFinderState:
    """Extract the job criteria from the job description."""
    configurable = Configuration.from_runnable_config(config)
    if configurable.debug:
        print("[green bold]Extracting job criteria...[/green bold]")
    job_description = state.job_description
    job_extraction_llm = llm.with_structured_output(JobCriteria)
    job_criteria: JobCriteria = await job_extraction_llm.ainvoke(job_description)
    if configurable.debug:
        print(f"[magenta italic]Job description: {job_description}[/magenta italic]")
        print(f"[magenta bold]Job criteria: {job_criteria}[/magenta bold]")
    state.job_criteria = job_criteria
    return state

async def find_candidates(state: CandidateFinderState, config: RunnableConfig) -> CandidateFinderState:
    """Search the Qdrant vector database for candidates that best fit the job criteria."""
    configurable = Configuration.from_runnable_config(config)
    if configurable.debug:
        print("[green bold]Finding job candidates...[/green bold]")
    job_criteria = state.job_criteria
    candidates = await vector_db.retrieve_REMOVED_BUCKET_NAME(job_criteria.model_dump_json(indent=2), stringify=True)
    state.candidates = candidates
    if configurable.debug:
        print(f"[magenta bold]Job criteria: {job_criteria}[/magenta bold]")
    return state

async def decide_best_candidate(state: CandidateFinderState, config: RunnableConfig) -> CandidateFinderState:
    """Decide the best candidate for the job."""
    configurable = Configuration.from_runnable_config(config)
    if configurable.debug:
        print("[green bold]Deciding best candidate...[/green bold]")
    candidates = state.candidates
    structured_llm = llm.with_structured_output(Candidate)
    best_candidate = await structured_llm.ainvoke([
        SystemMessage(content="You are a hiring manager looking for candidates for a job. You are given the job criteria, along with a list of candidates. The candidates that best fit the job criteria are the ones that have the most relevant experience, skills, and education to the job criteria."),
        HumanMessage(content=f"Job criteria: {state.job_criteria.model_dump_json(indent=2)}"),
        HumanMessage(content=f"Candidates:\n\n{candidates}"),
    ])
    state.best_candidate = best_candidate
    if configurable.debug:
        print(f"[magenta bold]Best candidate: {best_candidate}[/magenta bold]")
    return state

def build_graph(debug: bool = False) -> StateGraph:
    # Construct the agentic workflow 
    builder = StateGraph(CandidateFinderState, 
                         input=CandidateFinderStateInput, 
                        #  output=CandidateFinderStateOutput, 
                         config_schema=Configuration(debug=debug))

    builder.add_node("extract_job_criteria", extract_job_criteria)
    builder.add_node("find_candidates", find_candidates)
    builder.add_node("decide_best_candidate", decide_best_candidate)

    builder.add_edge(START, "extract_job_criteria")
    builder.add_edge("extract_job_criteria", "find_candidates")
    builder.add_edge("find_candidates", "decide_best_candidate")
    builder.add_edge("decide_best_candidate", END)

    return builder.compile()