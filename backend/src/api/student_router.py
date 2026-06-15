import logging

from fastapi import APIRouter, HTTPException
from starlette import status
from starlette.requests import Request

from core.use_cases.authentication_use_cases import AuthenticationUseCases
from core.use_cases.process_use_cases import ProcessUseCases
from core.use_cases.student_use_cases import StudentUseCases

student_app = APIRouter()
logger = logging.getLogger(__name__)

@student_app.get("/student/{ra}/processes")
def get_student_processes_list(ra: str):
    try:
        processes = StudentUseCases.get_student_processes_list(ra=ra)
        return {"processes": processes}
    except Exception as e:
        logger.error(f"Error fetching student processes list for RA {ra}: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to get student processes list")

@student_app.get("/student/process/{process_id}")
def get_process_details(process_id: int):
    try:
        process = StudentUseCases.get_process_details_by_id(process_id=process_id)
        workload = ProcessUseCases.get_workload_stats(process)
        return {"process": process, "workload": workload}
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Error fetching process details for ID {process_id}: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to get process details")


@student_app.get("/student/processes")
def get_my_processes(request: Request):
    try:
        current_user = AuthenticationUseCases.current_user(request)
        
        if not current_user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not logged in")
            
        if not current_user.ra:
            print("-> Retornando vazio porque o RA no current_user é nulo/vazio!")
            return {"processes": []}

        processes = StudentUseCases.get_student_processes_list(ra=current_user.ra)
        print(f"-> Processos encontrados no banco para o RA {current_user.ra}: {len(processes)}")
        
        return {"processes": processes}
        
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Error fetching student processes list for session RA: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to get student processes list")
