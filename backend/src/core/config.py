import os
from dotenv import load_dotenv
from pydantic import BaseModel

load_dotenv()

class SMTPSettings(BaseModel):
    smtp_host: str = os.getenv("SMTP_HOST", "localhost")
    smtp_port: int = int(os.getenv("SMTP_PORT", 1025))
    smtp_user: str | None = os.getenv("SMTP_USER")
    smtp_password: str | None = os.getenv("SMTP_PASSWORD")
    smtp_from: str = os.getenv("SMTP_FROM_EMAIL", "noreply@app.com")

smpt_settings = SMTPSettings()


class AuthRoleSettings(BaseModel):
    prae_email: str | None = os.getenv("PRAE_EMAIL")
    advisor_for_test: str | None = os.getenv("ADVISOR_FOR_TEST")


auth_role_settings = AuthRoleSettings()

