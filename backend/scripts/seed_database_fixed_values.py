import unicodedata
from adapters.database.mysql_adapter import MySQLAdapter
from scripts.seed_database_queries import (
    INSERT_ROLE,
    INSERT_COURSE,
    INSERT_PROCESS_STATUS,
    INSERT_INTERNSHIP_TYPE,
    SET_FOREIGN_KEY_CHECKS, INSERT_DOCUMENT_TYPE,
)


def remove_accent(texto):
    return "".join(c for c in unicodedata.normalize('NFD', texto) if unicodedata.category(c) != 'Mn')


def clear_database(db: MySQLAdapter):
    print("Cleaning tables...")
    tables = [
        "audit_log", "document_message", "document", "hour_goal",
        "internship_process", "document_template", "user",
        "role", "course", "company", "process_status",
        "document_status", "internship_type", "document_type",
        "holiday", "action"
    ]

    db.execute_query(SET_FOREIGN_KEY_CHECKS, (0,))
    for table in tables:
        db.execute_query(f"DELETE FROM {table}")
        db.execute_query(f"ALTER TABLE {table} AUTO_INCREMENT = 1")
    db.execute_query(SET_FOREIGN_KEY_CHECKS, (1,))
    print("Database cleaned successfully!")


def seed_database():
    db = MySQLAdapter()

    clear_database(db)
    print("Initializing seed...")

    for role in ['STUDENT', 'ADVISOR', 'PRAE', 'ADMIN']:
        db.execute_query(INSERT_ROLE, (role,))

    for course in ['BSI', 'EC']:
        db.execute_query(INSERT_COURSE, (course,))

    for status in ['PENDING', 'ACTIVE', 'OVERDUE', 'TERMINATED', 'COMPLETED']:
        db.execute_query(INSERT_PROCESS_STATUS, (status,))

    for i_type in ['MANDATORY', 'NON_MANDATORY']:
        db.execute_query(INSERT_INTERNSHIP_TYPE, (i_type,))

    for doc_name, doc_format in [
        ('partial_report', 'jpg'),
        ('final_report', 'pdf'),
        ('internship_agreement', 'pdf')
    ]:
        db.execute_query(INSERT_DOCUMENT_TYPE, (doc_name, doc_format))

    print("Seed completed successfully!")


if __name__ == "__main__":
    seed_database()