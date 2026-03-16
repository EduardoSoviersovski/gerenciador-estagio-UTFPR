from abc import ABC, abstractmethod
from typing import Any


class OAuthProviderPort(ABC):
    @abstractmethod
    async def authorize_redirect(
        self, request: Any, redirect_uri: str, prompt: str = None
    ) -> Any:
        pass

    @abstractmethod
    async def authorize_access_token(self, request: Any) -> dict:
        raise NotImplementedError
