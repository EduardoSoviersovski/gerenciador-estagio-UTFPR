from fastapi import UploadFile

from core.tasks.file_formatter_tasks import FileFormatterTasks


class FileFormatterUseCases:
    @staticmethod
    def convert_file_to_jpg(upload_file: UploadFile) -> str:
        content_type = upload_file.content_type

        if content_type == "application/pdf":
            return FileFormatterTasks.convert_pdf_to_jpg(upload_file)
        return FileFormatterTasks.convert_image_to_jpg(upload_file)
