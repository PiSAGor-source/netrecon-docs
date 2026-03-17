---
sidebar_position: 2
title: Installatie
description: Stapsgewijze handleiding voor self-hosted implementatie
---

# Self-hosted installatie

Deze handleiding begeleidt u bij het implementeren van het NetRecon-platform op uw eigen server met Docker Compose.

## Vereisten

- Een Linux-server (Ubuntu 22.04+ aanbevolen) of Windows Server met Docker
- Docker v24.0+ en Docker Compose v2.20+
- Een domeinnaam die naar uw server verwijst (bijv. `netrecon.uwbedrijf.com`)
- TLS-certificaat voor uw domein (of gebruik Let's Encrypt)
- Minimaal 4 GB RAM en 40 GB schijfruimte

## Linux VPS-installatie

### Stap 1: Installeer Docker

```bash
# Systeem bijwerken
sudo apt update && sudo apt upgrade -y

# Docker installeren
curl -fsSL https://get.docker.com | sudo sh

# Uw gebruiker toevoegen aan de docker-groep
sudo usermod -aG docker $USER

# Docker Compose-plugin installeren
sudo apt install docker-compose-plugin -y

# Installatie verifiëren
docker --version
docker compose version
```

### Stap 2: Maak de projectmap aan

```bash
sudo mkdir -p /opt/netrecon
cd /opt/netrecon
```

### Stap 3: Maak het omgevingsbestand aan

```bash
sudo tee /opt/netrecon/.env << 'EOF'
# NetRecon Self-Hosted Configuratie
NETRECON_DOMAIN=netrecon.uwbedrijf.com
NETRECON_EMAIL=admin@uwbedrijf.com

# PostgreSQL
POSTGRES_USER=netrecon
POSTGRES_PASSWORD=WIJZIG_NAAR_EEN_STERK_WACHTWOORD
POSTGRES_DB=netrecon

# Redis
REDIS_PASSWORD=WIJZIG_NAAR_EEN_STERK_WACHTWOORD

# JWT Secret (genereer met: openssl rand -hex 32)
JWT_SECRET=WIJZIG_NAAR_EEN_WILLEKEURIGE_HEX_STRING

# Agent Registry
AGENT_REGISTRY_SECRET=WIJZIG_NAAR_EEN_WILLEKEURIGE_HEX_STRING
AGENT_JWT_SECRET=WIJZIG_NAAR_EEN_WILLEKEURIGE_HEX_STRING

# E-mail (SMTP)
SMTP_HOST=smtp.uwbedrijf.com
SMTP_PORT=587
SMTP_USER=noreply@uwbedrijf.com
SMTP_PASSWORD=WIJZIG_DIT
SMTP_FROM=NetRecon <noreply@uwbedrijf.com>

# Licentie
LICENSE_KEY=uw-licentiesleutel
EOF
```

:::warning
Wijzig alle tijdelijke wachtwoorden en geheimen voordat u implementeert. Gebruik `openssl rand -hex 32` om veilige willekeurige waarden te genereren.
:::

### Stap 4: Maak het Docker Compose-bestand aan

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

### Stap 5: Maak de Nginx-configuratie aan

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

### Stap 6: Stel TLS-certificaten in

**Optie A: Let's Encrypt (aanbevolen voor servers met internettoegang)**

```bash
sudo apt install certbot -y
sudo certbot certonly --standalone -d netrecon.uwbedrijf.com

# Certificaten kopiëren
sudo mkdir -p /opt/netrecon/certs
sudo cp /etc/letsencrypt/live/netrecon.uwbedrijf.com/fullchain.pem /opt/netrecon/certs/
sudo cp /etc/letsencrypt/live/netrecon.uwbedrijf.com/privkey.pem /opt/netrecon/certs/
```

**Optie B: Zelfondertekend certificaat (voor intern/testen)**

```bash
sudo mkdir -p /opt/netrecon/certs
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /opt/netrecon/certs/privkey.pem \
  -out /opt/netrecon/certs/fullchain.pem \
  -subj "/CN=netrecon.uwbedrijf.com"
```

### Stap 7: Implementeren

```bash
cd /opt/netrecon
sudo docker compose up -d
```

Controleer of alle services draaien:
```bash
sudo docker compose ps
```

### Stap 8: Ga naar het Dashboard

Open uw browser en navigeer naar:
```
https://netrecon.uwbedrijf.com
```

Maak bij de eerste toegang het initiële beheerdersaccount aan.

## Windows Server-installatie

### Stap 1: Installeer Docker Desktop

1. Download Docker Desktop van [docker.com](https://www.docker.com/products/docker-desktop/)
2. Installeer met WSL2-backend ingeschakeld
3. Herstart de server

### Stap 2: Volg de Linux-stappen

De Docker Compose-configuratie is identiek. Open PowerShell en volg stappen 2-8 hierboven, met aangepaste paden:

```powershell
mkdir C:\netrecon
cd C:\netrecon
# Maak .env en docker-compose.yml aan zoals hierboven
docker compose up -d
```

## Na de installatie

### Databasemigraties

Migraties worden automatisch uitgevoerd bij de eerste start. Om handmatig te activeren:

```bash
docker compose exec api-gateway python manage.py migrate
```

### Back-upconfiguratie

Stel dagelijkse PostgreSQL-back-ups in:

```bash
# Toevoegen aan crontab
echo "0 2 * * * docker compose -f /opt/netrecon/docker-compose.yml exec -T postgres pg_dump -U netrecon netrecon | gzip > /opt/netrecon/backups/db-\$(date +\%Y\%m\%d).sql.gz" | sudo crontab -
```

### Monitoring

Controleer de servicestatus:

```bash
# Status van alle services
docker compose ps

# Servicelogboeken
docker compose logs -f api-gateway

# Bronnengebruik
docker stats
```

## Bijwerken

```bash
cd /opt/netrecon

# Laatste images ophalen
docker compose pull

# Herstarten met nieuwe images
docker compose up -d

# Verifiëren
docker compose ps
```

## Probleemoplossing

### Services starten niet
```bash
# Bekijk logboeken van de falende service
docker compose logs <servicenaam>

# Veelvoorkomend probleem: PostgreSQL nog niet gereed
# Oplossing: wacht en probeer opnieuw, of verhoog het aantal healthcheck-pogingen
```

### Kan het dashboard niet bereiken
- Controleer of poort 443 open is in uw firewall
- Controleer of certificaten aanwezig zijn in de certs-map
- Controleer of het DNS-domein naar uw server verwijst

### Databaseverbindingsfouten
- Controleer of PostgreSQL gezond is: `docker compose exec postgres pg_isready`
- Controleer of de inloggegevens in `.env` overeenkomen bij alle services

## Veelgestelde vragen

**V: Kan ik een externe PostgreSQL-database gebruiken?**
A: Ja. Verwijder de `postgres`-service uit docker-compose.yml en werk de `DATABASE_URL`-omgevingsvariabele bij om naar uw externe database te verwijzen.

**V: Hoe schaal ik voor hoge beschikbaarheid?**
A: Gebruik voor HA-implementaties Kubernetes met de meegeleverde Helm charts. Docker Compose is geschikt voor implementaties op een enkele server.

**V: Kan ik een andere reverse proxy gebruiken (bijv. Traefik, Caddy)?**
A: Ja. Vervang de Nginx-service door uw voorkeurs-reverse proxy. Zorg ervoor dat deze doorstuurt naar de API Gateway op poort 8000 en WebSocket-upgrades ondersteunt.

Voor aanvullende hulp kunt u contact opnemen met [support@netreconapp.com](mailto:support@netreconapp.com).
