from core.schemas.process_schemas import CourseIds
from core.ports.admin_ports import AdminPort
from core.ports.authentication_ports import AuthenticationPorts
from core.schemas.role_schemas import StudentAdminUpdateRequest

class AdminTasks:
    @staticmethod
    def get_admin_processes_list() -> list[dict]:
        return AdminPort.get_admin_processes_list()

    @staticmethod
    def get_process_by_id(process_id: int) -> dict:
        return AdminPort.get_process_by_id(process_id)

    @staticmethod
    def get_advisor_emails() -> list[str]:
        return AdminPort.get_advisor_emails()
    
    @staticmethod
    def update_advisor(current_email: str, request_data) -> bool:
        new_name = request_data.name
        new_email = request_data.email
        new_phone = request_data.phone
        new_department = request_data.department

        AdminTasks._validate_name_email_update(
            current_email=current_email,
            new_name=new_name,
            new_email=new_email,
            not_found_message="Advisor not found"
        )
        success = AdminPort.update_advisor(
            current_email=current_email,
            new_name=new_name,
            new_email=new_email,
            new_phone=new_phone,
            new_department=new_department
        )
        
        if not success:
            raise ValueError("Não foi possível salvar as alterações no banco de dados.")
            
        return True

    @staticmethod
    def get_student_emails() -> list[str]:
        return AdminPort.get_student_emails()

    @classmethod
    def update_student(cls, current_email: str, request_data: StudentAdminUpdateRequest) -> None:
        new_name = request_data.name
        new_email = request_data.email

        cls._validate_name_email_update(
            current_email=current_email,
            new_name=new_name,
            new_email=new_email,
            not_found_message="Student not found."
        )

        data_to_update = request_data.to_dict()

        if request_data.student_course:
            course_abbreviation = request_data.student_course.value
            data_to_update["student_course"] = CourseIds[course_abbreviation].value

        AdminPort.update_student(
            current_email=current_email,
            data=data_to_update
        )


    @staticmethod
    def _validate_name_email_update(current_email: str, new_name: str, new_email: str, not_found_message: str) -> dict:
        current_user = AuthenticationPorts.get_user_by_email(current_email)

        if not current_user:
            raise ValueError(not_found_message)

        is_google_linked = bool(current_user.get("google_id"))

        if is_google_linked:
            if new_email != current_email or new_name != current_user.get("name"):
                raise ValueError("Usuários vinculados ao Google não podem ter o nome ou e-mail alterados.")
        else:
            if current_email != new_email:
                existing_user = AuthenticationPorts.get_user_by_email(new_email)
                if existing_user:
                    raise ValueError("O novo e-mail escolhido já está em uso por outro usuário no sistema.")

        return current_user
