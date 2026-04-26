from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr

from core.use_cases.notification_use_cases import NotificationUseCases

notification_app = APIRouter()


class EmailRequest(BaseModel):
    email: EmailStr
    name: str


@notification_app.post("/send_welcome_email")
async def send_welcome_email(request_data: EmailRequest):
    try:
        success = await NotificationUseCases.send_welcome_notification(
            email=request_data.email,
            name=request_data.name
        )
        if not success:
            raise HTTPException(status_code=500, detail="Email failed to send")

        return {"message": "Email sent successfully"}
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
