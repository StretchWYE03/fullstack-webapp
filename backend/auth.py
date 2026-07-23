from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from database import get_db
import models
import jwt
import json
import base64
import struct
from cryptography.hazmat.primitives.asymmetric.ec import (
    EllipticCurvePublicNumbers, SECP256R1
)
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.backends import default_backend
from dotenv import load_dotenv
import os

security = HTTPBearer()

load_dotenv()

# ============================================================
# SUPABASE JWK CREDENTIALS
# ============================================================
SUPABASE_JWK = {
    "alg": "ES256",
    "crv": "P-256",
    "kty": "EC",
    "use": "sig",
    "x": os.getenv("SUPABASE_JWK_X"),
    "y": os.getenv("SUPABASE_JWK_Y"),
}

def _build_public_key():
    """
    Converts a JWK (EC P-256) to a cryptography public key object
    that PyJWT can use to verify ES256 tokens.
    """
    def decode_base64url(s):
        # Add padding if needed
        padding = 4 - len(s) % 4
        if padding != 4:
            s += "=" * padding
        return base64.urlsafe_b64decode(s)

    x_bytes = decode_base64url(SUPABASE_JWK["x"])
    y_bytes = decode_base64url(SUPABASE_JWK["y"])

    x_int = int.from_bytes(x_bytes, "big")
    y_int = int.from_bytes(y_bytes, "big")

    public_numbers = EllipticCurvePublicNumbers(
        x=x_int,
        y=y_int,
        curve=SECP256R1()
    )
    return public_numbers.public_key(default_backend())

# Build the key once on startup
PUBLIC_KEY = _build_public_key()

# ============================================================
# TOKEN VERIFICATION
# Validates the JWT token sent by the frontend
# ============================================================
def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(
            token,
            PUBLIC_KEY,
            algorithms=["ES256"],
            options={
                "verify_aud": False,
            }
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired"
        )
    except jwt.InvalidTokenError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}"
        )

# ============================================================
# GET CURRENT USER
# Extracts user ID from verified token
# ============================================================
def get_current_user(payload: dict = Depends(verify_token)):
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not identify user"
        )
    return user_id

# ============================================================
# ROLE CHECKERS
# Use as dependencies on protected routes
# ============================================================
def require_admin(
    user_id: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Allows original_admin and admin. Blocks regular users."""
    user_role = db.query(models.UserRole).filter(
        models.UserRole.user_id == user_id
    ).first()
    if not user_role or user_role.role not in ["admin", "original_admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return user_id

def require_original_admin(
    user_id: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Allows original_admin only. Blocks everyone else."""
    user_role = db.query(models.UserRole).filter(
        models.UserRole.user_id == user_id
    ).first()
    if not user_role or user_role.role != "original_admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Original admin access required"
        )
    return user_id