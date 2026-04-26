import os

import pymysql


class MySQLAdapter:
    def __init__(self):
        connection_url = os.getenv("DATABASE_URL", "mysql+pymysql://user:user_password@localhost/sisprae_db")
        url = connection_url.replace("mysql+pymysql://", "")
        auth, rest = url.split("@")
        user, password = auth.split(":")

        host_port, db = rest.split("/")

        if ":" in host_port:
            host, port = host_port.split(":")
            port = int(port)
        else:
            host = host_port
            port = 3306

        self.config = {
            'host': host,
            'port': port,
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
