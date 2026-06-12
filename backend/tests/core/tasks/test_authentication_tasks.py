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
def test_get_or_create_user_from_auth_existing_user(mock_auth_ports) -> None:
    existing_user = {"id": 1, "email": "test@utfpr.edu.br", "google_id": None}
    updated_user = {"id": 1, "email": "test@utfpr.edu.br", "google_id": "12345"}

    mock_auth_ports.get_user_by_email.return_value = existing_user
    mock_auth_ports.update_user_google_id.return_value = updated_user

    result = AuthenticationTasks.get_or_create_user_from_auth(
        name="Test", email="test@utfpr.edu.br", role_id=1, google_id="12345"
    )

    mock_auth_ports.create_user.assert_not_called()
    mock_auth_ports.update_user_google_id.assert_called_once_with(1, "12345")
    assert result == updated_user


@patch("core.tasks.authentication_tasks.AuthenticationPorts")
def test_get_or_create_user_from_auth_new_user(mock_auth_ports) -> None:
    mock_auth_ports.get_user_by_email.return_value = None
    new_user = {"id": 2, "email": "new@alunos.utfpr.edu.br"}
    mock_auth_ports.create_user.return_value = new_user

    result = AuthenticationTasks.get_or_create_user_from_auth(
        name="New Student", email="new@alunos.utfpr.edu.br", role_id=3, google_id="6789"
    )

    mock_auth_ports.create_user.assert_called_once_with(
        name="New Student", ra=None, email="new@alunos.utfpr.edu.br", phone=None, role_id=3, google_id="6789"
    )
    assert result == new_user
