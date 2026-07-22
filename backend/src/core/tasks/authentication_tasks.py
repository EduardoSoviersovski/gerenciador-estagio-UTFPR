from core.ports.authentication_ports import AuthenticationPorts
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
    def get_or_create_user_from_auth(
        cls,
        name: str,
        email: str,
        role_id: int,
        phone: str | None = None,
        ra: str | None = None,
        google_id: str | None = None,
    ) -> dict:
        if existing_user := AuthenticationPorts.get_user_by_email(email):
            return cls._sync_google_data_on_login(
                user=existing_user,
                google_name=name,
                google_email=email,
                google_id=google_id
            )

        return AuthenticationPorts.create_user(
            name=name,
            ra=ra,
            email=email,
            phone=phone,
            role_id=role_id,
            google_id=google_id,
        )

    @classmethod
    def create_or_update_user_from_process(
        cls,
        name: str,
        email: str,
        phone: str,
        role_id: int,
        ra: str | None = None,
        advisor_department: str | None = None,
        student_period: int | None = None,
        student_course_id: int | None = None,
    ) -> dict:
        if existing_user := AuthenticationPorts.get_user_by_email(email):
            effective_name, effective_email = cls._get_effective_name_and_email(existing_user, name, email)
            return cls.update_user(
                user_id=existing_user["id"],
                name=effective_name,
                email=effective_email,
                phone=phone,
                ra=ra,
                department=advisor_department,
                student_period=student_period,
                student_course_id=student_course_id,
            )

        return AuthenticationPorts.create_user(
            name=name,
            ra=ra,
            email=email,
            phone=phone,
            role_id=role_id,
            advisor_department=advisor_department,
            student_period=student_period,
            student_course_id=student_course_id
        )

    @staticmethod
    def _get_effective_name_and_email(existing_user: dict, name: str, email: str) -> tuple[str, str]:
        if existing_user.get("google_id"):
            return existing_user.get("name"), existing_user.get("email")
        return name, email

    @classmethod
    def _sync_google_data_on_login(cls, user: dict, google_name: str, google_email: str, google_id: str | None) -> dict:
        current_google_id = user.get("google_id")

        needs_id_update = current_google_id is None and google_id is not None
        needs_data_sync = user.get("name") != google_name or user.get("email") != google_email

        if needs_id_update:
            user_updated = AuthenticationPorts.update_user_google_id(user["id"], google_id)
            user = user_updated

        if needs_data_sync:
            user = cls.update_user(
                user_id=user["id"],
                name=google_name,
                email=google_email,
                phone=user.get("phone"),
                ra=user.get("ra"),
                department=user.get("advisor_department") or user.get("department")
            )

        return user

    @staticmethod
    def _get_email_from_user_info(user_info: dict) -> str:
        if user_info is None or user_info.get("email") is None:
            raise MissingEmailError()

        return user_info.get("email", "")

    @classmethod
    def update_user(
        cls,
        user_id: int,
        name: str,
        email: str,
        phone: str | None,
        ra: str | None = None,
        department: str | None = None,
        student_period: int | None = None,
        student_course_id: int | None = None
    ) -> dict:
        return AuthenticationPorts.update_user(
            user_id=user_id, name=name, email=email, phone=phone, ra=ra, department=department, student_period=student_period, student_course_id=student_course_id
        )
