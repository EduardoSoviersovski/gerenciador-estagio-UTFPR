from core.ports.authentication_ports import AuthenticationPorts
from core.schemas.process_schemas import ProcessResponse
from core.tasks.admin_tasks import AdminTasks


class AdminUseCases:
    @staticmethod
    def get_admin_processes_list() -> list[dict]:
        return AdminTasks.get_admin_processes_list()

    @staticmethod
    def get_process_by_id(process_id: int) -> dict:
        return AdminTasks.get_process_by_id(process_id)

    @staticmethod
    def get_user_by_email(email: str) -> dict | None:
        return AuthenticationPorts.get_user_by_email(email)

    @staticmethod
    def get_advisor_emails() -> list[str]:
        return AdminTasks.get_advisor_emails()
    
    @staticmethod
    def update_advisor(current_email: str, request_data):
        return AdminTasks.update_advisor(current_email, request_data)
