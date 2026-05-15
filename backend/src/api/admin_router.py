import logging

from fastapi import APIRouter, HTTPException
from starlette import status

from core.use_cases.admin_use_cases import AdminUseCases
from core.use_cases.process_use_cases import ProcessUseCases
from core.schemas.process_schemas import CreateProcessRequest

admin_app = APIRouter()
logger = logging.getLogger(__name__)


@admin_app.get("/admin/processes")
def get_all_processes():
    try:
        student_process = AdminUseCases.get_admin_processes_list()
        return {"student_processes_list": student_process}
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get all student processes",
        )


@admin_app.post("/admin/processes", status_code=status.HTTP_201_CREATED)
def create_process(request: CreateProcessRequest):
    try:
        result = ProcessUseCases.create_new_process(request)
        hour_goal = ProcessUseCases.create_hour_goal(
            result["id"], request.weekly_hours, request.target_hours, request.start_date
        )
        return {"process": result, "hour_goal": hour_goal}
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create internship process: {e}",
        )
