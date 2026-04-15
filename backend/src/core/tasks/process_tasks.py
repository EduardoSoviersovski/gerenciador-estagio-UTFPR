from core.ports.process_ports import ProcessPort


class ProcessTasks:
    @staticmethod
    def get_or_create_user(
        name: str,
        email: str,
        phone: str,
        role_id: int,
        ra: str | None = None,
        google_id: str | None = None,
    ) -> dict:
        user = ProcessPort.get_user_by_email(email)

        if user:
            return user

        new_user = ProcessPort.insert_user(name, ra, email, phone, role_id, google_id)
        return new_user

    @staticmethod
    def get_internship_type_id(category_name: str) -> int | None:
        result = ProcessPort.get_internship_id(category_name)

        return result.get('id') if result else None

    @staticmethod
    def create_internship_process(process_data: dict) -> None:
        params = (
            process_data['student_id'],
            process_data['advisor_id'],
            1,  # company_id provisório
            1,  # status_id provisório
            1,  # student_course_id provisório
            process_data['internship_type_id'],
            process_data.get('sei_number'),
            process_data['start_date'],
            30  # weekly_hours provisório
        )
        return ProcessPort.insert_internship_process(params)
