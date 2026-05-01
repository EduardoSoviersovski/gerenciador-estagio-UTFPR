import unicodedata
from faker import Faker
from adapters.database.mysql_adapter import MySQLAdapter
from scripts.seed_database_queries import (
    INSERT_ROLE,
    INSERT_COURSE,
    INSERT_COMPANY,
    INSERT_PROCESS_STATUS,
    INSERT_INTERNSHIP_TYPE,
    INSERT_USER,
    SELECT_USERS,
    SELECT_COMPANIES,
    SELECT_COURSES,
    INSERT_INTERNSHIP_PROCESS,
    SET_FOREIGN_KEY_CHECKS, INSERT_DOCUMENT_TYPE,
)

fake = Faker('pt_BR')
Faker.seed(42)


def remove_accent(texto):
    return "".join(c for c in unicodedata.normalize('NFD', texto) if unicodedata.category(c) != 'Mn')


def clear_database(db: MySQLAdapter):
    print("Cleaning tables...")
    tables = [
        "audit_log", "document_message", "document", "hour_goal",
        "internship_process", "document_template", "user",
        "role", "course", "company", "process_status",
        "document_status", "internship_type", "document_type",
        "holiday", "action"
    ]

    db.execute_query(SET_FOREIGN_KEY_CHECKS, (0,))
    for table in tables:
        db.execute_query(f"DELETE FROM {table}")
        db.execute_query(f"ALTER TABLE {table} AUTO_INCREMENT = 1")
    db.execute_query(SET_FOREIGN_KEY_CHECKS, (1,))
    print("Database cleaned successfully!")


def seed_database():
    db = MySQLAdapter()

    clear_database(db)
    print("Initializing seed...")

    for role in ['STUDENT', 'ADVISOR', 'ADMIN']:
        db.execute_query(INSERT_ROLE, (role,))

    for course in ['BSI', 'EC']:
        db.execute_query(INSERT_COURSE, (course,))

    for status in ['PENDING', 'ACTIVE', 'OVERDUE', 'TERMINATED', 'COMPLETED']:
        db.execute_query(INSERT_PROCESS_STATUS, (status,))

    for i_type in ['MANDATORY', 'NON_MANDATORY']:
        db.execute_query(INSERT_INTERNSHIP_TYPE, (i_type,))

    for doc_name, doc_format in [
        ('partial_report', 'jpg'),
        ('final_report', 'pdf'),
        ('internship_agreement', 'pdf')
    ]:
        db.execute_query(INSERT_DOCUMENT_TYPE, (doc_name, doc_format))

    for _ in range(3):
        db.execute_query(INSERT_COMPANY, (
            fake.company(),
            fake.cnpj(),
            fake.name(),
            fake.company_email()
        ))

    for _ in range(15):
        name = fake.name()
        email_name = remove_accent(name).replace(' ', '.').lower()

        role_id = fake.random_element(elements=[1, 1, 1, 1, 1, 2, 2, 3, 4])

        if role_id == 1:
            email = f"{email_name}@alunos.utfpr.edu.br"
            ra = fake.numerify(text="#######")
        else:
            email = f"{email_name}@utfpr.edu.br"
            ra = None

        phone = fake.phone_number()[:20]

        db.execute_query(INSERT_USER, (
            name,
            ra,
            email,
            phone,
            fake.unique.uuid4(),
            role_id
        ))

    users_inserted = db.fetch_list(SELECT_USERS)
    companies_inserted = db.fetch_list(SELECT_COMPANIES)
    courses_inserted = db.fetch_list(SELECT_COURSES)

    students = [u for u in users_inserted if u['role_id'] == 1]
    advisors = [u for u in users_inserted if u['role_id'] == 2]

    if students and advisors and companies_inserted and courses_inserted:
        for _ in range(5):
            student = fake.random_element(elements=students)
            advisor = fake.random_element(elements=advisors)
            company = fake.random_element(elements=companies_inserted)
            course = fake.random_element(elements=courses_inserted)

            db.execute_query(
                INSERT_INTERNSHIP_PROCESS,
                (
                    student['id'],
                    advisor['id'],
                    company['id'],
                    fake.random_element(elements=[1, 2, 3]),
                    course['id'],
                    fake.random_element(elements=[1, 2]),
                    fake.numerify(text="#####.######/####-##"),
                    fake.date_between(start_date='-1y', end_date='today'),
                    fake.random_int(min=20, max=40)
                )
            )

    print("Seed completed successfully!")


if __name__ == "__main__":
    seed_database()