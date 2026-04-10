import io
import uuid
from PIL import Image
from typing import List


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
    def stitch_pages_vertically(pages: List[Image.Image]) -> Image.Image:
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
