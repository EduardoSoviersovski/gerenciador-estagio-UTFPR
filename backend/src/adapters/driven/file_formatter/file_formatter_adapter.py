from fastapi import UploadFile
from pdf2image import convert_from_bytes
from core.ports.file_formatter_port import FileFormatterPort
from core.tasks.file_formatter_tasks import FileFormatterTasks


class PdfToImageFileFormatterAdapter(FileFormatterPort):
    def convert_image_to_jpg(self, upload_file: UploadFile) -> str:
        content = upload_file.file.read()
        output_path = FileFormatterTasks.generate_temp_filename("jpg")

        rgb_im = FileFormatterTasks.convert_bytes_to_rgb_image(content)
        rgb_im.save(output_path, 'JPEG')

        return output_path

    def convert_pdf_to_jpg(self, upload_file: UploadFile) -> str:
        pdf_content = upload_file.file.read()

        pages = convert_from_bytes(pdf_content)
        if not pages:
            raise ValueError("PDF is empty or invalid")

        combined_image = FileFormatterTasks.stitch_pages_vertically(pages)

        output_path = FileFormatterTasks.generate_temp_filename("jpg")
        combined_image.save(output_path, 'JPEG')

        return output_path
