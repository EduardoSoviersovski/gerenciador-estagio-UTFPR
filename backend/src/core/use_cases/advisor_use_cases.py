from core.tasks.advisor_tasks import AdvisorTasks


class AdvisorUseCases:
    @staticmethod
    def get_advisor_student_processes_list(advisor_email: str) -> list[dict]:
        return AdvisorTasks.get_advisor_student_processes_list(advisor_email)
