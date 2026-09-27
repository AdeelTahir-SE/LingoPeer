from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from supabase_auth.errors import AuthApiError, AuthError

from api.auth.deps import get_current_user
from api.auth.schemas import (
    AuthResponse,
    GoogleIdTokenRequest,
    LoginRequest,
    MessageResponse,
    OAuthUrlResponse,
    RefreshTokenRequest,
    RegisterRequest,
    UserResponse,
)
from db.client import (
    exchange_code_for_session,
    refresh_session,
    sign_in_with_google_url,
    sign_in_with_id_token,
    sign_in_with_password,
    sign_out,
    sign_up_user,
)

auth_router = APIRouter(prefix="", tags=["Authentication"])


def _build_user_response(user) -> Optional[UserResponse]:
    if not user:
        return None
    return UserResponse(
        id=str(user.id),
        email=user.email,
        user_metadata=user.user_metadata,
        created_at=str(user.created_at) if user.created_at else None,
    )


def _build_auth_response(
    auth_data,
    default_message: Optional[str] = None,
    no_session_message: Optional[str] = None,
) -> AuthResponse:
    user_resp = _build_user_response(getattr(auth_data, "user", None))
    session = getattr(auth_data, "session", None)

    if session:
        return AuthResponse(
            user=user_resp,
            access_token=session.access_token,
            refresh_token=session.refresh_token,
            token_type=session.token_type or "bearer",
            expires_in=session.expires_in,
            message=default_message or "Authentication successful",
        )

    # When email verification is required, session is None but user exists
    return AuthResponse(
        user=user_resp,
        access_token=None,
        refresh_token=None,
        message=no_session_message
        or "Registration successful. Please verify your email to activate your account.",
    )


def _handle_supabase_error(e: Exception):
    if isinstance(e, (AuthApiError, AuthError)):
        status_code = getattr(e, "status", status.HTTP_400_BAD_REQUEST)
        # Ensure status_code is a valid HTTP status
        if not isinstance(status_code, int) or status_code < 400 or status_code > 599:
            status_code = status.HTTP_400_BAD_REQUEST
        error_msg = getattr(e, "message", str(e))
        raise HTTPException(status_code=status_code, detail=error_msg)
    raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail=f"An unexpected authentication error occurred: {str(e)}",
    )


@auth_router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def register(payload: RegisterRequest):
    """
    Register a new user with email and password.
    """
    try:
        user_metadata = payload.metadata or {}
        if payload.full_name:
            user_metadata["full_name"] = payload.full_name

        res = sign_up_user(
            email=payload.email,
            password=payload.password,
            data=user_metadata if user_metadata else None,
        )
        return _build_auth_response(
            res,
            default_message="User registered successfully",
            no_session_message="Registration successful. Please verify your email to activate your account.",
        )
    except Exception as e:
        _handle_supabase_error(e)


@auth_router.post("/login", response_model=AuthResponse)
async def login(payload: LoginRequest):
    """
    Authenticate user using email and password.
    """
    try:
        res = sign_in_with_password(email=payload.email, password=payload.password)
        return _build_auth_response(res, default_message="Login successful")
    except Exception as e:
        _handle_supabase_error(e)


@auth_router.get("/google/url", response_model=OAuthUrlResponse)
async def get_google_auth_url(redirect_to: Optional[str] = Query(None, description="Callback redirect URL")):
    """
    Generate Google OAuth authentication URL.
    """
    try:
        url = sign_in_with_google_url(redirect_to=redirect_to)
        return OAuthUrlResponse(url=url, provider="google")
    except Exception as e:
        _handle_supabase_error(e)


@auth_router.get("/callback", response_model=AuthResponse)
async def auth_callback(
    code: str = Query(..., description="Authorization code from OAuth provider"),
    redirect_to: Optional[str] = Query(None, description="Original redirect URI"),
):
    """
    OAuth callback endpoint: exchanges the authorization code for a session.
    """
    try:
        res = exchange_code_for_session(code=code, redirect_to=redirect_to)
        return _build_auth_response(res, default_message="OAuth login successful")
    except Exception as e:
        _handle_supabase_error(e)


@auth_router.post("/google/id-token", response_model=AuthResponse)
async def login_with_google_id_token(payload: GoogleIdTokenRequest):
    """
    Sign in using a Google ID token (e.g. from Google Sign-In SDK on mobile/web).
    """
    try:
        res = sign_in_with_id_token(id_token=payload.id_token, provider="google")
        return _build_auth_response(res, default_message="Google ID token login successful")
    except Exception as e:
        _handle_supabase_error(e)


@auth_router.post("/refresh", response_model=AuthResponse)
async def refresh_user_session(payload: RefreshTokenRequest):
    """
    Refresh an expired access token using a valid Supabase refresh token.
    """
    try:
        res = refresh_session(refresh_token=payload.refresh_token)
        return _build_auth_response(res, default_message="Session refreshed successfully")
    except Exception as e:
        _handle_supabase_error(e)


@auth_router.get("/me", response_model=UserResponse)
async def get_my_profile(current_user: UserResponse = Depends(get_current_user)):
    """
    Get profile information of the currently authenticated user.
    Requires Bearer token in Authorization header.
    """
    return current_user


@auth_router.post("/logout", response_model=MessageResponse)
async def logout(current_user: UserResponse = Depends(get_current_user)):
    """
    Log out the current user session.
    Requires Bearer token in Authorization header.
    """
    try:
        sign_out()
        return MessageResponse(message="Successfully logged out")
    except Exception as e:
        _handle_supabase_error(e)
