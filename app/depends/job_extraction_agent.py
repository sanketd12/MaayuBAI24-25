from app.services.agent.graph import build_graph
from app.settings import Settings

def get_job_extraction_agent():
    agent = build_graph(Settings.debug)
    return agent