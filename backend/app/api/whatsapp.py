from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from twilio.rest import Client
from dotenv import load_dotenv
# from app.config import settings
import os
import structlog

load_dotenv()

logger = structlog.get_logger(__name__)

account_sid = os.getenv("TWILIO_ACCOUNT_SID")
auth_token = os.getenv("TWILIO_AUTH_TOKEN")
twilio_from = os.getenv("TWILIO_WHATSAPP_FROM")
client = Client(account_sid, auth_token)

whatsapp_router = APIRouter(prefix="/whatsapp", tags=["whatsapp"])

class MessageRequest(BaseModel):
    phone_number: str
    message: str

@whatsapp_router.post("/send-whatsapp")
def send_whatsapp(req: MessageRequest):
    try:
        to_number = f"whatsapp:{req.phone_number}"
        message = client.messages.create(
            body=req.message,
            from_=twilio_from,
            to=to_number
        )
        return {"status": "sent", "sid": message.sid}
    except Exception as e:
        logger.error(f"Error in send_whatsapp: {e}")
        raise HTTPException(status_code=500, detail=str(e))