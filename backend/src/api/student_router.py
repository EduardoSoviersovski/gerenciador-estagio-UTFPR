from fastapi import APIRouter, HTTPException
from starlette import status
from starlette.requests import Request

from core.use_cases.authentication_use_cases import AuthenticationUseCases
from core.use_cases.student_use_cases import StudentUseCases

student_app = APIRouter()


@student_app.get("/student/{ra}/process")
def get_student_process(ra: str):
    try:
        student_process = StudentUseCases.get_student_process(ra=ra)
        return {"process": student_process}
    except Exception:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to get student process")


@student_app.get("/student/reports")
def get_student_reports(request: Request):
    try:
        user = AuthenticationUseCases.current_user(request)
        student_reports = StudentUseCases.get_student_reports(user=user)
        return {"reports": student_reports}
    except Exception:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to get student reports")
