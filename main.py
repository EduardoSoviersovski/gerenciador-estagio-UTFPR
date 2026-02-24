import os
from dotenv import load_dotenv
from fastapi import FastAPI, Request
from starlette.middleware.sessions import SessionMiddleware
from authlib.integrations.starlette_client import OAuth
from starlette.responses import RedirectResponse

load_dotenv()

app = FastAPI()
app.add_middleware(SessionMiddleware, secret_key=os.getenv("SECRET_KEY"))

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
    return RedirectResponse(url='/dashboard')

@app.get('/logout')
async def logout(request: Request):
    request.session.pop('user', None)
    return RedirectResponse(url='/')


@app.get('/dashboard')
async def dashboard(request: Request):
    user = request.session.get('user')
    if not user:
        return RedirectResponse(url='/login')

    return {"message": f"Olá {user['name']}, você está autenticado!", "email": user['email']}
