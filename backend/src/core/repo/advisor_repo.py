GET_ADVISOR_STUDENT_PROCESS_BY_ADVISOR_EMAIL = """
    SELECT 
        ip.id AS process_id,
        ip.sei_number,
        ip.start_date,
        student.student_period,
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
    LEFT JOIN course co ON student.student_course_id = co.id
    LEFT JOIN internship_type it ON ip.internship_type_id = it.id
    WHERE advisor.email = %s
    ORDER BY ip.start_date DESC;
    """
