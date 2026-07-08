import io
import logging

from fastapi import Response, UploadFile, HTTPException, status
from pdf2image import convert_from_bytes

from core.exceptions.document_exceptions import ImageConversionError
from core.schemas.document_schemas import DocumentStatus, EmptyDocument
from core.schemas.role_schemas import User
from core.tasks.file_formatter_tasks import FileFormatterTasks
from core.tasks.document_tasks import DocumentTasks
from core.tasks.process_tasks import ProcessTasks

logger = logging.getLogger(__name__)

class DocumentUseCases:
    @staticmethod
    def convert_file_to_jpg(upload_file: UploadFile) -> bytes:
        content_type = upload_file.content_type

        if content_type == "application/pdf":
            return FileFormatterTasks.convert_pdf_to_jpg(upload_file)
        return FileFormatterTasks.convert_image_to_jpg(upload_file)

    @staticmethod
    def save_document(file_bytes: bytes, process_id: int, document_type_id: int, original_filename: str) -> None:
        DocumentTasks.save_document(
            process_id=process_id,
            document_type_id=document_type_id,
            file_content=file_bytes,
            original_filename=original_filename
        )

    @staticmethod
    def get_document(document_id: int) -> dict:
        document = DocumentTasks.get_document(document_id)
        return document

    @staticmethod
    def get_process_documents(process_id: int) -> list:
        document_list = DocumentTasks.get_process_documents(process_id)
        return document_list

    @staticmethod
    def get_document_messages(document_id: int) -> list:
        document_messages = DocumentTasks.get_document_messages(document_id)
        return document_messages

    @staticmethod
    def save_document_template(
        file_bytes: bytes,
        document_type_id: int,
        file_name: str,
        mime_type: str,
        template_type: str
    ) -> None:
        DocumentTasks.save_document_template(
            document_type_id=document_type_id,
            file_content=file_bytes,
            file_name=file_name,
            mime_type=mime_type,
            template_type=template_type
        )

    @staticmethod
    def get_all_document_templates(template_type: str = None) -> list:
        return DocumentTasks.get_all_document_templates(template_type)

    @staticmethod
    def get_document_template_by_type_id(document_type_id: int) -> dict:
        template = DocumentTasks.get_document_template_by_type_id(document_type_id)
        if not template:
            raise ValueError(f"Template for document type '{document_type_id}' not found")
        return template

    @staticmethod
    def add_comment_to_report(process_id: int, document_type_id: int, message: str, user_id: int, user_role: str, document_id: int = None) -> dict:

        document_id = document_id or DocumentTasks.create_empty_document(
            process_id,
            document_type_id,
            DocumentStatus.PENDING.value
        )
        if not document_id:
            raise HTTPException(status_code=500, detail="Error to create base document for the report")

        message_id = DocumentTasks.insert_document_message(document_id, message, user_id)
        
        return {
            "message": "Comment added successfully",
            "document_id": document_id,
            "message_id": message_id,
            "role": user_role  
        }

    @staticmethod
    def get_report_message_list(document_id: int) -> dict:
        document = DocumentTasks.get_document(document_id)
        print(f"Document fetched for document_id {document_id}: {document.get('id')}") 
        if not document:
            logger.info("Document not found.", extra={"document_id": document_id})
            return {
                "document": None,
                "messages": []
            }
        
        doc_data = document.copy()
        doc_data.pop('file_content', None)

        messages = DocumentTasks.get_document_messages(document_id)

        return {
            "document": doc_data,
            "messages": messages
        }

    @staticmethod
    def update_report_status(process_id: int, document_type_id: int, status_id: int, user_role: str, document_id: int = None) -> dict:

        if user_role.upper() not in ["ADMIN", "ADVISOR"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, 
                detail="Ação restrita. Apenas Administradores e Orientadores podem adicionar comentários."
            )

        if document_id:
            DocumentTasks.update_document_status(document_id, status_id)
        else:
            document_id = DocumentTasks.create_empty_document(
                process_id,
                document_type_id,
                status_id
            )
            if not document_id:
                raise HTTPException(status_code=500, detail="Erro ao criar documento base para o relatório")
        
        return {
            "message": "Status updated successfully",
            "document_id": document_id,
            "status_id": status_id
        }

    @classmethod
    def upload_pdf_document(cls, process_id: int, document_type_id: int, file: UploadFile, current_user: User, document_id: int = None) -> dict:
        ProcessTasks.verify_process_access(process_id=process_id, current_user=current_user)

        file_bytes = file.file.read()
        cls._verify_file_integrity(file_bytes)

        original_filename = file.filename or "documento_sem_nome.pdf"

        upsert_result = DocumentTasks.upsert_pdf_document(
            process_id=process_id,
            document_type_id=document_type_id,
            file_content=file_bytes,
            original_filename=original_filename,
            document_id=document_id
        )

        return {
            "message": upsert_result["message"],
            "document_id": upsert_result["document_id"],
            "document_type_id": document_type_id,
            "file_name": original_filename
        }
    
    @classmethod
    def download_document(cls, process_id: int,document_id: int, file_format: str, current_user: User) -> Response:
        ProcessTasks.verify_process_access(process_id=process_id, current_user=current_user)
        document = DocumentTasks.get_document(document_id)

        file_bytes = document.get("file_content")
        original_filename = document.get("file_name", "document_name")

        if not file_bytes or document.get("mime_type") == EmptyDocument.MIME_TYPE:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This document does not have a file attached to it."
            )

        requested_format = file_format.lower()
        if requested_format not in ["pdf", "jpg", "jpeg"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid file format requested. Supported formats are: pdf, jpg, jpeg."
            )

        if requested_format in ["jpg", "jpeg"]:
            file_bytes, media_type, filename = cls._convert_pdf_to_image(file_bytes, original_filename)
        else:
            media_type = "application/pdf"
            filename = original_filename if original_filename.lower().endswith(".pdf") else f"{original_filename}.pdf"

        return Response(
            content=file_bytes,
            media_type=media_type,
            headers={
                "Content-Disposition": f'attachment; filename="{filename}"'
            }
        )

    @staticmethod
    def _convert_pdf_to_image(file_bytes: bytes, original_filename: str) -> tuple[bytes, str, str]:
        try:
            file_bytes = FileFormatterTasks.convert_pdf_bytes_to_jpg(file_bytes)
            media_type = "image/jpeg"
            filename = original_filename if not original_filename.lower().endswith(".jpg") else f"{original_filename[:-4]}.jpg"
            return file_bytes, media_type, filename

        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error converting document to JPG: {str(e)}"
            )

    @staticmethod
    def _verify_file_integrity(file_bytes: bytes) -> bool:
        if not file_bytes:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="The file is empty"
            )

        if not file_bytes.startswith(b'%PDF'):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid format. The file must be a valid PDF document."
            )
        return True