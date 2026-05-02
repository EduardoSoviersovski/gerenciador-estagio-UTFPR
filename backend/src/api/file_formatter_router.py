import urllib

from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from starlette import status
from fastapi.responses import Response

from core.use_cases.file_formatter_use_cases import FileFormatterUseCases

file_formatter_app = APIRouter()


@file_formatter_app.post("/convert_file_to_jpg")
def convert_file_to_jpg(
        file: UploadFile = File(...),
        process_id: int = Form(...),
        document_type_id: int = Form(...)
):
    try:
        converted_bytes = FileFormatterUseCases.convert_file_to_jpg(file)

        FileFormatterUseCases.save_document(
            converted_bytes,
            process_id,
            document_type_id,
            file.filename
        )

        print("File converted and saved to the database successfully")
        encoded_filename = urllib.parse.quote(f"converted_{file.filename}.jpg")
        return Response(
            content=converted_bytes,
            media_type="image/jpeg",
            headers={"Content-Disposition": f"attachment; filename*=utf-8''{encoded_filename}"}
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Conversion or database saving failed: {str(e)}",
        )


@file_formatter_app.get("/document/{document_id}")
def get_document(document_id: int):
    try:
        doc = FileFormatterUseCases.get_document(document_id)
        encoded_filename = urllib.parse.quote(doc["file_name"])

        return Response(
            content=doc["file_content"],
            media_type=doc["mime_type"],
            headers={"Content-Disposition": f"inline; filename*=utf-8''{encoded_filename}"}
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch document: {str(e)}",
        )
