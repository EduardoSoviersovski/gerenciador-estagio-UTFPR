from adapters.database.mysql_adapter import MySQLAdapter
from core.repo.document_repo import INSERT_DOCUMENT, GET_DOCUMENT_BY_ID, DELETE_DOCUMENTS_BY_PROCESS

adapter = MySQLAdapter()

class DocumentPorts:
    @staticmethod
    def insert_document(
        process_id: int, 
        document_type_id: int, 
        status_id: int, 
        file_content: bytes, 
        file_name: str, 
        file_size: int, 
        mime_type: str
    ) -> None:
        adapter.execute_query(
            INSERT_DOCUMENT, 
            (process_id, document_type_id, status_id, file_content, file_name, file_size, mime_type)
        )

    @staticmethod
    def get_document_by_id(document_id: int) -> dict | None:
        return adapter.fetch_one(GET_DOCUMENT_BY_ID, (document_id,))

    @classmethod
    def delete_document_by_process_id(cls, process_id: int):
        return adapter.fetch_one(DELETE_DOCUMENTS_BY_PROCESS, (process_id,))
