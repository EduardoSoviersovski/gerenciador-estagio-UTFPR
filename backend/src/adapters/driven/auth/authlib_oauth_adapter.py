import os

from authlib.integrations.starlette_client import OAuth
from dotenv import load_dotenv

from core.ports.out.oauth_provider_port import OAuthProviderPort

load_dotenv()


class AuthlibOAuthAdapter(OAuthProviderPort):
    def __init__(self) -> None:
        oauth = OAuth()
        oauth.register(
            name="sisprae_utfpr",
            client_id=os.getenv("GOOGLE_CLIENT_ID"),
            client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
            server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
            client_kwargs={"scope": "openid email profile"},
        )
        self.client = oauth.sisprae_utfpr

    async def authorize_redirect(self, request, redirect_uri: str, prompt: str = None):
        return await self.client.authorize_redirect(
            request, redirect_uri, prompt=prompt
        )

    async def authorize_access_token(self, request) -> dict:
        return await self.client.authorize_access_token(request)
