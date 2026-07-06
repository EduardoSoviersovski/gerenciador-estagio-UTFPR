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