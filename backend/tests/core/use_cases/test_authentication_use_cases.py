from copy import copy
from unittest.mock import call, patch, MagicMock

from fastapi.responses import RedirectResponse
import pytest

from core.exceptions.authentication_exceptions import (
    UnauthorizedEmailDomainError,
    MissingEmailError,
)
from core.use_cases.authentication_use_cases import AuthenticationUseCases


@pytest.fixture
def mock_request() -> MagicMock:
    return MagicMock()

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
    ("mock_token", "expected_role"),
    [
        (
            {
                "userinfo": {"email": "user@alunos.utfpr.edu.br"},
                "access_token": "token-123",
            },
            "student",
        ),
        (
            {"userinfo": {"email": "user@utfpr.edu.br"}, "access_token": "token-123"},
            "supervisor",
        ),
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
    expected_role: str
) -> None:
    mock_authorize_access_token.return_value = mock_token
    mock_redirect_builder_get_home_url.return_value = "http://localhost:5173/home"

    await AuthenticationUseCases.auth(mock_request)

    mock_authorize_access_token.assert_awaited_once_with(mock_request)
    mock_session_set.assert_has_calls(
        [
            call(mock_request, "user", mock_token.get("userinfo")),
            call(mock_request, "access_token", mock_token.get("access_token")),
        ]
    )
    mock_redirect_builder_get_home_url.assert_called_once_with(
        mock_token.get("userinfo").get("role")
    )
    assert mock_token.get("userinfo").get("role") == expected_role

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
    "token",
    [
        {
            "userinfo": {"email": "user@alunos.utfpr.edu.br"},
            "access_token": "token-123",
        },
        {"userinfo": {"email": "user@utfpr.edu.br"}, "access_token": "token-123"},
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
    token: dict,
) -> None:
    expected_url = "http://localhost:5173/home"
    mock_authorize_access_token.return_value = token
    mock_redirect_builder_get_home_url.return_value = expected_url

    result = await AuthenticationUseCases.auth(mock_request)

    mock_session_set.assert_has_calls(
        [
            call(mock_request, "user", token.get("userinfo")),
            call(mock_request, "access_token", token.get("access_token")),
        ]
    )
    mock_redirect_builder_get_home_url.assert_called_once_with(
        token.get("userinfo").get("role")
    )
    assert isinstance(result, RedirectResponse)

@patch("core.use_cases.authentication_use_cases.SessionAdapter.pop")
def test_logout_pops_user_and_access_token(
    mock_session_pop: MagicMock,
    mock_request: object,
) -> None:
    AuthenticationUseCases.logout(mock_request)

    mock_session_pop.assert_has_calls(
        [
            call(mock_request, "user", None),
            call(mock_request, "access_token", None),
        ]
    )

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
    }
    expected_user = copy(inserted_user)
    expected_user["google_id"] = expected_user.pop("sub")

    mock_session_get.return_value = inserted_user
    result = AuthenticationUseCases.current_user(mock_request)

    mock_session_get.assert_called_once_with(mock_request, "user")
    assert result.to_dict() == expected_user
