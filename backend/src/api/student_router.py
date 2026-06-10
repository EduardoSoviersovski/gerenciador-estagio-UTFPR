import logging

from fastapi import APIRouter, HTTPException
from starlette import status
from starlette.requests import Request

from core.use_cases.authentication_use_cases import AuthenticationUseCases
from core.use_cases.process_use_cases import ProcessUseCases
from core.use_cases.student_use_cases import StudentUseCases

student_app = APIRouter()
logger = logging.getLogger(__name__)

@student_app.get("/student/{ra}/processes")
def get_student_processes_list(ra: str):
    try:
        processes = StudentUseCases.get_student_processes_list(ra=ra)
        return {"processes": processes}
    except Exception as e:
        logger.error(f"Error fetching student processes list for RA {ra}: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to get student processes list")

@student_app.get("/process/{process_id}")
def get_process_details(process_id: int):
    try:
        process = StudentUseCases.get_process_details_by_id(process_id=process_id)
        try:
            workload = ProcessUseCases.get_workload_stats(process)
        except ValueError:
            workload = None
        return {"process": process, "workload": workload}
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Error fetching process details for ID {process_id}: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to get process details")


@student_app.get("/student/{student_ra}/reports")
def get_student_reports(student_ra: str):
    try:
        student_reports = StudentUseCases.get_student_reports(ra=student_ra)
        return {"reports": student_reports}
    except Exception:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to get student reports")