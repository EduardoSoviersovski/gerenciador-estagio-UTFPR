from fastapi import APIRouter, HTTPException, UploadFile, File
from starlette import status
from starlette.responses import FileResponse

from core.use_cases.file_formatter_use_cases import FileFormatterUseCases

file_formatter_app = APIRouter()


@file_formatter_app.post("/convert_file_to_jpg")
def convert_file_to_jpg(
        file: UploadFile = File(...)
):
    try:
        result_path = FileFormatterUseCases.convert_file_to_jpg(file)
        print(f"File converted successfully: {result_path}")
        return FileResponse(
            path=result_path,
            media_type="image/jpeg",
            filename="converted_result.jpg"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Conversion failed: {str(e)}",
        )
