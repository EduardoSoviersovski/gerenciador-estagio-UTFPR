from core.schemas.role_schemas import UserRole
from core.exceptions.authentication_exceptions import (
    UnauthorizedEmailDomainError,
    MissingEmailError,
)
from core.schemas.email_schemas import AllowedEmailDomain


class AuthenticationTasks:
    @staticmethod
    def verify_email_domain(user_info: dict) -> None:
        if user_info is None or user_info.get("email") is None:
            raise MissingEmailError()

        email = user_info.get("email", "")
        domain = email.split("@")[1]
        allowed_domains = {item.value for item in AllowedEmailDomain}

        if domain not in allowed_domains:
            raise UnauthorizedEmailDomainError(email)

    @staticmethod
    def get_user_role(user_info: dict) -> None:
        email = user_info.get("email", "")
        if AllowedEmailDomain.UTFPR_STUDENTS.value in email:
            user_info["role"] = UserRole.STUDENT.value
        else:
            user_info["role"] = UserRole.SUPERVISOR.value
