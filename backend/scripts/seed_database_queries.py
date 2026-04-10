INSERT_ROLE = "INSERT IGNORE INTO role (role_name) VALUES (%s)"

INSERT_COURSE = "INSERT IGNORE INTO course (course_name) VALUES (%s)"

INSERT_COMPANY = """
    INSERT IGNORE INTO company (name, cnpj, supervisor_name, supervisor_email) 
    VALUES (%s, %s, %s, %s)
"""

INSERT_PROCESS_STATUS = "INSERT IGNORE INTO process_status (name) VALUES (%s)"

INSERT_INTERNSHIP_TYPE = "INSERT IGNORE INTO internship_type (name) VALUES (%s)"

INSERT_USER = """
    INSERT IGNORE INTO 
        user (name, ra, email, phone, google_id, role_id)
    VALUES (%s, %s, %s, %s, %s, %s)
"""

INSERT_DOCUMENT_TYPE = "INSERT IGNORE INTO document_type (name, accepted_format) VALUES (%s, %s)"

SELECT_USERS = "SELECT id, role_id FROM user"

SELECT_COMPANIES = "SELECT id FROM company"

SELECT_COURSES = "SELECT id FROM course"

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
    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
"""

SET_FOREIGN_KEY_CHECKS = "SET FOREIGN_KEY_CHECKS = %s"
