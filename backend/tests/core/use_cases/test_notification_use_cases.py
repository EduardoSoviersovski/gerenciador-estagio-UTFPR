import httpx
import pytest
from unittest.mock import AsyncMock, MagicMock, patch

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

    with pytest.raises(ValueError, match="Invalid email address"):
        await NotificationUseCases.send_welcome_notification("bad-email", "John")

    mock_email_port.send_html_email.assert_not_called()

@patch("core.use_cases.notification_use_cases.EmailTasks.send_html_email")
@pytest.mark.asyncio
async def test_send_welcome_notification_port_failure_returns_false(
    mock_send_html_email: AsyncMock
):
    mock_send_html_email.return_value = False

    result = await NotificationUseCases.send_welcome_notification("test@test.com", "John")

    assert result is False

@pytest.mark.asyncio
async def test_send_welcome_email_integration_with_mailcatcher():
    test_email = "tester@example.com"
    test_name = "Integration Tester"

    success = await NotificationUseCases.send_welcome_notification(
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
