from core.ports.authentication_ports import AuthenticationPorts


def test_create_user():
    result = AuthenticationPorts.create_user(
        name="Novo Usuário",
        ra="1234567",
        email="novo@utfpr.edu.br",
        role_id=1,
        google_id="google_123"
    )

    assert result == {
        "id": 1,
        "name": "Novo Usuário",
        "ra": "1234567",
        "email": "novo@utfpr.edu.br",
        "google_id": "google_123",
        "role": "student",
        "department": None,
        "student_period": None,
        "student_course_id": None,
        "student_course": None,
    }
