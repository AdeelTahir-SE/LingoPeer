from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from supabase_auth.errors import AuthApiError, AuthError

from db.client import get_user_by_token
from api.auth.schemas import UserResponse

security = HTTPBearer(auto_error=True)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> UserResponse:
    """
    FastAPI dependency to extract and validate the JWT Bearer token from the
    Authorization header using Supabase.
    """
    token = credentials.credentials
    try:
        response = get_user_by_token(token)
        if not response or not response.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found or token expired",
                headers={"WWW-Authenticate": "Bearer"},
            )
        user = response.user
        return UserResponse(
            id=str(user.id),
            email=user.email,
            user_metadata=user.user_metadata,
            created_at=str(user.created_at) if user.created_at else None,
        )
    except (AuthApiError, AuthError) as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e.message) if hasattr(e, "message") else str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication failed: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
