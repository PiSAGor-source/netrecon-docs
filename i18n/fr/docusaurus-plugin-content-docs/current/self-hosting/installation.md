---
sidebar_position: 2
title: Installation
description: Guide de déploiement auto-hébergé étape par étape
---

# Installation auto-hébergée

Ce guide vous accompagne dans le déploiement de la plateforme NetRecon sur votre propre serveur à l'aide de Docker Compose.

## Prérequis

- Un serveur Linux (Ubuntu 22.04+ recommandé) ou Windows Server avec Docker
- Docker v24.0+ et Docker Compose v2.20+
- Un nom de domaine pointant vers votre serveur (par ex., `netrecon.yourcompany.com`)
- Un certificat TLS pour votre domaine (ou utilisez Let's Encrypt)
- Au moins 4 Go de RAM et 40 Go d'espace disque

## Installation sur VPS Linux

### Étape 1 : Installer Docker

```bash
# Mettre à jour le système
sudo apt update && sudo apt upgrade -y

# Installer Docker
curl -fsSL https://get.docker.com | sudo sh

# Ajouter votre utilisateur au groupe docker
sudo usermod -aG docker $USER

# Installer le plugin Docker Compose
sudo apt install docker-compose-plugin -y

# Vérifier l'installation
docker --version
docker compose version
```

### Étape 2 : Créer le répertoire du projet

```bash
sudo mkdir -p /opt/netrecon
cd /opt/netrecon
```

### Étape 3 : Créer le fichier d'environnement

```bash
sudo tee /opt/netrecon/.env << 'EOF'
# Configuration NetRecon auto-hébergé
NETRECON_DOMAIN=netrecon.yourcompany.com
NETRECON_EMAIL=admin@yourcompany.com

# PostgreSQL
POSTGRES_USER=netrecon
POSTGRES_PASSWORD=CHANGE_ME_TO_A_STRONG_PASSWORD
POSTGRES_DB=netrecon

# Redis
REDIS_PASSWORD=CHANGE_ME_TO_A_STRONG_PASSWORD

# JWT Secret (générer avec : openssl rand -hex 32)
JWT_SECRET=CHANGE_ME_TO_A_RANDOM_HEX_STRING

# Agent Registry
AGENT_REGISTRY_SECRET=CHANGE_ME_TO_A_RANDOM_HEX_STRING
AGENT_JWT_SECRET=CHANGE_ME_TO_A_RANDOM_HEX_STRING

# Email (SMTP)
SMTP_HOST=smtp.yourcompany.com
SMTP_PORT=587
SMTP_USER=noreply@yourcompany.com
SMTP_PASSWORD=CHANGE_ME
SMTP_FROM=NetRecon <noreply@yourcompany.com>

# Licence
LICENSE_KEY=your-license-key
EOF
```

:::warning
Modifiez tous les mots de passe et secrets par défaut avant le déploiement. Utilisez `openssl rand -hex 32` pour générer des valeurs aléatoires sécurisées.
:::

### Étape 4 : Créer le fichier Docker Compose

```bash
sudo tee /opt/netrecon/docker-compose.yml << 'YAML'
version: "3.9"

services:
  postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "-a", "${REDIS_PASSWORD}", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  api-gateway:
    image: netrecon/api-gateway:latest
    restart: unless-stopped
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
      REDIS_URL: redis://:${REDIS_PASSWORD}@redis:6379/0
      JWT_SECRET: ${JWT_SECRET}
      LICENSE_KEY: ${LICENSE_KEY}
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy

  vault-server:
    image: netrecon/vault-server:latest
    restart: unless-stopped
    ports:
      - "8001:8001"
    environment:
      DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
      JWT_SECRET: ${JWT_SECRET}
    depends_on:
      postgres:
        condition: service_healthy

  license-server:
    image: netrecon/license-server:latest
    restart: unless-stopped
    ports:
      - "8002:8002"
    environment:
      DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
      LICENSE_KEY: ${LICENSE_KEY}
    depends_on:
      postgres:
        condition: service_healthy

  email-service:
    image: netrecon/email-service:latest
    restart: unless-stopped
    ports:
      - "8003:8003"
    environment:
      SMTP_HOST: ${SMTP_HOST}
      SMTP_PORT: ${SMTP_PORT}
      SMTP_USER: ${SMTP_USER}
      SMTP_PASSWORD: ${SMTP_PASSWORD}
      SMTP_FROM: ${SMTP_FROM}

  notification-service:
    image: netrecon/notification-service:latest
    restart: unless-stopped
    ports:
      - "8004:8004"
    environment:
      DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
      REDIS_URL: redis://:${REDIS_PASSWORD}@redis:6379/1
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy

  update-server:
    image: netrecon/update-server:latest
    restart: unless-stopped
    ports:
      - "8005:8005"
    volumes:
      - update_data:/data/updates

  agent-registry:
    image: netrecon/agent-registry:latest
    restart: unless-stopped
    ports:
      - "8006:8006"
    environment:
      DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
      AGENT_REGISTRY_SECRET: ${AGENT_REGISTRY_SECRET}
      AGENT_JWT_SECRET: ${AGENT_JWT_SECRET}
    depends_on:
      postgres:
        condition: service_healthy

  warranty-service:
    image: netrecon/warranty-service:latest
    restart: unless-stopped
    ports:
      - "8007:8007"
    environment:
      DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
    depends_on:
      postgres:
        condition: service_healthy

  cmod-service:
    image: netrecon/cmod-service:latest
    restart: unless-stopped
    ports:
      - "8008:8008"
    environment:
      DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
      REDIS_URL: redis://:${REDIS_PASSWORD}@redis:6379/2
    depends_on:
      postgres:
        condition: service_healthy

  ipam-service:
    image: netrecon/ipam-service:latest
    restart: unless-stopped
    ports:
      - "8009:8009"
    environment:
      DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
    depends_on:
      postgres:
        condition: service_healthy

  nginx:
    image: nginx:alpine
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./certs:/etc/nginx/certs:ro
    depends_on:
      - api-gateway

volumes:
  postgres_data:
  redis_data:
  update_data:
YAML
```

### Étape 5 : Créer la configuration Nginx

```bash
sudo tee /opt/netrecon/nginx.conf << 'CONF'
events {
    worker_connections 1024;
}

http {
    upstream api_gateway {
        server api-gateway:8000;
    }

    server {
        listen 80;
        server_name ${NETRECON_DOMAIN};
        return 301 https://$host$request_uri;
    }

    server {
        listen 443 ssl;
        server_name ${NETRECON_DOMAIN};

        ssl_certificate /etc/nginx/certs/fullchain.pem;
        ssl_certificate_key /etc/nginx/certs/privkey.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;

        location / {
            proxy_pass http://api_gateway;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /ws {
            proxy_pass http://api_gateway;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
        }
    }
}
CONF
```

### Étape 6 : Configurer les certificats TLS

**Option A : Let's Encrypt (recommandé pour les serveurs accessibles depuis Internet)**

```bash
sudo apt install certbot -y
sudo certbot certonly --standalone -d netrecon.yourcompany.com

# Copier les certificats
sudo mkdir -p /opt/netrecon/certs
sudo cp /etc/letsencrypt/live/netrecon.yourcompany.com/fullchain.pem /opt/netrecon/certs/
sudo cp /etc/letsencrypt/live/netrecon.yourcompany.com/privkey.pem /opt/netrecon/certs/
```

**Option B : Certificat auto-signé (pour usage interne/test)**

```bash
sudo mkdir -p /opt/netrecon/certs
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /opt/netrecon/certs/privkey.pem \
  -out /opt/netrecon/certs/fullchain.pem \
  -subj "/CN=netrecon.yourcompany.com"
```

### Étape 7 : Déployer

```bash
cd /opt/netrecon
sudo docker compose up -d
```

Vérifiez que tous les services fonctionnent :
```bash
sudo docker compose ps
```

### Étape 8 : Accéder au tableau de bord

Ouvrez votre navigateur et accédez à :
```
https://netrecon.yourcompany.com
```

Créez le compte administrateur initial lors du premier accès.

## Installation sur Windows Server

### Étape 1 : Installer Docker Desktop

1. Téléchargez Docker Desktop depuis [docker.com](https://www.docker.com/products/docker-desktop/)
2. Installez avec le backend WSL2 activé
3. Redémarrez le serveur

### Étape 2 : Suivre les étapes Linux

La configuration Docker Compose est identique. Ouvrez PowerShell et suivez les étapes 2 à 8 ci-dessus en ajustant les chemins :

```powershell
mkdir C:\netrecon
cd C:\netrecon
# Créez .env et docker-compose.yml comme ci-dessus
docker compose up -d
```

## Post-installation

### Migrations de base de données

Les migrations s'exécutent automatiquement au premier démarrage. Pour les déclencher manuellement :

```bash
docker compose exec api-gateway python manage.py migrate
```

### Configuration des sauvegardes

Configurez des sauvegardes quotidiennes de PostgreSQL :

```bash
# Ajouter au crontab
echo "0 2 * * * docker compose -f /opt/netrecon/docker-compose.yml exec -T postgres pg_dump -U netrecon netrecon | gzip > /opt/netrecon/backups/db-\$(date +\%Y\%m\%d).sql.gz" | sudo crontab -
```

### Surveillance

Vérifiez l'état de santé des services :

```bash
# Statut de tous les services
docker compose ps

# Journaux des services
docker compose logs -f api-gateway

# Utilisation des ressources
docker stats
```

## Mise à jour

```bash
cd /opt/netrecon

# Récupérer les dernières images
docker compose pull

# Redémarrer avec les nouvelles images
docker compose up -d

# Vérifier
docker compose ps
```

## Résolution de problèmes

### Les services ne démarrent pas
```bash
# Vérifier les journaux du service défaillant
docker compose logs <service-name>

# Problème courant : PostgreSQL pas encore prêt
# Solution : attendre et réessayer, ou augmenter le nombre de tentatives du healthcheck
```

### Impossible d'accéder au tableau de bord
- Vérifiez que le port 443 est ouvert dans votre pare-feu
- Vérifiez que les certificats existent dans le répertoire certs
- Vérifiez que le DNS du domaine pointe vers votre serveur

### Erreurs de connexion à la base de données
- Vérifiez que PostgreSQL est sain : `docker compose exec postgres pg_isready`
- Vérifiez que les identifiants dans `.env` correspondent pour tous les services

## FAQ

**Q : Puis-je utiliser une base de données PostgreSQL externe ?**
R : Oui. Supprimez le service `postgres` de docker-compose.yml et mettez à jour la variable d'environnement `DATABASE_URL` pour pointer vers votre base de données externe.

**Q : Comment dimensionner pour la haute disponibilité ?**
R : Pour les déploiements HA, utilisez Kubernetes avec les charts Helm fournis. Docker Compose convient aux déploiements sur serveur unique.

**Q : Puis-je utiliser un autre reverse proxy (par ex., Traefik, Caddy) ?**
R : Oui. Remplacez le service Nginx par votre reverse proxy préféré. Assurez-vous qu'il redirige vers l'API Gateway sur le port 8000 et qu'il prend en charge les mises à niveau WebSocket.

Pour obtenir de l'aide supplémentaire, contactez [support@netreconapp.com](mailto:support@netreconapp.com).
