---
sidebar_position: 2
title: Installasjon
description: Trinnvis guide for selvhostet distribusjon
---

# Selvhostet installasjon

Denne guiden leder deg gjennom distribusjon av NetRecon-plattformen pa din egen server ved hjelp av Docker Compose.

## Forutsetninger

- En Linux-server (Ubuntu 22.04+ anbefalt) eller Windows Server med Docker
- Docker v24.0+ og Docker Compose v2.20+
- Et domenenavn som peker til serveren din (f.eks. `netrecon.yourcompany.com`)
- TLS-sertifikat for domenet ditt (eller bruk Let's Encrypt)
- Minst 4 GB RAM og 40 GB diskplass

## Linux VPS-installasjon

### Trinn 1: Installer Docker

```bash
# Oppdater systemet
sudo apt update && sudo apt upgrade -y

# Installer Docker
curl -fsSL https://get.docker.com | sudo sh

# Legg brukeren din til docker-gruppen
sudo usermod -aG docker $USER

# Installer Docker Compose-plugin
sudo apt install docker-compose-plugin -y

# Bekreft installasjonen
docker --version
docker compose version
```

### Trinn 2: Opprett prosjektkatalogen

```bash
sudo mkdir -p /opt/netrecon
cd /opt/netrecon
```

### Trinn 3: Opprett miljofilen

```bash
sudo tee /opt/netrecon/.env << 'EOF'
# NetRecon selvhostet konfigurasjon
NETRECON_DOMAIN=netrecon.yourcompany.com
NETRECON_EMAIL=admin@yourcompany.com

# PostgreSQL
POSTGRES_USER=netrecon
POSTGRES_PASSWORD=ENDRE_MEG_TIL_ET_STERKT_PASSORD
POSTGRES_DB=netrecon

# Redis
REDIS_PASSWORD=ENDRE_MEG_TIL_ET_STERKT_PASSORD

# JWT-hemmelighet (generer med: openssl rand -hex 32)
JWT_SECRET=ENDRE_MEG_TIL_EN_TILFELDIG_HEX_STRENG

# Agentregister
AGENT_REGISTRY_SECRET=ENDRE_MEG_TIL_EN_TILFELDIG_HEX_STRENG
AGENT_JWT_SECRET=ENDRE_MEG_TIL_EN_TILFELDIG_HEX_STRENG

# E-post (SMTP)
SMTP_HOST=smtp.yourcompany.com
SMTP_PORT=587
SMTP_USER=noreply@yourcompany.com
SMTP_PASSWORD=ENDRE_MEG
SMTP_FROM=NetRecon <noreply@yourcompany.com>

# Lisens
LICENSE_KEY=din-lisensnokkel
EOF
```

:::warning
Endre alle plassholderpassord og hemmeligheter for du distribuerer. Bruk `openssl rand -hex 32` for a generere sikre tilfeldige verdier.
:::

### Trinn 4: Opprett Docker Compose-filen

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

### Trinn 5: Opprett Nginx-konfigurasjonen

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

### Trinn 6: Sett opp TLS-sertifikater

**Alternativ A: Let's Encrypt (anbefalt for internett-tilgjengelige servere)**

```bash
sudo apt install certbot -y
sudo certbot certonly --standalone -d netrecon.yourcompany.com

# Kopier sertifikater
sudo mkdir -p /opt/netrecon/certs
sudo cp /etc/letsencrypt/live/netrecon.yourcompany.com/fullchain.pem /opt/netrecon/certs/
sudo cp /etc/letsencrypt/live/netrecon.yourcompany.com/privkey.pem /opt/netrecon/certs/
```

**Alternativ B: Selvsignert sertifikat (for internt bruk/testing)**

```bash
sudo mkdir -p /opt/netrecon/certs
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /opt/netrecon/certs/privkey.pem \
  -out /opt/netrecon/certs/fullchain.pem \
  -subj "/CN=netrecon.yourcompany.com"
```

### Trinn 7: Distribuer

```bash
cd /opt/netrecon
sudo docker compose up -d
```

Bekreft at alle tjenester kjorer:
```bash
sudo docker compose ps
```

### Trinn 8: Fa tilgang til dashbordet

Apne nettleseren din og naviger til:
```
https://netrecon.yourcompany.com
```

Opprett den forste administratorkontoen ved forste tilgang.

## Windows Server-installasjon

### Trinn 1: Installer Docker Desktop

1. Last ned Docker Desktop fra [docker.com](https://www.docker.com/products/docker-desktop/)
2. Installer med WSL2-backend aktivert
3. Start serveren pa nytt

### Trinn 2: Folg Linux-trinnene

Docker Compose-oppsettet er identisk. Apne PowerShell og folg trinn 2-8 ovenfor, med justerte stier:

```powershell
mkdir C:\netrecon
cd C:\netrecon
# Opprett .env og docker-compose.yml som ovenfor
docker compose up -d
```

## Etter installasjon

### Databasemigreringer

Migreringer kjorer automatisk ved forste oppstart. For a utlose manuelt:

```bash
docker compose exec api-gateway python manage.py migrate
```

### Sikkerhetskopieringskonfigurasjon

Sett opp daglig PostgreSQL-sikkerhetskopiering:

```bash
# Legg til i crontab
echo "0 2 * * * docker compose -f /opt/netrecon/docker-compose.yml exec -T postgres pg_dump -U netrecon netrecon | gzip > /opt/netrecon/backups/db-\$(date +\%Y\%m\%d).sql.gz" | sudo crontab -
```

### Overvaking

Sjekk tjenestestatus:

```bash
# Status for alle tjenester
docker compose ps

# Tjenestelogger
docker compose logs -f api-gateway

# Ressursbruk
docker stats
```

## Oppdatering

```bash
cd /opt/netrecon

# Hent nyeste bilder
docker compose pull

# Start pa nytt med nye bilder
docker compose up -d

# Bekreft
docker compose ps
```

## Feilsoking

### Tjenester starter ikke
```bash
# Sjekk logger for den feilende tjenesten
docker compose logs <tjenestenavn>

# Vanlig problem: PostgreSQL er ikke klar enna
# Losning: vent og prov igjen, eller ok antall healthcheck-forsok
```

### Kan ikke na dashbordet
- Bekreft at port 443 er apen i brannmuren
- Sjekk at sertifikater finnes i sertifikatkatalogen
- Bekreft at domenets DNS peker til serveren din

### Databasetilkoblingsfeil
- Bekreft at PostgreSQL er sunn: `docker compose exec postgres pg_isready`
- Sjekk at legitimasjon i `.env` stemmer overens pa tvers av alle tjenester

## Vanlige sporsmal

**Sp: Kan jeg bruke en ekstern PostgreSQL-database?**
Sv: Ja. Fjern `postgres`-tjenesten fra docker-compose.yml og oppdater `DATABASE_URL`-miljovariabelen til a peke til din eksterne database.

**Sp: Hvordan skalerer jeg for hoy tilgjengelighet?**
Sv: For HA-distribusjoner, bruk Kubernetes med de medfolgene Helm-diagrammene. Docker Compose er egnet for enkelserver-distribusjoner.

**Sp: Kan jeg bruke en annen omvendt proxy (f.eks. Traefik, Caddy)?**
Sv: Ja. Erstatt Nginx-tjenesten med din foretrukne omvendte proxy. Sorge for at den videresender til API Gateway pa port 8000 og stotter WebSocket-oppgraderinger.

For ytterligere hjelp, kontakt [support@netreconapp.com](mailto:support@netreconapp.com).
