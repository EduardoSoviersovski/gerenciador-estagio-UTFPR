from core.exceptions.database_exceptions import DocumentNotFoundError
from core.ports.document_ports import DocumentPorts
from core.schemas.document_schemas import EmptyDocument

MIME_TYPE = "none"

class DocumentTasks:
    @staticmethod
    def _get_or_create_document_type(document_type_name: str) -> int:
        doc_type = DocumentPorts.get_document_type_by_name(document_type_name)

        # if not doc_type:
        #     return DocumentPorts.create_document_type(document_type_name)

        return doc_type["id"]

    @staticmethod
    def _update_or_create_template(
        document_type_id: int,
        file_content: bytes,
        file_name: str,
        file_size: int,
        mime_type: str,
        template_type: str = "DOCUMENT"
    ) -> None:
        if DocumentPorts.get_template_by_type_id(document_type_id):
            return DocumentPorts.update_document_template(
                document_type_id=document_type_id,
                file_content=file_content,
                file_name=file_name,
                file_size=file_size,
                mime_type=mime_type,
                template_type=template_type
            )
        return DocumentPorts.save_document_template(
            document_type_id=document_type_id,
            file_content=file_content,
            file_name=file_name,
            file_size=file_size,
            mime_type=mime_type,
            template_type=template_type
        )

    @staticmethod
    def save_document(
            process_id: int,
            document_type_id: int,
            file_content: bytes,
            original_filename: str
    ) -> None:
        status_id = 1
        file_size = len(file_content)
        mime_type = "image/jpeg"
        file_name = f"doc_{process_id}_{document_type_id}_{original_filename}.jpg"

        DocumentPorts.insert_document(
            process_id=process_id,
            document_type_id=document_type_id,
            status_id=status_id,
            file_content=file_content,
            file_name=file_name,
            file_size=file_size,
            mime_type=mime_type
        )

    @staticmethod
    def get_document(document_id: int) -> dict | None:
        if not (document := DocumentPorts.get_document_by_id(document_id)):
            raise DocumentNotFoundError(document_id)
        return document

    @staticmethod
    def delete_documents_by_process_id(process_id: int) -> bool:
        return DocumentPorts.delete_document_by_process_id(process_id)

    @staticmethod
    def get_process_documents(process_id: int) -> list:
        return DocumentPorts.get_documents_by_process_id(process_id)

    @staticmethod
    def get_document_messages(document_id: int) -> list:
        return DocumentPorts.get_document_messages(document_id)

    @staticmethod
    def save_document_template(
        document_type_id: int,
        file_content: bytes,
        file_name: str,
        mime_type: str,
        template_type: str = "DOCUMENT"
    ) -> None:
        file_size = len(file_content)

        DocumentTasks._update_or_create_template(
            document_type_id=document_type_id,
            file_content=file_content,
            file_name=file_name,
            file_size=file_size,
            mime_type=mime_type,
            template_type=template_type
        )

    @staticmethod
    def get_all_document_templates(template_type: str = None) -> list:
        return DocumentPorts.get_all_document_templates(template_type)

    @staticmethod
    def get_document_template_by_type_id(document_type_id: int) -> dict | None:
        return DocumentPorts.get_document_template_by_type_id(document_type_id)

    @staticmethod
    def get_document_by_process_and_type(process_id: int, document_type_id: int) -> dict | None:
        return DocumentPorts.get_document_by_process_and_type(process_id, document_type_id)

    @staticmethod
    def create_empty_document(process_id: int, document_type_id: int, status_id: int) -> int:
        return DocumentPorts.insert_document(
            process_id=process_id, 
            document_type_id=document_type_id, 
            status_id=status_id, 
            file_content=EmptyDocument.FILE_CONTENT,
            file_name=EmptyDocument.FILE_NAME,
            file_size=EmptyDocument.FILE_SIZE,
            mime_type=EmptyDocument.MIME_TYPE
        )

    @staticmethod
    def insert_document_message(document_id: int, message: str, user_id: int) -> int:
        return DocumentPorts.insert_document_message(document_id, message, user_id)
    
    @staticmethod
    def update_document_status(document_id: int, status_id: int) -> int:
        return DocumentPorts.update_document_status(document_id, status_id)

    @staticmethod
    def delete_document_messages_by_process_id(process_id: int) -> bool:
        return DocumentPorts.delete_document_messages_by_process_id(process_id)
    
    @staticmethod
    def save_pdf_document(
            process_id: int,
            document_type_id: int,
            file_content: bytes,
            original_filename: str
    ) -> int:
        status_id = 1
        file_size = len(file_content)
        mime_type = "application/pdf"

        file_name =  original_filename if original_filename.lower().endswith('.pdf') else f"{original_filename}.pdf"

        return DocumentPorts.insert_document(
            process_id=process_id,
            document_type_id=document_type_id,
            status_id=status_id,
            file_content=file_content,
            file_name=file_name,
            file_size=file_size,
            mime_type=mime_type
        )
    
    @staticmethod
    def update_pdf_document_file(
            document_id: int,
            process_id: int,
            document_type_id: int,
            file_content: bytes,
            original_filename: str
    ) -> None:
        file_size = len(file_content)
        mime_type = "application/pdf"
        
        safe_filename = original_filename if original_filename.lower().endswith('.pdf') else f"{original_filename}.pdf"
        file_name = f"doc_{process_id}_{document_type_id}_{safe_filename}"

        DocumentPorts.update_document_file(
            document_id=document_id,
            file_content=file_content,
            file_name=file_name,
            file_size=file_size,
            mime_type=mime_type
        )

    @classmethod
    def upsert_pdf_document(cls, process_id: int, document_type_id: int, file_content: bytes, original_filename: str) -> dict:
        if existing_document := cls.get_document_by_process_and_type(process_id, document_type_id):
            document_id = existing_document["id"]
            cls.update_pdf_document_file(
                document_id=document_id,
                process_id=process_id,
                document_type_id=document_type_id,
                file_content=file_content,
                original_filename=original_filename
            )
            return {
                "document_id": document_id,
                "message": "Documento PDF atualizado (sobrescrito) com sucesso."
            }

        document_id = cls.save_pdf_document(
            process_id=process_id,
            document_type_id=document_type_id,
            file_content=file_content,
            original_filename=original_filename
        )
        return {
            "document_id": document_id,
            "message": "Documento PDF criado e salvo com sucesso."
        }