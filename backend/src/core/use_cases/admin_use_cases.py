from core.tasks.admin_tasks import AdminTasks


class AdminUseCases:
    @staticmethod
    def get_admin_processes_list() -> list[dict]:
        return AdminTasks.get_admin_processes_list()
