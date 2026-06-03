from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..config import settings
from ..database import get_db
from ..dependencies import get_current_user
from ..models import UserDB
from ..schemas import LoginReq, MeResponse, RegisterReq, TokenResponse, UserPublic
from ..security import create_access_token, get_password_hash, verify_password


router = APIRouter()


def to_user_public(user: UserDB) -> UserPublic:
    return UserPublic(id=user.id, fullname=user.fullname, email=user.email, role=user.role)


@router.post("/api/register")
def register_user(user: RegisterReq, db: Session = Depends(get_db)):
    if db.query(UserDB).filter(UserDB.email == user.email).first():
        raise HTTPException(status_code=400, detail="Bu email allaqachon ro'yxatdan o'tgan!")

    assigned_role = "admin" if user.email.lower() in settings.admin_emails else "fermer"
    new_user = UserDB(
        fullname=user.fullname,
        email=user.email,
        password_hash=get_password_hash(user.password),
        role=assigned_role,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {
        "status": "success",
        "message": "Muvaffaqiyatli ro'yxatdan o'tdingiz!",
        "user": to_user_public(new_user).model_dump(),
    }


@router.post("/api/login", response_model=TokenResponse)
def login_user(user: LoginReq, db: Session = Depends(get_db)):
    db_user = db.query(UserDB).filter(UserDB.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.password_hash):
        raise HTTPException(status_code=401, detail="Email yoki parol noto'g'ri!")

    user_public = to_user_public(db_user)
    access_token = create_access_token(
        {
            "sub": str(db_user.id),
            "email": db_user.email,
            "role": db_user.role,
        }
    )

    return TokenResponse(access_token=access_token, user=user_public)


@router.get("/api/me", response_model=MeResponse)
def get_me(current_user: UserDB = Depends(get_current_user)):
    return MeResponse(user=to_user_public(current_user))
