import logging
import urllib

from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Query
from starlette import status
from fastapi.responses import Response
from starlette.requests import Request

from core.dependencies import get_advisor_or_admin_user
from core.schemas.document_schemas import DocumentMessageCreate, DocumentStatusUpdate, TemplateFormat
from core.tasks.document_tasks import DocumentTasks
from core.use_cases.authentication_use_cases import AuthenticationUseCases
from core.use_cases.document_use_cases import DocumentUseCases

document_app = APIRouter()
logger = logging.getLogger(__name__)

@document_app.post("/convert_file_to_jpg")
def convert_file_to_jpg(
        file: UploadFile = File(...),
        process_id: int = Form(...),
        document_type_id: int = Form(...)
):
    try:
        converted_bytes = DocumentUseCases.convert_file_to_jpg(file)

        DocumentUseCases.save_document(
            converted_bytes,
            process_id,
            document_type_id,
            file.filename,
            custom_name=None
        )

        logger.info("File converted and saved to the database successfully")
        encoded_filename = urllib.parse.quote(f"converted_{file.filename}.jpg")
        return Response(
            content=converted_bytes,
            media_type="image/jpeg",
            headers={"Content-Disposition": f"attachment; filename*=utf-8''{encoded_filename}"}
        )

    except Exception as e:
        logger.error(f"Error during file conversion or saving to database: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Conversion or database saving failed: {str(e)}",
        )


@document_app.get("/document/{document_id}")
def get_document(document_id: int):
    try:
        doc = DocumentUseCases.get_document(document_id)
        encoded_filename = urllib.parse.quote(doc["file_name"])

        return Response(
            content=doc["file_content"],
            media_type=doc["mime_type"],
            headers={"Content-Disposition": f"inline; filename*=utf-8''{encoded_filename}"}
        )

    except ValueError as e:
        logger.warning(f"Document with id {document_id} not found: {e}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )
    except Exception as e:
        logger.error(f"Error to fetch document {document_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch document: {str(e)}",
        )

# TODO: alinhar se é obsoleta essa rota?
@document_app.get("/document/{document_id}/messages")
def get_document_messages(document_id: int) -> list:
    try:
        document_messages = DocumentUseCases.get_document_messages(document_id)
        return document_messages

    except ValueError as e:
        logger.warning(f"Document with id {document_id} not found: {e}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )
    except Exception as e:
        logger.error(f"Error to fetch document messages: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch document: {str(e)}",
        )

@document_app.get("/document/{process_id}/documents")
def get_process_documents(process_id: int):
    try:
        document_list = DocumentUseCases.get_process_documents(process_id)
        return document_list
    except ValueError as e:
        logger.warning(f"Document with id {process_id} not found: {e}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )
    except Exception as e:
        logger.error(f"Error to fetch documents: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch document: {str(e)}",
        )
    
@document_app.get("/document/templates/{document_type_id}/download")
def download_document_template(
        document_type_id: int,
        file_format: TemplateFormat = Query(..., description="Formato do arquivo")
    ):
    try:
        template_data = DocumentTasks.get_template_file_by_format(document_type_id, file_format.value)
        return Response(
            content=template_data["file_content"],
            media_type=template_data["mime_type"],
            headers={
                "Content-Disposition": f'attachment; filename="{template_data["file_name"]}"'
            }
        )
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))


@document_app.get("/document/templates/list", status_code=status.HTTP_200_OK)
def get_templates_list(template_type: str = Query(None)):
    try:
        templates = DocumentUseCases.get_all_document_templates(template_type=template_type)
        return {"templates": templates}
    except Exception as e:
        logger.error(f"Error getting templates: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get templates"
        )

@document_app.post("/document/{process_id}/reports/{document_type_id}/comments")
def add_comment(
    process_id: int,
    document_type_id: int,
    payload: DocumentMessageCreate,
    request: Request,
    document_id: int | None = Query(None)
):
    try:
        current_user = AuthenticationUseCases.current_user(request)
        role_name = current_user.user_role.name.lower()
        get_advisor_or_admin_user(current_user)
        return DocumentUseCases.add_comment_to_report(
            process_id=process_id,
            document_type_id=document_type_id,
            message=payload.message,
            user_id=current_user.id,
            user_role=role_name,
            document_id=document_id
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=str(e)
        )
    
@document_app.get("/document/reports/{document_id}/message_list")
def get_report_message_list(
    document_id: int,
    request: Request
):
    try:
        return DocumentUseCases.get_report_message_list(
            document_id=document_id
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=str(e)
        )
    
@document_app.patch("/document/{process_id}/reports/{document_type_id}/status")
def update_report_status(
    process_id: int,
    document_type_id: int,
    payload: DocumentStatusUpdate,
    request: Request,
    document_id: int | None = Query(None)
):
    current_user = AuthenticationUseCases.current_user(request)
    
    if not current_user or not current_user.id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="User not logged in or missing user ID"
        )

    try:
        role_name = current_user.user_role.name.lower()
        
        return DocumentUseCases.update_report_status(
            process_id=process_id,
            document_type_id=document_type_id,
            status_id=payload.status_id.value,
            user_role=role_name,
            document_id=document_id
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=str(e)
        )
    
@document_app.post("/document/{process_id}/upload")
def upload_pdf_document(
    process_id: int,
    request: Request,
    document_type_id: int = Form(...), 
    file: UploadFile = File(...),
    custom_name: str | None = Form(None),
    document_id: int | None = Query(None)
):
    current_user = AuthenticationUseCases.current_user(request)
    try:
        result = DocumentUseCases.upload_pdf_document(
            process_id=process_id,
            document_type_id=document_type_id,
            file=file,
            current_user=current_user,
            custom_name=custom_name,
            document_id=document_id
        )
        return result
        
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error uploading PDF document for process {process_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload document: {str(e)}"
        )
    
@document_app.get("/document/{process_id}/{document_id}/download")
def download_process_document(
    process_id: int,
    document_id: int,
    request: Request,
    file_format: str = Query("pdf", description="Formato de saída desejado: 'pdf' ou 'jpg'")
):
    current_user = AuthenticationUseCases.current_user(request)
    if not current_user or not current_user.id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="User not logged in or missing user ID"
        )

    try:
        return DocumentUseCases.download_document(
            process_id=process_id,
            document_id=document_id, 
            file_format=file_format,
            current_user=current_user
        )
        
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Error executing download for document {document_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal error processing the download: {str(e)}"
        )
    