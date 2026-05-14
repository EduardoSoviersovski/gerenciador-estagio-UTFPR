from dataclasses import dataclass, asdict
from enum import Enum

from pydantic import BaseModel
from datetime import date

class ProcessCatagory(Enum):
    MANDATORY = "mandatory"
    NON_MANDATORY = "non_mandatory"

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
    company_name: str
    company_cnpj: str | None = None
    supervisor_name: str
    supervisor_email: str
    supervisor_cpf: str | None = None
    weekly_hours: int
    target_hours: int

class UpdateProcessRequest(BaseModel):
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
    company_name: str
    company_cnpj: str | None = None
    supervisor_name: str
    supervisor_email: str
    supervisor_cpf: str | None = None
    weekly_hours: int
    target_hours: int

@dataclass
class StudentData:
    id: int | None
    google_id: str | None
    name: str | None
    ra: str | None
    email: str | None
    course: str | None

@dataclass
class CompanyData:
    name: str | None
    supervisor: str | None
    supervisor_email: str | None

@dataclass
class ProcessInfoData:
    id: int | None
    advisor_id: int | None
    advisor_name: str | None
    advisor_email: str | None
    advisor_google_id: str | None
    company: CompanyData
    status: str | None
    type: str | None
    start_date: date | None
    weekly_hours: int | None
    sei_number: str | None

@dataclass
class ProcessResponse:
    student: StudentData
    process: ProcessInfoData

    @classmethod
    def from_dict(cls, raw_data: dict) -> "ProcessResponse":
        start_date_str = raw_data.get("start_date")

        return cls(
            student=StudentData(
                id=raw_data.get("student_id"),
                google_id=raw_data.get("student_google_id"),
                name=raw_data.get("student_name"),
                ra=raw_data.get("student_ra"),
                email=raw_data.get("student_email"),
                course=raw_data.get("student_course")
            ),
            process=ProcessInfoData(
                id=raw_data.get("id"),
                advisor_id=raw_data.get("advisor_id"),
                advisor_name=raw_data.get("advisor_name"),
                advisor_email=raw_data.get("advisor_email"),
                advisor_google_id=raw_data.get("advisor_google_id"),
                company=CompanyData(
                    name=raw_data.get("company_name"),
                    supervisor=raw_data.get("company_supervisor_name"),
                    supervisor_email=raw_data.get("company_supervisor_email")
                ),
                status=raw_data.get("process_status"),
                type=raw_data.get("internship_type"),
                start_date=start_date_str,
                weekly_hours=raw_data.get("weekly_hours"),
                sei_number=raw_data.get("sei_number")
            )
        )

    def to_dict(self) -> dict:
        return asdict(self)
