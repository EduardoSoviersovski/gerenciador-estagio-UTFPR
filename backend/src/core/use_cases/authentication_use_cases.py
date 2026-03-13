from core.ports.out.oauth_provider_port import OAuthProviderPort
from core.ports.out.redirect_builder_port import RedirectBuilderPort
from core.ports.out.session_port import SessionPort


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

    async def auth(self, request) -> str:
        token = await self.oauth_provider.authorize_access_token(request)
        self.session.set(request, "user", token.get("userinfo"))
        self.session.set(request, "access_token", token.get("access_token"))
        return self.redirect_builder.dashboard_url()

    def logout(self, request) -> None:
        self.session.pop(request, "user", None)
        self.session.pop(request, "access_token", None)

    def current_user(self, request):
        return self.session.get(request, "user")
