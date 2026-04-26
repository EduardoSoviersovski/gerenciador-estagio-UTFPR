from core.schemas.role_schemas import User
from core.tasks.student_tasks import StudentTasks


class StudentUseCases:
    @staticmethod
    def get_student_reports(user: User) -> list[dict]:
        user_email = user.email
        student_reports = StudentTasks.get_student_reports(user_email)
        return student_reports

