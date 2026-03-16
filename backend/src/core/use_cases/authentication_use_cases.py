import os

from fastapi.responses import RedirectResponse

from core.schemas.email_schemas import AllowedEmailDomain
from core.schemas.role_schemas import UserRole
from core.ports.out.oauth_provider_port import OAuthProviderPort
from core.ports.out.redirect_builder_port import RedirectBuilderPort
from core.ports.out.session_port import SessionPort
from core.tasks.authentication_tasks import AuthenticationTasks


class AuthenticationUseCases:
    def __init__(
        self,
        oauth_provider: OAuthProviderPort,
        session: SessionPort,
        redirect_builder: RedirectBuilderPort,
    ) -> None:
        self.oauth_provider = oauth_provider
        self.session = session
        self.redirect_builder = redirect_builder

    async def login(self, request, redirect_uri: str):
        prompt = "select_account"
        return await self.oauth_provider.authorize_redirect(
            request, redirect_uri, prompt=prompt
        )

    async def auth(self, request) -> RedirectResponse:
        token = await self.oauth_provider.authorize_access_token(request)
        user_info = token.get("userinfo")

        print(f"User info from OAuth provider: {user_info}")
        AuthenticationTasks.verify_email_domain(user_info)
        AuthenticationTasks.get_user_role(user_info)

        self.session.set(request, "user", user_info)
        self.session.set(request, "access_token", token.get("access_token"))

        print(f"User info stored in session: {user_info}")
        url = self.redirect_builder.home_url(user_info["role"])
        return RedirectResponse(url=url)

    def logout(self, request) -> RedirectResponse:
        self.session.pop(request, "user", None)
        self.session.pop(request, "access_token", None)

        frontend_login_url = "http://localhost:5173/login"
        return RedirectResponse(url=frontend_login_url)

    def current_user(self, request):
        return self.session.get(request, "user")
