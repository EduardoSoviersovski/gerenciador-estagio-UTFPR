import logging
from fastapi import APIRouter, HTTPException
from starlette import status
from starlette.requests import Request

from core.use_cases.advisor_use_cases import AdvisorUseCases
from core.use_cases.authentication_use_cases import AuthenticationUseCases

advisor_app = APIRouter()
logger = logging.getLogger(__name__)

@advisor_app.get("/advisor/processes")
def get_advisor_student_processes(request: Request):
    try:
        current_user = AuthenticationUseCases.current_user(request)
        
        if not current_user or not current_user.email:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, 
                detail="User not logged in or missing email"
            )

        processes = AdvisorUseCases.get_advisor_student_processes_list(advisor_email=current_user.email)
        
        return {"student_processes_list": processes}

    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Error fetching advisor processes for session email: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="Failed to get student processes list"
        )
