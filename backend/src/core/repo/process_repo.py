GET_INTERNSHIP_TYPE_ID = "SELECT id FROM internship_type WHERE name = %s"

INSERT_INTERNSHIP_PROCESS = """
INSERT INTO internship_process (
    student_id,
    advisor_id,
    company_id,
    status_id,
    student_course_id,
    internship_type_id,
    sei_number,
    start_date,
    weekly_hours
)
VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
"""

GET_INTERNSHIP_PROCESS = """
SELECT
    student_id,
    advisor_id,
    company_id,
    status_id,
    student_course_id,
    internship_type_id,
    sei_number,
    start_date,
    weekly_hours
FROM internship_process
WHERE id = %s
"""

GET_INTERNSHIP_PROCESS_BY_STUDENT_ID_AND_START_DATE = """
SELECT
    student_id,
    advisor_id,
    company_id,
    status_id,
    student_course_id,
    internship_type_id,
    sei_number,
    start_date,
    weekly_hours
FROM internship_process
WHERE student_id = %s
    AND start_date = %s
"""
