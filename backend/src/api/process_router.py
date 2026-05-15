from fastapi import APIRouter, HTTPException
from starlette import status

from core.schemas.process_schemas import UpdateProcessRequest
from core.use_cases.document_use_cases import DocumentUseCases
from core.use_cases.process_use_cases import ProcessUseCases

process_app = APIRouter()


@process_app.put("/{process_id}", status_code=status.HTTP_200_OK)
def update_process(process_id: int, request: UpdateProcessRequest):
    try:
        return ProcessUseCases.update_process(process_id, request)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update internship process: {e}",
        )


@process_app.delete("/{process_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_process(process_id: int):
    try:
        success = ProcessUseCases.delete_process(process_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Process not found"
            )
        return None
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete internship process: {e}",
        )


@process_app.get("/{process_id}/documents")
def get_process_documents(process_id: int):
    try:
        document_list = DocumentUseCases.get_process_documents(process_id)
        return document_list
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
