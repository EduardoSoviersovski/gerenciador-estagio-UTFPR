import os

from dotenv import load_dotenv

from core.ports.redirect_builder_port import RedirectBuilderPort

load_dotenv()


class FrontendRedirectAdapter(RedirectBuilderPort):
    def get_home_url(self, role: str) -> str:
        base_url = os.getenv("FRONTEND_URL")

        base_url = base_url.rstrip("/")

        final_url = f"{base_url}/{role}"
        return final_url
