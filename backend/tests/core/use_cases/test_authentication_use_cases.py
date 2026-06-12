from copy import copy
from unittest.mock import call, patch, MagicMock

from fastapi.responses import RedirectResponse
import pytest

from core.exceptions.authentication_exceptions import (
    UnauthorizedEmailDomainError,
    MissingEmailError,
)
from core.ports.authentication_ports import AuthenticationPorts
from core.schemas.role_schemas import UserRoleId
from core.tasks.authentication_tasks import AuthenticationTasks
from core.use_cases.authentication_use_cases import AuthenticationUseCases


@pytest.fixture
def mock_request() -> MagicMock:
    return MagicMock()

MOCK_STUDENT_TOKEN_AND_EXPECTED = (
    {
        "userinfo": {
            "email": "user@alunos.utfpr.edu.br",
            "name": "Student User",
            "phone": "1234567890",
            "ra": "123456",
            "sub": "google-123",
        },
        "access_token": "token-123",
    },
    {
        "id": 1,
        "name": "Student User",
        "ra": "123456",
        "email": "user@alunos.utfpr.edu.br",
        "phone": "1234567890",
        "google_id": "google-123",
        "role": "student",
        "department": None
    }
)
MOCK_ADVISOR_TOKEN_AND_EXPECTED = (
    {
        "userinfo": {
            "email": "user@utfpr.edu.br",
            "name": "Advisor User",
            "phone": "0987654321",
            "sub": "google-456",
        },
        "access_token": "token-123"
    },
    {
        "id": 1,
        "name": "Advisor User",
        "ra": None,
        "email": "user@utfpr.edu.br",
        "phone": "0987654321",
        "google_id": "google-456",
        "role": "advisor",
        "department": None
    }
)


@patch("core.use_cases.authentication_use_cases.AuthlibOAuthAdapter.authorize_redirect")
@pytest.mark.asyncio
async def test_login_calls_authorize_redirect_and_returns_response(mock_authorize_redirect: MagicMock, mock_request: MagicMock) -> None:
    expected_response = object()
    redirect_uri = "http://testserver/auth"
    mock_authorize_redirect.return_value = expected_response

    result = await AuthenticationUseCases.login(mock_request, redirect_uri)

    assert result is expected_response


@patch("core.use_cases.authentication_use_cases.RedirectAdapter.get_home_url")
@patch("core.use_cases.authentication_use_cases.SessionAdapter.set")
@patch("core.use_cases.authentication_use_cases.AuthlibOAuthAdapter.authorize_access_token")
@pytest.mark.asyncio
@pytest.mark.parametrize(
    ("mock_token", "expected"),
    [
        MOCK_STUDENT_TOKEN_AND_EXPECTED,
        MOCK_ADVISOR_TOKEN_AND_EXPECTED,
    ],
    ids=[
        "students-email-domain",
        "utfpr-email-domain",
    ],
)
async def test_auth_stores_user_and_access_token_and_returns_home_url(
    mock_authorize_access_token: MagicMock,
    mock_session_set: MagicMock,
    mock_redirect_builder_get_home_url: MagicMock,
    mock_request: object,
    mock_token: dict,
    expected: dict
) -> None:
    mock_authorize_access_token.return_value = mock_token
    mock_redirect_builder_get_home_url.return_value = "http://localhost:5173/home"

    await AuthenticationUseCases.auth(mock_request)

    mock_authorize_access_token.assert_awaited_once_with(mock_request)
    mock_session_set.assert_has_calls(
        [
            call(mock_request, "user", expected),
            call(mock_request, "access_token", mock_token.get("access_token")),
        ]
    )
    mock_redirect_builder_get_home_url.assert_called_once_with(
        mock_token.get("userinfo").get("role")
    )
    assert mock_token.get("userinfo").get("role") == expected.get("role")


@patch("core.use_cases.authentication_use_cases.RedirectAdapter.get_home_url")
@patch("core.use_cases.authentication_use_cases.SessionAdapter.set")
@patch("core.use_cases.authentication_use_cases.AuthlibOAuthAdapter.authorize_access_token")
@pytest.mark.asyncio
async def test_auth_raises_unauthorized_email_domain_error_for_non_utfpr_email(
    mock_authorize_access_token: MagicMock,
    mock_session_set: MagicMock,
    mock_redirect_builder_get_home_url: MagicMock,
    mock_request: object,
) -> None:
    token = {
        "userinfo": {"email": "user@gmail.com"},
        "access_token": "token-123",
    }
    mock_authorize_access_token.return_value = token
    with pytest.raises(UnauthorizedEmailDomainError):
        await AuthenticationUseCases.auth(mock_request)

    mock_session_set.assert_not_called()
    mock_redirect_builder_get_home_url.assert_not_called()


@patch("core.use_cases.authentication_use_cases.RedirectAdapter.get_home_url")
@patch("core.use_cases.authentication_use_cases.SessionAdapter.set")
@patch("core.use_cases.authentication_use_cases.AuthlibOAuthAdapter.authorize_access_token")
@pytest.mark.asyncio
@pytest.mark.parametrize(
    "token",
    [
        {},
        {"userinfo": {}, "access_token": "token-123"},
        {"userinfo": {"email": None}, "access_token": "token-123"},
    ],
    ids=[
        "missing-token-fields",
        "missing-email-key",
        "email-is-none",
    ],
)
async def test_auth_raises_missing_email_error_for_invalid_email_payloads(
    mock_authorize_access_token: MagicMock,
    mock_session_set: MagicMock,
    mock_redirect_builder_get_home_url: MagicMock,
    mock_request: object,
    token: dict,
) -> None:
    mock_authorize_access_token.return_value = token
    with pytest.raises(MissingEmailError):
        await AuthenticationUseCases.auth(mock_request)

        mock_session_set.assert_not_called()
        mock_redirect_builder_get_home_url.assert_not_called()

@patch("core.use_cases.authentication_use_cases.RedirectAdapter.get_home_url")
@patch("core.use_cases.authentication_use_cases.SessionAdapter.set")
@patch("core.use_cases.authentication_use_cases.AuthlibOAuthAdapter.authorize_access_token")
@pytest.mark.asyncio
@pytest.mark.parametrize(
    ("mock_token", "expected"),
    [
        MOCK_STUDENT_TOKEN_AND_EXPECTED,
        MOCK_ADVISOR_TOKEN_AND_EXPECTED,
    ],
    ids=[
        "utfpr-students-domain",
        "utfpr-domain",
    ],
)
async def test_auth_accepts_utfpr_domain_and_subdomain_variants(
    mock_authorize_access_token: MagicMock,
    mock_session_set: MagicMock,
    mock_redirect_builder_get_home_url: MagicMock,
    mock_request: object,
    mock_token: dict,
    expected: dict
) -> None:
    expected_url = "http://localhost:5173/home"
    mock_authorize_access_token.return_value = mock_token
    mock_redirect_builder_get_home_url.return_value = expected_url

    result = await AuthenticationUseCases.auth(mock_request)

    mock_session_set.assert_has_calls(
        [
            call(mock_request, "user", expected),
            call(mock_request, "access_token", mock_token.get("access_token")),
        ]
    )
    mock_redirect_builder_get_home_url.assert_called_once_with(
        mock_token.get("userinfo").get("role")
    )
    assert isinstance(result, RedirectResponse)

@patch("core.use_cases.authentication_use_cases.SessionAdapter.clear")
def test_logout_pops_user_and_access_token(
    mock_session_clear: MagicMock,
    mock_request: object,
) -> None:
    AuthenticationUseCases.logout(mock_request)

    mock_session_clear.assert_called_once()

@patch("core.use_cases.authentication_use_cases.SessionAdapter.get")
def test_current_user_returns_session_user(
    mock_session_get: MagicMock,
    mock_request: object,
) -> None:
    inserted_user = {
        "email": "user@example.com",
        "name": "User Example",
        "role": "student",
        "sub": "google-123",
        'id': None,
        'ra': None
    }
    expected_user = copy(inserted_user)
    expected_user["google_id"] = expected_user.pop("sub")

    mock_session_get.return_value = inserted_user
    result = AuthenticationUseCases.current_user(mock_request)

    mock_session_get.assert_called_once_with(mock_request, "user")
    assert result.to_dict() == expected_user

@patch("core.use_cases.authentication_use_cases.RedirectAdapter.get_home_url")
@patch("core.use_cases.authentication_use_cases.SessionAdapter.set")
@patch("core.use_cases.authentication_use_cases.AuthlibOAuthAdapter.authorize_access_token")
@pytest.mark.asyncio
async def test_auth_updates_google_id_when_user_was_created_by_process(
    mock_authorize_access_token: MagicMock,
    mock_session_set: MagicMock,
    mock_redirect_builder_get_home_url: MagicMock,
    mock_request: object,
) -> None:
    AuthenticationTasks.create_or_update_user_from_process(
        name="Aluno Processo",
        email="aluno_processo@alunos.utfpr.edu.br",
        phone="4199999999",
        role_id=UserRoleId.STUDENT.value,
        ra="a1234567"
    )

    db_user_before = AuthenticationPorts.get_user_by_email("aluno_processo@alunos.utfpr.edu.br")
    assert db_user_before["google_id"] is None
    assert db_user_before["ra"] == "a1234567"

    mock_authorize_access_token.return_value = {
        "userinfo": {
            "email": "aluno_processo@alunos.utfpr.edu.br",
            "name": "Aluno Processo",
            "sub": "google-oauth-12345",
        },
        "access_token": "token-123"
    }
    mock_redirect_builder_get_home_url.return_value = "http://localhost/home"

    await AuthenticationUseCases.auth(mock_request)

    db_user_after = AuthenticationPorts.get_user_by_email("aluno_processo@alunos.utfpr.edu.br")
    _assert_user_info(db_user_after)

    session_user = mock_session_set.call_args_list[0][0][2]
    _assert_user_info(session_user)


@patch("core.use_cases.authentication_use_cases.RedirectAdapter.get_home_url")
@patch("core.use_cases.authentication_use_cases.SessionAdapter.set")
@patch("core.use_cases.authentication_use_cases.AuthlibOAuthAdapter.authorize_access_token")
@pytest.mark.asyncio
async def test_auth_creates_new_user_without_process(
        mock_authorize_access_token: MagicMock,
        mock_session_set: MagicMock,
        mock_redirect_builder_get_home_url: MagicMock,
        mock_request: object,
) -> None:
    mock_authorize_access_token.return_value = {
        "userinfo": {
            "email": "aluno_curioso@alunos.utfpr.edu.br",
            "name": "Aluno Curioso",
            "sub": "google-oauth-999",
        },
        "access_token": "token-999"
    }
    mock_redirect_builder_get_home_url.return_value = "http://localhost/home"

    await AuthenticationUseCases.auth(mock_request)

    db_user = AuthenticationPorts.get_user_by_email("aluno_curioso@alunos.utfpr.edu.br")

    assert db_user is not None
    assert db_user["name"] == "Aluno Curioso"
    assert db_user["google_id"] == "google-oauth-999"
    assert db_user["role"] == "student"
    assert db_user["ra"] is None
    assert db_user["department"] is None

    session_user = mock_session_set.call_args_list[0][0][2]
    assert session_user["email"] == "aluno_curioso@alunos.utfpr.edu.br"


def _assert_user_info(user_info: dict) -> None:
    assert user_info["google_id"] == "google-oauth-12345"
    assert user_info["ra"] == "a1234567"
    assert user_info["name"] == "Aluno Processo"
    assert user_info["email"] == "aluno_processo@alunos.utfpr.edu.br"
    assert user_info["phone"] == "4199999999"
    assert user_info["department"] is None
    assert user_info["role"] == "student"
