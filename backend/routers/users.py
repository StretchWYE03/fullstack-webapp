from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from auth import get_current_user, require_admin, require_original_admin
import models
import schemas 

router = APIRouter(prefix="/users", tags=["users"])

# Called automatically after a new user signs up via Supabase
@router.post("/register", response_model=schemas.UserRoleResponse)
def register_user(
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user)
):
    # Check if user already has a role assigned
    existing = db.query(models.UserRole).filter(
        models.UserRole.user_id == user_id
    ).first()
    if existing:
        return existing
    
    # Assign "user" role by default
    new_role = models.UserRole(
        user_id=user_id,
        role="user",
        created_by="self"
    )
    db.add(new_role)
    db.commit()
    db.refresh(new_role)
    return new_role

# ============================================================
# GET CURRENT USER ROLE — any authenticated user
# Used by frontend to determine what UI to show
# ============================================================
@router.get("/me", response_model=schemas.UserRoleResponse)
def get_my_role(
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user)
):
    user_role = db.query(models.UserRole).filter(
        models.UserRole.user_id == user_id
    ).first()
    if not user_role:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User role not found — call /register first"
        )
    return user_role

# Get all users - admin only
@router.get("/", response_model=list[schemas.UserRoleResponse])
def get_all_users(
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user),
):
    user_role = db.query(models.UserRole).filter(
        models.UserRole.user_id == user_id
    ).first()
    if not user_role:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User role not found. Please register first."
        )
    return user_role

# Update user role - original_admin only
@router.put("/{target_user_id}/role", response_model=schemas.UserRoleResponse)
def update_user_role(
    target_user_id: str,
    role_update: schemas.UserRoleUpdate,
    db: Session = Depends(get_db),
    user_id: str = Depends(require_original_admin)
):
    
    # Customize: allowed role names
    allowed_roles = ["user", "admin", "original_admin"]
    if role_update.role not in allowed_roles:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Role must be one of: {allowed_roles}"
        )

    target = db.query(models.UserRole).filter(
        models.UserRole.user_id == target_user_id
    ).first()
    if not target:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Target user not found"
        )
    
    target.role = role_update.role
    target.created_by = user_id
    db.commit()
    db.refresh(target)
    return target

# Delete a user - original admin only
@router.delete("/{target_user_id}")
def delete_user(
    target_user_id: str,
    db: Session = Depends(get_db),
    user_id: str = Depends(require_original_admin)
):
    target = db.query(models.UserRole).filter(
        models.UserRole.user_id == target_user_id
    ).first()
    if not target:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Target user not found"
        )
    
    # Security: original_admin accounts cannot be deleted
    if target.role == "original_admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Original admin accounts cannot be deleted"
        )
    
    db.delete(target)
    db.commit()
    return {"detail": "User deleted successfully"}
