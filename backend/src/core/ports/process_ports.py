from datetime import date

from adapters.database.mysql_adapter import MySQLAdapter
from core.repo.authentication_ports import GET_USER_BY_EMAIL
from core.repo.process_repo import GET_INTERNSHIP_TYPE_ID, INSERT_INTERNSHIP_PROCESS, \
    GET_INTERNSHIP_PROCESS_BY_STUDENT_ID_AND_START_DATE, GET_INTERNSHIP_PROCESS, GET_ACTIVE_HOUR_GOAL_BY_PROCESS_ID, \
    UPDATE_HOUR_GOAL_INACTIVE, INSERT_HOUR_GOAL

adapter = MySQLAdapter()

class ProcessPort:
    @staticmethod
    def get_user_by_email(user_email: str) -> dict:
        return adapter.fetch_one(GET_USER_BY_EMAIL, (user_email,))

    @staticmethod
    def get_internship_id(category_name: str) -> dict:
        return adapter.fetch_one(GET_INTERNSHIP_TYPE_ID, (category_name,))

    @staticmethod
    def insert_internship_process(
        student_id: int,
        advisor_id: int,
        company_id: int,
        status_id: int,
        student_course_id: int,
        internship_type_id: int,
        sei_number: str,
        start_date: str,
        weekly_hours: int
    ) -> dict:
        params = (
            student_id,
            advisor_id,
            company_id,
            status_id,
            student_course_id,
            internship_type_id,
            sei_number,
            start_date,
            weekly_hours
        )
        adapter.execute_query(INSERT_INTERNSHIP_PROCESS, params)
        return adapter.fetch_one(GET_INTERNSHIP_PROCESS_BY_STUDENT_ID_AND_START_DATE, (student_id, start_date))

    @staticmethod
    def get_process_by_id(process_id: int) -> dict:
        return adapter.fetch_one(GET_INTERNSHIP_PROCESS, (process_id,))

    @staticmethod
    def get_active_hour_goal(process_id: int) -> dict:
        return adapter.fetch_one(GET_ACTIVE_HOUR_GOAL_BY_PROCESS_ID, (process_id,))

    @classmethod
    def create_hour_goal(cls, process_id: int, target_hours: int, forecast_date: date) -> dict:
        adapter.execute_query(UPDATE_HOUR_GOAL_INACTIVE, (process_id,))
        adapter.execute_query(INSERT_HOUR_GOAL, (process_id, target_hours, forecast_date.strftime("%Y-%m-%d")))
        return cls.get_active_hour_goal(process_id)
