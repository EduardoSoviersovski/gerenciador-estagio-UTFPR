import logging

from fastapi import APIRouter, HTTPException
from starlette import status

from core.use_cases.admin_use_cases import AdminUseCases

admin_app = APIRouter()
logger = logging.getLogger(__name__)

@admin_app.get("/admin/processes")
def get_all_processes():
    try:
        student_process = AdminUseCases.get_admin_processes_list()
        return {"student_processes_list": student_process}
    except Exception as e:
        logger.error(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to get all student processes")
