import pytest
from adapters.database.mysql_adapter import MySQLAdapter
import pytest
import datetime
from unittest.mock import MagicMock
from core.schemas.process_schemas import Department


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

@pytest.fixture
def create_mock_process_request():
    def _create(student_ra="1234567", sei_number="1234.5678/2026-90"):
        mock_request = MagicMock()
        mock_request.student_name = "Eduardo Silva"
        mock_request.student_email = "eduardo@alunos.utfpr.edu.br"
        mock_request.student_phone = "41999999999"
        mock_request.student_ra = student_ra
        mock_request.student_course = "BSI"
        mock_request.student_period = 5

        mock_request.advisor_name = "Adolfo Gustavo"
        mock_request.advisor_email = "adolfo@utfpr.edu.br"
        mock_request.advisor_phone = "41888888888"
        mock_request.advisor_department = Department.DAINF
        mock_request.internship_type.value = "NON_MANDATORY"
        mock_request.sei_number = sei_number
        mock_request.start_date = datetime.date(2026, 8, 1)

        mock_request.company_name = "Tech Solutions Ltda"
        mock_request.company_cnpj = "12.345.678/0001-91"
        mock_request.supervisor_name = "Maria Oliveira"
        mock_request.supervisor_email = "maria@email.com"
        mock_request.supervisor_cpf = "123.456.789-01"
        mock_request.weekly_hours = 30
        mock_request.target_hours = 400
        return mock_request
    
    return _create
