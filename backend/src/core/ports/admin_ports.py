from adapters.database.mysql_adapter import MySQLAdapter
from core.repo.admin_repo import GET_ALL_PROCESSES, GET_PROCESS_BY_ID, GET_ADVISOR_EMAILS, UPDATE_ADVISOR, GET_STUDENT_EMAILS, UPDATE_STUDENT_BY_EMAIL
from core.schemas.role_schemas import UserRoleId

adapter = MySQLAdapter()

class AdminPort:
    @staticmethod
    def get_admin_processes_list() -> list[dict]:
        return adapter.fetch_list(GET_ALL_PROCESSES)

    @staticmethod
    def get_process_by_id(process_id: int) -> dict:
        return adapter.fetch_one(GET_PROCESS_BY_ID, (process_id,))

    @staticmethod
    def get_advisor_emails() -> list[str]:
        advisor_emails = adapter.fetch_list(GET_ADVISOR_EMAILS, (UserRoleId.ADVISOR.value,))
        return [advisor_email["email"] for advisor_email in advisor_emails] if advisor_emails else []

    @classmethod
    def update_advisor(cls, current_email: str, new_name: str, new_email: str, new_phone: str, new_department: str) -> bool:
        adapter.execute_query(
                    UPDATE_ADVISOR, 
                    (new_name, new_email, new_phone, new_department, current_email)
                )
        return True

    @classmethod
    def get_student_emails(cls) -> list[str]:
        students_emails = adapter.fetch_list(GET_STUDENT_EMAILS, (UserRoleId.STUDENT.value,))
        return [row['email'] for row in students_emails]

    @classmethod
    def update_student(cls, current_email: str, data: dict) -> bool:
        try:
            adapter.execute_query(UPDATE_STUDENT_BY_EMAIL,
                (
                    data.get('name'), 
                    data.get('email'), 
                    data.get('phone'), 
                    data.get('ra'), 
                    data.get('student_course_id'), 
                    data.get('student_period'),   
                    current_email
                )
            )
            return True
        except Exception as e:
            return False