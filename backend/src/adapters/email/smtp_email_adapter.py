import logging
from email.message import EmailMessage
import aiosmtplib
from core.config import smpt_settings

logger = logging.getLogger(__name__)

class SmtpEmailAdapter:
    @staticmethod
    async def send_html_email(recipient: str, subject: str, html_body: str) -> bool:
        message = EmailMessage()
        message["From"] = smpt_settings.smtp_from
        message["To"] = recipient
        message["Subject"] = subject
        message.set_content("Please view in an HTML compatible viewer.")
        message.add_alternative(html_body, subtype="html")

        username = smpt_settings.smtp_user if smpt_settings.smtp_user else None
        password = smpt_settings.smtp_password if smpt_settings.smtp_password else None

        try:
            await aiosmtplib.send(
                message,
                hostname=smpt_settings.smtp_host,
                port=smpt_settings.smtp_port,
                username=username,
                password=password,
                start_tls=True if smpt_settings.smtp_port == 587 else False
            )
            return True
        except Exception as e:
            print(f"SMTP Error: {e}")
            return False
