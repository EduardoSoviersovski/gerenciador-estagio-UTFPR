from fastapi import UploadFile

from core.ports.file_formatter_port import FileFormatterPort


class FileFormatterUseCases:
    def __init__(self, file_formatter: FileFormatterPort) -> None:
        self.file_formatter = file_formatter

    def convert_file_to_jpg(self, upload_file: UploadFile) -> str:
        content_type = upload_file.content_type

        if content_type == "application/pdf":
            return self.file_formatter.convert_pdf_to_jpg(upload_file)
        return self.file_formatter.convert_image_to_jpg(upload_file)
