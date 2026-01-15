"""
Module de gestion de base de données pour TwoInOne ML Backend
Gestion de la persistance des encodages faciaux dans PostgreSQL
"""

import psycopg2
from psycopg2.extras import RealDictCursor, Json
from psycopg2.pool import SimpleConnectionPool
from typing import List, Dict, Optional, Any
import json
import logging
from contextlib import contextmanager

from config import get_app_settings

logger = logging.getLogger(__name__)

# Pool de connexions global
_connection_pool: Optional[SimpleConnectionPool] = None


def init_db_pool():
    """
    Initialiser le pool de connexions à la base de données
    
    Raises:
        Exception: Si la connexion échoue
    """
    global _connection_pool
    
    if _connection_pool is not None:
        logger.info("Pool de connexions déjà initialisé")
        return
    
    settings = get_app_settings()
    
    try:
        _connection_pool = SimpleConnectionPool(
            minconn=1,
            maxconn=10,
            dsn=settings.DATABASE_URL
        )
        logger.info("✅ Pool de connexions PostgreSQL initialisé")
    except Exception as e:
        logger.error(f"❌ Erreur d'initialisation du pool de connexions: {e}")
        raise


def close_db_pool():
    """Fermer le pool de connexions"""
    global _connection_pool
    
    if _connection_pool is not None:
        _connection_pool.closeall()
        _connection_pool = None
        logger.info("Pool de connexions fermé")


@contextmanager
def get_db_connection():
    """
    Context manager pour obtenir une connexion depuis le pool
    
    Usage:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM users")
    """
    if _connection_pool is None:
        init_db_pool()
    
    conn = _connection_pool.getconn()
    try:
        yield conn
        conn.commit()
    except Exception as e:
        conn.rollback()
        logger.error(f"Erreur de transaction: {e}")
        raise
    finally:
        _connection_pool.putconn(conn)


async def create_tables():
    """
    Créer les tables nécessaires si elles n'existent pas
    
    Raises:
        Exception: Si la création échoue
    """
    create_table_sql = """
    CREATE TABLE IF NOT EXISTS face_encodings (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        encoding JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE INDEX IF NOT EXISTS idx_face_encodings_user_id 
    ON face_encodings(user_id);
    
    -- Trigger pour mettre à jour updated_at automatiquement
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
    END;
    $$ language 'plpgsql';
    
    DROP TRIGGER IF EXISTS update_face_encodings_updated_at ON face_encodings;
    
    CREATE TRIGGER update_face_encodings_updated_at
    BEFORE UPDATE ON face_encodings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
    """
    
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(create_table_sql)
            logger.info("✅ Tables créées/vérifiées avec succès")
    except Exception as e:
        logger.error(f"❌ Erreur de création des tables: {e}")
        raise


async def save_face_encoding(user_id: str, encoding: List[float]) -> bool:
    """
    Sauvegarder un encodage facial pour un utilisateur
    
    Args:
        user_id: ID de l'utilisateur
        encoding: Encodage facial (liste de floats)
        
    Returns:
        True si la sauvegarde a réussi
        
    Raises:
        Exception: Si la sauvegarde échoue
    """
    settings = get_app_settings()
    
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            
            # Vérifier le nombre d'encodages existants
            cursor.execute(
                "SELECT COUNT(*) FROM face_encodings WHERE user_id = %s",
                (user_id,)
            )
            count = cursor.fetchone()[0]
            
            # Si on dépasse la limite, supprimer les plus anciens
            if count >= settings.MAX_ENCODINGS_PER_USER:
                cursor.execute(
                    """
                    DELETE FROM face_encodings 
                    WHERE id IN (
                        SELECT id FROM face_encodings 
                        WHERE user_id = %s 
                        ORDER BY created_at ASC 
                        LIMIT %s
                    )
                    """,
                    (user_id, count - settings.MAX_ENCODINGS_PER_USER + 1)
                )
            
            # Insérer le nouvel encodage
            cursor.execute(
                """
                INSERT INTO face_encodings (user_id, encoding)
                VALUES (%s, %s)
                """,
                (user_id, Json(encoding))
            )
            
            logger.info(f"Encodage sauvegardé pour user_id: {user_id}")
            return True
            
    except Exception as e:
        logger.error(f"Erreur de sauvegarde de l'encodage: {e}")
        raise


async def get_face_encodings(user_id: str) -> List[List[float]]:
    """
    Récupérer tous les encodages faciaux d'un utilisateur
    
    Args:
        user_id: ID de l'utilisateur
        
    Returns:
        Liste des encodages faciaux
    """
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor(cursor_factory=RealDictCursor)
            cursor.execute(
                """
                SELECT encoding FROM face_encodings 
                WHERE user_id = %s 
                ORDER BY created_at DESC
                """,
                (user_id,)
            )
            
            rows = cursor.fetchall()
            encodings = [row['encoding'] for row in rows]
            
            return encodings
            
    except Exception as e:
        logger.error(f"Erreur de récupération des encodages: {e}")
        return []


async def get_all_face_encodings() -> Dict[str, List[List[float]]]:
    """
    Récupérer tous les encodages faciaux de tous les utilisateurs
    
    Returns:
        Dictionnaire {user_id: [encodages]}
    """
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor(cursor_factory=RealDictCursor)
            cursor.execute(
                """
                SELECT user_id, encoding FROM face_encodings 
                ORDER BY user_id, created_at DESC
                """
            )
            
            rows = cursor.fetchall()
            
            # Grouper par user_id
            encodings_by_user = {}
            for row in rows:
                user_id = row['user_id']
                if user_id not in encodings_by_user:
                    encodings_by_user[user_id] = []
                encodings_by_user[user_id].append(row['encoding'])
            
            return encodings_by_user
            
    except Exception as e:
        logger.error(f"Erreur de récupération de tous les encodages: {e}")
        return {}


async def delete_face_encodings(user_id: str) -> bool:
    """
    Supprimer tous les encodages faciaux d'un utilisateur
    
    Args:
        user_id: ID de l'utilisateur
        
    Returns:
        True si la suppression a réussi
    """
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "DELETE FROM face_encodings WHERE user_id = %s",
                (user_id,)
            )
            
            deleted_count = cursor.rowcount
            logger.info(f"Supprimé {deleted_count} encodage(s) pour user_id: {user_id}")
            
            return deleted_count > 0
            
    except Exception as e:
        logger.error(f"Erreur de suppression des encodages: {e}")
        raise


async def get_enrolled_users() -> List[str]:
    """
    Récupérer la liste des user_ids ayant des encodages faciaux
    
    Returns:
        Liste des user_ids
    """
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "SELECT DISTINCT user_id FROM face_encodings ORDER BY user_id"
            )
            
            rows = cursor.fetchall()
            user_ids = [row[0] for row in rows]
            
            return user_ids
            
    except Exception as e:
        logger.error(f"Erreur de récupération des utilisateurs: {e}")
        return []


async def get_user_encoding_count(user_id: str) -> int:
    """
    Obtenir le nombre d'encodages pour un utilisateur
    
    Args:
        user_id: ID de l'utilisateur
        
    Returns:
        Nombre d'encodages
    """
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "SELECT COUNT(*) FROM face_encodings WHERE user_id = %s",
                (user_id,)
            )
            
            count = cursor.fetchone()[0]
            return count
            
    except Exception as e:
        logger.error(f"Erreur de comptage des encodages: {e}")
        return 0
