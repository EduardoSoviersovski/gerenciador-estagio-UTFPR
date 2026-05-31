import logging

from fastapi import APIRouter, HTTPException
from starlette import status
from starlette.requests import Request

from core.use_cases.authentication_use_cases import AuthenticationUseCases
from core.use_cases.process_use_cases import ProcessUseCases
from core.use_cases.student_use_cases import StudentUseCases

student_app = APIRouter()
logger = logging.getLogger(__name__)

@student_app.get("/student/{ra}/process")
def get_student_process(ra: str):
    try:
        student_process = StudentUseCases.get_student_process(ra=ra)
        workload = ProcessUseCases.get_workload_stats(student_process)
        return {"process": student_process, "workload": workload}
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Error fetching student process for RA {ra}: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to get student process")


@student_app.get("/student/{student_ra}/reports")
def get_student_reports(student_ra: str):
    try:
        student_reports = StudentUseCases.get_student_reports(ra=student_ra)
        return {"reports": student_reports}
    except Exception:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to get student reports")
