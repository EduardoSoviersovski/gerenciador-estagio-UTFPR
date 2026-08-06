import logging
from datetime import date

from pymysql import MySQLError

from adapters.database.mysql_adapter import MySQLAdapter
from core.exceptions.database_exceptions import DeleteProcessHourGoalsError, DeleteProcessError
from core.repo.authentication_ports import GET_USER_BY_EMAIL
from core.repo.process_repo import GET_INTERNSHIP_TYPE_ID, GET_PROCESS_STATUS_ID, INSERT_INTERNSHIP_PROCESS, \
    GET_INTERNSHIP_PROCESS, GET_ACTIVE_HOUR_GOAL_BY_PROCESS_ID, \
    UPDATE_HOUR_GOAL_INACTIVE, INSERT_HOUR_GOAL, DELETE_INTERNSHIP_PROCESS, \
    DELETE_HOUR_GOALS_BY_PROCESS, UPDATE_INTERNSHIP_PROCESS, UPDATE_HOUR_GOAL, \
    GET_PREVIOUS_HOUR_GOAL_BY_PROCESS_ID, UPDATE_HOUR_GOAL_ACTIVE_BY_ID

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
    def get_process_status_id(status_name: str) -> dict:
        return adapter.fetch_one(GET_PROCESS_STATUS_ID, (status_name,))

    @staticmethod
    def insert_internship_process(
        student_id: int,
        advisor_id: int,
        company_id: int,
        status_id: int,
        internship_type_id: int,
        sei_number: str,
        start_date: str,
    ) -> dict | None:
        params = (
            student_id,
            advisor_id,
            company_id,
            status_id,
            internship_type_id,
            sei_number,
            start_date,
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
    def create_hour_goal(
        cls,
        process_id: int,
        target_hours: int,
        weekly_hours: int,
        forecast_date: date,
        source_document_id: int | None = None,
    ) -> dict:
        adapter.execute_query(UPDATE_HOUR_GOAL_INACTIVE, (process_id,))
        adapter.execute_query(
            INSERT_HOUR_GOAL,
            (process_id, target_hours, weekly_hours, forecast_date.strftime("%Y-%m-%d"), source_document_id),
        )
        return cls.get_active_hour_goal(process_id)

    @staticmethod
    def get_previous_hour_goal(process_id: int, current_hour_goal_id: int) -> dict | None:
        return adapter.fetch_one(GET_PREVIOUS_HOUR_GOAL_BY_PROCESS_ID, (process_id, current_hour_goal_id))

    @staticmethod
    def set_hour_goal_active(hour_goal_id: int, is_active: bool) -> int:
        return adapter.execute_query(UPDATE_HOUR_GOAL_ACTIVE_BY_ID, (1 if is_active else 0, hour_goal_id))

    @staticmethod
    def update_internship_process(
        process_id: int,
        internship_type_id: int,
        sei_number: str,
        start_date: date,
        advisor_id: int,
        student_id: int,
        status_id: int 
    ) -> dict:
        adapter.execute_query(
            UPDATE_INTERNSHIP_PROCESS,
            (sei_number, start_date, internship_type_id, advisor_id, student_id, status_id, process_id,)
        )
        return adapter.fetch_one(GET_INTERNSHIP_PROCESS, (process_id,))

    @staticmethod
    def update_hour_goal(process_id: int, target_hours: int, weekly_hours: int, forecast_date: date):
        adapter.execute_query(UPDATE_HOUR_GOAL, (target_hours, weekly_hours, forecast_date, process_id,))

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