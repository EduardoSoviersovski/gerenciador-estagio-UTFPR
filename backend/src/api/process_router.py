from fastapi import APIRouter, HTTPException
from starlette import status

from core.schemas.process_schemas import CreateProcessRequest
from core.use_cases.process_use_cases import ProcessUseCases

process_app = APIRouter()

@process_app.post("/create_process", status_code=status.HTTP_201_CREATED)
def create_process(request: CreateProcessRequest):
    try:
        result = ProcessUseCases.create_new_process(request)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create internship process: {str(e)}"
        )
