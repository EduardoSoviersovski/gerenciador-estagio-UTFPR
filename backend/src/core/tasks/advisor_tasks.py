from core.ports.advisor_ports import AdvisorPort


class AdvisorTasks:
    @staticmethod
    def get_advisor_student_processes_list(advisor_email: str) -> list[dict]:
        return AdvisorPort.get_advisor_student_processes_list(advisor_email)
