import datetime
from unittest.mock import MagicMock

from core.use_cases.process_use_cases import ProcessUseCases


def test_create_new_process_success():
    mock_request = MagicMock()

    mock_request.student_name = "Eduardo Silva"
    mock_request.student_email = "eduardo@alunos.utfpr.edu.br"
    mock_request.student_phone = "41999999999"
    mock_request.student_ra = "1234567"

    mock_request.advisor_name = "Adolfo Gustavo"
    mock_request.advisor_email = "adolfo@utfpr.edu.br"
    mock_request.advisor_phone = "41888888888"

    mock_request.category.value = "NON_MANDATORY"
    mock_request.sei_number = "1234.5678/2026-90"
    mock_request.start_date = "2026-08-01"

    mock_request.company_name = "Tech Solutions Ltda"
    mock_request.company_cnpj = "12.345.678/0001-90"
    mock_request.supervisor_name = "Maria Oliveira"
    mock_request.supervisor_email = "maria@email.com"
    mock_request.supervisor_cpf = "123.456.789-00"

    result = ProcessUseCases.create_new_process(mock_request)

    assert result == {
        "advisor_id": 2,
        "company_id": 1,
        "internship_type_id": 2,
        "sei_number": mock_request.sei_number,
        "start_date": datetime.date(2026, 8, 1),
        "status_id": 1,
        "student_course_id": 1,
        "student_id": 1,
        "weekly_hours": 30
    }
