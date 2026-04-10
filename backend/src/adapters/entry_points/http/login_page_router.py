from fastapi import APIRouter, Request, HTTPException
from starlette import status

from core.dependencies import get_authentication_use_cases
from core.exceptions.authentication_exceptions import UnauthorizedEmailDomainError

login_page_app = APIRouter()

authentication_use_cases = get_authentication_use_cases()


@login_page_app.get("/")
def homepage(request: Request):
    try:
        user = authentication_use_cases.current_user(request)
        print(f"USER NA HOME PAGE: {user}")
        if user:
            return {"user": user.to_dict()}
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not authenticated",
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to load home page",
        )


@login_page_app.get("/login")
async def login(request: Request):
    try:
        redirect_uri = str(request.url_for("auth"))
        return await authentication_use_cases.login(request, redirect_uri)
    except Exception as e:
        print(f"ERRO NO LOGIN: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to start login flow",
        )


@login_page_app.get("/auth")
async def auth(request: Request):
    try:
        return await authentication_use_cases.auth(request)

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
        response = authentication_use_cases.logout(request)
        return response
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to logout",
        )
