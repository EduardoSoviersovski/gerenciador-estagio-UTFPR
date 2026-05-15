from adapters.database.mysql_adapter import MySQLAdapter
from core.repo.admin_repo import GET_ALL_PROCESSES

adapter = MySQLAdapter()

class AdminPort:
    @staticmethod
    def get_admin_processes_list() -> list[dict]:
        return adapter.fetch_list(GET_ALL_PROCESSES)
