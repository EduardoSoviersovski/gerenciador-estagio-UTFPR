from dataclasses import dataclass
from enum import Enum


class UserRole(str, Enum):
    STUDENT = "student"
    SUPERVISOR = "supervisor"
    ADMIN = "admin"

@dataclass
class User:
    email: str
    name: str
    user_role: UserRole
    google_id: str

    @staticmethod
    def from_dict(data: dict) -> User:
        return User(
            email=data.get("email"),
            name=data.get("name"),
            user_role=UserRole(data.get("role")),
            google_id=data.get("sub"),
        )

    def to_dict(self) -> dict:
        return {
            "email": self.email,
            "name": self.name,
            "role": self.user_role.value,
            "google_id": self.google_id,
        }
