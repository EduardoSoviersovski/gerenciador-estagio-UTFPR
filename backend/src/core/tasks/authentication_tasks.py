from core.ports.authentication_ports import AuthenticationPorts
from core.ports.process_ports import ProcessPort
from core.schemas.role_schemas import UserRole
from core.exceptions.authentication_exceptions import (
    UnauthorizedEmailDomainError,
    MissingEmailError,
)
from core.schemas.email_schemas import AllowedEmailDomain


class AuthenticationTasks:
    @classmethod
    def verify_email_domain(cls, user_info: dict) -> None:
        email = cls._get_email_from_user_info(user_info)
        domain = email.split("@")[1]
        allowed_domains = {item.value for item in AllowedEmailDomain}

        if domain not in allowed_domains:
            raise UnauthorizedEmailDomainError(email)

    @classmethod
    def set_user_role(cls, user_info: dict) -> None:
        email = cls._get_email_from_user_info(user_info)
        known_emails = {
            "fernandaneto@alunos.utfpr.edu.br": UserRole.ADMIN.value,
            "gabrielgodinho@alunos.utfpr.edu.br": UserRole.ADVISOR.value,
        }
        if user_role := known_emails.get(email):
            user_info["role"] = user_role
            return

        is_student_email = AllowedEmailDomain.UTFPR_STUDENTS.value in email
        user_info["role"] = (
            UserRole.STUDENT.value if is_student_email else UserRole.ADVISOR.value
        )

    @classmethod
    def get_or_create_user(
        cls,
        name: str,
        email: str,
        phone: str,
        role_id: int,
        ra: str | None = None,
        google_id: str | None = None,
        advisor_department: str | None = None,
    ) -> dict:
        if existing_user := AuthenticationPorts.get_user_by_email(email):
            return  cls._update_google_id_if_needed(user=existing_user, google_id=google_id)

        return AuthenticationPorts.create_user(
            name=name,
            ra=ra,
            email=email,
            phone=phone,
            role_id=role_id,
            google_id=google_id,
            advisor_department=advisor_department
        )

    @staticmethod
    def _update_google_id_if_needed(user: dict, google_id: str | None) -> dict:
        current_google_id = user.get("google_id")
        new_google_is_provided = google_id is not None
        if current_google_id is None and new_google_is_provided:
            return AuthenticationPorts.update_user_google_id(
                user["id"], google_id
            )
        return user

    @staticmethod
    def _get_email_from_user_info(user_info: dict) -> str:
        if user_info is None or user_info.get("email") is None:
            raise MissingEmailError()

        return user_info.get("email", "")

    @classmethod
    def update_user(
        cls, user_id: int, name: str, email: str, phone: str | None, ra: str | None = None, department: str | None = None
    ) -> dict:
        return AuthenticationPorts.update_user(
            user_id=user_id, name=name, email=email, phone=phone, ra=ra, department=department
        )
