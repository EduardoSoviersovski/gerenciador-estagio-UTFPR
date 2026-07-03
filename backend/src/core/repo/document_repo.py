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
    u.email,
    u.role_id
FROM document_message dm
LEFT JOIN user u ON dm.user_id = u.id
WHERE document_id = %s
ORDER BY dm.send_at ASC
"""

INSERT_DOCUMENT_TEMPLATE = """
INSERT INTO document_template (
    document_type_id, 
    file_content, 
    file_name, 
    file_size, 
    mime_type,
    template_type
) VALUES (%s, %s, %s, %s, %s, %s)
"""

GET_ALL_DOCUMENT_TEMPLATES = """
SELECT 
    dt.id,
    dt.document_type_id,
    dt.file_name,
    dt.file_size,
    dt.mime_type,
    dt.template_type,
    t.name as document_type_name
FROM document_template dt
JOIN document_type t ON dt.document_type_id = t.id
"""

GET_DOCUMENT_TEMPLATE_BY_TYPE_NAME = """
SELECT 
    dt.file_content, 
    dt.file_name, 
    dt.mime_type
FROM document_template dt
JOIN document_type t ON dt.document_type_id = t.id
WHERE t.name = %s
"""

GET_DOCUMENT_TEMPLATE_BY_TYPE_ID = """
SELECT 
    dt.file_content, 
    dt.file_name, 
    dt.mime_type
FROM document_template dt
JOIN document_type t ON dt.document_type_id = t.id
WHERE t.id = %s
"""

GET_DOCUMENT_TYPE_BY_NAME = """
SELECT id FROM document_type WHERE name = %s
"""

INSERT_DOCUMENT_TYPE = """
INSERT INTO document_type (name) VALUES (%s)
"""

GET_TEMPLATE_BY_TYPE_ID = """
SELECT id FROM document_template WHERE document_type_id = %s
"""

UPDATE_DOCUMENT_TEMPLATE = """
UPDATE document_template 
SET file_content = %s, file_name = %s, file_size = %s, mime_type = %s, template_type = %s
WHERE document_type_id = %s
"""

GET_DOCUMENT_TEMPLATES_BY_TYPE = """
SELECT 
    dt.id,
    dt.document_type_id,
    dt.file_name,
    dt.file_size,
    dt.mime_type,
    dt.template_type,
    t.name as document_type_name
FROM document_template dt
JOIN document_type t ON dt.document_type_id = t.id
WHERE dt.template_type = %s
"""

GET_DOCUMENT_BY_PROCESS_AND_TYPE = """
SELECT id, status_id 
FROM document 
WHERE process_id = %s AND document_type_id = %s
"""

INSERT_DOCUMENT_MESSAGE = """
INSERT INTO document_message (document_id, message, user_id)
VALUES (%s, %s, %s)
"""

