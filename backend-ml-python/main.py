"""
TwoInOne - Backend ML Python
Microservice pour la reconnaissance faciale et l'IA
FastAPI + TensorFlow + OpenCV
"""

from fastapi import FastAPI, File, UploadFile, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import face_recognition
import numpy as np
import cv2
import io
from PIL import Image
import os
from typing import Optional, List
import json
import psycopg2
from psycopg2.extras import RealDictCursor
import base64
import logging

# Imports des modules personnalisés
from config import get_app_settings, validate_environment
from auth import get_current_user, get_current_user_optional, TokenData
from database import (
    init_db_pool,
    close_db_pool,
    create_tables,
    save_face_encoding,
    get_face_encodings,
    get_all_face_encodings,
    delete_face_encodings,
    get_enrolled_users,
    get_user_encoding_count
)

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Charger et valider la configuration
try:
    settings = validate_environment()
except Exception as e:
    logger.error(f"❌ Erreur de configuration: {e}")
    logger.info("💡 Créez un fichier .env basé sur .env.example")
    # En mode développement, on peut continuer sans .env
    if os.getenv("ENVIRONMENT") != "production":
        logger.warning("⚠️  Mode développement: utilisation de valeurs par défaut")
        from config import Settings
        settings = Settings(
            DATABASE_URL=os.getenv("DATABASE_URL", "postgresql://localhost/twoinone"),
            SUPABASE_URL=os.getenv("SUPABASE_URL", "http://localhost"),
            SUPABASE_ANON_KEY=os.getenv("SUPABASE_ANON_KEY", "dev-key"),
            JWT_SECRET_KEY=os.getenv("JWT_SECRET_KEY", "dev-secret-key-not-for-production"),
            ALLOWED_ORIGINS=os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:5173")
        )
    else:
        raise

app = FastAPI(
    title="TwoInOne ML API",
    description="Microservice de reconnaissance faciale et IA pour TwoInOne",
    version="1.0.0"
)

# CORS - Origines restreintes depuis la configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.get_allowed_origins_list(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db_connection():
    """Créer une connexion à PostgreSQL"""
    try:
        conn = psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)
        return conn
    except Exception as e:
        logger.error(f"Erreur de connexion DB: {e}")
        raise HTTPException(status_code=500, detail="Erreur de connexion à la base de données")

# Modèles Pydantic
class FaceEnrollmentRequest(BaseModel):
    user_id: str
    name: str

class FaceVerificationResponse(BaseModel):
    success: bool
    user_id: Optional[str] = None
    confidence: float
    message: str

class HealthResponse(BaseModel):
    status: str
    service: str
    version: str

# Événements de cycle de vie de l'application
@app.on_event("startup")
async def startup_event():
    """Initialiser la base de données au démarrage"""
    logger.info("🚀 Démarrage de l'application...")
    try:
        init_db_pool()
        await create_tables()
        logger.info("✅ Application prête")
    except Exception as e:
        logger.error(f"❌ Erreur au démarrage: {e}")
        # Ne pas bloquer le démarrage en développement
        if settings.ENVIRONMENT == "production":
            raise

@app.on_event("shutdown")
async def shutdown_event():
    """Fermer les connexions au shutdown"""
    logger.info("🛑 Arrêt de l'application...")
    close_db_pool()
    logger.info("✅ Connexions fermées")

# Routes

@app.get("/", response_model=HealthResponse)
async def root():
    """Health check"""
    return {
        "status": "healthy",
        "service": "TwoInOne ML API",
        "version": "1.0.0"
    }

@app.get("/ml/health")
async def health_check():
    """Vérifier l'état du service ML"""
    enrolled_users = await get_enrolled_users()
    return {
        "status": "healthy",
        "environment": settings.ENVIRONMENT,
        "ml_libraries": {
            "face_recognition": "installed",
            "opencv": "installed",
            "numpy": "installed"
        },
        "enrolled_users_count": len(enrolled_users),
        "cors_origins": len(settings.get_allowed_origins_list())
    }

@app.post("/ml/enroll-face")
async def enroll_face(
    file: UploadFile = File(...),
    current_user: TokenData = Depends(get_current_user)
):
    """
    Enregistrer le visage d'un utilisateur pour la reconnaissance faciale
    
    - file: Image du visage (JPEG, PNG)
    - current_user: Utilisateur authentifié (extrait du JWT)
    """
    user_id = current_user.user_id
    try:
        logger.info(f"Enregistrement facial pour user_id: {user_id}")
        
        # Lire l'image uploadée
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # Convertir en array numpy
        image_array = np.array(image)
        
        # Convertir RGB si nécessaire
        if len(image_array.shape) == 2:  # Image en niveaux de gris
            image_array = cv2.cvtColor(image_array, cv2.COLOR_GRAY2RGB)
        elif image_array.shape[2] == 4:  # RGBA
            image_array = cv2.cvtColor(image_array, cv2.COLOR_RGBA2RGB)
        
        # Détecter les visages dans l'image
        face_locations = face_recognition.face_locations(image_array)
        
        if len(face_locations) == 0:
            logger.warning(f"Aucun visage détecté pour user_id: {user_id}")
            raise HTTPException(
                status_code=400,
                detail="Aucun visage détecté dans l'image. Veuillez prendre une photo claire de votre visage."
            )
        
        if len(face_locations) > 1:
            logger.warning(f"Plusieurs visages détectés pour user_id: {user_id}")
            raise HTTPException(
                status_code=400,
                detail="Plusieurs visages détectés. Assurez-vous d'être seul dans l'image."
            )
        
        # Encoder le visage
        face_encodings = face_recognition.face_encodings(image_array, face_locations)
        
        if len(face_encodings) == 0:
            raise HTTPException(
                status_code=400,
                detail="Impossible d'encoder le visage. Veuillez réessayer avec une meilleure photo."
            )
        
        face_encoding = face_encodings[0]
        
        # Sauvegarder l'encodage dans PostgreSQL
        await save_face_encoding(user_id, face_encoding.tolist())
        
        # Obtenir le nombre total d'encodages pour cet utilisateur
        face_count = await get_user_encoding_count(user_id)
        
        logger.info(f"Visage enregistré avec succès pour user_id: {user_id}")
        
        return {
            "success": True,
            "message": "Visage enregistré avec succès",
            "face_count": face_count
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erreur lors de l'enregistrement facial: {e}")
        raise HTTPException(status_code=500, detail=f"Erreur serveur: {str(e)}")

@app.post("/ml/verify-face", response_model=FaceVerificationResponse)
async def verify_face(
    file: UploadFile = File(...),
    current_user: Optional[TokenData] = Depends(get_current_user_optional)
):
    """
    Vérifier l'identité d'un utilisateur via reconnaissance faciale
    
    - file: Image du visage à vérifier
    - current_user: Utilisateur authentifié (optionnel)
    
    Retourne l'user_id si reconnu avec un niveau de confiance
    """
    try:
        logger.info("Demande de vérification faciale")
        
        # Lire l'image uploadée
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # Convertir en array numpy
        image_array = np.array(image)
        
        # Convertir RGB si nécessaire
        if len(image_array.shape) == 2:
            image_array = cv2.cvtColor(image_array, cv2.COLOR_GRAY2RGB)
        elif image_array.shape[2] == 4:
            image_array = cv2.cvtColor(image_array, cv2.COLOR_RGBA2RGB)
        
        # Détecter les visages
        face_locations = face_recognition.face_locations(image_array)
        
        if len(face_locations) == 0:
            return FaceVerificationResponse(
                success=False,
                confidence=0.0,
                message="Aucun visage détecté. Veuillez réessayer."
            )
        
        if len(face_locations) > 1:
            return FaceVerificationResponse(
                success=False,
                confidence=0.0,
                message="Plusieurs visages détectés. Assurez-vous d'être seul."
            )
        
        # Encoder le visage à vérifier
        unknown_encodings = face_recognition.face_encodings(image_array, face_locations)
        
        if len(unknown_encodings) == 0:
            return FaceVerificationResponse(
                success=False,
                confidence=0.0,
                message="Impossible d'encoder le visage. Veuillez réessayer."
            )
        
        unknown_encoding = unknown_encodings[0]
        
        # Récupérer tous les encodages depuis PostgreSQL
        all_encodings = await get_all_face_encodings()
        
        # Comparer avec tous les visages enregistrés
        best_match_user_id = None
        best_match_distance = 1.0  # Distance maximale (pire match)
        
        for user_id, stored_encodings in all_encodings.items():
            for stored_encoding in stored_encodings:
                # Calculer la distance faciale
                face_distances = face_recognition.face_distance(
                    [np.array(stored_encoding)],
                    unknown_encoding
                )
                distance = face_distances[0]
                
                # Garder le meilleur match
                if distance < best_match_distance:
                    best_match_distance = distance
                    best_match_user_id = user_id
        
        # Seuil de confiance depuis la configuration
        CONFIDENCE_THRESHOLD = settings.FACE_RECOGNITION_THRESHOLD
        
        if best_match_distance < CONFIDENCE_THRESHOLD and best_match_user_id:
            confidence = 1.0 - best_match_distance  # Convertir en score de confiance
            logger.info(f"Visage reconnu: {best_match_user_id}, confiance: {confidence:.2f}")
            
            return FaceVerificationResponse(
                success=True,
                user_id=best_match_user_id,
                confidence=round(confidence, 2),
                message=f"Identité vérifiée avec {round(confidence * 100)}% de confiance"
            )
        else:
            logger.warning(f"Visage non reconnu. Meilleure distance: {best_match_distance}")
            return FaceVerificationResponse(
                success=False,
                confidence=0.0,
                message="Visage non reconnu. Veuillez vous enregistrer d'abord."
            )
        
    except Exception as e:
        logger.error(f"Erreur lors de la vérification faciale: {e}")
        raise HTTPException(status_code=500, detail=f"Erreur serveur: {str(e)}")

@app.get("/ml/users-enrolled")
async def get_enrolled_users_endpoint(
    current_user: TokenData = Depends(get_current_user)
):
    """Obtenir la liste des utilisateurs avec reconnaissance faciale activée"""
    users = await get_enrolled_users()
    return {
        "enrolled_users": users,
        "total_count": len(users)
    }

@app.delete("/ml/delete-face/{user_id}")
async def delete_face_enrollment(
    user_id: str,
    current_user: TokenData = Depends(get_current_user)
):
    """Supprimer l'enregistrement facial d'un utilisateur"""
    # Vérifier que l'utilisateur supprime ses propres données ou est admin
    if current_user.user_id != user_id and current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Vous ne pouvez supprimer que vos propres données"
        )
    
    deleted = await delete_face_encodings(user_id)
    if deleted:
        logger.info(f"Enregistrement facial supprimé pour user_id: {user_id}")
        return {"success": True, "message": "Enregistrement facial supprimé"}
    else:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")

@app.post("/ml/detect-anomalies")
async def detect_anomalies(authorization: str = Header(...)):
    """
    Détection d'anomalies dans les présences
    (Fonctionnalité future - ML pour détecter les patterns suspects)
    """
    return {
        "status": "not_implemented",
        "message": "Détection d'anomalies - Fonctionnalité à venir"
    }

@app.post("/ml/predict-absence")
async def predict_absence(authorization: str = Header(...)):
    """
    Prédiction des absences futures
    (Fonctionnalité future - ML pour prédire les absences)
    """
    return {
        "status": "not_implemented",
        "message": "Prédiction d'absences - Fonctionnalité à venir"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
