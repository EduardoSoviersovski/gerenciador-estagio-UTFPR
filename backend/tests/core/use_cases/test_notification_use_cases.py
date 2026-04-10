import httpx
import pytest
from unittest.mock import AsyncMock, MagicMock

from adapters.driven.email.smtp_email_adapter import SmtpEmailAdapter
from core.dependencies import get_notification_use_cases
from core.use_cases.notification_use_cases import NotificationUseCases


MAILCATCHER_API = "http://localhost:1080/messages"

pytestmark = pytest.mark.asyncio

@pytest.fixture(autouse=True)
async def clear_mailcatcher():
    try:
        async with httpx.AsyncClient() as client:
            await client.delete("http://localhost:1080/messages")
    except Exception:
        pass

@pytest.mark.asyncio
async def test_send_welcome_notification_invalid_email_raises_error():
    mock_email_port = MagicMock()

    use_case = NotificationUseCases(email_port=mock_email_port)

    with pytest.raises(ValueError, match="Invalid email address"):
        await use_case.send_welcome_notification("bad-email", "John")

    mock_email_port.send_html_email.assert_not_called()


@pytest.mark.asyncio
async def test_send_welcome_notification_port_failure_returns_false():
    mock_email_port = MagicMock()
    mock_email_port.send_html_email = AsyncMock(return_value=False)

    use_case = NotificationUseCases(email_port=mock_email_port)

    result = await use_case.send_welcome_notification("test@test.com", "John")

    assert result is False

@pytest.mark.asyncio
async def test_send_welcome_email_integration_with_mailcatcher():
    use_case = get_notification_use_cases()

    test_email = "tester@example.com"
    test_name = "Integration Tester"

    success = await use_case.send_welcome_notification(
        email=test_email,
        name=test_name
    )
    assert success is True

    async with httpx.AsyncClient() as client:
        response = await client.get(MAILCATCHER_API)
        messages = response.json()

        assert len(messages) > 0
        last_message = messages[0]

        assert last_message["recipients"] == [f"<{test_email}>"]
        assert last_message["subject"] == "Welcome to our App!"

        msg_id = last_message["id"]
        body_response = await client.get(f"{MAILCATCHER_API}/{msg_id}.html")
        assert f"Hello, {test_name}!" in body_response.text
