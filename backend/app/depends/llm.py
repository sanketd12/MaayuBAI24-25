from app.settings import settings
from langchain_google_genai import ChatGoogleGenerativeAI

llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", api_key=settings.GOOGLE_API_KEY)

def get_llm():
    return llm