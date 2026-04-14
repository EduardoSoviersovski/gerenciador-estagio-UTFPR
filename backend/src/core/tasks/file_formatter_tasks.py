import io
import uuid
from PIL import Image
from fastapi import UploadFile
from pdf2image import convert_from_bytes


class FileFormatterTasks:
    @staticmethod
    def generate_temp_filename(extension: str) -> str:
        return f"/tmp/{uuid.uuid4()}.{extension}"

    @staticmethod
    def convert_bytes_to_rgb_image(content: bytes) -> Image.Image:
        image_bytes = io.BytesIO(content)
        with Image.open(image_bytes) as img:
            return img.convert('RGB')

    @staticmethod
    def stitch_pages_vertically(pages: list[Image.Image]) -> Image.Image:
        if not pages:
            raise ValueError("No pages provided for stitching.")

        widths, heights = zip(*(i.size for i in pages))
        max_width = max(widths)
        total_height = sum(heights)

        combined_image = Image.new('RGB', (max_width, total_height))

        y_offset = 0
        for page in pages:
            combined_image.paste(page, (0, y_offset))
            y_offset += page.height

        return combined_image

    @staticmethod
    def convert_image_to_jpg(upload_file: UploadFile) -> str:
        content = upload_file.file.read()
        output_path = FileFormatterTasks.generate_temp_filename("jpg")

        rgb_im = FileFormatterTasks.convert_bytes_to_rgb_image(content)
        rgb_im.save(output_path, 'JPEG')

        return output_path

    @staticmethod
    def convert_pdf_to_jpg(upload_file: UploadFile) -> str:
        pdf_content = upload_file.file.read()

        pages = convert_from_bytes(pdf_content)
        if not pages:
            raise ValueError("PDF is empty or invalid")

        combined_image = FileFormatterTasks.stitch_pages_vertically(pages)

        output_path = FileFormatterTasks.generate_temp_filename("jpg")
        combined_image.save(output_path, 'JPEG')

        return output_path
