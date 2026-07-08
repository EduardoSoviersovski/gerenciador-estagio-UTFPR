from enum import Enum

from pydantic import BaseModel, Field

class DocumentMessageCreate(BaseModel):
    message: str = Field(..., min_length=1, max_length=255, description="Texto do comentário")

class DocumentStatus(Enum):
    PENDING = 1
    REQUEST_CHANGES = 2
    APPROVED = 3
    REJECTED = 4

class DocumentStatusUpdate(BaseModel):
    status_id: DocumentStatus = Field(..., description="Novo status do documento (1-PENDING, 2-REQUEST_CHANGES, 3-APPROVED, 4-REJECTED)")

class EmptyDocument:
    FILE_NAME = "Pendente_de_envio"
    FILE_CONTENT = None
    FILE_SIZE = 0
    MIME_TYPE = "none"

class DocumentType(Enum):
    STUDENT_PARTIAL_REPORT_1 = 1
    SUPERVISOR_PARTIAL_REPORT_1 = 2
    VISIT_REPORT = 3
    STUDENT_PARTIAL_REPORT_2 = 4
    FINAL_REPORT = 5
    OTHERS = 6
