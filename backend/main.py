from fastapi import FastAPI, Depends
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

from api.admin_router import admin_app
from api.advisor_router import advisor_app
from api.document_router import document_app
from api.login_page_router import login_page_app
from api.notification_router import notification_app
from api.student_router import student_app
from core.dependencies import get_current_authenticated_user, get_admin_user, get_advisor_user

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

admin_dependencies = [Depends(get_admin_user)]
advisor_dependencies = [Depends(get_advisor_user)]
user_dependencies = [Depends(get_current_authenticated_user)]
app.include_router(document_app, dependencies=user_dependencies)
app.include_router(notification_app, dependencies=user_dependencies)
app.include_router(student_app, dependencies=user_dependencies)
app.include_router(advisor_app, dependencies=advisor_dependencies)
app.include_router(admin_app, dependencies=admin_dependencies)
