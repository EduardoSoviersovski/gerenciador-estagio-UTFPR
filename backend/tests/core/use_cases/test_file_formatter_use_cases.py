import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from fastapi import UploadFile
from core.use_cases.file_formatter_use_cases import FileFormatterUseCases

@patch("core.use_cases.file_formatter_use_cases.FileFormatterTasks.convert_pdf_to_jpg")
@patch("core.use_cases.file_formatter_use_cases.FileFormatterTasks.convert_image_to_jpg")
def test_convert_file_to_jpg_routes_to_pdf_port(
    mock_convert_image_to_jpg: MagicMock,
    mock_convert_pdf_to_jpg: MagicMock
) -> None:
    mock_convert_pdf_to_jpg.return_value = "/tmp/test.jpg"

    use_case = FileFormatterUseCases()
    mock_file = MagicMock(spec=UploadFile)
    mock_file.content_type = "application/pdf"

    result = use_case.convert_file_to_jpg(mock_file)

    assert result == "/tmp/test.jpg"
    mock_convert_pdf_to_jpg.assert_called_once_with(mock_file)
    mock_convert_image_to_jpg.assert_not_called()


@patch("core.use_cases.file_formatter_use_cases.FileFormatterTasks.convert_pdf_to_jpg")
@patch("core.use_cases.file_formatter_use_cases.FileFormatterTasks.convert_image_to_jpg")
def test_convert_file_to_jpg_routes_to_image_port(
    mock_convert_image_to_jpg: MagicMock,
    mock_convert_pdf_to_jpg: MagicMock
) -> None:
    mock_convert_image_to_jpg.return_value= "/tmp/img.jpg"

    use_case = FileFormatterUseCases()
    mock_file = MagicMock(spec=UploadFile)
    mock_file.content_type = "image/png"

    result = use_case.convert_file_to_jpg(mock_file)

    assert result == "/tmp/img.jpg"
    mock_convert_pdf_to_jpg.assert_not_called()
    mock_convert_image_to_jpg.assert_called_once_with(mock_file)
