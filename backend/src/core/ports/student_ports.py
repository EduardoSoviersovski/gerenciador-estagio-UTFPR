from adapters.database.mysql_adapter import MySQLAdapter
from core.repo.student_repo import GET_USER_PROCESSES_LIST_BY_RA, GET_PROCESS_DETAILS_BY_ID, GET_USER_REPORTS_BY_STUDENT_RA

adapter = MySQLAdapter()

class StudentPort:
    @staticmethod
    def get_student_processes_list(ra: str) -> list[dict]:
        return adapter.fetch_list(GET_USER_PROCESSES_LIST_BY_RA, (ra,))

    @staticmethod
    def get_process_details_by_id(process_id: int) -> dict | None:
        return adapter.fetch_one(GET_PROCESS_DETAILS_BY_ID, (process_id,))

    @staticmethod
    def get_student_reports(ra: str) -> list[dict]:
        return adapter.fetch_list(GET_USER_REPORTS_BY_STUDENT_RA, (ra,))