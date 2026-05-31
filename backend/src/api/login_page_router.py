import logging

from authlib.integrations.base_client import MismatchingStateError
from fastapi import APIRouter, Request, HTTPException
from starlette import status
from starlette.responses import RedirectResponse

from adapters.web.frontend_redirect_adapter import RedirectAdapter
from core.exceptions.authentication_exceptions import UnauthorizedEmailDomainError
from core.use_cases.authentication_use_cases import AuthenticationUseCases

logger = logging.getLogger(__name__)

login_page_app = APIRouter()

@login_page_app.get("/")
def homepage(request: Request):
    try:
        user = AuthenticationUseCases.current_user(request)
        if user:
            return {"user": user.to_dict()}
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not authenticated",
        )
    except HTTPException:
        raise
    except Exception:
        logger.exception("Failed to load home page")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to load home page",
        )

@login_page_app.get("/login")
async def login(request: Request):
    try:
        redirect_uri = str(request.url_for("auth"))
        response = await AuthenticationUseCases.login(request, redirect_uri)

        response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
        response.headers["Pragma"] = "no-cache"

        return response
    except Exception:
        logger.exception("Error starting login flow:")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to start login flow",
        )

@login_page_app.get("/auth")
async def auth(request: Request):
    try:
        return await AuthenticationUseCases.auth(request)
    except UnauthorizedEmailDomainError as e:
        logger.warning(f"Unauthorized email domain attempt: {e}")
        request.session.clear()
        login_url = RedirectAdapter.get_login_url()
        return RedirectResponse(url=f"{login_url}?error=invalid_email_domain")
    except MismatchingStateError:
        logger.warning("State mismatch detected (user likely used the back button).")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Login session expired. Please return to the main login page and try again without using the back button.",
        )
    except Exception:
        logger.exception("Authentication callback failed:")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Authentication callback failed",
        )

@login_page_app.get("/logout")
def logout(request: Request):
    try:
        return AuthenticationUseCases.logout(request)
    except Exception:
        logger.exception("Error during logout:")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to logout",
        )
