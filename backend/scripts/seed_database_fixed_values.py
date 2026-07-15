import mimetypes
import os

import unicodedata
from adapters.database.mysql_adapter import MySQLAdapter
from scripts.seed_database_queries import (
    INSERT_ROLE,
    INSERT_COURSE,
    INSERT_PROCESS_STATUS,
    INSERT_INTERNSHIP_TYPE,
    SET_FOREIGN_KEY_CHECKS, INSERT_DOCUMENT_TYPE, INSERT_HOLIDAYS_2026, INSERT_DOCUMENT_STATUS,
    INSERT_DOCUMENT_TEMPLATE,
)

TEMPLATES_DIR = "documents_and_reports"

TEMPLATE_MAPPING = {
    'student_partial_report_1': {
        "category": "REPORTS",
        "templates": (
            f"{TEMPLATES_DIR}/Relatório Parcial de Estágio_Estagiário.docx",
            f"{TEMPLATES_DIR}/Relatório Parcial de Estágio_Estagiário.pdf"
        ),
        "doc_type_id": 1
    },
    'supervisor_partial_report_1': {
        "category": "REPORTS",
        "templates": (
            f"{TEMPLATES_DIR}/Relatório Parcial de Estágio_Supervisor.docx",
            f"{TEMPLATES_DIR}/Relatório Parcial de Estágio_Supervisor.pdf"
        ),
        "doc_type_id": 2
    },
    'visit_report': {
        "category": "REPORTS",
        "templates": (
            f"{TEMPLATES_DIR}/Relatório de Visita.docx",
            f"{TEMPLATES_DIR}/Relatório de Visita.pdf"
        ),
        "doc_type_id": 3
    },
    'student_partial_report_2': {
        "category": "REPORTS",
        "templates": (
            f"{TEMPLATES_DIR}/Relatório Parcial de Estágio_Estagiário.docx",
            f"{TEMPLATES_DIR}/Relatório Parcial de Estágio_Estagiário.pdf"
        ),
        "doc_type_id": 4
    },
    'supervisor_partial_report_2': {
        "category": "REPORTS",
        "templates": (
            f"{TEMPLATES_DIR}/Relatório Parcial de Estágio_Supervisor.docx",
            f"{TEMPLATES_DIR}/Relatório Parcial de Estágio_Supervisor.pdf"
        ),
        "doc_type_id": 5
    },
    'final_report': {
        "category": "REPORTS",
        "templates": [],
        "doc_type_id": 6
    },
    'others': {
        "category": "DOCUMENTS",
        "templates": [],
        "doc_type_id": 7
    },
    'internship_plan': {
        "category": "DOCUMENTS",
        "templates": (
            f"{TEMPLATES_DIR}/Plano de estágio.docx",
            f"{TEMPLATES_DIR}/Plano de estágio.pdf"
        ),
        "doc_type_id": 8
    },
    'additive_plan': {
        "category": "DOCUMENTS",
        "templates": [],
        "doc_type_id": 9
    },
    'rescision_plan': {
        "category": "DOCUMENTS",
        "templates": [],
        "doc_type_id": 10
    },
}

def remove_accent(texto):
    return "".join(c for c in unicodedata.normalize('NFD', texto) if unicodedata.category(c) != 'Mn')


def get_file_data(file_path):
    if file_path and os.path.exists(file_path):
        with open(file_path, 'rb') as f:
            content = f.read()
        name = os.path.basename(file_path)
        size = len(content)
        mime_type, _ = mimetypes.guess_type(file_path)
        if not mime_type:
            mime_type = 'application/octet-stream'
        return content, name, size, mime_type

    return b"", "pendente.docx", 0, "application/None"


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

    for role in ['STUDENT', 'ADVISOR', 'ADMIN']:
        db.execute_query(INSERT_ROLE, (role,))

    for course in ['BSI', 'EC']:
        db.execute_query(INSERT_COURSE, (course,))

    for status in ['PENDING', 'ACTIVE', 'OVERDUE', 'TERMINATED', 'COMPLETED']:
        db.execute_query(INSERT_PROCESS_STATUS, (status,))

    for i_type in ['MANDATORY', 'NON_MANDATORY']:
        db.execute_query(INSERT_INTERNSHIP_TYPE, (i_type,))

    for doc_status in ["PENDING", "REQUEST_CHANGES", "APPROVED", "REJECTED"]:
        db.execute_query(INSERT_DOCUMENT_STATUS, (doc_status,))

    doc_types = [
        ('student_partial_report_1', 'pdf'),
        ('supervisor_partial_report_1', 'pdf'),
        ('visit_report', 'pdf'),
        ('student_partial_report_2', 'pdf'),
        ('supervisor_partial_report_2', 'pdf'),
        ('final_report', 'pdf'),
        ('others', 'pdf'),
        ('internship_plan', 'pdf'),
        ('additive_plan', 'pdf'),
        ('rescision_plan', 'pdf'),
    ]

    print("Seeding document types...")
    for doc_name, doc_format in doc_types:
        db.execute_query(INSERT_DOCUMENT_TYPE, (doc_name, doc_format))

    print("Seeding document templates...")
    for doc_name, config in TEMPLATE_MAPPING.items():
        category = config["category"]
        doc_type_id = config["doc_type_id"]
        for file_path in config["templates"]:
            content, name, size, mime_type = get_file_data(file_path)

            db.execute_query(
                INSERT_DOCUMENT_TEMPLATE,
                (doc_type_id, content, name, size, mime_type, category)
            )

    db.execute_query(INSERT_HOLIDAYS_2026)

    print("Seed completed successfully!")


if __name__ == "__main__":
    seed_database()