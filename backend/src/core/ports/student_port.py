from adapters.database.mysql_adapter import MySQLAdapter
from core.repo.student_repo import GET_USER_REPORTS_BY_USER_EMAIL, GET_USER_ACTIVE_PROCESS_BY_STUDENT_RA

adapter = MySQLAdapter()

class StudentPort:
    @staticmethod
    def get_student_process(ra: str) -> dict:
        return adapter.fetch_one(GET_USER_ACTIVE_PROCESS_BY_STUDENT_RA, (ra,))

    @staticmethod
    def get_student_reports(user_email: str) -> list[dict]:
        return adapter.fetch_list(GET_USER_REPORTS_BY_USER_EMAIL, (user_email,))
