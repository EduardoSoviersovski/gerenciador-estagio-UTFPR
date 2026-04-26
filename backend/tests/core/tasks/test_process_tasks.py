from unittest.mock import patch

from core.tasks.authentication_tasks import AuthenticationTasks
from core.tasks.process_tasks import ProcessTasks

def test_get_or_create_user_existing():
    user = AuthenticationTasks.get_or_create_user(
        name="John Doe",
        email="john@utfpr.edu.br",
        phone="41999999999",
        role_id=1
    )

    assert user == {
        "email": "john@utfpr.edu.br",
        "google_id": None,
        "id": 1,
        "name": "John Doe",
        "phone": "41999999999",
        "ra": None,
        "role": 'student'
    }

def test_get_or_create_user_new():
    user = AuthenticationTasks.get_or_create_user(
        name="Jane Doe",
        email="jane@utfpr.edu.br",
        phone="41888888888",
        role_id=2,
        ra="1234567"
    )

    assert user == {
        "email": "jane@utfpr.edu.br",
        "google_id": None,
        "id": 1,
        "name": "Jane Doe",
        "phone": "41888888888",
        "ra": "1234567",
        "role": 'advisor'
    }

@patch("core.tasks.process_tasks.ProcessPort")
def test_get_internship_type_id_found(mock_process_port):
    mock_process_port.get_internship_id.return_value = {"id": 2}

    type_id = ProcessTasks.get_internship_type_id("Obrigatório")

    assert type_id == 2
    mock_process_port.get_internship_id.assert_called_once_with("Obrigatório")

@patch("core.tasks.process_tasks.ProcessPort")
def test_get_internship_type_id_not_found(mock_process_port):
    mock_process_port.get_internship_id.return_value = None

    type_id = ProcessTasks.get_internship_type_id("Desconhecido")

    assert type_id is None
    mock_process_port.get_internship_id.assert_called_once_with("Desconhecido")
