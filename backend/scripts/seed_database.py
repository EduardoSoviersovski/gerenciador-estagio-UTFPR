import unicodedata
from faker import Faker
from adapters.database.mysql_adapter import MySQLAdapter
from core.repo.process_repo import INSERT_HOUR_GOAL
from scripts.seed_database_fixed_values import TEMPLATE_MAPPING, get_file_data
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
    SET_FOREIGN_KEY_CHECKS,
    INSERT_DOCUMENT_TYPE,
    INSERT_DOCUMENT_STATUS,
    INSERT_HOLIDAYS_2026, INSERT_DOCUMENT_TEMPLATE,
)

fake = Faker("pt_BR")
Faker.seed(42)


def remove_accent(texto):
    return "".join(
        c
        for c in unicodedata.normalize("NFD", texto)
        if unicodedata.category(c) != "Mn"
    )


def clear_database(db: MySQLAdapter):
    print("Cleaning tables...")
    tables = [
        "audit_log",
        "document_message",
        "document",
        "hour_goal",
        "internship_process",
        "document_template",
        "user",
        "role",
        "course",
        "company",
        "process_status",
        "document_status",
        "internship_type",
        "document_type",
        "holiday",
        "action",
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

    for role in ["STUDENT", "ADVISOR", "ADMIN"]:
        db.execute_query(INSERT_ROLE, (role,))

    for course in ["BSI", "EC"]:
        db.execute_query(INSERT_COURSE, (course,))

    for status in ["PENDING", "ACTIVE", "OVERDUE", "TERMINATED", "COMPLETED"]:
        db.execute_query(INSERT_PROCESS_STATUS, (status,))

    for i_type in ["MANDATORY", "NON_MANDATORY"]:
        db.execute_query(INSERT_INTERNSHIP_TYPE, (i_type,))

    for doc_status in ["PENDING", "REQUEST_CHANGES", "APPROVED", "REJECTED"]:
        db.execute_query(INSERT_DOCUMENT_STATUS, (doc_status,))

    doc_types = [
        ('student_partial_report_1', 'pdf'),
        ('supervisor_partial_report_1', 'pdf'),
        ('visit_report', 'pdf'),
        ('student_partial_report_2', 'pdf'),
        ('supervisor_partial_report_2', 'pdf'),
        ('final_report', 'pdf'),
        ('others', 'pdf'),
        ('internship_plan', 'pdf'),
        ('additive_plan', 'pdf'),
        ('rescision_plan', 'pdf'),
    ]

    print("Seeding document types...")
    for doc_name, doc_format in doc_types:
        db.execute_query(INSERT_DOCUMENT_TYPE, (doc_name, doc_format))

    print("Seeding document templates...")
    for doc_name, config in TEMPLATE_MAPPING.items():
        category = config["category"]
        doc_type_id = config["doc_type_id"]
        for file_path in config["templates"]:
            content, name, size, mime_type = get_file_data(file_path)
            db.execute_query(
                INSERT_DOCUMENT_TEMPLATE,
                (doc_type_id, content, name, size, mime_type, category)
            )

    for _ in range(3):
        db.execute_query(
            INSERT_COMPANY,
            (fake.company(), fake.cnpj(), fake.name(), fake.company_email()),
        )

    for _ in range(15):
        name = fake.name()
        email_name = remove_accent(name).replace(" ", ".").lower()

        role_id = fake.random_element(elements=[1, 1, 1, 1, 1, 2, 2, 3, 4])

        if role_id == 1:
            email = f"{email_name}@alunos.utfpr.edu.br"
            ra = fake.numerify(text="#######")
            department = None
        else:
            email = f"{email_name}@utfpr.edu.br"
            ra = None
            department = fake.random_element(
                elements=[
                    "DAINF",
                    "DAMAT",
                    "DAELN",
                    "DAFIS",
                    "DAELE",
                    "DAMEC",
                ]
            )

        phone = fake.phone_number()[:20]

        db.execute_query(
            INSERT_USER,
            (name, ra, email, phone, fake.unique.uuid4(), role_id, department),
        )

    users_inserted = db.fetch_list(SELECT_USERS)
    companies_inserted = db.fetch_list(SELECT_COMPANIES)
    courses_inserted = db.fetch_list(SELECT_COURSES)

    students = [u for u in users_inserted if u["role_id"] == 1]
    advisors = [u for u in users_inserted if u["role_id"] == 2]

    if students and advisors and companies_inserted and courses_inserted:
        for index in range(1, 6):
            student = fake.random_element(elements=students)
            advisor = fake.random_element(elements=advisors)
            company = fake.random_element(elements=companies_inserted)
            course = fake.random_element(elements=courses_inserted)

            start_date = fake.date_between(start_date="-1y", end_date="today")
            end_date = fake.date_between(start_date=start_date, end_date="today")
            db.execute_query(
                INSERT_INTERNSHIP_PROCESS,
                (
                    student["id"],
                    advisor["id"],
                    company["id"],
                    fake.random_element(elements=[1, 2, 3]),
                    course["id"],
                    fake.random_element(elements=[1, 2]),
                    fake.numerify(text="#####.######/####-##"),
                    start_date,
                    fake.random_int(min=20, max=40),
                    fake.random_int(min=2, max=10),
                ),
            )
            db.execute_query(
                INSERT_HOUR_GOAL,
                (index, fake.random_element(elements=[200, 400]), end_date),
            )

    print("Seed completed successfully!")


if __name__ == "__main__":
    seed_database()
