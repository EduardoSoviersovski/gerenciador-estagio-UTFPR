from core.ports.process_ports import ProcessPort


class ProcessTasks:
    @staticmethod
    def get_internship_type_id(category_name: str) -> int | None:
        result = ProcessPort.get_internship_id(category_name)

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
            weekly_hours = 30  # weekly_hours provisório
        )
