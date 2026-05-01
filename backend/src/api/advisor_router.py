from fastapi import APIRouter, HTTPException
from starlette import status

from core.use_cases.advisor_use_cases import AdvisorUseCases

advisor_app = APIRouter()


@advisor_app.get("/advisor/{advisor_email}/student_processes")
def get_advisor_student_processes_list(advisor_email: str):
    try:
        student_process = AdvisorUseCases.get_advisor_student_processes_list(advisor_email=advisor_email)
        return {"student_processes_list": student_process}
    except Exception:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to get student process")
