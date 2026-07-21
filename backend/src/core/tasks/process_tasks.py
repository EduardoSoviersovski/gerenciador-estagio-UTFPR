from datetime import date
from fastapi import HTTPException, status

from core.exceptions.database_exceptions import ProcessNotFoundError
from core.ports.process_ports import ProcessPort
from core.schemas.role_schemas import User, UserRole


class ProcessTasks:
    @staticmethod
    def get_process_by_id(process_id: int) -> dict:
        if not (process := ProcessPort.get_process_by_id(process_id)):
            raise ProcessNotFoundError(process_id=process_id)
        return process

    @staticmethod
    def get_internship_type_id(category_name: str) -> int | None:
        result = ProcessPort.get_internship_type_id(category_name)

        return result.get('id') if result else None

    @staticmethod
    def create_internship_process(process_data: dict) -> dict:
        return ProcessPort.insert_internship_process(
            student_id = process_data['student_id'],
            advisor_id = process_data['advisor_id'],
            company_id = process_data['company_id'],
            status_id = 1,
            student_course_id = process_data["student_course_id"],
            internship_type_id = process_data['internship_type_id'],
            sei_number = process_data.get('sei_number'),
            start_date = process_data['start_date'],
            weekly_hours = process_data['weekly_hours'],
            student_period = process_data['student_period'],
        )

    @staticmethod
    def create_hour_goal(process_id: int, target_hours: int, forecast_date: date) -> dict:
        return ProcessPort.create_hour_goal(process_id, target_hours, forecast_date)

    @staticmethod
    def update_process(process_id: int, process_data: dict) -> dict:
        return ProcessPort.update_internship_process(
            process_id=process_id,
            internship_type_id=process_data['internship_type_id'],
            sei_number=process_data.get('sei_number'),
            start_date=process_data['start_date'],
            weekly_hours=process_data['weekly_hours'],
            advisor_id=process_data['advisor_id'],
            student_id=process_data['student_id'],
        )

    @staticmethod
    def update_hour_goal(process_id: int, target_hours: int, forecast_date: date) -> dict:
        return ProcessPort.update_hour_goal(process_id, target_hours, forecast_date)

    @staticmethod
    def delete_process(process_id: int) -> bool:
        return ProcessPort.delete_process(process_id)
    
    @classmethod
    def verify_process_access(cls, process_id: int, current_user: User) -> None:
        process = cls.get_process_by_id(process_id)

        role = current_user.user_role.name.lower()
        if role == UserRole.ADMIN.value:
            return

        role_validation_rules = {
            UserRole.STUDENT.value: (
                lambda: process.get("student_id") == current_user.id,
                "Acesso negado: Você não tem permissão para acessar os documentos deste processo."
            ),
            UserRole.ADVISOR.value: (
                lambda: process.get("advisor_id") == current_user.id,
                "Acesso negado: Você não é o orientador vinculado a este processo."
            )
        }

        is_authorized, error_msg = role_validation_rules[role]

        if not is_authorized():
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=error_msg
            )
