import pytest
from unittest.mock import patch

from core.exceptions.authentication_exceptions import (
    UnauthorizedEmailDomainError,
    MissingEmailError,
)
from core.schemas.email_schemas import AllowedEmailDomain
from core.schemas.role_schemas import UserRole
from core.tasks.authentication_tasks import AuthenticationTasks


@pytest.mark.parametrize(
    "valid_domain",
    [
        AllowedEmailDomain.UTFPR.value,
        AllowedEmailDomain.UTFPR_STUDENTS.value,
    ],
    ids=[
        "verify-email-domain-valid-utfpr",
        "verify-email-domain-valid-utfpr-students",
    ],
)
def test_verify_email_domain_success(valid_domain: str) -> None:
    valid_email = f"user@{valid_domain}"
    user_info = {"email": valid_email}

    try:
        AuthenticationTasks.verify_email_domain(user_info)
    except Exception as e:
        pytest.fail(f"verify_email_domain levantou uma exceção inesperada: {e}")


@pytest.mark.parametrize(
    "invalid_domain",
    ["gmail.com", "yahoo.com.br", "hotmail.com", None, [AllowedEmailDomain.UTFPR.value]],
    ids=["gmail", "yahoo", "hotmail", "none", "list-with-utfpr-domain"],
)
def test_verify_email_domain_fail_raise(invalid_domain: str) -> None:
    invalid_email = f"user@{invalid_domain}"
    user_info = {"email": invalid_email}

    with pytest.raises(UnauthorizedEmailDomainError):
        AuthenticationTasks.verify_email_domain(user_info)


@pytest.mark.parametrize(
    "email, expected_role",
    [
        ("fernandaneto@alunos.utfpr.edu.br", UserRole.ADMIN.value),
        ("gabrielgodinho@alunos.utfpr.edu.br", UserRole.ADVISOR.value),
        ("aluno_qualquer@alunos.utfpr.edu.br", UserRole.STUDENT.value),
        ("professor@utfpr.edu.br", UserRole.ADVISOR.value),
    ],
    ids=[
        "known-admin",
        "known-advisor",
        "dynamic-student",
        "dynamic-advisor",
    ],
)
def test_set_user_role(email: str, expected_role: int) -> None:
    user_info = {"email": email}
    AuthenticationTasks.set_user_role(user_info)

    assert user_info["role"] == expected_role


@patch("core.tasks.authentication_tasks.AuthenticationPorts")
def test_create_or_update_user_new_user(mock_ports) -> None:
    mock_ports.get_user_by_email.return_value = None
    mock_ports.create_user.return_value = {"id": 1, "name": "Pedro Novo"}

    result = AuthenticationTasks.create_or_update_user_from_process(
        name="Pedro Novo", email="pedro@alunos.utfpr.edu.br",
        phone="4199999999", role_id=1, ra="1561464"
    )

    mock_ports.create_user.assert_called_once_with(
        name="Pedro Novo", email="pedro@alunos.utfpr.edu.br",
        phone="4199999999", role_id=1, ra="1561464", advisor_department=None
    )
    assert result["id"] == 1


@patch("core.tasks.authentication_tasks.AuthenticationPorts")
def test_create_or_update_user_manual_user(mock_ports) -> None:
    existing_user = {
        "id": 2,
        "name": "Nome Antigo",
        "email": "antigo@alunos.utfpr.edu.br",
        "google_id": None
    }
    mock_ports.get_user_by_email.return_value = existing_user

    AuthenticationTasks.create_or_update_user_from_process(
        name="Nome Corrigido", email="corrigido@alunos.utfpr.edu.br",
        phone="4188888888", role_id=1, ra="1234567", advisor_department="DAINF"
    )

    mock_ports.update_user.assert_called_once_with(
        user_id=2, name="Nome Corrigido", email="corrigido@alunos.utfpr.edu.br",
        phone="4188888888", ra="1234567", department="DAINF"
    )


@patch("core.tasks.authentication_tasks.AuthenticationPorts")
def test_create_or_update_user_golden_rule(mock_ports) -> None:
    existing_user = {
        "id": 3,
        "name": "Eduardo Soviersovski",
        "email": "edusov@alunos.utfpr.edu.br",
        "google_id": "google-oauth-12345",
        "phone": "0000"
    }
    mock_ports.get_user_by_email.return_value = existing_user

    AuthenticationTasks.create_or_update_user_from_process(
        name="Eduardo S.", email="email.errado@alunos.utfpr.edu.br",
        phone="41911112222", role_id=1, ra="2135949"
    )

    mock_ports.update_user.assert_called_once_with(
        user_id=3,
        name="Eduardo Soviersovski",
        email="edusov@alunos.utfpr.edu.br",
        phone="41911112222",
        ra="2135949",
        department=None
    )


@patch("core.tasks.authentication_tasks.AuthenticationPorts")
def test_login_match_manual_user(mock_ports) -> None:
    existing_user = {
        "id": 4,
        "name": "Pedro (Criado Pelo PRAE)",
        "email": "pedper@alunos.utfpr.edu.br",
        "google_id": None,
        "ra": "1561464",
        "phone": "4199998888"
    }
    mock_ports.get_user_by_email.return_value = existing_user
    mock_ports.update_user_google_id.return_value = {**existing_user, "google_id": "new-id"}

    AuthenticationTasks.get_or_create_user_from_auth(
        name="Pedro A. T. Pereira", email="pedper@alunos.utfpr.edu.br",
        role_id=1, google_id="new-id"
    )

    mock_ports.update_user_google_id.assert_called_once_with(4, "new-id")
    mock_ports.update_user.assert_called_once_with(
        user_id=4,
        name="Pedro A. T. Pereira", # Fonte da verdade!
        email="pedper@alunos.utfpr.edu.br",
        phone="4199998888", ra="1561464", department=None
    )


@patch("core.tasks.authentication_tasks.AuthenticationPorts")
def test_login_absolute_first_login(mock_ports) -> None:
    mock_ports.get_user_by_email.return_value = None
    new_user = {"id": 5, "email": "new@alunos.utfpr.edu.br", "google_id": "6789"}
    mock_ports.create_user.return_value = new_user

    result = AuthenticationTasks.get_or_create_user_from_auth(
        name="New Student", email="new@alunos.utfpr.edu.br", role_id=3, google_id="6789"
    )

    mock_ports.create_user.assert_called_once_with(
        name="New Student", ra=None, email="new@alunos.utfpr.edu.br", phone=None, role_id=3, google_id="6789"
    )
    assert result == new_user
