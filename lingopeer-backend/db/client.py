import os
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client, Client
from supabase_auth.errors import AuthApiError, AuthError

# Load environment variables from .env file (either in lingopeer-backend or root)
env_path = Path(__file__).resolve().parent.parent / ".env"
if env_path.exists():
    load_dotenv(dotenv_path=env_path)
else:
    load_dotenv()

supabase_url = os.environ.get("SUPABASE_URL") or "https://uulxfxtcjeroxneamqkn.supabase.co"
supabase_key = os.environ.get("SUPABASE_KEY") or "sb_publishable_1-xb5l14CFMbPqKLwRk7WA_vyxYqFi4"

client: Client = create_client(supabase_url, supabase_key)


def sign_up_user(email: str, password: str, data: dict | None = None):
    """
    Sign up a user with email and password, optional user metadata.
    """
    signup_payload = {
        "email": email,
        "password": password,
    }
    if data:
        signup_payload["options"] = {"data": data}
    return client.auth.sign_up(signup_payload)


def sign_in_with_password(email: str, password: str):
    """
    Sign in user with email and password.
    """
    return client.auth.sign_in_with_password({
        "email": email,
        "password": password
    })


def sign_in_with_google_url(redirect_to: str | None = None):
    """
    Generate Google OAuth sign-in URL with an optional redirect_to target.
    """
    options = {}
    if redirect_to:
        options["redirect_to"] = redirect_to

    response = client.auth.sign_in_with_oauth({
        "provider": "google",
        "options": options
    })
    return response.url


def exchange_code_for_session(code: str, redirect_to: str | None = None):
    """
    Exchange OAuth code for user session.
    """
    params = {"code": code}
    if redirect_to:
        params["redirect_to"] = redirect_to

    return client.auth.exchange_code_for_session(params)


def sign_in_with_id_token(id_token: str, provider: str = "google"):
    """
    Sign in using an OAuth ID token (e.g. from Google Sign-In SDK).
    """
    return client.auth.sign_in_with_id_token({
        "provider": provider,
        "id_token": id_token
    })


def get_user_by_token(jwt_token: str):
    """
    Retrieve user information using access token.
    """
    return client.auth.get_user(jwt_token)


def refresh_session(refresh_token: str):
    """
    Refresh user session using refresh token.
    """
    return client.auth.refresh_session(refresh_token)


def sign_out(jwt_token: str | None = None):
    """
    Sign out user session.
    """
    return client.auth.sign_out()
