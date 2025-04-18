from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.agent import agent_router
from app.api.ingestion import ingestion_router
from app.api.whatsapp import whatsapp_router

from app.settings import settings

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(agent_router)
app.include_router(ingestion_router)
app.include_router(whatsapp_router)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8123, reload=settings.debug)