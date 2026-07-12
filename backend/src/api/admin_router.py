import logging

from fastapi import APIRouter, HTTPException, Form, File, Query, UploadFile, Path
from starlette import status

from core.schemas.document_schemas import TemplateFormat
from core.schemas.process_schemas import CreateProcessRequest, UpdateProcessRequest, DeleteProcessesRequest
from core.tasks.document_tasks import DocumentTasks
from core.use_cases.admin_use_cases import AdminUseCases
from core.use_cases.document_use_cases import DocumentUseCases
from core.use_cases.process_use_cases import ProcessUseCases

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


@admin_app.post("/admin/create_process", status_code=status.HTTP_201_CREATED)
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


@admin_app.put("/admin/process/{process_id}", status_code=status.HTTP_200_OK)
def update_process(process_id: int, request: UpdateProcessRequest):
    try:
        return ProcessUseCases.update_process(process_id, request)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update internship process: {e}",
        )


@admin_app.delete("/admin/processes", status_code=status.HTTP_204_NO_CONTENT)
def delete_processes(request: DeleteProcessesRequest):
    try:
        return ProcessUseCases.delete_processes(request.process_ids)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete internship processes: {e}",
        )


@admin_app.get("/admin/process/{process_id}", status_code=status.HTTP_200_OK)
def get_process_by_id(process_id: int):
    try:
        student_process = AdminUseCases.get_process_by_id(process_id)
        return student_process
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Error fetching student process for process_id {process_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get student process",
        )


@admin_app.get("/admin/users/{email}", status_code=status.HTTP_200_OK)
def get_user_by_email(email: str = Path(..., description="O email do usuário a ser buscado")):
    try:
        user = AdminUseCases.get_user_by_email(email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        return user
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Error fetching user by email {email}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch user data",
        )

@admin_app.get("/admin/advisors/emails", status_code=status.HTTP_200_OK)
def get_all_advisor_emails():
    try:
        return AdminUseCases.get_advisor_emails()
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Error fetching advisor emails: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch advisor emails",
        )

@admin_app.post("/admin/templates/{document_type_id}/upload")
async def upload_document_template(
        document_type_id: int,
        file_format: TemplateFormat = Query(..., description="Formato do arquivo"),
        file: UploadFile = File(...)
    ):
    try:
        file_content = await file.read()
        
        response = DocumentTasks.upsert_template(
            document_type_id=document_type_id,
            file_content=file_content,
            file_name=file.filename,
            file_format=file_format.value 
        )
        return response
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))