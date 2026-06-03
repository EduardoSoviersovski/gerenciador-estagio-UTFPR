import logging
import urllib

from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from starlette import status
from fastapi.responses import Response

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
            file.filename
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

@document_app.get("/{process_id}/documents")
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

@document_app.get("/document/templates/{document_type_id}/download", status_code=status.HTTP_200_OK)
def download_template_by_id(document_type_id: str):
    try:
        template = DocumentUseCases.get_document_template_by_type_id(document_type_id)
        return Response(
            content=template["file_content"],
            media_type=template["mime_type"],
            headers={
                "Content-Disposition": f"attachment; filename={template['file_name']}"
            }
        )
    except ValueError as e:
        logger.warning(f"Template for document type '{document_type_id}' not found: {e}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        logger.error(f"Failed to download template for document type '{document_type_id}': {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to download template",
        )

@document_app.get("/document/templates/list", status_code=status.HTTP_200_OK)
def get_all_templates():
    try:
        templates = DocumentUseCases.get_all_document_templates()
        return {"templates": templates}
    except Exception as e:
        logger.error(f"Erro ao listar templates: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Falha ao obter lista de templates."
        )
