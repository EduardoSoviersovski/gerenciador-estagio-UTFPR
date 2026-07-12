from fastapi import Request, HTTPException, status, Depends

from core.schemas.role_schemas import UserRole
from core.use_cases.authentication_use_cases import AuthenticationUseCases

def get_current_authenticated_user(request: Request):
    user = AuthenticationUseCases.current_user(request)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuário não autenticado."
        )
    return user

def get_admin_user(current_user = Depends(get_current_authenticated_user)):
    if current_user.user_role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acesso restrito a administradores (PRAE)."
        )
    return current_user

def get_advisor_user(current_user = Depends(get_current_authenticated_user)):
    if current_user.user_role != UserRole.ADVISOR:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acesso restrito a professores orientadores."
        )
    return current_user

def get_advisor_or_admin_user(current_user = Depends(get_current_authenticated_user)):
    if current_user.user_role not in [UserRole.ADMIN, UserRole.ADVISOR]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acesso restrito a administradores (PRAE) ou professores orientadores."
        )
    return current_user
