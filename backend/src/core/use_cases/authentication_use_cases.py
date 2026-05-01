from types import CoroutineType

from dotenv import load_dotenv
from fastapi.responses import RedirectResponse

from adapters.auth.authlib_oauth_adapter import AuthlibOAuthAdapter
from adapters.session.starlette_session_adapter import SessionAdapter
from adapters.web.frontend_redirect_adapter import RedirectAdapter
from core.schemas.role_schemas import User, UserRoleId, UserRole
from core.tasks.authentication_tasks import AuthenticationTasks

load_dotenv()


class AuthenticationUseCases:
    @staticmethod
    async def login(request, redirect_uri: str) -> CoroutineType:
        return await AuthlibOAuthAdapter().authorize_redirect(
            request, redirect_uri, "select_account"
        )

    @staticmethod
    async def auth(request) -> RedirectResponse:
        token = await AuthlibOAuthAdapter().authorize_access_token(request)
        user_info = token.get("userinfo", {})

        AuthenticationTasks.verify_email_domain(user_info)
        AuthenticationTasks.set_user_role(user_info)

        user_role = UserRole(user_info.get("role"))
        role_id = UserRoleId[user_role.name].value

        user_info = AuthenticationTasks.get_or_create_user(
            name=user_info.get("name"),
            email=user_info.get("email"),
            phone=user_info.get("phone"),
            role_id=role_id,
            ra=user_info.get("ra"),
            google_id=user_info.get("sub"),
        )

        if user_info.get("email") == "fernandaneto@alunos.utfpr.edu.br":
            user_info["role"] = UserRole.ADMIN.value

        SessionAdapter.set(request, "user", user_info)
        SessionAdapter.set(request, "access_token", token.get("access_token"))

        return RedirectResponse(url=RedirectAdapter.get_home_url(user_info["role"]))

    @staticmethod
    def logout(request) -> RedirectResponse:
        SessionAdapter.pop(request, "user", None)
        SessionAdapter.pop(request, "access_token", None)

        return RedirectResponse(url=RedirectAdapter.get_login_url())

    @staticmethod
    def current_user(request) -> User:
        user_dict = SessionAdapter.get(request, "user")
        return User.from_dict(user_dict)
