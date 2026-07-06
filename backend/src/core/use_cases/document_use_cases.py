import logging

from fastapi import UploadFile, HTTPException, status

from core.schemas.document_schemas import DocumentStatus
from core.tasks.file_formatter_tasks import FileFormatterTasks
from core.tasks.document_tasks import DocumentTasks

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
        if not document:
            raise ValueError("Document not found")
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
    def add_comment_to_report(process_id: int, document_type_id: int, message: str, user_id: int, user_role: str) -> dict:

        if user_role.upper() not in ["ADMIN", "ADVISOR"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, 
                detail="Ação restrita. Apenas Administradores e Orientadores podem adicionar comentários."
            )
        
        document = DocumentTasks.get_document_by_process_and_type(process_id, document_type_id) or {}

        document_id = document.get('id') or DocumentTasks.create_empty_document(
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
    def get_report_details(process_id: int, document_type_id: int) -> dict:
        document = DocumentTasks.get_document_by_process_and_type(process_id, document_type_id)
        if not document:
            logger.info(
                "Document not found.",
                extra={
                    "process_id": process_id,
                    "document_type_id": document_type_id
                }
            )
            return {
                "document": None,
                "messages": []
            }

        messages = DocumentTasks.get_document_messages(document['id'])

        return {
            "document": document,
            "messages": messages
        }

    @staticmethod
    def update_report_status(process_id: int, document_type_id: int, status_id: int, user_role: str) -> dict:

        if user_role.upper() not in ["ADMIN", "ADVISOR"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, 
                detail="Ação restrita. Apenas Administradores e Orientadores podem adicionar comentários."
            )

        document = DocumentTasks.get_document_by_process_and_type(process_id, document_type_id)
        
        if not document:
            document_id = DocumentTasks.create_empty_document(
                process_id,
                document_type_id,
                status_id
            )
            if not document_id:
                raise HTTPException(status_code=500, detail="Erro ao criar documento base para o relatório")
        else:
            document_id = document.get('id')
            DocumentTasks.update_document_status(document_id, status_id)
            
        return {
            "message": "Status updated successfully",
            "document_id": document_id,
            "status_id": status_id
        }