from unittest.mock import patch
from core.tasks.process_tasks import ProcessTasks


@patch("core.tasks.process_tasks.ProcessPort")
def test_get_or_create_user_existing(mock_process_port):
    mock_existing_user = {'id': 10, 'name': 'John Doe', 'email': 'john@utfpr.edu.br'}
    mock_process_port.get_user_by_email.return_value = mock_existing_user

    user = ProcessTasks.get_or_create_user(
        name="John Doe",
        email="john@utfpr.edu.br",
        phone="41999999999",
        role_id=1
    )

    assert user == mock_existing_user
    mock_process_port.get_user_by_email.assert_called_once_with("john@utfpr.edu.br")
    mock_process_port.insert_user.assert_not_called()

@patch("core.tasks.process_tasks.ProcessPort")
def test_get_or_create_user_new(mock_process_port):
    mock_process_port.get_user_by_email.return_value = None
    mock_new_user = {'id': 15, 'name': 'Jane Doe', 'email': 'jane@utfpr.edu.br'}
    mock_process_port.insert_user.return_value = mock_new_user

    user = ProcessTasks.get_or_create_user(
        name="Jane Doe",
        email="jane@utfpr.edu.br",
        phone="41888888888",
        role_id=2,
        ra="1234567"
    )

    assert user == mock_new_user
    mock_process_port.get_user_by_email.assert_called_once_with("jane@utfpr.edu.br")
    mock_process_port.insert_user.assert_called_once_with(
        "Jane Doe", "1234567", "jane@utfpr.edu.br", "41888888888", 2, None
    )

@patch("core.tasks.process_tasks.ProcessPort")
def test_get_internship_type_id_found(mock_process_port):
    mock_process_port.get_internship_id.return_value = {'id': 2}

    type_id = ProcessTasks.get_internship_type_id("Obrigatório")

    assert type_id == 2
    mock_process_port.get_internship_id.assert_called_once_with("Obrigatório")

@patch("core.tasks.process_tasks.ProcessPort")
def test_get_internship_type_id_not_found(mock_process_port):
    mock_process_port.get_internship_id.return_value = None

    type_id = ProcessTasks.get_internship_type_id("Desconhecido")

    assert type_id is None
    mock_process_port.get_internship_id.assert_called_once_with("Desconhecido")

@patch("core.tasks.process_tasks.ProcessPort")
def test_create_internship_process(mock_process_port):
    mock_process_port.insert_internship_process.return_value = {"id": 1}
    process_data = {
        "student_id": 10,
        "advisor_id": 20,
        "internship_type_id": 2,
        "sei_number": "23064.123456/2026-00",
        "start_date": "2026-05-01"
    }

    result = ProcessTasks.create_internship_process(process_data)

    assert result == {"id": 1}
    mock_process_port.insert_internship_process.assert_called_once()

    called_args, _ = mock_process_port.insert_internship_process.call_args
    params = called_args[0]

    assert params[0] == 10  # student_id
    assert params[1] == 20  # advisor_id
    assert params[2] == 1  # company_id provisório
    assert params[3] == 1  # status_id provisório
    assert params[4] == 1  # student_course_id provisório
    assert params[5] == 2  # internship_type_id
    assert params[6] == "23064.123456/2026-00"  # sei_number
    assert params[7] == "2026-05-01"  # start_date
    assert params[8] == 30  # weekly_hours provisório