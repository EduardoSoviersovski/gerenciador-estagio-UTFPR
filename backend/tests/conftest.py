import pytest
from adapters.database.mysql_adapter import MySQLAdapter


@pytest.fixture(autouse=True)
def clear_database():
    _truncate_tables()

    yield

def _truncate_tables():
    db = MySQLAdapter()

    tables_to_clear = [
        "audit_log",
        "document_message",
        "document",
        "hour_goal",
        "internship_process",
        "user",
        "company"
    ]

    with db.get_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute("SET FOREIGN_KEY_CHECKS = 0;")

            for table in tables_to_clear:
                cursor.execute(f"TRUNCATE TABLE {table};")

            cursor.execute("SET FOREIGN_KEY_CHECKS = 1;")

        conn.commit()
