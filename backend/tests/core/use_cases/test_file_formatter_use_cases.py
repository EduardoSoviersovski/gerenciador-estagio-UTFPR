import pytest
from unittest.mock import AsyncMock, MagicMock
from fastapi import UploadFile
from core.use_cases.file_formatter_use_cases import FileFormatterUseCases


@pytest.mark.asyncio
async def test_convert_file_to_jpg_routes_to_pdf_port():
    mock_port = MagicMock()
    mock_port.convert_pdf_to_jpg = AsyncMock(return_value="/tmp/test.jpg")

    use_case = FileFormatterUseCases(file_formatter=mock_port)
    mock_file = MagicMock(spec=UploadFile)
    mock_file.content_type = "application/pdf"

    result = await use_case.convert_file_to_jpg(mock_file)

    assert result == "/tmp/test.jpg"
    mock_port.convert_pdf_to_jpg.assert_called_once_with(mock_file)
    mock_port.convert_image_to_jpg.assert_not_called()


@pytest.mark.asyncio
async def test_convert_file_to_jpg_routes_to_image_port():
    mock_port = MagicMock()
    mock_port.convert_image_to_jpg = AsyncMock(return_value="/tmp/img.jpg")

    use_case = FileFormatterUseCases(file_formatter=mock_port)
    mock_file = MagicMock(spec=UploadFile)
    mock_file.content_type = "image/png"

    result = await use_case.convert_file_to_jpg(mock_file)

    assert result == "/tmp/img.jpg"
    mock_port.convert_pdf_to_jpg.assert_not_called()
    mock_port.convert_image_to_jpg.assert_called_once_with(mock_file)
