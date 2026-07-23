from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware 
from database import engine, Base 
import models
from routers import items, users

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=['*']
)

app.include_router(items.router)
app.include_router(users.router)