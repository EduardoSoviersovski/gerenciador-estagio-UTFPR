from fastapi import HTTPException

from core.ports.student_ports import StudentPort
from core.schemas.process_schemas import ProcessResponse


class StudentTasks:
    @staticmethod
    def get_student_processes_list(ra: str) -> list[dict]:
        return StudentPort.get_student_processes_list(ra)

    @staticmethod
    def get_process_details_by_id(process_id: int) -> ProcessResponse | None:
        raw_data = StudentPort.get_process_details_by_id(process_id)
        if not raw_data:
            raise HTTPException(status_code=404, detail="Processo não encontrado")
        return ProcessResponse.from_dict(raw_data)

    @staticmethod
    def get_student_reports(ra: str) -> list[dict]:
        return StudentPort.get_student_reports(ra)