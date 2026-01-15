"""
Module d'authentification JWT pour TwoInOne ML Backend
Gestion de la validation des tokens et extraction des utilisateurs
"""

from fastapi import Depends, HTTPException, status, Header
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from typing import Optional, Dict, Any
from datetime import datetime, timedelta
import logging

from config import get_app_settings

logger = logging.getLogger(__name__)
security = HTTPBearer()


class TokenData:
    """Données extraites du token JWT"""
    def __init__(self, user_id: str, email: Optional[str] = None, role: Optional[str] = None):
        self.user_id = user_id
        self.email = email
        self.role = role


def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """
    Créer un token JWT
    
    Args:
        data: Données à encoder dans le token
        expires_delta: Durée de validité du token
        
    Returns:
        Token JWT encodé
    """
    settings = get_app_settings()
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.JWT_EXPIRATION_MINUTES)
    
    to_encode.update({"exp": expire})
    
    encoded_jwt = jwt.encode(
        to_encode,
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM
    )
    
    return encoded_jwt


def decode_token(token: str) -> TokenData:
    """
    Décoder et valider un token JWT
    
    Args:
        token: Token JWT à décoder
        
    Returns:
        TokenData avec les informations de l'utilisateur
        
    Raises:
        HTTPException: Si le token est invalide ou expiré
    """
    settings = get_app_settings()
    
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM]
        )
        
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token invalide: 'sub' manquant",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        email = payload.get("email")
        role = payload.get("role")
        
        return TokenData(user_id=user_id, email=email, role=role)
        
    except JWTError as e:
        logger.warning(f"Erreur de validation JWT: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token invalide ou expiré",
            headers={"WWW-Authenticate": "Bearer"},
        )


def verify_token(token: str) -> bool:
    """
    Vérifier si un token est valide
    
    Args:
        token: Token JWT à vérifier
        
    Returns:
        True si le token est valide, False sinon
    """
    try:
        decode_token(token)
        return True
    except HTTPException:
        return False


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> TokenData:
    """
    Dependency FastAPI pour extraire l'utilisateur actuel depuis le token JWT
    
    Usage:
        @app.get("/protected")
        async def protected_route(current_user: TokenData = Depends(get_current_user)):
            return {"user_id": current_user.user_id}
    
    Args:
        credentials: Credentials HTTP Bearer automatiquement extraites
        
    Returns:
        TokenData avec les informations de l'utilisateur
        
    Raises:
        HTTPException: Si le token est manquant, invalide ou expiré
    """
    token = credentials.credentials
    return decode_token(token)


async def get_current_user_optional(
    authorization: Optional[str] = Header(None)
) -> Optional[TokenData]:
    """
    Dependency FastAPI pour extraire l'utilisateur actuel (optionnel)
    Utile pour les endpoints qui peuvent fonctionner avec ou sans authentification
    
    Args:
        authorization: Header Authorization (optionnel)
        
    Returns:
        TokenData si le token est présent et valide, None sinon
    """
    if not authorization:
        return None
    
    # Extraire le token du header "Bearer <token>"
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        return None
    
    token = parts[1]
    
    try:
        return decode_token(token)
    except HTTPException:
        return None


def require_role(required_role: str):
    """
    Decorator pour vérifier que l'utilisateur a un rôle spécifique
    
    Usage:
        @app.get("/admin")
        async def admin_route(current_user: TokenData = Depends(require_role("admin"))):
            return {"message": "Admin access"}
    
    Args:
        required_role: Rôle requis
        
    Returns:
        Dependency function
    """
    async def role_checker(current_user: TokenData = Depends(get_current_user)) -> TokenData:
        if current_user.role != required_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Rôle '{required_role}' requis"
            )
        return current_user
    
    return role_checker
