GET_USER_BY_EMAIL = """
SELECT
    u.id,
    u.name,
    u.ra,
    u.email,
    u.phone,
    u.google_id,
    LOWER(r.role_name) as role
FROM user u
JOIN role r ON u.role_id = r.id
WHERE u.email = %s
"""

GET_USER_BY_GOOGLE_ID = """
SELECT
    id,
    name,
    ra,
    email,
    phone,
    google_id,
    role_id
FROM user WHERE google_id = %s
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

UPDATE_USER_GOOGLE_ID = """
UPDATE user SET google_id = %s WHERE id = %s
"""
