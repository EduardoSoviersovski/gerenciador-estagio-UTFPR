import os
from types import CoroutineType

from dotenv import load_dotenv
from fastapi.responses import RedirectResponse

from core.ports.oauth_provider_port import OAuthProviderPort
from core.ports.redirect_builder_port import RedirectBuilderPort
from core.ports.session_port import SessionPort
from core.tasks.authentication_tasks import AuthenticationTasks

load_dotenv()


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

    async def login(self, request, redirect_uri: str) -> CoroutineType:
        return await self.oauth_provider.authorize_redirect(
            request, redirect_uri, "select_account"
        )

    async def auth(self, request) -> RedirectResponse:
        token = await self.oauth_provider.authorize_access_token(request)
        user_info = token.get("userinfo")

        AuthenticationTasks.verify_email_domain(user_info)
        AuthenticationTasks.set_user_role(user_info)

        self.session.set(request, "user", user_info)
        self.session.set(request, "access_token", token.get("access_token"))

        return RedirectResponse(
            url=self.redirect_builder.get_home_url(user_info["role"])
        )

    def logout(self, request) -> RedirectResponse:
        self.session.pop(request, "user", None)
        self.session.pop(request, "access_token", None)

        frontend_login_url = os.getenv("FRONTEND_URL") + "/login"

        return RedirectResponse(url=frontend_login_url)

    def current_user(self, request):
        return self.session.get(request, "user")
