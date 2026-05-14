from fastapi import HTTPException

from core.ports.student_ports import StudentPort
from core.schemas.process_schemas import ProcessResponse


class StudentTasks:
    @staticmethod
    def get_student_process(ra: str) -> ProcessResponse | None:
        raw_data = StudentPort.get_student_process(ra)
        if not raw_data:
            raise HTTPException(status_code=404, detail="Processo não encontrado")
        return ProcessResponse.from_dict(raw_data)

    @staticmethod
    def get_student_reports(ra: str) -> list[dict]:
        return StudentPort.get_student_reports(ra)

