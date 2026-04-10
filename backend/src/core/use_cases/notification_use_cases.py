from core.ports.email_port import EmailPort
from core.tasks.email_tasks import EmailTasks


class NotificationUseCases:
    def __init__(self, email_port: EmailPort):
        self.email_port = email_port

    async def send_welcome_notification(self, email: str, name: str) -> bool:
        if not EmailTasks.is_valid_email(email):
            raise ValueError("Invalid email address")

        html_body = EmailTasks.format_welcome_email(name)
        success = await self.email_port.send_html_email(
            recipient=email,
            subject="Welcome to our App!",
            html_body=html_body
        )
        return success
