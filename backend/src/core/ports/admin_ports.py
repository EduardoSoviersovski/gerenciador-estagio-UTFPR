from adapters.database.mysql_adapter import MySQLAdapter
from core.repo.admin_repo import GET_ALL_PROCESSES, GET_PROCESS_BY_ID

adapter = MySQLAdapter()

class AdminPort:
    @staticmethod
    def get_admin_processes_list() -> list[dict]:
        return adapter.fetch_list(GET_ALL_PROCESSES)

    @staticmethod
    def get_process_by_id(process_id: int) -> dict:
        return adapter.fetch_one(GET_PROCESS_BY_ID, (process_id,))
