from fastapi import APIRouter, HTTPException
from starlette import status
from starlette.requests import Request

from core.dependencies import get_student_router_use_cases, get_authentication_use_cases

student_app = APIRouter()

student_use_cases = get_student_router_use_cases()
authentication_use_cases = get_authentication_use_cases()

@student_app.post("/student/reports")
def get_student_reports(request: Request):
    try:
        user = authentication_use_cases.current_user(request)
        student_reports = student_use_cases.get_student_reports(user=user)
        return {"reports": student_reports}
    except Exception:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to get student reports")
