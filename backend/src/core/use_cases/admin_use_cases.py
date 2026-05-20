from core.schemas.process_schemas import ProcessResponse
from core.tasks.admin_tasks import AdminTasks


class AdminUseCases:
    @staticmethod
    def get_admin_processes_list() -> list[dict]:
        return AdminTasks.get_admin_processes_list()

    @staticmethod
    def get_process_by_id(process_id: int) -> ProcessResponse:
        return AdminTasks.get_process_by_id(process_id)
