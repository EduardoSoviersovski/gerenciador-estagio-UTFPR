class EmailPort:
    async def send_html_email(self, recipient: str, subject: str, html_body: str) -> bool:
        raise NotImplementedError
