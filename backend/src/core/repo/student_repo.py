GET_USER_REPORTS_BY_STUDENT_RA = """
    SELECT 
        d.id AS document_id,
        d.file_name,
        d.file_size,
        d.mime_type,
        d.upload_at,
        dt.name AS document_type,
        ds.name AS document_status
    FROM user student
    JOIN internship_process ip ON student.id = ip.student_id
    JOIN document d ON ip.id = d.process_id
    JOIN document_type dt ON d.document_type_id = dt.id
    JOIN document_status ds ON d.status_id = ds.id
    WHERE student.ra = %s
      AND dt.name in ('partial_report', 'final_report', 'internship_agreement');
"""

GET_USER_PROCESSES_LIST_BY_RA = """
    SELECT
        ip.id,
        c.name AS company_name,
        d.name AS process_status,
        ip.start_date,
        it.name AS internship_type
    FROM user student
    JOIN internship_process ip ON student.id = ip.student_id
    LEFT JOIN company c ON ip.company_id = c.id
    LEFT JOIN process_status d ON ip.status_id = d.id
    LEFT JOIN internship_type it ON ip.internship_type_id = it.id
    WHERE student.ra = %s
    ORDER BY ip.start_date DESC;
"""

GET_PROCESS_DETAILS_BY_ID = """
    SELECT
        ip.id,
        ip.sei_number,
        ip.start_date,
        ip.weekly_hours,
        student.student_period,
        student.id as student_id,
        student.name AS student_name,
        student.email AS student_email,
        student.phone AS student_phone,
        student.ra AS student_ra,
        student.google_id AS student_google_id,
        advisor.id AS advisor_id,
        advisor.name AS advisor_name,
        advisor.email AS advisor_email,
        advisor.phone AS advisor_phone,
        advisor.department AS advisor_department,
        advisor.google_id AS advisor_google_id,
        c.name AS company_name,
        c.supervisor_name AS supervisor_name,
        c.supervisor_email AS supervisor_email,
        c.cnpj AS company_cnpj,
        c.supervisor_cpf as supervisor_cpf,
        d.name AS process_status,
        co.course_name AS student_course,
        it.name AS internship_type,
        hg.total_target_hours AS target_hours,
        hg.end_date_forecast
    FROM internship_process ip
    JOIN user student ON ip.student_id = student.id
    LEFT JOIN user advisor ON ip.advisor_id = advisor.id
    LEFT JOIN company c ON ip.company_id = c.id
    LEFT JOIN process_status d ON ip.status_id = d.id
    LEFT JOIN course co ON student.student_course_id = co.id
    LEFT JOIN internship_type it ON ip.internship_type_id = it.id
    LEFT JOIN hour_goal hg ON ip.id = hg.process_id
    WHERE ip.id = %s;
"""