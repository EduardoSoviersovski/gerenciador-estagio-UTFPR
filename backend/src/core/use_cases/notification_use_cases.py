from core.tasks.email_tasks import EmailTasks


class NotificationUseCases:
    @staticmethod
    async def send_welcome_notification(email: str, name: str) -> bool:
        if not EmailTasks.is_valid_email(email):
            raise ValueError("Invalid email address")

        html_body = EmailTasks.format_welcome_email(name)
        response = await EmailTasks.send_html_email(
            recipient=email,
            subject="Welcome to our App!",
            html_body=html_body
        )
        return response
