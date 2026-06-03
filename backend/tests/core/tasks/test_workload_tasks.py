import datetime
import pytest
from adapters.database.mysql_adapter import MySQLAdapter
from core.tasks.workload_tasks import WorkloadTasks

@pytest.fixture
def mock_db_holidays():
    db = MySQLAdapter()

    with db.get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute("SET FOREIGN_KEY_CHECKS = 0;")
            cursor.execute("TRUNCATE TABLE holiday;")

            cursor.execute("INSERT INTO holiday (date, description) VALUES ('2026-06-03', 'Feriado de Teste 1');")
            cursor.execute("INSERT INTO holiday (date, description) VALUES ('2026-06-04', 'Feriado de Teste 2');")

            cursor.execute("SET FOREIGN_KEY_CHECKS = 1;")
        conn.commit()

    yield

    with db.get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute("TRUNCATE TABLE holiday;")
        conn.commit()


class TestWorkloadTasks:
    def test_get_next_business_day(self):
        friday = datetime.date(2026, 6, 5)
        assert WorkloadTasks.get_next_business_day(friday) == friday

        saturday = datetime.date(2026, 6, 6)
        monday = datetime.date(2026, 6, 8)
        assert WorkloadTasks.get_next_business_day(saturday) == monday

        sunday = datetime.date(2026, 6, 7)
        assert WorkloadTasks.get_next_business_day(sunday) == monday

    @pytest.mark.parametrize(
        "start_date, days_to_add, expected_date",
        [
            (datetime.date(2026, 6, 5), 0, datetime.date(2026, 6, 5)),
            (datetime.date(2026, 6, 5), 1, datetime.date(2026, 6, 5)),
            (datetime.date(2026, 6, 5), 2, datetime.date(2026, 6, 8)),
            (datetime.date(2026, 6, 8), 5, datetime.date(2026, 6, 12)),
            (datetime.date(2026, 6, 8), 6, datetime.date(2026, 6, 15)),
        ],
        ids=[
            "zero_days_on_friday",
            "one_day_on_friday",
            "two_days_from_friday_to_monday",
            "five_days_from_monday_to_friday",
            "six_days_from_monday_to_next_monday"
        ]
    )
    def test_add_business_days(self, start_date, days_to_add, expected_date):
        assert WorkloadTasks._add_business_days(start_date, days_to_add) == expected_date

    def test_calculate_forecast_end_date_happy_path(self):
        start_date = datetime.date(2026, 6, 1)
        weekly_hours = 30
        target_hours = 60

        expected_end_date = datetime.date(2026, 6, 12)

        result = WorkloadTasks.calculate_forecast_end_date(start_date, weekly_hours, target_hours)
        assert result == expected_end_date

    @pytest.mark.parametrize(
        "start_date, weekly_hours, target_hours, expected_date",
        [
            (datetime.date(2026, 6, 1), 30, 60, datetime.date(2026, 6, 16)),
            (datetime.date(2026, 6, 1), 30, 24, datetime.date(2026, 6, 8)),
        ],
        ids=[
            "10_days_target_pushed_to_tuesday",
            "4_days_target_pushed_through_weekend_to_monday"
        ]
    )
    def test_calculate_forecast_end_date_with_holidays(
        self,
        start_date,
        weekly_hours,
        target_hours,
        expected_date,
        mock_db_holidays
    ):

        assert WorkloadTasks.calculate_forecast_end_date(start_date, weekly_hours, target_hours) == expected_date

    @pytest.mark.parametrize(
        "start_date, weekly_hours, target_hours, expected_date",
        [
            (datetime.date(2026, 6, 1), 0, 60, datetime.date(2026, 6, 1)),
            (datetime.date(2026, 6, 1), 30, 0, datetime.date(2026, 6, 1)),
        ],
        ids=[
            "zero_weekly_hours",
            "zero_target_hours"
        ]
    )
    def test_calculate_forecast_end_date_edge_cases(self, start_date, weekly_hours, target_hours, expected_date):
        assert WorkloadTasks.calculate_forecast_end_date(start_date, weekly_hours, target_hours) == expected_date

    def test_calculate_fulfilled_hours_no_holidays(self):
        start_date = datetime.date(2026, 6, 1)
        end_date = datetime.date(2026, 6, 7)
        weekly_hours = 30

        result = WorkloadTasks.calculate_fulfilled_hours(start_date, end_date, weekly_hours)
        assert result == 30.0

    def test_calculate_fulfilled_hours_with_holidays(self, mock_db_holidays):
        start_date = datetime.date(2026, 6, 1)
        end_date = datetime.date(2026, 6, 7)
        weekly_hours = 30

        result = WorkloadTasks.calculate_fulfilled_hours(start_date, end_date, weekly_hours)
        assert result == 18.0

    @pytest.mark.parametrize(
        "start_date, end_date, weekly_hours, expected_hours",
        [
            (datetime.date(2026, 6, 10), datetime.date(2026, 6, 1), 30, 0.0),
            (datetime.date(2026, 6, 1), datetime.date(2026, 6, 10), 0, 0.0),
        ],
        ids=[
            "start_date_after_end_date",
            "zero_weekly_hours"
        ]
    )
    def test_calculate_fulfilled_hours_edge_cases(self, start_date, end_date, weekly_hours, expected_hours):
        assert WorkloadTasks.calculate_fulfilled_hours(start_date, end_date, weekly_hours) == expected_hours
