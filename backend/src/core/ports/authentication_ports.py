from adapters.database.mysql_adapter import MySQLAdapter
from core.repo.authentication_ports import GET_USER_BY_EMAIL, INSERT_USER, UPDATE_USER_GOOGLE_ID, GET_USER_BY_GOOGLE_ID

adapter = MySQLAdapter()

class AuthenticationPorts:
    @staticmethod
    def get_user_by_email(user_email: str) -> dict:
        return adapter.fetch_one(GET_USER_BY_EMAIL, (user_email,))

    @classmethod
    def update_user_google_id(cls, user_id: str, google_id: str) -> dict:
        adapter.execute_query(UPDATE_USER_GOOGLE_ID, (
            google_id,
            user_id)
        )
        return adapter.fetch_one(GET_USER_BY_GOOGLE_ID, (google_id,))

    @staticmethod
    def create_user(name: str, ra: str, email: str, phone: str, role_id: int, google_id: str | None = None) -> dict:
        adapter.execute_query(INSERT_USER, (
            name,
            ra,
            email,
            phone,
            google_id,
            role_id)
        )
        return adapter.fetch_one(GET_USER_BY_EMAIL, (email,))
