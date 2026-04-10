from adapters.driven.database.student_repo_adapter import StudentRepoAdapter
from core.schemas.role_schemas import User


class StudentUseCases:
    def __init__(self, student_repo: StudentRepoAdapter):
        self.student_repo = student_repo

    def get_student_reports(self, user: User) -> list[dict]:
        user_email = user.email
        student_reports = self.student_repo.get_student_reports(user_email)
        return student_reports

