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
        is_report: bool = False
    ) -> None:
        if DocumentPorts.get_template_by_type_id(document_type_id):
            return DocumentPorts.update_document_template(
                document_type_id=document_type_id,
                file_content=file_content,
                file_name=file_name,
                file_size=file_size,
                mime_type=mime_type,
                is_report=is_report
            )
        return DocumentPorts.save_document_template(
            document_type_id=document_type_id,
            file_content=file_content,
            file_name=file_name,
            file_size=file_size,
            mime_type=mime_type,
            is_report=is_report
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
    def get_document_messages(document_id: int):
        return DocumentPorts.get_document_messages(document_id)

    @staticmethod
    def save_document_template(
        document_type_id: int,
        file_content: bytes,
        file_name: str,
        mime_type: str,
        is_report: bool = False
    ) -> None:
        file_size = len(file_content)

        DocumentTasks._update_or_create_template(
            document_type_id=document_type_id,
            file_content=file_content,
            file_name=file_name,
            file_size=file_size,
            mime_type=mime_type,
            is_report=is_report
        )

    @staticmethod
    def get_all_document_templates(is_report: bool = None) -> list:
        return DocumentPorts.get_all_document_templates(is_report)

    @staticmethod
    def get_document_template_by_type_id(document_type_id: int) -> dict | None:
        return DocumentPorts.get_document_template_by_type_id(document_type_id)
