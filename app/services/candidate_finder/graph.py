from langgraph.graph import StateGraph, START, END
from langchain_core.runnables import RunnableConfig

from app.services.candidate_finder.config import Configuration
from app.services.candidate_finder.state import CandidateFinderState, CandidateFinderStateInput, CandidateFinderStateOutput
from rich import print
from langchain_google_genai import ChatGoogleGenerativeAI
from app.settings import settings
from app.models.job_criteria import JobCriteria

llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", api_key=settings.GOOGLE_API_KEY)

async def extract_job_criteria(state: CandidateFinderState, config: RunnableConfig) -> CandidateFinderState:
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

def build_graph(debug: bool = False) -> StateGraph:
    # Construct the agentic workflow 
    builder = StateGraph(CandidateFinderState, 
                         input=CandidateFinderStateInput, 
                        #  output=CandidateFinderStateOutput, 
                         config_schema=Configuration(debug=debug))

    builder.add_node("extract_job_criteria", extract_job_criteria)

    builder.add_edge(START, "extract_job_criteria")
    builder.add_edge("extract_job_criteria", END)

    return builder.compile()