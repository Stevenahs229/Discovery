# 🔐 Guide de Déploiement Sécurisé - Backend ML Python

## 🚀 Démarrage Rapide

### 1. Configuration de l'Environnement

```bash
# Copier le template d'environnement
cp .env.example .env

# Éditer .env avec vos vraies valeurs
nano .env
```

**Variables requises:**
- `DATABASE_URL`: URL PostgreSQL
- `SUPABASE_URL` et `SUPABASE_ANON_KEY`: Configuration Supabase
- `JWT_SECRET_KEY`: Clé secrète pour JWT (générer avec `openssl rand -hex 32`)
- `ALLOWED_ORIGINS`: Domaines autorisés (ex: `https://app.example.com`)

### 2. Déploiement avec Docker

```bash
# Build et démarrer
docker-compose up -d

# Vérifier les logs
docker-compose logs -f

# Vérifier le health
curl http://localhost:8000/ml/health
```

### 3. Migration de la Base de Données

```bash
# Se connecter à PostgreSQL
psql $DATABASE_URL

# Exécuter la migration
\i migrations/001_create_face_encodings.sql
```

---

## 🔒 Sécurité

### Authentification JWT

Tous les endpoints protégés requièrent un token JWT valide:

```bash
# Exemple de requête avec JWT
curl -X POST http://localhost:8000/ml/enroll-face \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@photo.jpg"
```

**Format du token JWT:**
```json
{
  "sub": "user-id-123",
  "email": "user@example.com",
  "role": "user",
  "exp": 1234567890
}
```

### CORS

Les origines autorisées sont configurées via `ALLOWED_ORIGINS` dans `.env`:

```env
ALLOWED_ORIGINS=https://app.example.com,https://www.example.com
```

---

## 📡 API Endpoints

### Health Check (Public)

```bash
GET /ml/health
```

**Réponse:**
```json
{
  "status": "healthy",
  "environment": "production",
  "ml_libraries": {...},
  "enrolled_users_count": 42
}
```

### Enregistrer un Visage (Authentifié)

```bash
POST /ml/enroll-face
Headers: Authorization: Bearer <JWT>
Body: file (image)
```

### Vérifier un Visage (Optionnel JWT)

```bash
POST /ml/verify-face
Headers: Authorization: Bearer <JWT> (optionnel)
Body: file (image)
```

### Lister les Utilisateurs (Authentifié)

```bash
GET /ml/users-enrolled
Headers: Authorization: Bearer <JWT>
```

### Supprimer un Enregistrement (Authentifié)

```bash
DELETE /ml/delete-face/{user_id}
Headers: Authorization: Bearer <JWT>
```

---

## 🗄️ Base de Données

### Structure

Table `face_encodings`:
- `id`: Serial (PK)
- `user_id`: VARCHAR(255)
- `encoding`: JSONB (array de floats)
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

### Connexion

Le backend utilise un pool de connexions PostgreSQL (1-10 connexions).

---

## 🐳 Docker

### Configuration

- **Healthcheck**: Vérifie `/ml/health` toutes les 30s
- **Resource Limits**: 2 CPU / 2GB RAM max
- **Restart Policy**: `unless-stopped`
- **Volumes**: `./models`, `./logs`

### Commandes Utiles

```bash
# Voir les logs
docker-compose logs -f twoinone-ml

# Redémarrer
docker-compose restart

# Arrêter
docker-compose down

# Rebuild
docker-compose build --no-cache
```

---

## 🧪 Tests

### Tests Automatisés

```bash
# Installer les dépendances de test
pip install -r requirements.txt

# Exécuter les tests
python test_ml_api.py
```

### Tests Manuels

```bash
# Health check
curl http://localhost:8000/ml/health

# Enregistrer (nécessite un JWT valide)
curl -X POST http://localhost:8000/ml/enroll-face \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@test_face.jpg"
```

---

## 🔧 Configuration Avancée

### Variables d'Environnement

| Variable | Description | Défaut |
|----------|-------------|--------|
| `FACE_RECOGNITION_THRESHOLD` | Seuil de confiance (0.0-1.0) | 0.6 |
| `MAX_ENCODINGS_PER_USER` | Encodages max par utilisateur | 5 |
| `LOG_LEVEL` | Niveau de log | INFO |
| `ENVIRONMENT` | dev/staging/production | development |

### Logs

Les logs sont stockés dans `./logs/` et affichés dans stdout.

---

## 🚨 Dépannage

### Erreur: "Missing env vars"

**Solution**: Vérifiez que toutes les variables requises sont dans `.env`

### Erreur: "Database connection failed"

**Solution**: Vérifiez `DATABASE_URL` et que PostgreSQL est accessible

### Erreur: "Token invalide"

**Solution**: Vérifiez que `JWT_SECRET_KEY` est identique entre services

### Healthcheck échoue

**Solution**: 
```bash
# Vérifier les logs
docker-compose logs twoinone-ml

# Tester manuellement
docker exec twoinone-ml-api curl http://localhost:8000/ml/health
```

---

## 📚 Documentation Complète

- [Installation Facile](INSTALLATION_FACILE.md) - Guide pas à pas
- [README Détaillé](README_DETAILLE.md) - Documentation approfondie
- [Migrations](migrations/) - Scripts SQL

---

## 🔐 Checklist de Sécurité

Avant le déploiement en production:

- [ ] `JWT_SECRET_KEY` est une clé forte (32+ caractères)
- [ ] `ALLOWED_ORIGINS` contient uniquement vos domaines
- [ ] `DATABASE_URL` utilise SSL (`?sslmode=require`)
- [ ] `.env` n'est PAS commité dans Git
- [ ] Les logs ne contiennent pas de secrets
- [ ] Le healthcheck fonctionne
- [ ] Les tests passent

---

**Backend ML Python - Sécurisé et Prêt pour la Production ! 🚀🔒**
