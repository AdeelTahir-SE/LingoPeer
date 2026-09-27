from typing import Any, Optional
from pydantic import BaseModel, EmailStr, Field


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6, description="Password must be at least 6 characters")
    full_name: Optional[str] = Field(None, description="Optional full name or display name")
    metadata: Optional[dict[str, Any]] = Field(default_factory=dict, description="Custom user metadata")


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=1)


class GoogleIdTokenRequest(BaseModel):
    id_token: str = Field(..., description="Google OAuth ID Token received from client")


class RefreshTokenRequest(BaseModel):
    refresh_token: str = Field(..., description="Supabase refresh token")


class UserResponse(BaseModel):
    id: str
    email: Optional[str] = None
    user_metadata: Optional[dict[str, Any]] = None
    created_at: Optional[str] = None


class AuthResponse(BaseModel):
    user: Optional[UserResponse] = None
    access_token: Optional[str] = None
    refresh_token: Optional[str] = None
    token_type: Optional[str] = "bearer"
    expires_in: Optional[int] = None
    message: Optional[str] = None


class OAuthUrlResponse(BaseModel):
    url: str
    provider: str = "google"


class MessageResponse(BaseModel):
    message: str
    success: bool = True
