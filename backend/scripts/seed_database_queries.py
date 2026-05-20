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
        weekly_hours,
        student_period
    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
"""

SET_FOREIGN_KEY_CHECKS = "SET FOREIGN_KEY_CHECKS = %s"

INSERT_DOCUMENT_STATUS = "INSERT IGNORE INTO document_status (name) VALUES (%s)"

INSERT_HOLIDAYS_2026 = """
INSERT INTO holiday (date, description) VALUES
('2026-01-01', 'Confraternização Universal - Ano Novo'),
('2026-04-03', 'Paixão de Cristo - Sexta-feira Santa'),
('2026-04-21', 'Tiradentes - Dia de Tiradentes'),
('2026-05-01', 'Dia do Trabalho - Dia Mundial do Trabalho'),
('2026-09-07', 'Independência do Brasil - Dia da Independência'),
('2026-09-08', 'Nossa Senhora da Luz dos Pinhais - Padroeira de Curitiba'),
('2026-10-12', 'Nossa Senhora Aparecida - Padroeira do Brasil'),
('2026-11-02', 'Finados - Dia de Finados'),
('2026-11-20', 'Dia da Consciência Negra - Dia Nacional de Zumbi e da Consciência Negra'),
('2026-12-25', 'Natal - Nascimento de Jesus Cristo');
"""
