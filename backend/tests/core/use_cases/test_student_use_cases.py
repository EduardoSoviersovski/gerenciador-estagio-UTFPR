import datetime
from unittest.mock import patch, MagicMock

import pytest
from fastapi import HTTPException

from core.schemas.process_schemas import Department
from core.use_cases.student_use_cases import StudentUseCases
from core.use_cases.process_use_cases import ProcessUseCases


@patch("core.use_cases.student_use_cases.StudentTasks")
def test_get_process_details_by_id_use_case(mock_student_tasks):
    mock_student_tasks.get_process_details_by_id.return_value = {"id": 1}
    
    result = StudentUseCases.get_process_details_by_id(1)
    
    assert result == {"id": 1}
    mock_student_tasks.get_process_details_by_id.assert_called_once_with(1)


def test_get_process_details_by_id_integration():
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
    mock_request.start_date = datetime.date(2026, 8, 1)

    mock_request.company_name = "Tech Solutions Ltda"
    mock_request.company_cnpj = "12.345.678/0001-91"
    mock_request.supervisor_name = "Maria Oliveira"
    mock_request.supervisor_email = "maria@email.com"
    mock_request.supervisor_cpf = "123.456.789-01"
    mock_request.weekly_hours = 30
    mock_request.target_hours = 400

    created_process = ProcessUseCases.create_new_process(mock_request)
    ProcessUseCases.create_hour_goal(
        created_process["id"], mock_request.weekly_hours, mock_request.target_hours, mock_request.start_date
    )
    process_id = created_process["id"]

    result = StudentUseCases.get_process_details_by_id(process_id)

    assert result is not None
    assert result.process.id == process_id
    assert result.process.sei_number == mock_request.sei_number
    assert result.process.start_date == datetime.date(2026, 8, 1)
    assert result.process.weekly_hours == mock_request.weekly_hours
    assert result.process.target_hours == mock_request.target_hours
    assert result.process.status == "PENDING"

    assert result.student.period == mock_request.student_period
    assert result.student.name == mock_request.student_name
    assert result.student.email == mock_request.student_email
    assert result.student.phone == mock_request.student_phone
    assert result.student.ra == mock_request.student_ra

    assert result.process.advisor_name == mock_request.advisor_name
    assert result.process.advisor_email == mock_request.advisor_email
    assert result.process.advisor_phone == mock_request.advisor_phone
    assert result.process.advisor_department == mock_request.advisor_department.value

    assert result.process.company.name == mock_request.company_name
    assert result.process.company.company_cnpj == mock_request.company_cnpj

    assert result.process.company.supervisor == mock_request.supervisor_name
    assert result.process.company.supervisor_email == mock_request.supervisor_email
    assert result.process.company.supervisor_cpf == mock_request.supervisor_cpf

def test_get_process_details_by_id_not_found_integration():

    non_existent_id = 9999999

    with pytest.raises(HTTPException) as exc_info:
        StudentUseCases.get_process_details_by_id(non_existent_id)

    assert exc_info.value.status_code == 404
    assert exc_info.value.detail == "Processo não encontrado"
