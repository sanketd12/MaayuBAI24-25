from langgraph.graph import StateGraph, START, END
from langchain_core.runnables import RunnableConfig

from app.services.agent.config import Configuration
from app.services.agent.state import SlackbotState, SlackbotStateInput, SlackbotStateOutput
from rich import print
from app.settings import Settings

async def categorize_message(state: SlackbotState, config: RunnableConfig) -> SlackbotState:
    configurable = Configuration.from_runnable_config(config)
    if configurable.debug:
        print("[green bold]Categorizing message...[/green bold]")
    user_question = state.user_question
    category: Category = await b.CategorizeMessage(user_question)
    if configurable.debug:
        print(f"[magenta italic]User question: {user_question}[/magenta italic]")
        print(f"[magenta bold]Category: {category}[/magenta bold]")
    state.category = category
    print("@ STATE", state)
    return state

def build_graph(debug: bool = False) -> StateGraph:
    # Construct the agentic workflow 
    builder = StateGraph(SlackbotState, 
                         input=SlackbotStateInput, 
                        #  output=SlackbotStateOutput, 
                         config_schema=Configuration(debug=debug))

    builder.add_node("categorize_message", categorize_message)

    builder.add_edge(START, "categorize_message")
    builder.add_edge("categorize_message", END)

    return builder.compile()