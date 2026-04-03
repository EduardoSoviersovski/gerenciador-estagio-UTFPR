from fastapi import APIRouter, Request, HTTPException
from starlette import status

from core.dependencies import get_login_page_use_cases
from core.exceptions.authentication_exceptions import UnauthorizedEmailDomainError

login_page_app = APIRouter()

auth_use_cases = get_login_page_use_cases()


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
