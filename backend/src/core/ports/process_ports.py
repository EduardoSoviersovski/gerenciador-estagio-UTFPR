from adapters.database.mysql_adapter import MySQLAdapter
from core.repo.process_repo import GET_USER_BY_EMAIL, INSERT_USER, GET_INTERNSHIP_TYPE_ID, INSERT_INTERNSHIP_PROCESS

adapter = MySQLAdapter()

class ProcessPort:
    @staticmethod
    def get_user_by_email(user_email: str) -> dict:
        return adapter.fetch_one(GET_USER_BY_EMAIL, (user_email,))

    @staticmethod
    def insert_user(name: str, ra: str, email: str, phone: str, role_id: int, google_id: str | None = None) -> dict:
        adapter.execute_query(INSERT_USER, (
            name,
            ra,
            email,
            phone,
            google_id,
            role_id))
        return adapter.fetch_one(GET_USER_BY_EMAIL, (email,))

    @staticmethod
    def get_internship_id(category_name: str) -> dict:
        return adapter.fetch_one(GET_INTERNSHIP_TYPE_ID, (category_name,))

    @staticmethod
    def insert_internship_process(params: tuple) -> None:
        adapter.execute_query(INSERT_INTERNSHIP_PROCESS, params)