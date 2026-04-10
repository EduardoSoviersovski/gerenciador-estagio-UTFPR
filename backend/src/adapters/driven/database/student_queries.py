GET_USER_REPORTS_BY_USER_EMAIL = """
    SELECT 
        d.id AS document_id,
        d.file_name,
        d.file_size,
        d.mime_type,
        d.upload_at,
        dt.name AS document_type,
        ds.name AS document_status
    FROM user u
    JOIN internship_process ip ON u.id = ip.student_id
    JOIN document d ON ip.id = d.process_id
    JOIN document_type dt ON d.document_type_id = dt.id
    JOIN document_status ds ON d.status_id = ds.id
    WHERE u.email = %s
      AND dt.name in ('partial_report', 'final_report', 'internship_agreement');
"""
