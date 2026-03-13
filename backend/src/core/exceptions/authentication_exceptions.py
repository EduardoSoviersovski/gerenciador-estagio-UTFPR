from core.schemas.email_schemas import AllowedEmailDomain


class AuthenticationError(Exception):
    pass

class UnauthorizedEmailDomainError(AuthenticationError):
    def __init__(self, email: str | None = None) -> None:
        self.email = email
        self.allowed_domains = {item.value for item in AllowedEmailDomain}
        super().__init__(self._build_message())

    def _build_message(self) -> str:
        return f"Unauthorized email domain for '{self.email}'. Allowed domains: {', '.join(self.allowed_domains)}"

class MissingEmailError(AuthenticationError):
    def __init__(self) -> None:
        super().__init__("No email provided")

    @staticmethod
    def _build_message() -> str:
        return "No email provided"
