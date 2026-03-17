---
sidebar_position: 2
title: Installation
description: Schritt-für-Schritt-Anleitung zur Self-Hosted-Bereitstellung
---

# Self-Hosted-Installation

Diese Anleitung führt Sie durch die Bereitstellung der NetRecon-Plattform auf Ihrem eigenen Server mit Docker Compose.

## Voraussetzungen

- Ein Linux-Server (Ubuntu 22.04+ empfohlen) oder Windows Server mit Docker
- Docker v24.0+ und Docker Compose v2.20+
- Ein Domainname, der auf Ihren Server zeigt (z. B. `netrecon.yourcompany.com`)
- TLS-Zertifikat für Ihre Domain (oder Let's Encrypt verwenden)
- Mindestens 4 GB RAM und 40 GB Speicherplatz

## Linux VPS Installation

### Schritt 1: Docker installieren

```bash
# System aktualisieren
sudo apt update && sudo apt upgrade -y

# Docker installieren
curl -fsSL https://get.docker.com | sudo sh

# Benutzer zur Docker-Gruppe hinzufügen
sudo usermod -aG docker $USER

# Docker Compose Plugin installieren
sudo apt install docker-compose-plugin -y

# Installation überprüfen
docker --version
docker compose version
```

### Schritt 2: Projektverzeichnis erstellen

```bash
sudo mkdir -p /opt/netrecon
cd /opt/netrecon
```

### Schritt 3: Umgebungsdatei erstellen

```bash
sudo tee /opt/netrecon/.env << 'EOF'
# NetRecon Self-Hosted Configuration
NETRECON_DOMAIN=netrecon.yourcompany.com
NETRECON_EMAIL=admin@yourcompany.com

# PostgreSQL
POSTGRES_USER=netrecon
POSTGRES_PASSWORD=CHANGE_ME_TO_A_STRONG_PASSWORD
POSTGRES_DB=netrecon

# Redis
REDIS_PASSWORD=CHANGE_ME_TO_A_STRONG_PASSWORD

# JWT Secret (generate with: openssl rand -hex 32)
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

# License
LICENSE_KEY=your-license-key
EOF
```

:::warning
Ändern Sie alle Platzhalter-Passwörter und Geheimnisse vor der Bereitstellung. Verwenden Sie `openssl rand -hex 32`, um sichere Zufallswerte zu generieren.
:::

### Schritt 4: Docker Compose-Datei erstellen

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

### Schritt 5: Nginx-Konfiguration erstellen

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

### Schritt 6: TLS-Zertifikate einrichten

**Option A: Let's Encrypt (empfohlen für internetfähige Server)**

```bash
sudo apt install certbot -y
sudo certbot certonly --standalone -d netrecon.yourcompany.com

# Zertifikate kopieren
sudo mkdir -p /opt/netrecon/certs
sudo cp /etc/letsencrypt/live/netrecon.yourcompany.com/fullchain.pem /opt/netrecon/certs/
sudo cp /etc/letsencrypt/live/netrecon.yourcompany.com/privkey.pem /opt/netrecon/certs/
```

**Option B: Selbstsigniertes Zertifikat (für interne/Testumgebungen)**

```bash
sudo mkdir -p /opt/netrecon/certs
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /opt/netrecon/certs/privkey.pem \
  -out /opt/netrecon/certs/fullchain.pem \
  -subj "/CN=netrecon.yourcompany.com"
```

### Schritt 7: Bereitstellen

```bash
cd /opt/netrecon
sudo docker compose up -d
```

Überprüfen Sie, ob alle Services laufen:
```bash
sudo docker compose ps
```

### Schritt 8: Dashboard aufrufen

Öffnen Sie Ihren Browser und navigieren Sie zu:
```
https://netrecon.yourcompany.com
```

Erstellen Sie beim ersten Zugriff das initiale Administratorkonto.

## Windows Server Installation

### Schritt 1: Docker Desktop installieren

1. Laden Sie Docker Desktop von [docker.com](https://www.docker.com/products/docker-desktop/) herunter
2. Installieren Sie es mit aktiviertem WSL2-Backend
3. Starten Sie den Server neu

### Schritt 2: Linux-Schritte befolgen

Das Docker Compose-Setup ist identisch. Öffnen Sie PowerShell und befolgen Sie die Schritte 2-8 oben, wobei Sie die Pfade anpassen:

```powershell
mkdir C:\netrecon
cd C:\netrecon
# .env und docker-compose.yml wie oben erstellen
docker compose up -d
```

## Nach der Installation

### Datenbankmigrationen

Migrationen werden beim ersten Start automatisch ausgeführt. Zum manuellen Auslösen:

```bash
docker compose exec api-gateway python manage.py migrate
```

### Backup-Konfiguration

Tägliche PostgreSQL-Backups einrichten:

```bash
# Zum Crontab hinzufügen
echo "0 2 * * * docker compose -f /opt/netrecon/docker-compose.yml exec -T postgres pg_dump -U netrecon netrecon | gzip > /opt/netrecon/backups/db-\$(date +\%Y\%m\%d).sql.gz" | sudo crontab -
```

### Überwachung

Service-Zustand prüfen:

```bash
# Status aller Services
docker compose ps

# Service-Protokolle
docker compose logs -f api-gateway

# Ressourcenverbrauch
docker stats
```

## Aktualisierung

```bash
cd /opt/netrecon

# Neueste Images herunterladen
docker compose pull

# Mit neuen Images neu starten
docker compose up -d

# Überprüfen
docker compose ps
```

## Fehlerbehebung

### Services starten nicht
```bash
# Protokolle des fehlerhaften Services prüfen
docker compose logs <service-name>

# Häufiges Problem: PostgreSQL noch nicht bereit
# Lösung: Warten und erneut versuchen oder Healthcheck-Wiederholungen erhöhen
```

### Dashboard nicht erreichbar
- Überprüfen Sie, ob Port 443 in Ihrer Firewall geöffnet ist
- Prüfen Sie, ob Zertifikate im certs-Verzeichnis vorhanden sind
- Stellen Sie sicher, dass der Domain-DNS auf Ihren Server zeigt

### Datenbankverbindungsfehler
- Überprüfen Sie, ob PostgreSQL gesund ist: `docker compose exec postgres pg_isready`
- Prüfen Sie, ob die Anmeldedaten in `.env` bei allen Services übereinstimmen

## FAQ

**F: Kann ich eine externe PostgreSQL-Datenbank verwenden?**
A: Ja. Entfernen Sie den `postgres`-Service aus docker-compose.yml und aktualisieren Sie die Umgebungsvariable `DATABASE_URL`, damit sie auf Ihre externe Datenbank verweist.

**F: Wie skaliere ich für Hochverfügbarkeit?**
A: Für HA-Bereitstellungen verwenden Sie Kubernetes mit den bereitgestellten Helm Charts. Docker Compose ist für Einzelserver-Bereitstellungen geeignet.

**F: Kann ich einen anderen Reverse Proxy verwenden (z. B. Traefik, Caddy)?**
A: Ja. Ersetzen Sie den Nginx-Service durch Ihren bevorzugten Reverse Proxy. Stellen Sie sicher, dass er an das API Gateway auf Port 8000 weiterleitet und WebSocket-Upgrades unterstützt.

Für weitere Hilfe kontaktieren Sie [support@netreconapp.com](mailto:support@netreconapp.com).
