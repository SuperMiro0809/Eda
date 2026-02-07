from fastapi import HTTPException, Request
from jose import jwt, JWTError

from app.config import settings


async def verify_token(request: Request) -> dict:
    """
    Verify JWT token from Authorization header.
    Token should be in format: Bearer <token>

    Returns:
        Decoded token payload containing user info
    """
    auth_header = request.headers.get("Authorization")

    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization header")

    token = auth_header.split(" ")[1]

    try:
        payload = jwt.decode(
            token,
            settings.jwt_secret,
            algorithms=["HS256"],
        )
        return payload
    except JWTError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")