"""
TwoInOne - Backend ML Python (MODE SIMULATION)
Version simplifiée sans dépendances lourdes
FastAPI seulement - Fonctionne immédiatement !
"""

from fastapi import FastAPI, File, UploadFile, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import io
from typing import Optional, List
import logging
import random

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="TwoInOne ML API (Simulation Mode)",
    description="Microservice de reconnaissance faciale en mode simulation pour TwoInOne",
    version="1.0.0-simulation"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Stockage en mémoire (simulation)
ENROLLED_USERS = {}  # {user_id: {"count": int, "enrolled": True}}

# Modèles
class FaceVerificationResponse(BaseModel):
    success: bool
    user_id: Optional[str] = None
    confidence: float
    message: str

class HealthResponse(BaseModel):
    status: str
    service: str
    version: str
    mode: str

# Routes

@app.get("/", response_model=HealthResponse)
async def root():
    """Health check"""
    return {
        "status": "healthy",
        "service": "TwoInOne ML API",
        "version": "1.0.0",
        "mode": "simulation"
    }

@app.get("/ml/health")
async def health_check():
    """Vérifier l'état du service ML"""
    return {
        "status": "healthy",
        "mode": "simulation",
        "ml_libraries": {
            "fastapi": "installed",
            "simulation": "active"
        },
        "models_loaded": len(ENROLLED_USERS)
    }

@app.post("/ml/enroll-face")
async def enroll_face(
    file: UploadFile = File(...),
    user_id: str = Header(...),
    authorization: str = Header(...)
):
    """
    Enregistrer le visage d'un utilisateur (MODE SIMULATION)
    
    En mode simulation, on accepte toujours l'image et on simule l'enregistrement.
    """
    try:
        logger.info(f"[SIMULATION] Enregistrement facial pour user_id: {user_id}")
        
        # Lire l'image uploadée (juste pour vérifier qu'elle existe)
        contents = await file.read()
        
        if len(contents) < 100:  # Trop petite
            raise HTTPException(
                status_code=400,
                detail="L'image est trop petite. Veuillez uploader une vraie image."
            )
        
        # Simuler l'enregistrement
        if user_id not in ENROLLED_USERS:
            ENROLLED_USERS[user_id] = {"count": 0, "enrolled": True}
        
        ENROLLED_USERS[user_id]["count"] += 1
        
        logger.info(f"[SIMULATION] Visage enregistré avec succès pour user_id: {user_id}")
        
        return {
            "success": True,
            "message": "Visage enregistré avec succès (mode simulation)",
            "face_count": ENROLLED_USERS[user_id]["count"]
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
    Vérifier l'identité via reconnaissance faciale (MODE SIMULATION)
    
    En mode simulation, on retourne un utilisateur aléatoire enregistré
    avec une confiance simulée.
    """
    try:
        logger.info("[SIMULATION] Demande de vérification faciale")
        
        # Lire l'image uploadée
        contents = await file.read()
        
        if len(contents) < 100:
            return FaceVerificationResponse(
                success=False,
                confidence=0.0,
                message="Image trop petite. Veuillez uploader une vraie image."
            )
        
        # S'il y a des utilisateurs enregistrés, simuler une reconnaissance
        if ENROLLED_USERS:
            # Choisir un utilisateur aléatoire parmi ceux enregistrés
            user_id = random.choice(list(ENROLLED_USERS.keys()))
            confidence = random.uniform(0.85, 0.98)  # Confiance élevée simulée
            
            logger.info(f"[SIMULATION] Visage reconnu: {user_id}, confiance: {confidence:.2f}")
            
            return FaceVerificationResponse(
                success=True,
                user_id=user_id,
                confidence=round(confidence, 2),
                message=f"Identité vérifiée avec {round(confidence * 100)}% de confiance (simulation)"
            )
        else:
            logger.warning("[SIMULATION] Aucun utilisateur enregistré")
            return FaceVerificationResponse(
                success=False,
                confidence=0.0,
                message="Aucun visage enregistré. Veuillez vous enregistrer d'abord (simulation)."
            )
        
    except Exception as e:
        logger.error(f"Erreur lors de la vérification faciale: {e}")
        raise HTTPException(status_code=500, detail=f"Erreur serveur: {str(e)}")

@app.get("/ml/users-enrolled")
async def get_enrolled_users():
    """Obtenir la liste des utilisateurs avec reconnaissance faciale activée"""
    return {
        "enrolled_users": list(ENROLLED_USERS.keys()),
        "total_count": len(ENROLLED_USERS),
        "mode": "simulation"
    }

@app.delete("/ml/delete-face/{user_id}")
async def delete_face_enrollment(user_id: str, authorization: str = Header(...)):
    """Supprimer l'enregistrement facial d'un utilisateur"""
    if user_id in ENROLLED_USERS:
        del ENROLLED_USERS[user_id]
        logger.info(f"[SIMULATION] Enregistrement facial supprimé pour user_id: {user_id}")
        return {"success": True, "message": "Enregistrement facial supprimé (simulation)"}
    else:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")

if __name__ == "__main__":
    import uvicorn
    print("\n" + "="*60)
    print("🚀 TwoInOne ML Backend - MODE SIMULATION")
    print("="*60)
    print("✅ Démarrage sans dépendances lourdes (OpenCV, face_recognition)")
    print("✅ Parfait pour tester rapidement l'application")
    print("✅ Pour la vraie reconnaissance faciale, voir README.md")
    print("="*60 + "\n")
    uvicorn.run(app, host="0.0.0.0", port=8000)
