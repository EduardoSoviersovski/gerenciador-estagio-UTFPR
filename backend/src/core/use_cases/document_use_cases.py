from fastapi import UploadFile
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
        is_report: bool
    ) -> None:
        DocumentTasks.save_document_template(
            document_type_id=document_type_id,
            file_content=file_bytes,
            file_name=file_name,
            mime_type=mime_type,
            is_report=is_report
        )

    @staticmethod
    def get_all_document_templates(is_report: bool = None) -> list:
        return DocumentTasks.get_all_document_templates(is_report)

    @staticmethod
    def get_document_template_by_type_id(document_type_id: int) -> dict:
        template = DocumentTasks.get_document_template_by_type_id(document_type_id)
        if not template:
            raise ValueError(f"Template for document type '{document_type_id}' not found")
        return template
