from datetime import date

from core.ports.process_ports import ProcessPort


class ProcessTasks:
    @staticmethod
    def get_process_by_id(process_id: int) -> dict:
        return ProcessPort.get_process_by_id(process_id)

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
            status_id = 1,  # status_id provisório
            student_course_id = 1,  # student_course_id provisório
            internship_type_id = process_data['internship_type_id'],
            sei_number = process_data.get('sei_number'),
            start_date = process_data['start_date'],
            weekly_hours = process_data['weekly_hours']
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
            weekly_hours=process_data['weekly_hours']
        )

    @staticmethod
    def update_hour_goal(process_id: int, target_hours: int, forecast_date: date) -> dict:
        return ProcessPort.update_hour_goal(process_id, target_hours, forecast_date)

    @staticmethod
    def delete_process(process_id: int) -> bool:
        return ProcessPort.delete_process(process_id)