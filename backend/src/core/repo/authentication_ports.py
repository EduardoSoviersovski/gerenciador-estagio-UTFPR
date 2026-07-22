GET_USER_BY_EMAIL = """
SELECT
    u.id,
    u.name,
    u.ra,
    u.email,
    u.phone,
    u.google_id,
    LOWER(r.role_name) as role,
    u.department,
    u.student_period,
    c.course_name as student_course
FROM user u
JOIN role r ON u.role_id = r.id
LEFT JOIN course c ON u.student_course_id = c.id
WHERE u.email = %s
"""

GET_USER_BY_GOOGLE_ID = """
SELECT
    u.id,
    u.name,
    u.ra,
    u.email,
    u.phone,
    u.google_id,
    LOWER(r.role_name) as role,
    u.department,
    u.student_period,
    c.course_name as student_course
FROM user u
JOIN role r ON u.role_id = r.id
LEFT JOIN course c ON u.student_course_id = c.id
 WHERE google_id = %s
"""

INSERT_USER = """
INSERT INTO user (
    name,
    ra,
    email,
    phone,
    google_id,
    role_id,
    department,
    student_period,
    student_course_id
) 
VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
"""

UPDATE_USER_GOOGLE_ID = """
UPDATE user SET google_id = %s WHERE id = %s
"""

UPDATE_USER = """
UPDATE user SET 
    name = %s,
    email = %s,
    phone = %s,
    ra = %s,
    department = %s,
    student_period = %s,
    student_course_id = %s
WHERE id = %s
"""

