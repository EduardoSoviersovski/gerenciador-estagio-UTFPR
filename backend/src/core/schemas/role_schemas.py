from enum import Enum


class UserRole(str, Enum):
    STUDENT = "student"
    SUPERVISOR = "supervisor"
    ADMIN = "admin"
