import os

import unicodedata
from faker import Faker
from src.adapters.driven.database.mysql_adapter import MySQLAdapter
from scripts.seed_database_queries import (
    INSERT_PROFILE,
    INSERT_STATUS_PROCESS,
    INSERT_INTERNSHIP_TYPE,
    INSERT_USER,
    SELECT_USERS,
    SELECT_PROFILES,
    INSERT_USER_PROFILE,
    INSERT_INTERNSHIP_PROCESS,
    SET_FOREING_KEY_CHECKS,
)

fake = Faker('pt_BR')
Faker.seed(42)

def remove_accent(texto):
    return "".join(c for c in unicodedata.normalize('NFD', texto) if unicodedata.category(c) != 'Mn')


def clear_database(db: MySQLAdapter):
    print("Cleaning tables...")
    tables = [
        "log_auditoria", "documento", "meta_horas", "processo_estagio",
        "usuario_perfil", "usuario", "perfil", "status_processo",
        "tipo_estagio", "tipo_documento", "feriado", "acao"
    ]

    db.execute_query(SET_FOREING_KEY_CHECKS, (0,))
    for table in tables:
        db.execute_query(f"DELETE FROM {table}")
        db.execute_query(f"ALTER TABLE {table} AUTO_INCREMENT = 1")
    db.execute_query(SET_FOREING_KEY_CHECKS, (1,))
    print("Database cleaned successfully!")


def seed_database():
    database_url = os.getenv("DATABASE_URL", "mysql+pymysql://<user>:<password>@localhost/sisprae_db")
    db = MySQLAdapter(database_url)

    clear_database(db)
    print("Initializing seed...")

    for profile in ['Administrador', 'Coordenador', 'Orientador', 'Aluno']:
        db.execute_query(INSERT_PROFILE, (profile,))
    for status in ['Em Aberto', 'Aguardando Assinatura', 'Finalizado', 'Cancelado']:
        db.execute_query(INSERT_STATUS_PROCESS, (status,))
    for type in ['Obrigatório', 'Não Obrigatório']:
        db.execute_query(INSERT_INTERNSHIP_TYPE, (type,))

    for _ in range(10):
        name = fake.name()
        if ". " in name:
            email_name, domain = name.split(". ", 1)[1], "utfpr.edu.br"
        else:
            email_name, domain = name, "alunos.utfpr.edu.br"
        email = f"{remove_accent(email_name).replace(' ', '.').lower()}@{domain}"
        db.execute_query(INSERT_USER, (fake.unique.uuid4(), name, email, True))

    users_inserted = db.fetch_list(SELECT_USERS)
    profiles_inserted = db.fetch_list(SELECT_PROFILES)

    for user in users_inserted:
        perfil_id = fake.random_element(elements=[p['id'] for p in profiles_inserted])
        db.execute_query(INSERT_USER_PROFILE, (user['id'], perfil_id))

    if len(users_inserted) >= 2:
        for _ in range(5):
            student = fake.random_element(elements=users_inserted)
            advisor = fake.random_element(elements=users_inserted)
            db.execute_query(
                INSERT_INTERNSHIP_PROCESS,
                (
                    student['id'], advisor['id'],
                    fake.random_element(elements=[1, 2, 3]),
                    fake.random_element(elements=[1, 2]),
                    fake.numerify(text="#####.######/####-##"),
                    fake.date_between(start_date='-1y', end_date='today'),
                    fake.random_int(min=20, max=40)
                )
            )

    print("Seed completed successfully!")


if __name__ == "__main__":
    seed_database()