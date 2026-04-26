from core.schemas.role_schemas import UserRole
from core.exceptions.authentication_exceptions import (
    UnauthorizedEmailDomainError,
    MissingEmailError,
)
from core.schemas.email_schemas import AllowedEmailDomain


class AuthenticationTasks:
    @classmethod
    def verify_email_domain(cls, user_info: dict) -> None:
        email = cls._get_email_from_user_info(user_info)
        domain = email.split("@")[1]
        allowed_domains = {item.value for item in AllowedEmailDomain}

        if domain not in allowed_domains:
            raise UnauthorizedEmailDomainError(email)

    @classmethod
    def set_user_role(cls, user_info: dict) -> None:
        email = cls._get_email_from_user_info(user_info)
        is_student_email = AllowedEmailDomain.UTFPR_STUDENTS.value in email

        user_info["role"] = (
            UserRole.STUDENT.value if is_student_email else UserRole.ADVISOR.value
        )

    @staticmethod
    def _get_email_from_user_info(user_info: dict) -> str:
        if user_info is None or user_info.get("email") is None:
            raise MissingEmailError()

        return user_info.get("email", "")
