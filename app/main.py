from fastapi import Depends, FastAPI
from .dependencies import get_query_token
from .routers import items, users

app = FastAPI(dependencies=[Depends(get_query_token)])

@app.get("/")
async def root():
    return {"message": "Hello Bigger Applications!"}
