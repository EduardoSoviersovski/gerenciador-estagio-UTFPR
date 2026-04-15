from unittest.mock import patch, MagicMock

from core.use_cases.process_use_cases import ProcessUseCases
from core.schemas.role_schemas import UserRoleId


@patch("core.use_cases.process_use_cases.ProcessTasks")
def test_create_new_process_success(mock_process_tasks):
    mock_request = MagicMock()

    mock_request.student_name = "Eduardo Silva"
    mock_request.student_email = "eduardo@alunos.utfpr.edu.br"
    mock_request.student_phone = "41999999999"
    mock_request.student_ra = "1234567"

    mock_request.advisor_name = "Adolfo Gustavo"
    mock_request.advisor_email = "adolfo@utfpr.edu.br"
    mock_request.advisor_phone = "41888888888"

    mock_request.category.value = "Não Obrigatório"
    mock_request.sei_number = "23064.000000/2026-99"
    mock_request.start_date = "2026-08-01"

    mock_process_tasks.get_or_create_user.side_effect = [
        {"id": 100},
        {"id": 200}
    ]
    mock_process_tasks.get_internship_type_id.return_value = 2

    result = ProcessUseCases.create_new_process(mock_request)

    assert result == {"message": "Internship process created successfully"}

    mock_process_tasks.get_or_create_user.assert_any_call(
        name="Eduardo Silva",
        email="eduardo@alunos.utfpr.edu.br",
        phone="41999999999",
        role_id=UserRoleId.STUDENT.value,
        google_id=None,
        ra="1234567"
    )

    mock_process_tasks.get_or_create_user.assert_any_call(
        name="Adolfo Gustavo",
        email="adolfo@utfpr.edu.br",
        phone="41888888888",
        role_id=UserRoleId.ADVISOR.value,
        ra=None,
        google_id=None
    )

    mock_process_tasks.get_internship_type_id.assert_called_once_with("Não Obrigatório")

    mock_process_tasks.create_internship_process.assert_called_once_with({
        "student_id": 100,
        "advisor_id": 200,
        "internship_type_id": 2,
        "sei_number": "23064.000000/2026-99",
        "start_date": "2026-08-01"
    })