from unittest.mock import AsyncMock, Mock, call

import pytest

from core.exceptions.authentication_exceptions import (
    UnauthorizedEmailDomainError,
    MissingEmailError,
)
from core.use_cases.authentication_use_cases import AuthenticationUseCases


@pytest.fixture
def mock_request() -> object:
    return object()


@pytest.fixture
def dependencies() -> dict:
    oauth_provider = Mock()
    oauth_provider.authorize_redirect = AsyncMock()
    oauth_provider.authorize_access_token = AsyncMock()

    session = Mock()
    redirect_builder = Mock()

    use_cases = AuthenticationUseCases(
        oauth_provider=oauth_provider,
        session=session,
        redirect_builder=redirect_builder,
    )

    return {
        "oauth_provider": oauth_provider,
        "session": session,
        "redirect_builder": redirect_builder,
        "use_cases": use_cases,
    }


@pytest.mark.asyncio
async def test_login_calls_authorize_redirect_and_returns_response(
    dependencies: dict, mock_request: object
) -> None:
    expected_response = object()
    redirect_uri = "http://testserver/auth"

    dependencies["oauth_provider"].authorize_redirect.return_value = expected_response

    result = await dependencies["use_cases"].login(mock_request, redirect_uri)

    dependencies["oauth_provider"].authorize_redirect.assert_awaited_once_with(
        mock_request, redirect_uri
    )
    assert result is expected_response


@pytest.mark.asyncio
async def test_auth_stores_user_and_access_token_and_returns_home_url(
    dependencies: dict, mock_request: object
) -> None:
    token = {
        "userinfo": {"email": "user@alunos.utfpr.edu.br"},
        "access_token": "token-123",
    }
    expected_url = "http://localhost:5173/dashboard"

    dependencies["oauth_provider"].authorize_access_token.return_value = token
    dependencies["redirect_builder"].home_url.return_value = expected_url

    result = await dependencies["use_cases"].auth(mock_request)

    dependencies["oauth_provider"].authorize_access_token.assert_awaited_once_with(
        mock_request
    )
    dependencies["session"].set.assert_has_calls(
        [
            call(mock_request, "user", token.get("userinfo")),
            call(mock_request, "access_token", token.get("access_token")),
        ]
    )
    dependencies["redirect_builder"].home_url.assert_called_once_with()
    assert result == expected_url


@pytest.mark.asyncio
async def test_auth_raises_unauthorized_email_domain_error_for_non_utfpr_email(
    dependencies: dict, mock_request: object
) -> None:
    token = {
        "userinfo": {"email": "user@gmail.com"},
        "access_token": "token-123",
    }
    dependencies["oauth_provider"].authorize_access_token.return_value = token

    with pytest.raises(UnauthorizedEmailDomainError):
        await dependencies["use_cases"].auth(mock_request)

    dependencies["session"].set.assert_not_called()
    dependencies["redirect_builder"].home_url.assert_not_called()


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
    dependencies: dict, mock_request: object, token: dict
) -> None:
    dependencies["oauth_provider"].authorize_access_token.return_value = token

    with pytest.raises(MissingEmailError):
        await dependencies["use_cases"].auth(mock_request)

    dependencies["session"].set.assert_not_called()
    dependencies["redirect_builder"].home_url.assert_not_called()


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
    dependencies: dict, mock_request: object, token: dict
) -> None:
    expected_url = "http://localhost:5173/dashboard"

    dependencies["oauth_provider"].authorize_access_token.return_value = token
    dependencies["redirect_builder"].home_url.return_value = expected_url

    result = await dependencies["use_cases"].auth(mock_request)

    dependencies["session"].set.assert_has_calls(
        [
            call(mock_request, "user", token.get("userinfo")),
            call(mock_request, "access_token", token.get("access_token")),
        ]
    )
    assert result == expected_url


def test_logout_pops_user_and_access_token(
    dependencies: dict, mock_request: object
) -> None:
    dependencies["use_cases"].logout(mock_request)

    dependencies["session"].pop.assert_has_calls(
        [
            call(mock_request, "user", None),
            call(mock_request, "access_token", None),
        ]
    )


def test_current_user_returns_session_user(
    dependencies: dict, mock_request: object
) -> None:
    expected_user = {"email": "user@example.com"}
    dependencies["session"].get.return_value = expected_user

    result = dependencies["use_cases"].current_user(mock_request)

    dependencies["session"].get.assert_called_once_with(mock_request, "user")
    assert result == expected_user
