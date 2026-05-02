import datetime
from math import ceil

from core.ports.process_ports import ProcessPort


class WorkloadTasks:
    @staticmethod
    def get_next_business_day(start_date: datetime.date) -> datetime.date:
        current = start_date
        while current.weekday() > 4:
            current += datetime.timedelta(days=1)
        return current

    @staticmethod
    def calculate_forecast_end_date(start_date: datetime.date, weekly_hours: int, target_hours: int) -> datetime.date:
        if weekly_hours <= 0: return start_date

        daily_hours = weekly_hours / 5
        days_needed = ceil(target_hours / daily_hours)
        if days_needed <= 0: return start_date

        first_day = WorkloadTasks.get_next_business_day(start_date)
        remaining = days_needed - 1
        weeks, extra = divmod(remaining, 5)

        end_weekday = first_day.weekday() + extra
        weekend_skip = 2 if end_weekday > 4 else 0

        return first_day + datetime.timedelta(days=weeks * 7 + extra + weekend_skip)

    @staticmethod
    def calculate_fulfilled_hours(start_date: datetime.date, end_date: datetime.date, weekly_hours: int) -> float:
        daily_hours = weekly_hours / 5
        total_hours = 0.0
        current = start_date

        while current <= end_date:
            if current.weekday() < 5:
                total_hours += daily_hours
            current += datetime.timedelta(days=1)
        return total_hours

    @staticmethod
    def get_active_hour_goal(process_id: int):
        return ProcessPort.get_active_hour_goal(process_id)
