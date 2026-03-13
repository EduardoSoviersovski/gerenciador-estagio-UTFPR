import os

from dotenv import load_dotenv

from core.ports.out.redirect_builder_port import RedirectBuilderPort

load_dotenv()

class FrontendRedirectAdapter(RedirectBuilderPort):
    def dashboard_url(self) -> str:
        frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
        return f"{frontend_url}/dashboard"
