from adapters.driven.auth.authlib_oauth_adapter import AuthlibOAuthAdapter
from adapters.driven.email.smtp_email_adapter import SmtpEmailAdapter
from adapters.driven.file_formatter.file_formatter_adapter import PdfToImageFileFormatterAdapter
from adapters.driven.session.starlette_session_adapter import StarletteSessionAdapter
from adapters.driven.web.frontend_redirect_adapter import FrontendRedirectAdapter
from core.use_cases.authentication_use_cases import AuthenticationUseCases
from core.use_cases.file_formatter_use_cases import FileFormatterUseCases
from core.use_cases.notification_use_cases import NotificationUseCases


def get_notification_use_cases() -> NotificationUseCases:
    return NotificationUseCases(
        email_port=SmtpEmailAdapter()
    )

def get_login_page_use_cases() -> AuthenticationUseCases:
    return AuthenticationUseCases(
        oauth_provider=AuthlibOAuthAdapter(),
        session=StarletteSessionAdapter(),
        redirect_builder=FrontendRedirectAdapter(),
    )

def get_file_formatter_use_cases() -> FileFormatterUseCases:
    return FileFormatterUseCases(
        file_formatter=PdfToImageFileFormatterAdapter()
    )
