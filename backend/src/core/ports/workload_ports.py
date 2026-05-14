from datetime import date

from adapters.database.mysql_adapter import MySQLAdapter
from core.repo.workload_repo import GET_HOLIDAY_COUNT_IN_PERIOD

adapter = MySQLAdapter()

class WorkloadPort:
    @staticmethod
    def get_holidays_in_period(from_date: date, to_date: date) -> int:
        print(f"Querying holidays between {from_date} and {to_date}")
        return adapter.fetch_one(GET_HOLIDAY_COUNT_IN_PERIOD, (from_date, to_date))["num_holidays"]
