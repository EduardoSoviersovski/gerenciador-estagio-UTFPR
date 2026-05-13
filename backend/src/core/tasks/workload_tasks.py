import datetime
from math import ceil

from core.ports.process_ports import ProcessPort
from core.ports.workload_ports import WorkloadPort
from core.schemas.workload_schemas import WeekDays


WORKING_DAYS_IN_WEEK = 5

class WorkloadTasks:

    @staticmethod
    def get_next_business_day(current_date: datetime.date) -> datetime.date:
        while current_date.weekday() >= WeekDays.Saturday.value:
            current_date += datetime.timedelta(days=1)
        return current_date

    @staticmethod
    def _add_business_days(start_date: datetime.date, days_to_add: int) -> datetime.date:
        if days_to_add == 0:
            return start_date

        remaining = days_to_add - 1
        weeks, extra = divmod(remaining, WORKING_DAYS_IN_WEEK)

        end_weekday = start_date.weekday() + extra

        weekend_skip = 2 if end_weekday > WeekDays.Friday.value else 0

        return start_date + datetime.timedelta(days=weeks * 7 + extra + weekend_skip)

    @staticmethod
    def calculate_forecast_end_date(start_date: datetime.date, weekly_hours: int, target_hours: int) -> datetime.date:
        if weekly_hours <= 0: return start_date

        daily_hours = weekly_hours / WORKING_DAYS_IN_WEEK

        days_needed = ceil(target_hours / daily_hours)
        if days_needed <= 0: return start_date

        current_date = WorkloadTasks.get_next_business_day(start_date)

        projected_end_date = WorkloadTasks._add_business_days(current_date, days_needed)

        search_start = current_date
        print(f"Initial projected end date: {projected_end_date}, searching for holidays from {search_start} to {projected_end_date}")
        while holidays_count := WorkloadPort.get_holidays_in_period(search_start, projected_end_date):
            print(holidays_count)
            search_start = WorkloadTasks.get_next_business_day(projected_end_date + datetime.timedelta(days=1))
            projected_end_date = WorkloadTasks._add_business_days(search_start, holidays_count)
        return projected_end_date

    @staticmethod
    def calculate_fulfilled_hours(start_date: datetime.date, end_date: datetime.date, weekly_hours: int) -> float:
        if start_date > end_date or weekly_hours <= 0:
            return 0.0

        working_days_in_week = WeekDays.Saturday.value
        daily_hours = weekly_hours / working_days_in_week

        business_days = 0
        current = start_date

        while current <= end_date:
            if current.weekday() < working_days_in_week:
                business_days += 1
            current += datetime.timedelta(days=1)

        holidays_count = WorkloadPort.get_holidays_in_period(start_date, end_date)
        actual_worked_days = max(0, business_days - holidays_count)

        return float(actual_worked_days * daily_hours)

    @staticmethod
    def get_active_hour_goal(process_id: int):
        return ProcessPort.get_active_hour_goal(process_id)

    @staticmethod
    def delete_hour_goals_by_process_id(process_id: int) -> bool:
        return ProcessPort.delete_hour_goals_by_process_id(process_id)