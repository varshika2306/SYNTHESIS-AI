from sqlalchemy.orm import Session

from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.auth.hashing import hash_password, verify_password
from app.auth.jwt_handler import create_access_token


class AuthService:

    @staticmethod
    def register_user(db: Session, username: str, email: str, password: str):

        # Check if email already exists
        existing_user = UserRepository.get_by_email(db, email)

        if existing_user:
            return None

        # Hash password
        hashed_password = hash_password(password)

        # Create user
        new_user = User(
            username=username,
            email=email,
            hashed_password=hashed_password
        )

        return UserRepository.create(db, new_user)

    @staticmethod
    def login_user(db: Session, email: str, password: str):

        user = UserRepository.get_by_email(db, email)

        if not user:
            return None

        if not verify_password(password, user.hashed_password):
            return None

        access_token = create_access_token(
            data={
                "sub": user.email,
                "user_id": user.id
            }
        )

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email
            }
        }