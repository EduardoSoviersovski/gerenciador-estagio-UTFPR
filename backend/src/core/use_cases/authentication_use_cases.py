import os

from fastapi.responses import RedirectResponse

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
        return await self.oauth_provider.authorize_redirect(request, redirect_uri)

    async def auth(self, request) -> RedirectResponse:
        token = await self.oauth_provider.authorize_access_token(request)
        user_info = token.get("userinfo")

        AuthenticationTasks.verify_email_domain(user_info)

        # essa autenticação é aqui mesmo? no use_cases? ou em uma task?
        email = user_info.get("email", "")
        role = "STUDENT" if "alunos.utfpr.edu.br" in email else "SUPERVISOR"
        user_info["role"] = role

        self.session.set(request, "user", user_info)
        self.session.set(request, "access_token", token.get("access_token"))

        url = self.redirect_builder.home_url(role)
        return RedirectResponse(url=url)

    def logout(self, request) -> RedirectResponse:
        self.session.pop(request, "user", None)
        self.session.pop(request, "access_token", None)

        frontend_login_url = "http://localhost:5173/login"
        return RedirectResponse(url=frontend_login_url)

    def current_user(self, request):
        return self.session.get(request, "user")
