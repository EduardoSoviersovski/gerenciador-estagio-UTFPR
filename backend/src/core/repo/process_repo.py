GET_USER_BY_EMAIL = """
SELECT
    id,
    name,
    ra,
    email,
    phone,
    google_id,
    role_id
FROM user WHERE email = %s
"""

INSERT_USER = """
INSERT INTO user (
    name,
    ra,
    email,
    phone,
    google_id,
    role_id) 
VALUES (%s, %s, %s, %s, %s, %s)
"""

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