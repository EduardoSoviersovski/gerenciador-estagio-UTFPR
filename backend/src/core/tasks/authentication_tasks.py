from core.exceptions.authentication_exceptions import UnauthorizedEmailDomainError, MissingEmailError
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
