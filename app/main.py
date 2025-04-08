from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import completion_router, stats_router, users_router, webhooks_router

from app.settings import settings

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(completion_router)
app.include_router(users_router)
app.include_router(webhooks_router)
app.include_router(stats_router)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8123, reload=settings.debug)