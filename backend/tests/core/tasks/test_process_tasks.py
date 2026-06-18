from unittest.mock import patch

from core.schemas.process_schemas import Department
from core.tasks.authentication_tasks import AuthenticationTasks
from core.tasks.process_tasks import ProcessTasks


@patch("core.tasks.authentication_tasks.AuthenticationPorts")
def test_create_or_update_user_from_process_existing(mock_auth_ports) -> None:
    existing_user = {"id": 10, "email": "professor@utfpr.edu.br", "department": None}
    updated_user = {"id": 10, "email": "professor@utfpr.edu.br", "department": "DAINF"}

    mock_auth_ports.get_user_by_email.return_value = existing_user
    mock_auth_ports.update_user.return_value = updated_user

    result = AuthenticationTasks.create_or_update_user_from_process(
        name="Professor", email="professor@utfpr.edu.br", phone="99999999", role_id=2, advisor_department="DAINF"
    )

    mock_auth_ports.create_user.assert_not_called()
    mock_auth_ports.update_user.assert_called_once_with(
        user_id=10, name="Professor", email="professor@utfpr.edu.br", phone="99999999", ra=None, department="DAINF"
    )
    assert result == updated_user


@patch("core.tasks.authentication_tasks.AuthenticationPorts")
def test_create_or_update_user_from_process_new(mock_auth_ports) -> None:
    mock_auth_ports.get_user_by_email.return_value = None
    new_user = {"id": 11, "email": "aluno_processo@alunos.utfpr.edu.br"}
    mock_auth_ports.create_user.return_value = new_user

    result = AuthenticationTasks.create_or_update_user_from_process(
        name="Aluno Processo", email="aluno_processo@alunos.utfpr.edu.br", phone="88888888", role_id=3, ra="a123"
    )

    mock_auth_ports.update_user.assert_not_called()
    mock_auth_ports.create_user.assert_called_once_with(
        name="Aluno Processo", ra="a123", email="aluno_processo@alunos.utfpr.edu.br", phone="88888888", role_id=3,
        advisor_department=None
    )
    assert result == new_user


@patch("core.tasks.process_tasks.ProcessPort")
def test_get_internship_type_id_found(mock_process_port):
    mock_process_port.get_internship_type_id.return_value = {"id": 2}

    type_id = ProcessTasks.get_internship_type_id("Obrigatório")

    assert type_id == 2
    mock_process_port.get_internship_type_id.assert_called_once_with("Obrigatório")

@patch("core.tasks.process_tasks.ProcessPort")
def test_get_internship_type_id_not_found(mock_process_port):
    mock_process_port.get_internship_type_id.return_value = None

    type_id = ProcessTasks.get_internship_type_id("Desconhecido")

    assert type_id is None
    mock_process_port.get_internship_type_id.assert_called_once_with("Desconhecido")
