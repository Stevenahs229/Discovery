"""
TwoInOne - Backend ML Python
Microservice pour la reconnaissance faciale et l'IA
FastAPI + TensorFlow + OpenCV
"""

from fastapi import FastAPI, File, UploadFile, HTTPException, Header
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

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="TwoInOne ML API",
    description="Microservice de reconnaissance faciale et IA pour TwoInOne",
    version="1.0.0"
)

# CORS - Permettre les requêtes depuis le frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # À restreindre en production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration de la base de données
DATABASE_URL = os.getenv("DATABASE_URL", "")

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

# Stockage temporaire des encodages faciaux (à remplacer par DB en production)
# Structure: {user_id: [encodages_faciaux]}
FACE_ENCODINGS_STORAGE = {}

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
    return {
        "status": "healthy",
        "ml_libraries": {
            "face_recognition": "installed",
            "opencv": "installed",
            "numpy": "installed"
        },
        "models_loaded": len(FACE_ENCODINGS_STORAGE)
    }

@app.post("/ml/enroll-face")
async def enroll_face(
    file: UploadFile = File(...),
    user_id: str = Header(...),
    authorization: str = Header(...)
):
    """
    Enregistrer le visage d'un utilisateur pour la reconnaissance faciale
    
    - file: Image du visage (JPEG, PNG)
    - user_id: ID de l'utilisateur
    - authorization: Token JWT
    """
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
        
        # Stocker l'encodage (en production, sauvegarder dans la DB)
        if user_id not in FACE_ENCODINGS_STORAGE:
            FACE_ENCODINGS_STORAGE[user_id] = []
        
        FACE_ENCODINGS_STORAGE[user_id].append(face_encoding.tolist())
        
        # Limiter à 5 encodages par utilisateur pour éviter la surcharge
        if len(FACE_ENCODINGS_STORAGE[user_id]) > 5:
            FACE_ENCODINGS_STORAGE[user_id] = FACE_ENCODINGS_STORAGE[user_id][-5:]
        
        logger.info(f"Visage enregistré avec succès pour user_id: {user_id}")
        
        return {
            "success": True,
            "message": "Visage enregistré avec succès",
            "face_count": len(FACE_ENCODINGS_STORAGE[user_id])
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erreur lors de l'enregistrement facial: {e}")
        raise HTTPException(status_code=500, detail=f"Erreur serveur: {str(e)}")

@app.post("/ml/verify-face", response_model=FaceVerificationResponse)
async def verify_face(
    file: UploadFile = File(...),
    authorization: str = Header(...)
):
    """
    Vérifier l'identité d'un utilisateur via reconnaissance faciale
    
    - file: Image du visage à vérifier
    - authorization: Token JWT
    
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
        
        # Comparer avec tous les visages enregistrés
        best_match_user_id = None
        best_match_distance = 1.0  # Distance maximale (pire match)
        
        for user_id, stored_encodings in FACE_ENCODINGS_STORAGE.items():
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
        
        # Seuil de confiance (0.6 est une bonne valeur par défaut)
        # Plus la distance est faible, meilleure est la correspondance
        CONFIDENCE_THRESHOLD = 0.6
        
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
async def get_enrolled_users():
    """Obtenir la liste des utilisateurs avec reconnaissance faciale activée"""
    return {
        "enrolled_users": list(FACE_ENCODINGS_STORAGE.keys()),
        "total_count": len(FACE_ENCODINGS_STORAGE)
    }

@app.delete("/ml/delete-face/{user_id}")
async def delete_face_enrollment(user_id: str, authorization: str = Header(...)):
    """Supprimer l'enregistrement facial d'un utilisateur"""
    if user_id in FACE_ENCODINGS_STORAGE:
        del FACE_ENCODINGS_STORAGE[user_id]
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
