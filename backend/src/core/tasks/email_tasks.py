from pydantic import validate_email

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
