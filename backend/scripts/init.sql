CREATE TABLE IF NOT EXISTS usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    google_id VARCHAR(255) UNIQUE NOT NULL,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    status_lgpd BOOLEAN DEFAULT FALSE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS perfil (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_perfil VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS usuario_perfil (
    usuario_id INT NOT NULL,
    perfil_id INT NOT NULL,
    PRIMARY KEY (usuario_id, perfil_id),
    FOREIGN KEY (usuario_id) REFERENCES usuario(id),
    FOREIGN KEY (perfil_id) REFERENCES perfil(id)
);

CREATE TABLE IF NOT EXISTS status_processo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS tipo_estagio (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS processo_estagio (
    id INT AUTO_INCREMENT PRIMARY KEY,
    aluno_id INT NOT NULL,
    orientador_id INT,
    status_id INT NOT NULL,
    tipo_estagio_id INT NOT NULL,
    numero_sei VARCHAR(20),
    empresa_email VARCHAR(100),
    data_inicio DATE,
    carga_horaria_semanal INT,
    FOREIGN KEY (aluno_id) REFERENCES usuario(id),
    FOREIGN KEY (orientador_id) REFERENCES usuario(id),
    FOREIGN KEY (status_id) REFERENCES status_processo(id),
    FOREIGN KEY (tipo_estagio_id) REFERENCES tipo_estagio(id)
);

CREATE TABLE IF NOT EXISTS meta_horas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    processo_id INT NOT NULL,
    total_horas_objetivo INT,
    data_previsao_fim DATE,
    ativa BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (processo_id) REFERENCES processo_estagio(id)
);

CREATE TABLE IF NOT EXISTS tipo_documento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    formato_aceito VARCHAR(10)
);

CREATE TABLE IF NOT EXISTS documento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    processo_id INT NOT NULL,
    tipo_documento_id INT NOT NULL,
    path_arquivo VARCHAR(255),
    data_upload TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (processo_id) REFERENCES processo_estagio(id),
    FOREIGN KEY (tipo_documento_id) REFERENCES tipo_documento(id)
);

CREATE TABLE IF NOT EXISTS feriado (
    id INT AUTO_INCREMENT PRIMARY KEY,
    data DATE NOT NULL,
    descricao VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS acao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_acao VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS log_auditoria (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    acao_id INT,
    tabela_afetada VARCHAR(50),
    registro_id INT,
    dado_anterior JSON,
    dado_novo JSON,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id),
    FOREIGN KEY (acao_id) REFERENCES acao(id)
);
