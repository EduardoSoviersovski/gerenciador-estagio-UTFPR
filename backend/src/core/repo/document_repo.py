INSERT_DOCUMENT = """
INSERT INTO document (
    process_id, 
    document_type_id, 
    status_id, 
    file_content, 
    file_name, 
    file_size, 
    mime_type
) VALUES (%s, %s, %s, %s, %s, %s, %s)
"""

GET_DOCUMENT_BY_ID = """
SELECT file_content, file_name, mime_type
FROM document
WHERE id = %s
"""

DELETE_DOCUMENTS_BY_PROCESS = """
DELETE FROM document 
WHERE process_id = %s
"""
