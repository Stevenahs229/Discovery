# TwoInOne ML Backend - Dockerfile
FROM python:3.11-slim

# Installer les dépendances système
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    libopencv-dev \
    libboost-all-dev \
    libatlas-base-dev \
    libx11-dev \
    libgtk-3-dev \
    libboost-python-dev \
    && rm -rf /var/lib/apt/lists/*

# Créer le répertoire de travail
WORKDIR /app

# Copier les requirements et installer
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copier le code
COPY . .

# Exposer le port
EXPOSE 8000

# Variable d'environnement
ENV PYTHONUNBUFFERED=1

# Démarrage
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
