import os

from dotenv import load_dotenv

load_dotenv()


class RedirectAdapter:
    @staticmethod
    def get_home_url(role: str) -> str:
        base_url = os.getenv("FRONTEND_URL")

        base_url = base_url.rstrip("/")

        final_url = f"{base_url}/{role}"
        return final_url

    @staticmethod
    def get_login_url() -> str:
        return f"{os.getenv("FRONTEND_URL")}/login"
