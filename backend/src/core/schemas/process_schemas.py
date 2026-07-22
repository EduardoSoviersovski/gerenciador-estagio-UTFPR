from dataclasses import dataclass, asdict
from enum import Enum

from pydantic import BaseModel
from datetime import date


class ProcessCatagory(Enum):
    MANDATORY = "mandatory"
    NON_MANDATORY = "non_mandatory"


class Course(Enum):
    BSI = "BSI"
    EC = "EC"


class CourseIds(Enum):
    BSI = 1
    EC = 2


class Department(Enum):
    DAINF = "DAINF"
    DAMAT = "DAMAT"
    DAELN = "DAELN"
    DAFIS = "DAFIS"
    DAELE = "DAELE"
    DAMEC = "DAMEC"


class CreateProcessRequest(BaseModel):
    sei_number: str | None = None
    student_name: str
    student_ra: str
    student_period: int
    student_email: str
    student_course: Course
    student_phone: str | None = None
    advisor_name: str
    advisor_email: str | None = None
    advisor_phone: str | None = None
    advisor_department: Department
    start_date: date
    internship_type: ProcessCatagory
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
    advisor_department: Department
    start_date: date
    internship_type: ProcessCatagory
    company_name: str
    company_cnpj: str | None = None
    supervisor_name: str
    supervisor_email: str
    supervisor_cpf: str | None = None
    weekly_hours: int
    target_hours: int
    student_course: Course


class DeleteProcessesRequest(BaseModel):
    process_ids: list[int]


@dataclass
class StudentData:
    id: int | None
    google_id: str | None
    name: str | None
    ra: str | None
    email: str | None
    course: str | None
    period: int | None
    phone: str | None


@dataclass
class CompanyData:
    name: str | None
    supervisor: str | None
    supervisor_email: str | None
    company_cnpj: str | None
    supervisor_cpf: str | None


@dataclass
class ProcessInfoData:
    id: int | None
    advisor_id: int | None
    advisor_name: str | None
    advisor_email: str | None
    advisor_google_id: str | None
    advisor_phone: str | None
    advisor_department: str
    company: CompanyData
    status: str | None
    type: str | None
    start_date: date | None
    weekly_hours: int | None
    sei_number: str | None
    target_hours: int | None
    end_date_forecast: date | None


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
                course=raw_data.get("student_course"),
                period=raw_data.get("student_period"),
                phone=raw_data.get("student_phone"),
            ),
            process=ProcessInfoData(
                id=raw_data.get("id"),
                advisor_id=raw_data.get("advisor_id"),
                advisor_name=raw_data.get("advisor_name"),
                advisor_email=raw_data.get("advisor_email"),
                advisor_google_id=raw_data.get("advisor_google_id"),
                advisor_phone=raw_data.get("advisor_phone"),
                advisor_department=raw_data.get("advisor_department"),
                company=CompanyData(
                    name=raw_data.get("company_name"),
                    supervisor=raw_data.get("supervisor_name"),
                    supervisor_email=raw_data.get("supervisor_email"),
                    company_cnpj=raw_data.get("company_cnpj"),
                    supervisor_cpf=raw_data.get("supervisor_cpf"),
                ),
                status=raw_data.get("process_status"),
                type=raw_data.get("internship_type"),
                start_date=start_date_str,
                weekly_hours=raw_data.get("weekly_hours"),
                sei_number=raw_data.get("sei_number"),
                target_hours=raw_data.get("target_hours"),
                end_date_forecast=raw_data.get("end_date_forecast"),
            ),
        )

    def to_dict(self) -> dict:
        return asdict(self)
