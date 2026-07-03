GET_ALL_PROCESSES = """
    SELECT 
        ip.id AS process_id,
        ip.sei_number,
        ip.start_date,
        ip.student_period,
        student.name AS student_name,
        student.email AS student_email,
        student.ra AS student_ra,
        advisor.name AS advisor_name,
        advisor.email AS advisor_email,
        advisor.department AS advisor_department,
        c.name AS company_name,
        c.supervisor_name AS supervisor_name,
        c.supervisor_email AS supervisor_email,
        d.name AS process_status,
        co.course_name AS student_course,
        it.name AS internship_type
    FROM user student
    JOIN internship_process ip ON student.id = ip.student_id
    LEFT JOIN user advisor ON ip.advisor_id = advisor.id
    LEFT JOIN company c ON ip.company_id = c.id
    LEFT JOIN process_status d ON ip.status_id = d.id
    LEFT JOIN course co ON ip.student_course_id = co.id
    LEFT JOIN internship_type it ON ip.internship_type_id = it.id
    ORDER BY ip.start_date DESC;
    """

GET_PROCESS_BY_ID = """
    SELECT 
        ip.id AS process_id,
        ip.sei_number,
        ip.start_date,
        ip.weekly_hours,
        ip.student_period,
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
        advisor.google_id AS advisor_google_id,
        advisor.department AS advisor_department,
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
    FROM user student
    JOIN internship_process ip ON student.id = ip.student_id
    LEFT JOIN user advisor ON ip.advisor_id = advisor.id
    LEFT JOIN company c ON ip.company_id = c.id
    LEFT JOIN process_status d ON ip.status_id = d.id
    LEFT JOIN course co ON ip.student_course_id = co.id
    LEFT JOIN internship_type it ON ip.internship_type_id = it.id
    LEFT JOIN hour_goal hg ON ip.id = hg.process_id
    WHERE ip.id = %s;
"""

GET_ADVISOR_EMAILS = "SELECT email FROM user WHERE role_id = %s"
