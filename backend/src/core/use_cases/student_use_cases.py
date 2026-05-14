from core.schemas.process_schemas import ProcessResponse
from core.schemas.role_schemas import User
from core.tasks.student_tasks import StudentTasks


class StudentUseCases:
    @staticmethod
    def get_student_process(ra: str) -> ProcessResponse:
        student_process = StudentTasks.get_student_process(ra)
        return student_process


    @staticmethod
    def get_student_reports(ra: str) -> list[dict]:
        student_reports = StudentTasks.get_student_reports(ra=ra)
        return student_reports

