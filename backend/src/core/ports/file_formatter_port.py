from fastapi import UploadFile


class FileFormatterPort:
    def convert_image_to_jpg(self, upload_file: UploadFile) -> str:
        raise NotImplementedError

    def convert_pdf_to_jpg(self, upload_file: UploadFile) -> str:
        raise NotImplementedError
