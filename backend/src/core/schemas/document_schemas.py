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
    COMMITMENT_AGREEMENT = 7       
    INTERNSHIP_PLAN = 8            
    ADDENDUM = 9                   
    TERMINATION_TERM = 10          
    EVALUATION_FORM = 11           
    HOURS_DECLARATION = 12         
    ENROLLMENT_REQUEST = 13        
    COMPANY_VISIT_REPORT = 14
    INTERNS_PARTIAL_REPORT = 15
    COMPANY_SUPERVISOR_PARTIAL_REPORT = 16
    EVIDENCE_REPORT = 17           
    SIMPLIFIED_AGREEMENT = 18      
    TRAINING_ACTIVITY = 19         
    EVIDENCE_DECLARATION = 20      
    GENERAL_CONDITIONS = 21        

class TemplateFormat(Enum):
    PDF = "pdf"
    DOCX = "docx"

    @property
    def mime_type(self) -> str:
        mapping = {
            TemplateFormat.PDF: "application/pdf",
            TemplateFormat.DOCX: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        }
        return mapping[self]