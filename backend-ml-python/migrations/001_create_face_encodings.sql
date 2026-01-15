-- Migration 001: Créer la table face_encodings
-- Date: 2026-01-15
-- Description: Table pour stocker les encodages faciaux des utilisateurs

-- Créer la table face_encodings
CREATE TABLE IF NOT EXISTS face_encodings (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    encoding JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour améliorer les performances de recherche par user_id
CREATE INDEX IF NOT EXISTS idx_face_encodings_user_id 
ON face_encodings(user_id);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Supprimer le trigger s'il existe déjà
DROP TRIGGER IF EXISTS update_face_encodings_updated_at ON face_encodings;

-- Créer le trigger pour mettre à jour updated_at
CREATE TRIGGER update_face_encodings_updated_at
BEFORE UPDATE ON face_encodings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Commentaires sur la table et les colonnes
COMMENT ON TABLE face_encodings IS 'Stockage des encodages faciaux pour la reconnaissance faciale';
COMMENT ON COLUMN face_encodings.user_id IS 'ID de l''utilisateur (référence externe)';
COMMENT ON COLUMN face_encodings.encoding IS 'Encodage facial au format JSONB (array de floats)';
COMMENT ON COLUMN face_encodings.created_at IS 'Date de création de l''encodage';
COMMENT ON COLUMN face_encodings.updated_at IS 'Date de dernière modification';
