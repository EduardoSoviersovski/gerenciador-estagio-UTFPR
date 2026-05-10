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
