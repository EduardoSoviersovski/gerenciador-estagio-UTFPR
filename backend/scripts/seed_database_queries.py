INSERT_PROFILE = "INSERT IGNORE INTO perfil (nome_perfil) VALUES (%s)"

INSERT_STATUS_PROCESS = "INSERT IGNORE INTO status_processo (nome) VALUES (%s)"

INSERT_INTERNSHIP_TYPE = "INSERT IGNORE INTO tipo_estagio (nome) VALUES (%s)"

INSERT_USER = ("""
    INSERT IGNORE INTO 
        usuario (google_id, nome, email, status_lgpd)
    VALUES (%s,%s,%s,%s)
""")

SELECT_USERS = "SELECT id FROM usuario"

SELECT_PROFILES = "SELECT id FROM perfil"

INSERT_USER_PROFILE = "INSERT IGNORE INTO usuario_perfil (usuario_id, perfil_id) VALUES (%s, %s)"

INSERT_INTERNSHIP_PROCESS = ("""
   INSERT INTO processo_estagio (
        aluno_id,
        orientador_id,
        status_id,
        tipo_estagio_id,
        numero_sei,
        data_inicio,
        carga_horaria_semanal
    ) VALUES (%s, %s, %s, %s, %s, %s, %s)
""")

SET_FOREING_KEY_CHECKS = "SET FOREIGN_KEY_CHECKS = %s"
