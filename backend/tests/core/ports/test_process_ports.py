from unittest.mock import patch
from core.ports.process_ports import ProcessPort
from core.repo.authentication_ports import GET_USER_BY_EMAIL
from core.repo.process_repo import (
    GET_INTERNSHIP_TYPE_ID,
    INSERT_INTERNSHIP_PROCESS
)

@patch("core.ports.process_ports.adapter")
def test_get_user_by_email(mock_adapter):
    mock_adapter.fetch_one.return_value = {"id": 1, "email": "test@utfpr.edu.br"}

    result = ProcessPort.get_user_by_email("test@utfpr.edu.br")

    assert result == {"id": 1, "email": "test@utfpr.edu.br"}
    mock_adapter.fetch_one.assert_called_once_with(GET_USER_BY_EMAIL, ("test@utfpr.edu.br",))

@patch("core.ports.process_ports.adapter")
def test_get_internship_type_id(mock_adapter):
    mock_adapter.fetch_one.return_value = {"id": 2}

    result = ProcessPort.get_internship_type_id("Não Obrigatório")

    assert result == {"id": 2}
    mock_adapter.fetch_one.assert_called_once_with(GET_INTERNSHIP_TYPE_ID, ("Não Obrigatório",))

@patch("core.ports.process_ports.adapter")
def test_insert_internship_process(mock_adapter):
    ProcessPort.insert_internship_process(
        student_id = 10,
        advisor_id = 20,
        company_id = 1,
        status_id = 1,
        student_course_id = 1,
        internship_type_id = 2,
        sei_number = "23064.000000/2026-99",
        start_date = "2026-08-01",
        weekly_hours = 30
    )

    mock_adapter.execute_query.assert_called_once_with(INSERT_INTERNSHIP_PROCESS, (
        10,
        20,
        1,
        1,
        1,
        2,
        "23064.000000/2026-99",
        "2026-08-01",
        30
    ))
