from pydantic import validate_email

from adapters.email.smtp_email_adapter import SmtpEmailAdapter
from core.templates.email.welcome_email import WELCOME_EMAIL_TEMPLATE

class EmailTasks:
    @staticmethod
    def format_welcome_email(user_name: str) -> str:
        return WELCOME_EMAIL_TEMPLATE.format(name=user_name)

    @staticmethod
    def is_valid_email(email: str) -> bool:
        try:
            validate_email(email)
            return True
        except Exception:
            return False

    @staticmethod
    async def send_html_email(recipient: str, subject: str, html_body: str) -> bool:
        return await SmtpEmailAdapter.send_html_email(recipient, subject, html_body)
