from unittest.mock import patch
from core.ports.process_ports import ProcessPort
from core.repo.process_repo import (
    GET_USER_BY_EMAIL,
    INSERT_USER,
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
def test_insert_user(mock_adapter):
    mock_adapter.fetch_one.return_value = {"id": 2, "name": "Novo Usuário", "email": "novo@utfpr.edu.br"}

    result = ProcessPort.insert_user(
        name="Novo Usuário",
        ra="1234567",
        email="novo@utfpr.edu.br",
        phone="41999999999",
        role_id=1,
        google_id="google_123"
    )

    assert result == {"id": 2, "name": "Novo Usuário", "email": "novo@utfpr.edu.br"}

    mock_adapter.execute_query.assert_called_once_with(
        INSERT_USER,
        ("Novo Usuário", "1234567", "novo@utfpr.edu.br", "41999999999", "google_123", 1)
    )
    mock_adapter.fetch_one.assert_called_once_with(GET_USER_BY_EMAIL, ("novo@utfpr.edu.br",))

@patch("core.ports.process_ports.adapter")
def test_get_internship_id(mock_adapter):
    mock_adapter.fetch_one.return_value = {"id": 2}

    result = ProcessPort.get_internship_id("Não Obrigatório")

    assert result == {"id": 2}
    mock_adapter.fetch_one.assert_called_once_with(GET_INTERNSHIP_TYPE_ID, ("Não Obrigatório",))

@patch("core.ports.process_ports.adapter")
def test_insert_internship_process(mock_adapter):
    params = (
        10,  # student_id
        20,  # advisor_id
        1,  # company_id
        1,  # status_id
        1,  # student_course_id
        2,  # internship_type_id
        "23064.000000/2026-99",  # sei_number
        "2026-08-01",  # start_date
        30  # weekly_hours
    )

    ProcessPort.insert_internship_process(params)

    mock_adapter.execute_query.assert_called_once_with(INSERT_INTERNSHIP_PROCESS, params)
