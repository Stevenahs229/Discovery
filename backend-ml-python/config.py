"""
Configuration centralisée pour TwoInOne ML Backend
Gestion des variables d'environnement avec validation Pydantic
"""

from pydantic_settings import BaseSettings
from pydantic import Field, validator
from typing import List
import os
from pathlib import Path


class Settings(BaseSettings):
    """Configuration de l'application avec validation"""
    
    # Base de données
    DATABASE_URL: str = Field(
        ...,
        description="URL de connexion PostgreSQL"
    )
    
    # Supabase
    SUPABASE_URL: str = Field(
        ...,
        description="URL du projet Supabase"
    )
    SUPABASE_ANON_KEY: str = Field(
        ...,
        description="Clé anonyme Supabase"
    )
    SUPABASE_SERVICE_KEY: str = Field(
        default="",
        description="Clé de service Supabase (optionnel)"
    )
    
    # JWT
    JWT_SECRET_KEY: str = Field(
        ...,
        description="Clé secrète pour signer les tokens JWT"
    )
    JWT_ALGORITHM: str = Field(
        default="HS256",
        description="Algorithme de signature JWT"
    )
    JWT_EXPIRATION_MINUTES: int = Field(
        default=30,
        description="Durée de validité des tokens en minutes"
    )
    
    # API
    API_HOST: str = Field(
        default="0.0.0.0",
        description="Host de l'API"
    )
    API_PORT: int = Field(
        default=8000,
        description="Port de l'API"
    )
    
    # CORS
    ALLOWED_ORIGINS: str = Field(
        default="http://localhost:3000",
        description="Origines autorisées (séparées par des virgules)"
    )
    
    # Environnement
    ENVIRONMENT: str = Field(
        default="development",
        description="Type d'environnement: development, staging, production"
    )
    DEBUG: bool = Field(
        default=False,
        description="Mode debug"
    )
    
    # Machine Learning
    FACE_RECOGNITION_THRESHOLD: float = Field(
        default=0.6,
        ge=0.0,
        le=1.0,
        description="Seuil de confiance pour la reconnaissance faciale"
    )
    MAX_ENCODINGS_PER_USER: int = Field(
        default=5,
        ge=1,
        le=20,
        description="Nombre maximum d'encodages par utilisateur"
    )
    
    # Logging
    LOG_LEVEL: str = Field(
        default="INFO",
        description="Niveau de log"
    )
    LOG_DIR: str = Field(
        default="./logs",
        description="Répertoire des logs"
    )
    
    @validator("ENVIRONMENT")
    def validate_environment(cls, v):
        """Valider que l'environnement est valide"""
        allowed = ["development", "staging", "production"]
        if v not in allowed:
            raise ValueError(f"ENVIRONMENT doit être l'un de: {allowed}")
        return v
    
    @validator("LOG_LEVEL")
    def validate_log_level(cls, v):
        """Valider que le niveau de log est valide"""
        allowed = ["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"]
        if v.upper() not in allowed:
            raise ValueError(f"LOG_LEVEL doit être l'un de: {allowed}")
        return v.upper()
    
    @validator("JWT_SECRET_KEY")
    def validate_jwt_secret(cls, v, values):
        """Valider que la clé JWT est forte en production"""
        env = values.get("ENVIRONMENT", "development")
        if env == "production" and len(v) < 32:
            raise ValueError(
                "JWT_SECRET_KEY doit faire au moins 32 caractères en production"
            )
        if v == "your-super-secret-jwt-key-change-this-in-production":
            if env == "production":
                raise ValueError(
                    "JWT_SECRET_KEY doit être changée en production!"
                )
        return v
    
    def get_allowed_origins_list(self) -> List[str]:
        """Retourner la liste des origines autorisées"""
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",")]
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True


def get_settings() -> Settings:
    """
    Charger et valider la configuration
    
    Raises:
        ValueError: Si des variables requises sont manquantes ou invalides
    """
    try:
        settings = Settings()
        return settings
    except Exception as e:
        print(f"❌ Erreur de configuration: {e}")
        print("\n💡 Assurez-vous que:")
        print("  1. Le fichier .env existe")
        print("  2. Toutes les variables requises sont définies")
        print("  3. Les valeurs sont valides")
        print("\n📄 Consultez .env.example pour un modèle")
        raise


def validate_environment():
    """
    Valider l'environnement au démarrage de l'application
    
    Raises:
        RuntimeError: Si la configuration est invalide
    """
    try:
        settings = get_settings()
        
        # Créer le répertoire de logs s'il n'existe pas
        log_dir = Path(settings.LOG_DIR)
        log_dir.mkdir(parents=True, exist_ok=True)
        
        print("✅ Configuration validée avec succès")
        print(f"   Environnement: {settings.ENVIRONMENT}")
        print(f"   Debug: {settings.DEBUG}")
        print(f"   API: {settings.API_HOST}:{settings.API_PORT}")
        print(f"   CORS: {len(settings.get_allowed_origins_list())} origine(s) autorisée(s)")
        
        return settings
        
    except Exception as e:
        raise RuntimeError(f"Échec de validation de l'environnement: {e}")


# Instance globale des settings (lazy loading)
_settings = None

def get_app_settings() -> Settings:
    """Obtenir l'instance globale des settings"""
    global _settings
    if _settings is None:
        _settings = get_settings()
    return _settings
