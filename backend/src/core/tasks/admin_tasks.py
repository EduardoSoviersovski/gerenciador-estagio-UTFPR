from core.ports.admin_ports import AdminPort


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
