from adapters.database.mysql_adapter import MySQLAdapter
from core.repo.advisor_repo import GET_ADVISOR_STUDENT_PROCESS_BY_ADVISOR_EMAIL

adapter = MySQLAdapter()

class AdvisorPort:
    @staticmethod
    def get_advisor_student_processes_list(advisor_email: str) -> list[dict]:
        return adapter.fetch_list(GET_ADVISOR_STUDENT_PROCESS_BY_ADVISOR_EMAIL, (advisor_email,))
