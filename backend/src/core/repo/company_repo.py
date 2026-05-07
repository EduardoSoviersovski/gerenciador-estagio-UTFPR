GET_COMPANY_BY_NAME_AND_SUPERVISOR = """
SELECT id, name, cnpj, supervisor_name, supervisor_email, supervisor_cpf
FROM company
WHERE name = %s \
  AND supervisor_name = %s \
"""

INSERT_COMPANY = """
INSERT INTO company (name, cnpj, supervisor_name, supervisor_email, supervisor_cpf) VALUES (%s, %s, %s, %s, %s)\
"""

UPDATE_COMPANY = """
UPDATE company SET name=%s, cnpj=%s, supervisor_name=%s, supervisor_email=%s, supervisor_cpf=%s WHERE id=%s
"""
