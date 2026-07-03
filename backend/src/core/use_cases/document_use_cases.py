from datetime import datetime, timedelta

from fastapi import UploadFile, HTTPException

from core.schemas.document_schemas import DocumentStatus
from core.schemas.role_schemas import UserRole, UserRoleId
from core.tasks.file_formatter_tasks import FileFormatterTasks
from core.tasks.document_tasks import DocumentTasks


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
        messages = DocumentTasks.get_document_messages(document['id']) if document else []

        for msg in messages:
            role_id = msg.pop("role_id", None)  
            print(f"Retrieved role_id: {role_id} for message ID: {msg.get('id')}")
            if role_id is not None:
                try:
                    role_enum_id = UserRoleId(role_id)
                    msg["role"] = UserRole[role_enum_id.name].value.lower()
                    print(f"Role ID {role_id} mapped to role name: {msg['role']}")
                except ValueError:
                    msg["role"] = "unknown"
            else:
                msg["role"] = "unknown"

            send_at = msg.get("send_at")
            if isinstance(send_at, datetime):
                local_time = send_at - timedelta(hours=3)
                msg["send_at"] = local_time.isoformat()
            elif isinstance(send_at, str):
                try:
                    dt = datetime.fromisoformat(send_at)
                    msg["send_at"] = (dt - timedelta(hours=3)).isoformat()
                except ValueError:
                    pass

        return {
            "document": document,
            "messages": messages
        }
