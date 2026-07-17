import datetime
import io
import logging

from fastapi import Response, UploadFile, HTTPException, status
from pdf2image import convert_from_bytes

from core.exceptions.database_exceptions import DocumentNotFoundError
from core.exceptions.document_exceptions import ImageConversionError, DocumentTemplateDoesNotExistError
from core.schemas.document_schemas import DocumentStatus, EmptyDocument, TemplateFormat, DocumentType
from core.schemas.role_schemas import User
from core.tasks.file_formatter_tasks import FileFormatterTasks
from core.tasks.document_tasks import DocumentTasks
from core.tasks.process_tasks import ProcessTasks
from core.tasks.workload_tasks import WorkloadTasks

logger = logging.getLogger(__name__)

class DocumentUseCases:
    @staticmethod
    def convert_file_to_jpg(upload_file: UploadFile) -> bytes:
        content_type = upload_file.content_type

        if content_type == "application/pdf":
            return FileFormatterTasks.convert_pdf_to_jpg(upload_file)
        return FileFormatterTasks.convert_image_to_jpg(upload_file)

    @staticmethod
    def save_document(file_bytes: bytes, process_id: int, document_type_id: int, original_filename: str, custom_name: str = None) -> None:
        DocumentTasks.save_document(
            process_id=process_id,
            document_type_id=document_type_id,
            file_content=file_bytes,
            original_filename=original_filename,
            custom_name=custom_name
        )

    @staticmethod
    def get_document(document_id: int) -> dict:
        return DocumentTasks.get_document(document_id)

    @classmethod
    def get_process_documents(cls, process_id: int) -> list:
        process = ProcessTasks.get_process_by_id(process_id)

        start_date = process.get("start_date")
        weekly_hours = process.get("weekly_hours")

        hour_goal = WorkloadTasks.get_active_hour_goal(process_id)
        target_hours = hour_goal.get("target_hours", 0) if hour_goal else 0
        end_date = WorkloadTasks.calculate_forecast_end_date(start_date, weekly_hours, target_hours)

        first_partial_report_due_date = WorkloadTasks.get_partial_report_due_date(start_date, end_date, 6)
        second_partial_report_due_date = WorkloadTasks.get_partial_report_due_date(start_date, end_date, 12)

        raw_expected_dates = {
            DocumentType.STUDENT_PARTIAL_REPORT_1.value: first_partial_report_due_date,
            DocumentType.SUPERVISOR_PARTIAL_REPORT_1.value: first_partial_report_due_date,
            DocumentType.VISIT_REPORT.value: WorkloadTasks.get_visit_report_due_date(process, start_date, weekly_hours),
            DocumentType.STUDENT_PARTIAL_REPORT_2.value: second_partial_report_due_date,
            DocumentType.SUPERVISOR_PARTIAL_REPORT_2.value: second_partial_report_due_date,
            DocumentType.FINAL_REPORT.value: end_date,
        }
        expected_dates = {k: v for k, v in raw_expected_dates.items() if v is not None}
        existing_documents = DocumentTasks.get_process_documents(process_id)

        all_docs = WorkloadTasks.add_expected_due_dates(existing_documents, expected_dates, process_id)

        all_docs.sort(key=lambda x: x.get("expected_date", "9999-12-31"))
        return all_docs

    @staticmethod
    def get_document_messages(document_id: int) -> list:
        return DocumentTasks.get_document_messages(document_id)

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
            raise DocumentTemplateDoesNotExistError()
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

    @classmethod
    def get_report_message_list(cls, document_id: int) -> dict:
        try:
            document = cls.get_document(document_id)
        except DocumentNotFoundError:
            logger.info("Document not found.", extra={"document_id": document_id})
            return {
                "document": None,
                "messages": []
            }
        
        doc_data = document.copy()
        doc_data.pop('file_content', None)

        messages = cls.get_document_messages(document_id)

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
    def upload_pdf_document(cls, process_id: int, document_type_id: int, file: UploadFile, current_user: User, custom_name: str = None, document_id: int = None) -> dict:
        ProcessTasks.verify_process_access(process_id=process_id, current_user=current_user)

        file_bytes = file.file.read()
        cls._verify_file_integrity(file_bytes)

        original_filename = file.filename or "documento_sem_nome.pdf"
        print(f"Uploading document: {original_filename}, Process ID: {process_id}, Document Type ID: {document_type_id}, Document ID: {document_id}")

        upsert_result = DocumentTasks.upsert_pdf_document(
            process_id=process_id,
            document_type_id=document_type_id,
            file_content=file_bytes,
            original_filename=original_filename,
            custom_name=custom_name,
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
        document = cls.get_document(document_id)

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