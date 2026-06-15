from core.schemas.process_schemas import ProcessResponse
from core.schemas.role_schemas import User
from core.tasks.student_tasks import StudentTasks


class StudentUseCases:
    @staticmethod
    def get_student_processes_list(ra: str) -> list[dict]:
        return StudentTasks.get_student_processes_list(ra)

    @staticmethod
    def get_process_details_by_id(process_id: int) -> ProcessResponse:
        return StudentTasks.get_process_details_by_id(process_id)

    @staticmethod
    def get_student_reports(ra: str) -> list[dict]:
        student_reports = StudentTasks.get_student_reports(ra=ra)
        return student_reports