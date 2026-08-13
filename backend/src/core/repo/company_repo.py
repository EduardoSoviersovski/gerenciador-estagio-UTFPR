GET_COMPANY_BY_NAME_AND_SUPERVISOR = """
SELECT id, name, supervisor_name, supervisor_email
FROM company
WHERE name = %s \
  AND supervisor_name = %s \
"""

INSERT_COMPANY = """
INSERT INTO company (name, supervisor_name, supervisor_email) VALUES (%s, %s, %s)\
"""

UPDATE_COMPANY = """
UPDATE company SET name=%s, supervisor_name=%s, supervisor_email=%s WHERE id=%s
"""
