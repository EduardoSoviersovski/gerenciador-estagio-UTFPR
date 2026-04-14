from fastapi import APIRouter, Request, HTTPException
from starlette import status

from core.exceptions.authentication_exceptions import UnauthorizedEmailDomainError
from core.use_cases.authentication_use_cases import AuthenticationUseCases

login_page_app = APIRouter()


@login_page_app.get("/")
def homepage(request: Request):
    try:
        user = AuthenticationUseCases.current_user(request)
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
        return await AuthenticationUseCases.login(request, redirect_uri)
    except Exception as e:
        print(f"ERRO NO LOGIN: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to start login flow",
        )


@login_page_app.get("/auth")
async def auth(request: Request):
    try:
        return await AuthenticationUseCases.auth(request)

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
        response = AuthenticationUseCases.logout(request)
        return response
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to logout",
        )
