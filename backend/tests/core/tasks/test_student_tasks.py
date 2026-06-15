import pytest
from unittest.mock import patch
from fastapi import HTTPException

from core.schemas.process_schemas import ProcessResponse
from core.tasks.student_tasks import StudentTasks

@patch("core.tasks.student_tasks.StudentPort")
def test_get_process_details_by_id_success(mock_student_port):
    mock_data = {"id": 1, "sei_number": "123.456", "student_name": "Eduardo"}
    mock_student_port.get_process_details_by_id.return_value = mock_data
    
    result = StudentTasks.get_process_details_by_id(1)
    
    assert result == ProcessResponse.from_dict(mock_data)
    mock_student_port.get_process_details_by_id.assert_called_once_with(1)

def test_get_process_details_by_id_not_found():
    non_existent_id = 999999
    
    with pytest.raises(HTTPException) as exc:
        StudentTasks.get_process_details_by_id(non_existent_id)
        
    assert exc.value.status_code == 404
    assert exc.value.detail == "Processo não encontrado"
