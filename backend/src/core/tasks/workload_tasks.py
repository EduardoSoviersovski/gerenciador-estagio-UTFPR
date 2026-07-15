import calendar
import datetime
import logging
from math import ceil

from core.ports.process_ports import ProcessPort
from core.ports.workload_ports import WorkloadPort
from core.schemas.document_schemas import DocumentType, DocumentStatus, EmptyDocument
from core.schemas.process_schemas import ProcessCategoryId
from core.schemas.workload_schemas import WeekDays


WORKING_DAYS_IN_WEEK = 5
logger = logging.getLogger(__name__)

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
        logger.info(f"Initial projected end date: {projected_end_date}, searching for holidays from {search_start} to {projected_end_date}")
        while holidays_count := WorkloadPort.get_holidays_in_period(search_start, projected_end_date):
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

    @classmethod
    def add_months(cls, source_date: datetime.date, months: int) -> datetime.date:
        month = source_date.month - 1 + months
        year = source_date.year + month // 12
        month = month % 12 + 1

        max_days_in_month = calendar.monthrange(year, month)[1]

        day = min(source_date.day, max_days_in_month)
        return datetime.date(year, month, day)

    @classmethod
    def add_expected_due_dates(
            cls,
            existing_documents: list,
            expected_dates: dict,
            process_id: int
    ) -> list[dict]:
        existing_documents, handled_types = cls._add_expected_dates_to_existing_documents(existing_documents, expected_dates)
        all_docs = cls._add_expected_dates_to_placeholder_documents(existing_documents, expected_dates, handled_types, process_id)
        return all_docs

    @staticmethod
    def _add_expected_dates_to_existing_documents(existing_documents: list, expected_dates: dict) -> tuple[list, set]:
        handled_types = set()
        for documents in existing_documents:
            document_type = documents["document_type_id"]
            if document_type in expected_dates:
                documents["expected_date"] = expected_dates[document_type].isoformat()
            handled_types.add(document_type)
        return existing_documents, handled_types

    @staticmethod
    def _add_expected_dates_to_placeholder_documents(existing_documents: list, expected_dates: dict, handled_types: set, process_id: int) -> list:
        for document_type_id, exp_date in expected_dates.items():
            if document_type_id not in handled_types:
                existing_documents.append({
                    "id": None,
                    "process_id": process_id,
                    "document_type_id": document_type_id,
                    "document_type": DocumentType(document_type_id).name,
                    "status_id": DocumentStatus.PENDING.value,
                    "status": DocumentStatus.PENDING.name,
                    "file_name": EmptyDocument.FILE_NAME,
                    "mime_type": EmptyDocument.MIME_TYPE,
                    "expected_date": exp_date.isoformat()
                })
        return existing_documents

    @staticmethod
    def get_visit_report_due_date(process: dict, start_date: datetime.date, weekly_hours: int) -> datetime.date | None:
        is_mandatory = (process.get("internship_type_id") == ProcessCategoryId.MANDATORY.value)
        return WorkloadTasks.calculate_forecast_end_date(start_date, weekly_hours, 100) if is_mandatory else None

    @staticmethod
    def get_partial_report_due_date(start_date: datetime.date, end_date: datetime.date, months: int) -> datetime.date | None:
        partial_report_date = WorkloadTasks.add_months(start_date, months)
        is_report_needed = partial_report_date <= WorkloadTasks.add_months(end_date, -3)
        return partial_report_date if is_report_needed else None

    @staticmethod
    def _is_leap_year(year: int) -> bool:
        return year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)
