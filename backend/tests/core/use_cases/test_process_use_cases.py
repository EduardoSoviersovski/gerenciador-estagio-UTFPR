from datetime import date
from unittest.mock import MagicMock

from core.ports.authentication_ports import AuthenticationPorts
from core.schemas.process_schemas import Department, UpdateProcessRequest, ProcessCategory
from core.schemas.role_schemas import UserRoleId
from core.tasks.authentication_tasks import AuthenticationTasks
from core.use_cases.process_use_cases import ProcessUseCases


def test_create_new_process_success_and_creates_new_users():
    mock_request = MagicMock()
    mock_request.student_name = "Eduardo Silva"
    mock_request.student_email = "eduardo@alunos.utfpr.edu.br"
    mock_request.student_phone = "41999999999"
    mock_request.student_ra = "1234567"
    mock_request.student_course = "BSI"
    mock_request.student_period = 5

    mock_request.advisor_name = "Adolfo Gustavo"
    mock_request.advisor_email = "adolfo@utfpr.edu.br"
    mock_request.advisor_phone = "41888888888"
    mock_request.advisor_department = Department.DAINF
    mock_request.internship_type.value = "NON_MANDATORY"
    mock_request.sei_number = "1234.5678/2026-90"
    mock_request.start_date = "2026-08-01"

    mock_request.company_name = "Tech Solutions Ltda"
    mock_request.company_cnpj = "12.345.678/0001-90"
    mock_request.supervisor_name = "Maria Oliveira"
    mock_request.supervisor_email = "maria@email.com"
    mock_request.supervisor_cpf = "123.456.789-00"
    mock_request.weekly_hours = 30
    mock_request.target_hours = 400

    result = ProcessUseCases.create_new_process(mock_request)


    assert result["sei_number"] == mock_request.sei_number

    student = AuthenticationPorts.get_user_by_email("eduardo@alunos.utfpr.edu.br")
    assert student["name"] == "Eduardo Silva"
    assert student["email"] == "eduardo@alunos.utfpr.edu.br"
    assert student["phone"] == "41999999999"
    assert student["ra"] == "1234567"
    assert student["role"] == "student"
    assert student["google_id"] is None
    assert student["department"] is None

    advisor = AuthenticationPorts.get_user_by_email("adolfo@utfpr.edu.br")
    assert advisor["name"] == "Adolfo Gustavo"
    assert advisor["email"] == "adolfo@utfpr.edu.br"
    assert advisor["phone"] == "41888888888"
    assert advisor["department"] == Department.DAINF.value
    assert advisor["role"] == "advisor"
    assert advisor["google_id"] is None
    assert advisor["ra"] is None


def test_create_new_process_updates_existing_users_from_login():
    AuthenticationTasks.get_or_create_user_from_auth(
        name="Eduardo Login", email="edu_login@alunos.utfpr.edu.br",
        role_id=UserRoleId.STUDENT.value, google_id="google-edu-123"
    )
    AuthenticationTasks.get_or_create_user_from_auth(
        name="Adolfo Login", email="adolfo_login@utfpr.edu.br",
        role_id=UserRoleId.ADVISOR.value, google_id="google-adolfo-456"
    )

    mock_request = MagicMock()
    mock_request.student_name = "Eduardo Login"
    mock_request.student_email = "edu_login@alunos.utfpr.edu.br"
    mock_request.student_phone = "41999999999"
    mock_request.student_ra = "7654321"
    mock_request.student_course = "BSI"
    mock_request.student_period = 5

    mock_request.advisor_name = "Adolfo Login"
    mock_request.advisor_email = "adolfo_login@utfpr.edu.br"
    mock_request.advisor_phone = "41888888888"
    mock_request.advisor_department = Department.DAINF

    mock_request.internship_type.value = "NON_MANDATORY"
    mock_request.sei_number = "9999.9999/2026-90"
    mock_request.start_date = "2026-08-01"
    mock_request.company_name = "Company"
    mock_request.company_cnpj = "12.345.678/0001-90"
    mock_request.supervisor_name = "Supervisor"
    mock_request.supervisor_email = "super@email.com"
    mock_request.supervisor_cpf = "123.456.789-00"
    mock_request.weekly_hours = 30
    mock_request.target_hours = 400

    ProcessUseCases.create_new_process(mock_request)

    student = AuthenticationPorts.get_user_by_email("edu_login@alunos.utfpr.edu.br")
    assert student["name"] == "Eduardo Login"
    assert student["email"] == "edu_login@alunos.utfpr.edu.br"
    assert student["role"] == "student"
    assert student["google_id"] == "google-edu-123"
    assert student["ra"] == "7654321"
    assert student["phone"] == "41999999999"
    assert student["department"] is None

    advisor = AuthenticationPorts.get_user_by_email("adolfo_login@utfpr.edu.br")
    assert advisor["name"] == "Adolfo Login"
    assert advisor["email"] == "adolfo_login@utfpr.edu.br"
    assert advisor["role"] == "advisor"
    assert advisor["google_id"] == "google-adolfo-456"
    assert advisor["department"] == Department.DAINF.value
    assert advisor["phone"] == "41888888888"
    assert advisor["ra"] is None

def test_update_process_updates_advisor_info():
    mock_request_initial = MagicMock()
    mock_request_initial.student_name = "Eduardo Login"
    mock_request_initial.student_email = "edu_login@alunos.utfpr.edu.br"
    mock_request_initial.student_phone = "41999999999"
    mock_request_initial.student_ra = "7654321"
    mock_request_initial.student_course = "BSI"
    mock_request_initial.student_period = 5

    mock_request_initial.advisor_name = "Adolfo Login"
    mock_request_initial.advisor_email = "adolfo_login@utfpr.edu.br"
    mock_request_initial.advisor_phone = "41888888888"
    mock_request_initial.advisor_department = Department.DAINF

    mock_request_initial.internship_type.value = "NON_MANDATORY"
    mock_request_initial.sei_number = "9999.9999/2026-90"
    mock_request_initial.start_date = "2026-08-01"
    mock_request_initial.company_name = "Company"
    mock_request_initial.company_cnpj = "12.345.678/0001-90"
    mock_request_initial.supervisor_name = "Supervisor"
    mock_request_initial.supervisor_email = "super@email.com"
    mock_request_initial.supervisor_cpf = "123.456.789-00"
    mock_request_initial.weekly_hours = 30
    mock_request_initial.target_hours = 400

    process = ProcessUseCases.create_new_process(mock_request_initial)
    process_id = process["id"]

    update_data = UpdateProcessRequest(
        student_name="Eduardo Silva",
        student_email="edu@utfpr.edu.br",
        student_ra="1235671",
        student_period=5,
        advisor_name="Novo Orientador",
        advisor_email="novo.orientador@utfpr.edu.br",
        advisor_department=Department.DAINF,
        start_date=date(2026, 8, 1),
        internship_type=ProcessCategory.NON_MANDATORY,
        company_name="Empresa",
        supervisor_name="Maria",
        supervisor_email="maria@empresa.com",
        weekly_hours=30,
        target_hours=400
    )

    updated_process = ProcessUseCases.update_process(process_id, update_data)
    new_advisor = AuthenticationPorts.get_user_by_email("novo.orientador@utfpr.edu.br")
    old_advisor = AuthenticationPorts.get_user_by_email("adolfo_login@utfpr.edu.br")

    assert updated_process["advisor_id"] == new_advisor["id"]
    assert new_advisor["name"] == "Novo Orientador"
    assert old_advisor["name"] == "Adolfo Login"
