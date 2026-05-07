from core.ports.document_ports import DocumentPorts


class DocumentTasks:
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
