import io
import logging

from fastapi import Response, UploadFile, HTTPException, status
from pdf2image import convert_from_bytes

from core.schemas.document_schemas import DocumentStatus
from core.tasks.file_formatter_tasks import FileFormatterTasks
from core.tasks.document_tasks import DocumentTasks
from core.tasks.process_tasks import ProcessTasks

logger = logging.getLogger(__name__)

class DocumentUseCases:
    @staticmethod
    def convert_file_to_jpg(upload_file: UploadFile) -> bytes:
        content_type = upload_file.content_type

        if content_type == "application/pdf":
            return FileFormatterTasks.convert_pdf_to_jpg(upload_file)
        return FileFormatterTasks.convert_image_to_jpg(upload_file)

    @staticmethod
    def save_document(file_bytes: bytes, process_id: int, document_type_id: int, original_filename: str) -> None:
        DocumentTasks.save_document(
            process_id=process_id,
            document_type_id=document_type_id,
            file_content=file_bytes,
            original_filename=original_filename
        )

    @staticmethod
    def get_document(document_id: int) -> dict:
        document = DocumentTasks.get_document(document_id)
        if not document:
            raise ValueError("Document not found")
        return document

    @staticmethod
    def get_process_documents(process_id: int) -> list:
        document_list = DocumentTasks.get_process_documents(process_id)
        return document_list

    @staticmethod
    def get_document_messages(document_id: int) -> list:
        document_messages = DocumentTasks.get_document_messages(document_id)
        return document_messages

    @staticmethod
    def save_document_template(
        file_bytes: bytes,
        document_type_id: int,
        file_name: str,
        mime_type: str,
        template_type: str
    ) -> None:
        DocumentTasks.save_document_template(
            document_type_id=document_type_id,
            file_content=file_bytes,
            file_name=file_name,
            mime_type=mime_type,
            template_type=template_type
        )

    @staticmethod
    def get_all_document_templates(template_type: str = None) -> list:
        return DocumentTasks.get_all_document_templates(template_type)

    @staticmethod
    def get_document_template_by_type_id(document_type_id: int) -> dict:
        template = DocumentTasks.get_document_template_by_type_id(document_type_id)
        if not template:
            raise ValueError(f"Template for document type '{document_type_id}' not found")
        return template

    @staticmethod
    def add_comment_to_report(process_id: int, document_type_id: int, message: str, user_id: int, user_role: str) -> dict:

        if user_role.upper() not in ["ADMIN", "ADVISOR"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, 
                detail="Ação restrita. Apenas Administradores e Orientadores podem adicionar comentários."
            )
        
        document = DocumentTasks.get_document_by_process_and_type(process_id, document_type_id) or {}

        document_id = document.get('id') or DocumentTasks.create_empty_document(
            process_id,
            document_type_id,
            DocumentStatus.PENDING.value
        )
        if not document_id:
            raise HTTPException(status_code=500, detail="Error to create base document for the report")

        message_id = DocumentTasks.insert_document_message(document_id, message, user_id)
        
        return {
            "message": "Comment added successfully",
            "document_id": document_id,
            "message_id": message_id,
            "role": user_role  
        }

    @staticmethod
    def get_report_details(process_id: int, document_type_id: int) -> dict:
        document = DocumentTasks.get_document_by_process_and_type(process_id, document_type_id)
        if not document:
            logger.info(
                "Document not found.",
                extra={
                    "process_id": process_id,
                    "document_type_id": document_type_id
                }
            )
            return {
                "document": None,
                "messages": []
            }

        messages = DocumentTasks.get_document_messages(document['id'])

        return {
            "document": document,
            "messages": messages
        }

    @staticmethod
    def update_report_status(process_id: int, document_type_id: int, status_id: int, user_role: str) -> dict:

        if user_role.upper() not in ["ADMIN", "ADVISOR"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, 
                detail="Ação restrita. Apenas Administradores e Orientadores podem adicionar comentários."
            )

        document = DocumentTasks.get_document_by_process_and_type(process_id, document_type_id)
        
        if not document:
            document_id = DocumentTasks.create_empty_document(
                process_id,
                document_type_id,
                status_id
            )
            if not document_id:
                raise HTTPException(status_code=500, detail="Erro ao criar documento base para o relatório")
        else:
            document_id = document.get('id')
            DocumentTasks.update_document_status(document_id, status_id)
            
        return {
            "message": "Status updated successfully",
            "document_id": document_id,
            "status_id": status_id
        }
    
    @staticmethod
    def upload_pdf_document(process_id: int, document_type_id: int, file: UploadFile, current_user: dict) -> dict:
        file_bytes = file.file.read()
        if not file_bytes:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="O arquivo enviado está vazio."
            )
        
        if not file_bytes.startswith(b'%PDF'):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Formato inválido. O arquivo enviado não é um PDF válido, mesmo que a extensão seja .pdf."
            )

        process = ProcessTasks.get_process_by_id(process_id)
        if not process:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Processo com ID {process_id} não encontrado."
            )
        
        ProcessTasks.verify_process_access(process=process, current_user=current_user)

        existing_document = DocumentTasks.get_document_by_process_and_type(process_id, document_type_id)

        original_filename = file.filename or "documento_sem_nome.pdf"

        if existing_document:
            document_id = existing_document["id"]
            DocumentTasks.update_pdf_document_file(
                document_id=document_id,
                process_id=process_id,
                document_type_id=document_type_id,
                file_content=file_bytes,
                original_filename=original_filename
            )
            message = "Documento PDF atualizado (sobrescrito) com sucesso."
        else:
            document_id = DocumentTasks.save_pdf_document(
                process_id=process_id,
                document_type_id=document_type_id,
                file_content=file_bytes,
                original_filename=original_filename
            )
            message = "Documento PDF criado e salvo com sucesso."

        return {
            "message": message,
            "document_id": document_id,
            "document_type_id": document_type_id,
            "file_name": original_filename
        }
    
    @staticmethod
    def download_document(process_id: int,document_id: int, file_format: str, current_user: dict) -> Response:
        document = DocumentTasks.get_document(document_id)
        if not document:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Documento com ID {document_id} não encontrado."
            )
        
        process = ProcessTasks.get_process_by_id(process_id)
        if not process:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Processo associado a este documento não foi encontrado."
            )
        
        ProcessTasks.verify_process_access(process=process, current_user=current_user)

        file_bytes = document.get("file_content")
        original_filename = document.get("file_name") or "documento"

        if not file_bytes or document.get("mime_type") == "none":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Este documento ainda não possui nenhum arquivo anexado para download."
            )

        requested_format = file_format.lower()
        if requested_format not in ["pdf", "jpg", "jpeg"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Formato de download inválido. Escolha entre 'pdf' ou 'jpg'."
            )

        if requested_format in ["jpg", "jpeg"]:
            try:
                images = convert_from_bytes(file_bytes, first_page=1, last_page=1)
                if not images:
                    raise ValueError("Não foi possível renderizar as páginas do PDF.")

                img_byte_array = io.BytesIO()
                images[0].save(img_byte_array, format="JPEG", quality=90)
                file_bytes = img_byte_array.getvalue()

                media_type = "image/jpeg"
                if original_filename.lower().endswith(".pdf"):
                    filename = original_filename[0:-4] + ".jpg"
                else:
                    filename = f"{original_filename}.jpg"

            except Exception as e:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Erro ao converter o documento para JPG: {str(e)}"
                )
        else:
            media_type = "application/pdf"
            filename = original_filename if original_filename.lower().endswith(".pdf") else f"{original_filename}.pdf"

        return Response(
            content=file_bytes,
            media_type=media_type,
            headers={
                "Content-Disposition": f'attachment; filename="{filename}"'
            }
        )