import pytest
from core.tasks.email_tasks import EmailTasks


def test_format_welcome_email_injects_name():
    name = "Alice"

    html_result = EmailTasks.format_welcome_email(name)

    assert f"Hello, {name}!" in html_result
    assert "Welcome to our platform" in html_result


@pytest.mark.parametrize("email, expected", [
    ("test@example.com", True),
    ("user.name@domain.co.uk", True),
    ("invalid-email", False),
    ("@no-user.com", False),
    ("user@no-extension", False),
    ("", False),
])
def test_is_valid_email_validation_logic(email, expected):
    assert EmailTasks.is_valid_email(email) == expected
