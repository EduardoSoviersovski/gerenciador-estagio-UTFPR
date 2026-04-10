import pymysql
from typing import Any
from src.core.ports.database_port import DatabasePort


class MySQLAdapter(DatabasePort):
    def __init__(self, connection_url: str):
        url = connection_url.replace("mysql+pymysql://", "")
        auth, rest = url.split("@")
        user, password = auth.split(":")
        host, db = rest.split("/")

        self.config = {
            'host': host,
            'user': user,
            'password': password,
            'database': db,
            'cursorclass': pymysql.cursors.DictCursor
        }

    def get_connection(self):
        return pymysql.connect(**self.config)

    def execute_query(self, query: str, params: tuple | None = None) -> None:
        with self.get_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, params)
            conn.commit()

    def fetch_one(self, query: str, params: tuple | None = None) -> dict | None:
        with self.get_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, params)
                return cursor.fetchone()

    def fetch_list(self, query: str, params: tuple | None = None) -> list[dict]:
        with self.get_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute(query, params)
                return cursor.fetchall()
