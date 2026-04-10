from adapters.driven.database.mysql_adapter import MySQLAdapter
from adapters.driven.database.student_queries import GET_USER_REPORTS_BY_USER_EMAIL


class StudentRepoAdapter(MySQLAdapter):
    def get_student_reports(self, user_email: str) -> list[dict]:
        return self.fetch_list(GET_USER_REPORTS_BY_USER_EMAIL, (user_email,))
