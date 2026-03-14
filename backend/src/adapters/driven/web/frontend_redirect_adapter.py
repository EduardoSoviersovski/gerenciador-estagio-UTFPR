import os

from dotenv import load_dotenv

from core.ports.out.redirect_builder_port import RedirectBuilderPort

load_dotenv()


class FrontendRedirectAdapter(RedirectBuilderPort):
    def home_url(self, role: str) -> str:
        base_url = os.getenv("FRONTEND_URL", "http://localhost:5173")

        if not base_url.startswith("http"):
            base_url = f"http://localhost:5173"

        base_url = base_url.rstrip("/")

        role_path = "student" if role == "STUDENT" else "supervisor"

        final_url = f"{base_url}/{role_path}"

        return final_url
