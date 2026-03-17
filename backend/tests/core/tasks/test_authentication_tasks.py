import pytest

from core.exceptions.authentication_exceptions import UnauthorizedEmailDomainError
from core.schemas.email_schemas import AllowedEmailDomain
from core.tasks.authentication_tasks import AuthenticationTasks


@pytest.mark.parametrize(
    "valid_domain",
    [
        AllowedEmailDomain.UTFPR.value,
        AllowedEmailDomain.UTFPR_STUDENTS.value,
    ],
    ids=[
        "verify-email-domain-valid-utfpr",
        "verify-email-domain-valid-utfpr-students",
    ],
)
def test_verify_email_domain_success(valid_domain: str) -> None:
    valid_email = f"user@{valid_domain}"
    user_info = {"email": valid_email}

    try:
        AuthenticationTasks.verify_email_domain(user_info)
    except Exception as e:
        pytest.fail(f"verify_email_domain levantou uma exceção inesperada: {e}")


@pytest.mark.parametrize(
    "invalid_domain",
    ["gmail.com.br", None, [AllowedEmailDomain.UTFPR.value]],
    ids=["gmail-com-br", "none", "list-with-utfpr-domain"],
)
def test_verify_email_domain_fail_raise(invalid_domain: str) -> None:
    valid_email = f"user@{invalid_domain}"
    user_info = {"email": valid_email}

    with pytest.raises(UnauthorizedEmailDomainError) as exc_info:
        AuthenticationTasks.verify_email_domain(user_info)


# def test_set_user_role_with_student_email() -> None:
#     user_info = {"email": "
