import os
from dotenv import load_dotenv
from fastapi import FastAPI, Request
from starlette.middleware.cors import CORSMiddleware
from authlib.integrations.starlette_client import OAuth
from starlette.middleware.sessions import SessionMiddleware
from starlette.responses import RedirectResponse

load_dotenv()

app = FastAPI()
app.add_middleware(SessionMiddleware, secret_key=os.getenv("SECRET_KEY"))
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5173",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth = OAuth()
oauth.register(
    name='google',
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={'scope': 'openid email profile'}
)

@app.get('/')
async def homepage(request: Request):
    user = request.session.get('user')
    return {"user": user} if user else {"message": "Please /login"}

@app.get('/login')
async def login(request: Request):
    redirect_uri = request.url_for('auth')
    print(f"Redirect URI: {redirect_uri}")
    return await oauth.google.authorize_redirect(request, str(redirect_uri))

@app.get('/auth')
async def auth(request: Request):
    print("Handling auth callback")
    token = await oauth.google.authorize_access_token(request)
    request.session['user'] = token.get('userinfo')
    request.session['access_token'] = token.get('access_token')
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
    redirect_url = frontend_url + "/dashboard"
    return RedirectResponse(url=redirect_url)

@app.get('/logout')
async def logout(request: Request):
    request.session.pop('user', None)
    return RedirectResponse(url='/')
