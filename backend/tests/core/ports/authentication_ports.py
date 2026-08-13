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
        "email": "novo@utfpr.edu.br",
        "google_id": "google_123",
        "id": 1,
        "name": "Novo Usuário",
        "ra": "1234567",
        "role_id": 1
    }
