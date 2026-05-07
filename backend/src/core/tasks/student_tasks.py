from core.ports.student_port import StudentPort


class StudentTasks:
    @staticmethod
    def get_student_process(ra: str) -> dict:
        return StudentPort.get_student_process(ra)

    @staticmethod
    def get_student_reports(ra: str) -> list[dict]:
        return StudentPort.get_student_reports(ra)

