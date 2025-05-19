from app.services.candidate_finder.graph import build_graph
from app.settings import settings

def get_candidate_finder_agent():
    return build_graph(settings.debug)