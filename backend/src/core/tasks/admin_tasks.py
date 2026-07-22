from core.ports.admin_ports import AdminPort
from core.ports.authentication_ports import AuthenticationPorts


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

        current_user = AuthenticationPorts.get_user_by_email(current_email)
        
        if not current_user:
            raise ValueError("Orientador não encontrado.")

        is_google_linked = bool(current_user.get("google_id"))

        if is_google_linked:
            if new_email != current_email or new_name != current_user.get("name"):
                raise ValueError("Usuários vinculados ao Google não podem ter o nome ou e-mail alterados.")
        else:
            if current_email != new_email:
                existing_user = AuthenticationPorts.get_user_by_email(new_email)
                if existing_user:
                    raise ValueError("O novo e-mail escolhido já está em uso por outro usuário no sistema.")

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
