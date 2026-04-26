from fastapi import FastAPI
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

from api.file_formatter_router import file_formatter_app
from api.login_page_router import login_page_app
from api.notification_router import notification_app
from api.student_router import student_app

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(SessionMiddleware, secret_key=None)

app.include_router(login_page_app)
app.include_router(file_formatter_app)
app.include_router(notification_app)
app.include_router(student_app)
