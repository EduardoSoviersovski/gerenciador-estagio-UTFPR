from fastapi import APIRouter, Request, HTTPException
from starlette import status

from adapters.driven.auth.authlib_oauth_adapter import AuthlibOAuthAdapter
from adapters.driven.session.starlette_session_adapter import StarletteSessionAdapter
from adapters.driven.web.frontend_redirect_adapter import FrontendRedirectAdapter
from core.exceptions.authentication_exceptions import UnauthorizedEmailDomainError
from core.use_cases.authentication_use_cases import AuthenticationUseCases

login_page_app = APIRouter()

auth_use_cases = AuthenticationUseCases(
    oauth_provider=AuthlibOAuthAdapter(),
    session=StarletteSessionAdapter(),
    redirect_builder=FrontendRedirectAdapter(),
)


@login_page_app.get("/")
def homepage(request: Request):
    try:
        user = auth_use_cases.current_user(request)
        if user:
            return {"user": user}
        return {"user": None}
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to load home page",
        )


@login_page_app.get("/login")
async def login(request: Request):
    try:
        redirect_uri = str(request.url_for("auth"))
        return await auth_use_cases.login(request, redirect_uri)
    except Exception as e:
        print(f"ERRO NO LOGIN: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to start login flow",
        )


@login_page_app.get("/auth")
async def auth(request: Request):
    try:
        return await auth_use_cases.auth(request)

    except UnauthorizedEmailDomainError as e:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(e),
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Authentication callback failed",
        )


@login_page_app.get("/logout")
def logout(request: Request):
    try:
        response = auth_use_cases.logout(request)
        return response
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to logout",
        )
