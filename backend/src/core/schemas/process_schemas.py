from enum import Enum

from pydantic import BaseModel
from datetime import date

class ProcessCatagory(Enum):
    MANDATORY = "Obrigatório"
    NON_MANDATORY = "Não Obrigatório"

class CreateProcessRequest(BaseModel):
    sei_number: str | None = None
    student_name: str
    student_ra: str
    student_period: int
    student_email: str
    student_phone: str | None = None
    advisor_name: str
    advisor_email: str | None = None
    advisor_phone: str | None = None
    advisor_department: str
    start_date: date
    category: ProcessCatagory
