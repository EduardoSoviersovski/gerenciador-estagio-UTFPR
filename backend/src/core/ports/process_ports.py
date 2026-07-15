import logging
from datetime import date

from pymysql import MySQLError

from adapters.database.mysql_adapter import MySQLAdapter
from core.exceptions.database_exceptions import DeleteProcessHourGoalsError, DeleteProcessError
from core.repo.authentication_ports import GET_USER_BY_EMAIL
from core.repo.process_repo import GET_INTERNSHIP_TYPE_ID, INSERT_INTERNSHIP_PROCESS, \
    GET_INTERNSHIP_PROCESS, GET_ACTIVE_HOUR_GOAL_BY_PROCESS_ID, \
    UPDATE_HOUR_GOAL_INACTIVE, INSERT_HOUR_GOAL, DELETE_INTERNSHIP_PROCESS, \
    DELETE_HOUR_GOALS_BY_PROCESS, UPDATE_INTERNSHIP_PROCESS, UPDATE_HOUR_GOAL

adapter = MySQLAdapter()
logger = logging.getLogger(__name__)

class ProcessPort:
    @staticmethod
    def get_user_by_email(user_email: str) -> dict:
        return adapter.fetch_one(GET_USER_BY_EMAIL, (user_email,))

    @staticmethod
    def get_internship_type_id(category_name: str) -> dict:
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
        weekly_hours: int,
        student_period: int
    ) -> dict | None:
        params = (
            student_id,
            advisor_id,
            company_id,
            status_id,
            student_course_id,
            internship_type_id,
            sei_number,
            start_date,
            weekly_hours,
            student_period
        )
        process_id = adapter.execute_query(INSERT_INTERNSHIP_PROCESS, params)
        return adapter.fetch_one(GET_INTERNSHIP_PROCESS, (process_id,))

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

    @staticmethod
    def update_internship_process(
        process_id: int,
        internship_type_id: int,
        sei_number: str,
        start_date: date,
        weekly_hours: int,
        advisor_id: int
    ) -> dict:
        adapter.execute_query(
            UPDATE_INTERNSHIP_PROCESS,
    (sei_number, start_date, weekly_hours, internship_type_id, advisor_id, process_id,)
        )
        return adapter.fetch_one(GET_INTERNSHIP_PROCESS, (process_id,))

    @staticmethod
    def update_hour_goal(process_id: int, target_hours: int, forecast_date: date):
        adapter.execute_query(UPDATE_HOUR_GOAL, (target_hours, forecast_date, process_id,))

    @staticmethod
    def delete_process(process_id: int) -> bool:
        try:
            adapter.execute_query(DELETE_INTERNSHIP_PROCESS, (process_id,))
            return True
        except MySQLError as e:
            logger.error(f"Error deleting process with id {process_id}: {e}")
            raise DeleteProcessError(process_id)

    @staticmethod
    def delete_hour_goals_by_process_id(process_id: int) -> bool:
        try:
            adapter.execute_query(DELETE_HOUR_GOALS_BY_PROCESS, (process_id,))
            return True
        except MySQLError as e:
            logger.error(f"Error deleting hour goals for process with id {process_id}: {e}")
            raise DeleteProcessHourGoalsError(process_id)