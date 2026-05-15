from core.ports.admin_ports import AdminPort


class AdminTasks:
    @staticmethod
    def get_admin_processes_list() -> list[dict]:
        return AdminPort.get_admin_processes_list()
