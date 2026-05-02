import pytest
from PIL import Image
import io
from core.tasks.file_formatter_tasks import FileFormatterTasks


def test_convert_bytes_to_rgb_image():
    image_dimensions = (10, 10)
    img = Image.new("RGBA", image_dimensions, color="blue")
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format='PNG')
    raw_bytes = img_byte_arr.getvalue()

    result_img = FileFormatterTasks.convert_bytes_to_rgb_image(raw_bytes)

    assert result_img.mode == "RGB"
    assert result_img.size == image_dimensions


def test_stitch_pages_vertically():
    page_dimensions = (100, 50)
    img1 = Image.new("RGB", page_dimensions, color="red")
    img2 = Image.new("RGB", page_dimensions, color="green")
    pages = [img1, img2]

    combined = FileFormatterTasks.stitch_pages_vertically(pages)

    first_page_pixel = combined.getpixel((0, 10))
    second_page_pixel = combined.getpixel((0, 60))
    red_color = (255, 0, 0)
    green_color = (0, 128, 0)

    assert combined.size == (100, 100)
    assert first_page_pixel == red_color
    assert second_page_pixel == green_color


def test_stitch_pages_empty_list_raises_error():
    with pytest.raises(ValueError, match="No pages provided"):
        FileFormatterTasks.stitch_pages_vertically([])