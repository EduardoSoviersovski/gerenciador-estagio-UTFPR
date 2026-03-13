from fastapi import APIRouter, Request
from starlette.responses import RedirectResponse

from adapters.driven.auth.authlib_oauth_adapter import AuthlibOAuthAdapter
from adapters.driven.session.starlette_session_adapter import StarletteSessionAdapter
from adapters.driven.web.frontend_redirect_adapter import FrontendRedirectAdapter
from core.use_cases.authentication_use_cases import AuthenticationUseCases

home_page_app = APIRouter()

auth_use_cases = AuthenticationUseCases(
    oauth_provider=AuthlibOAuthAdapter(),
    session=StarletteSessionAdapter(),
    redirect_builder=FrontendRedirectAdapter(),
)


@home_page_app.get("/")
async def homepage(request: Request):
    user = auth_use_cases.current_user(request)
    return {"user": user} if user else {"message": "Please /login"}


@home_page_app.get("/login")
async def login(request: Request):
    redirect_uri = str(request.url_for("auth"))
    return await auth_use_cases.login(request, redirect_uri)


@home_page_app.get("/auth")
async def auth(request: Request):
    redirect_url = await auth_use_cases.auth(request)
    return RedirectResponse(url=redirect_url)


@home_page_app.get("/logout")
async def logout(request: Request):
    auth_use_cases.logout(request)
    return RedirectResponse(url="/")
