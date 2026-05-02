CREATE TABLE IF NOT EXISTS role (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS course (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_name VARCHAR(5) NOT NULL
);

CREATE TABLE IF NOT EXISTS company (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    cnpj VARCHAR(20),
    supervisor_name VARCHAR(100),
    supervisor_cpf VARCHAR(15),
    supervisor_email VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS process_status (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS document_status (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS internship_type (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS document_type (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    accepted_format VARCHAR(10)
);

CREATE TABLE IF NOT EXISTS holiday (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    description VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS action (
    id INT AUTO_INCREMENT PRIMARY KEY,
    action_code INT NOT NULL,
    action_name VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    ra VARCHAR(20) UNIQUE,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    google_id VARCHAR(255) UNIQUE,
    role_id INT NOT NULL,
    FOREIGN KEY (role_id) REFERENCES role(id)
);

CREATE TABLE IF NOT EXISTS document_template (
    id INT AUTO_INCREMENT PRIMARY KEY,
    document_type_id INT NOT NULL,
    file_content MEDIUMBLOB NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    FOREIGN KEY (document_type_id) REFERENCES document_type(id)
);

CREATE TABLE IF NOT EXISTS internship_process (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    advisor_id INT NOT NULL,
    company_id INT NOT NULL,
    status_id INT NOT NULL,
    student_course_id INT NOT NULL,
    internship_type_id INT NOT NULL,
    sei_number VARCHAR(20),
    start_date DATE NOT NULL,
    weekly_hours INT NOT NULL,
    FOREIGN KEY (student_id) REFERENCES user(id),
    FOREIGN KEY (advisor_id) REFERENCES user(id),
    FOREIGN KEY (company_id) REFERENCES company(id),
    FOREIGN KEY (status_id) REFERENCES process_status(id),
    FOREIGN KEY (student_course_id) REFERENCES course(id),
    FOREIGN KEY (internship_type_id) REFERENCES internship_type(id)
);

CREATE TABLE IF NOT EXISTS hour_goal (
    id INT AUTO_INCREMENT PRIMARY KEY,
    process_id INT NOT NULL,
    total_target_hours INT NOT NULL,
    end_date_forecast DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (process_id) REFERENCES internship_process(id)
);

CREATE TABLE IF NOT EXISTS document (
    id INT AUTO_INCREMENT PRIMARY KEY,
    process_id INT NOT NULL,
    document_type_id INT NOT NULL,
    status_id INT NOT NULL,
    file_content LONGBLOB NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    upload_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (process_id) REFERENCES internship_process(id),
    FOREIGN KEY (document_type_id) REFERENCES document_type(id),
    FOREIGN KEY (status_id) REFERENCES document_status(id)
);

CREATE TABLE IF NOT EXISTS document_message (
    id INT AUTO_INCREMENT PRIMARY KEY,
    document_id INT NOT NULL,
    message VARCHAR(255) NOT NULL,
    send_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (document_id) REFERENCES document(id)
);

CREATE TABLE IF NOT EXISTS audit_log (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    action_id INT NOT NULL,
    affected_table VARCHAR(50) NOT NULL,
    record_id INT NOT NULL,
    old_data JSON,
    new_data JSON,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (action_id) REFERENCES action(id)
);

