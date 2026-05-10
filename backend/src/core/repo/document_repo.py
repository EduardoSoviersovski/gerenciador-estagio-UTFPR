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

GET_DOCUMENTS_BY_PROCESS_ID = """
SELECT 
    d.id,
    d.process_id,
    d.document_type_id,
    d.status_id,
    d.file_name,
    d.file_size,
    d.mime_type,
    d.upload_at,
    dt.name as document_type,
    ds.name as status
FROM document d
LEFT JOIN document_type dt ON d.document_type_id = dt.id
LEFT JOIN document_status ds ON d.status_id = ds.id
WHERE process_id = %s
"""

GET_DOCUMENT_MESSAGES = """
SELECT
    dm.id,
    dm.document_id,
    dm.message,
    dm.send_at,
    u.name,
    u.email
FROM document_message dm
LEFT JOIN user u ON dm.user_id = u.id
WHERE document_id = %s
ORDER BY dm.send_at DESC
"""