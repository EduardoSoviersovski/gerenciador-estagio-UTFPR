from core.ports.document_ports import DocumentPorts

class DocumentTasks:
    @staticmethod
    def _get_or_create_document_type(document_type_name: str) -> int:
        doc_type = DocumentPorts.get_document_type_by_name(document_type_name)

        if not doc_type:
            return DocumentPorts.create_document_type(document_type_name)

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
        return DocumentPorts.get_document_by_id(document_id)

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
        file_name = "Pendente_de_envio"
        mime_type = "none"
        file_content = None
        file_size = 0
        
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
    def insert_document_message(document_id: int, message: str, user_id: int) -> int:
        return DocumentPorts.insert_document_message(document_id, message, user_id)
    
    @staticmethod
    def update_document_status(document_id: int, status_id: int) -> bool:
        return DocumentPorts.update_document_status(document_id, status_id)
    
    def delete_document_messages_by_process_id(process_id: int) -> bool:
        return DocumentPorts.delete_document_messages_by_process_id(process_id)
