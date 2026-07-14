import logging

from pymysql import MySQLError

from adapters.database.mysql_adapter import MySQLAdapter
from core.exceptions.database_exceptions import DeleteProcessDocumentsError
from core.repo.document_repo import (
    DELETE_DOCUMENT_MESSAGES_BY_PROCESS, GET_DOCUMENT_TEMPLATE_FILE_BY_TYPE_AND_MIME, GET_TEMPLATE_BY_TYPE_AND_MIME, INSERT_DOCUMENT, GET_DOCUMENT_BY_ID, DELETE_DOCUMENTS_BY_PROCESS,
    GET_DOCUMENTS_BY_PROCESS_ID, GET_DOCUMENT_MESSAGES, INSERT_DOCUMENT_TEMPLATE, 
    GET_ALL_DOCUMENT_TEMPLATES, GET_DOCUMENT_TYPE_BY_NAME, INSERT_DOCUMENT_TYPE, 
    GET_TEMPLATE_BY_TYPE_ID, UPDATE_DOCUMENT_FILE, UPDATE_DOCUMENT_STATUS, UPDATE_DOCUMENT_TEMPLATE, GET_DOCUMENT_TEMPLATE_BY_TYPE_ID, 
    GET_DOCUMENT_TEMPLATES_BY_TYPE, GET_DOCUMENT_BY_PROCESS_AND_TYPE, INSERT_DOCUMENT_MESSAGE
)

adapter = MySQLAdapter()
logger = logging.getLogger(__name__)

class DocumentPorts:
    @staticmethod
    def insert_document(
        process_id: int, 
        document_type_id: int, 
        status_id: int, 
        file_content: bytes | None, 
        file_name: str, 
        file_size: int, 
        mime_type: str,
        custom_name: str = None
    ) -> int:
        return adapter.execute_query(
            INSERT_DOCUMENT, 
            (process_id, document_type_id, status_id, file_content, file_name, file_size, mime_type, custom_name)
        )

    @staticmethod
    def get_document_by_id(document_id: int) -> dict | None:
        return adapter.fetch_one(GET_DOCUMENT_BY_ID, (document_id,))

    @classmethod
    def delete_document_by_process_id(cls, process_id: int) -> bool:
        try:
            adapter.execute_query(DELETE_DOCUMENTS_BY_PROCESS, (process_id,))
            return True
        except MySQLError as e:
            logger.error(f"Error deleting documents from process with id {process_id}: {e}")
            raise DeleteProcessDocumentsError(process_id)

    @staticmethod
    def get_documents_by_process_id(process_id: int) -> list:
        return adapter.fetch_list(GET_DOCUMENTS_BY_PROCESS_ID, (process_id,))

    @classmethod
    def get_document_messages(cls, document_id: int) -> list:
        return adapter.fetch_list(GET_DOCUMENT_MESSAGES, (document_id,))

    @staticmethod
    def insert_document_template(
            document_type_id: int,
            file_content: bytes,
            file_name: str,
            file_size: int,
            mime_type: str,
            template_type: str
    ) -> None:
        adapter.execute_query(
            INSERT_DOCUMENT_TEMPLATE,
            (document_type_id, file_content, file_name, file_size, mime_type, template_type)
        )

    @staticmethod
    def get_all_document_templates(template_type: str = None) -> list:
        if template_type is not None:
            return adapter.fetch_list(GET_DOCUMENT_TEMPLATES_BY_TYPE, (template_type,))
        return adapter.fetch_list(GET_ALL_DOCUMENT_TEMPLATES)

    @staticmethod
    def get_document_template_by_type_id(document_type_id: int) -> dict | None:
        return adapter.fetch_one(GET_DOCUMENT_TEMPLATE_BY_TYPE_ID, (document_type_id,))

    @staticmethod
    def get_document_type_by_name(document_type_name: str) -> dict | None:
        return adapter.fetch_one(GET_DOCUMENT_TYPE_BY_NAME, (document_type_name,))

    @staticmethod
    def create_document_type(document_type_name: str) -> int:
        adapter.execute_query(INSERT_DOCUMENT_TYPE, (document_type_name,))
        return adapter.fetch_one(GET_DOCUMENT_TYPE_BY_NAME, (document_type_name,))["id"]

    @staticmethod
    def get_template_by_type_id(document_type_id: int) -> dict | None:
        return adapter.fetch_one(GET_TEMPLATE_BY_TYPE_ID, (document_type_id,))

    @staticmethod
    def update_document_template(
        document_type_id: int,
        file_content: bytes,
        file_name: str,
        file_size: int,
        mime_type: str,
        template_type: str
    ) -> None:
        adapter.execute_query(
            UPDATE_DOCUMENT_TEMPLATE,
            (file_content, file_name, file_size, mime_type, template_type, document_type_id)
        )

    @staticmethod
    def save_document_template(
        document_type_id: int,
        file_content: bytes,
        file_name: str,
        file_size: int,
        mime_type: str,
        template_type: str
    ) -> None:
        adapter.execute_query(
            INSERT_DOCUMENT_TEMPLATE,
            (document_type_id, file_content, file_name, file_size, mime_type, template_type)
        )

    @staticmethod
    def get_document_by_process_and_type(process_id: int, document_type_id: int) -> dict | None:
        return adapter.fetch_one(GET_DOCUMENT_BY_PROCESS_AND_TYPE, (process_id, document_type_id))

    @staticmethod
    def insert_document_message(document_id: int, message: str, user_id: int) -> int:
        return adapter.execute_query(INSERT_DOCUMENT_MESSAGE, (document_id, message, user_id))
    
    @staticmethod
    def update_document_status(document_id: int, status_id: int) -> int:
        return adapter.execute_query(UPDATE_DOCUMENT_STATUS, (status_id, document_id))
    
    
    def delete_document_messages_by_process_id(process_id: int) -> bool:
        return adapter.execute_query(DELETE_DOCUMENT_MESSAGES_BY_PROCESS, (process_id,))

    @staticmethod
    def update_document_file(
        document_id: int,
        file_content: bytes,
        file_name: str,
        file_size: int,
        mime_type: str,
        custom_name: str = None
    ) -> int:
        return adapter.execute_query(
            UPDATE_DOCUMENT_FILE, 
            (file_content, file_name, file_size, mime_type, document_id, custom_name)
        )
    
    @staticmethod
    def get_template_by_type_and_mime(document_type_id: int, mime_type: str) -> dict | None:
        return adapter.fetch_one(GET_TEMPLATE_BY_TYPE_AND_MIME, (document_type_id, mime_type))

    @staticmethod
    def get_document_template_file(document_type_id: int, mime_type: str) -> dict | None:
        return adapter.fetch_one(GET_DOCUMENT_TEMPLATE_FILE_BY_TYPE_AND_MIME, (document_type_id, mime_type))

    @staticmethod
    def update_document_template(
        document_type_id: int,
        file_content: bytes,
        file_name: str,
        file_size: int,
        mime_type: str,
        template_type: str
    ) -> None:
        adapter.execute_query(
            UPDATE_DOCUMENT_TEMPLATE,
            (file_content, file_name, file_size, template_type, document_type_id, mime_type)
        )