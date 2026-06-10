from unittest.mock import patch
from core.use_cases.student_use_cases import StudentUseCases

@patch("core.use_cases.student_use_cases.StudentTasks")
def test_get_process_details_by_id_use_case(mock_student_tasks):
    mock_student_tasks.get_process_details_by_id.return_value = {"id": 1}
    
    result = StudentUseCases.get_process_details_by_id(1)
    
    assert result == {"id": 1}
    mock_student_tasks.get_process_details_by_id.assert_called_once_with(1)