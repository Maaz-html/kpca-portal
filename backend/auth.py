from fastapi import Security, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
import os
from enum import Enum
from typing import List, Optional

class UserRole(str, Enum):
    PARTNER = "PARTNER"
    DIRECTOR = "DIRECTOR"
    MANAGER = "MANAGER"

# Configuration - should be env vars
SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET", "placeholder-secret")
ALGORITHM = "HS256"

security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SUPABASE_JWT_SECRET, algorithms=[ALGORITHM], options={"verify_aud": False})
        user_id: str = payload.get("sub")
        # In Supabase, custom roles are often in user_metadata or app_metadata
        # For this portal, we'll assume they are stored in the profiles table and optionally injected into JWT
        role: str = payload.get("role", "MANAGER") # Default to lowest role if not in JWT
        
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        
        return {"id": user_id, "role": role}
    except JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")

class RoleChecker:
    def __init__(self, allowed_roles: List[UserRole]):
        self.allowed_roles = allowed_roles

    def __call__(self, user=Depends(get_current_user)):
        if user["role"] not in [role.value for role in self.allowed_roles]:
            raise HTTPException(
                status_code=403, 
                detail=f"Role {user['role']} does not have access to this resource"
            )
        return user
