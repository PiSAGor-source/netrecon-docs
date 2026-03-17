---
sidebar_position: 2
title: Installation
description: Steg-för-steg-guide för distribution med egen hosting
---

# Installation med egen hosting

Denna guide leder dig genom distributionen av NetRecon-plattformen på din egen server med Docker Compose.

## Förutsättningar

- En Linux-server (Ubuntu 22.04+ rekommenderat) eller Windows Server med Docker
- Docker v24.0+ och Docker Compose v2.20+
- Ett domännamn som pekar mot din server (t.ex. `netrecon.yourcompany.com`)
- TLS-certifikat för din domän (eller använd Let's Encrypt)
- Minst 4 GB RAM och 40 GB diskutrymme

## Linux VPS-installation

### Steg 1: Installera Docker

```bash
# Uppdatera systemet
sudo apt update && sudo apt upgrade -y

# Installera Docker
curl -fsSL https://get.docker.com | sudo sh

# Lägg till din användare i docker-gruppen
sudo usermod -aG docker $USER

# Installera Docker Compose-plugin
sudo apt install docker-compose-plugin -y

# Verifiera installationen
docker --version
docker compose version
```

### Steg 2: Skapa projektkatalogen

```bash
sudo mkdir -p /opt/netrecon
cd /opt/netrecon
```

### Steg 3: Skapa miljöfilen

```bash
sudo tee /opt/netrecon/.env << 'EOF'
# NetRecon-konfiguration för egen hosting
NETRECON_DOMAIN=netrecon.yourcompany.com
NETRECON_EMAIL=admin@yourcompany.com

# PostgreSQL
POSTGRES_USER=netrecon
POSTGRES_PASSWORD=CHANGE_ME_TO_A_STRONG_PASSWORD
POSTGRES_DB=netrecon

# Redis
REDIS_PASSWORD=CHANGE_ME_TO_A_STRONG_PASSWORD

# JWT-hemlighet (generera med: openssl rand -hex 32)
JWT_SECRET=CHANGE_ME_TO_A_RANDOM_HEX_STRING

# Agentregister
AGENT_REGISTRY_SECRET=CHANGE_ME_TO_A_RANDOM_HEX_STRING
AGENT_JWT_SECRET=CHANGE_ME_TO_A_RANDOM_HEX_STRING

# E-post (SMTP)
SMTP_HOST=smtp.yourcompany.com
SMTP_PORT=587
SMTP_USER=noreply@yourcompany.com
SMTP_PASSWORD=CHANGE_ME
SMTP_FROM=NetRecon <noreply@yourcompany.com>

# Licens
LICENSE_KEY=your-license-key
EOF
```

:::warning
Ändra alla platshållarlösenord och hemligheter innan distribution. Använd `openssl rand -hex 32` för att generera säkra slumpmässiga värden.
:::

### Steg 4: Skapa Docker Compose-filen

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

### Steg 5: Skapa Nginx-konfigurationen

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

### Steg 6: Konfigurera TLS-certifikat

**Alternativ A: Let's Encrypt (rekommenderat för internetanslutna servrar)**

```bash
sudo apt install certbot -y
sudo certbot certonly --standalone -d netrecon.yourcompany.com

# Kopiera certifikat
sudo mkdir -p /opt/netrecon/certs
sudo cp /etc/letsencrypt/live/netrecon.yourcompany.com/fullchain.pem /opt/netrecon/certs/
sudo cp /etc/letsencrypt/live/netrecon.yourcompany.com/privkey.pem /opt/netrecon/certs/
```

**Alternativ B: Självsignerat certifikat (för internt bruk/testning)**

```bash
sudo mkdir -p /opt/netrecon/certs
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /opt/netrecon/certs/privkey.pem \
  -out /opt/netrecon/certs/fullchain.pem \
  -subj "/CN=netrecon.yourcompany.com"
```

### Steg 7: Distribuera

```bash
cd /opt/netrecon
sudo docker compose up -d
```

Verifiera att alla tjänster körs:
```bash
sudo docker compose ps
```

### Steg 8: Åtkomst till instrumentpanelen

Öppna din webbläsare och navigera till:
```
https://netrecon.yourcompany.com
```

Skapa det initiala administratörskontot vid första åtkomsten.

## Windows Server-installation

### Steg 1: Installera Docker Desktop

1. Ladda ner Docker Desktop från [docker.com](https://www.docker.com/products/docker-desktop/)
2. Installera med WSL2-backend aktiverat
3. Starta om servern

### Steg 2: Följ Linux-stegen

Docker Compose-installationen är identisk. Öppna PowerShell och följ steg 2-8 ovan, med justerade sökvägar:

```powershell
mkdir C:\netrecon
cd C:\netrecon
# Skapa .env och docker-compose.yml enligt ovan
docker compose up -d
```

## Efter installationen

### Databasmigrationer

Migrationer körs automatiskt vid första start. För att köra manuellt:

```bash
docker compose exec api-gateway python manage.py migrate
```

### Konfiguration av säkerhetskopiering

Konfigurera dagliga PostgreSQL-säkerhetskopior:

```bash
# Lägg till i crontab
echo "0 2 * * * docker compose -f /opt/netrecon/docker-compose.yml exec -T postgres pg_dump -U netrecon netrecon | gzip > /opt/netrecon/backups/db-\$(date +\%Y\%m\%d).sql.gz" | sudo crontab -
```

### Övervakning

Kontrollera tjänsternas hälsa:

```bash
# Status för alla tjänster
docker compose ps

# Tjänsteloggar
docker compose logs -f api-gateway

# Resursanvändning
docker stats
```

## Uppdatering

```bash
cd /opt/netrecon

# Hämta senaste avbildningarna
docker compose pull

# Starta om med nya avbildningar
docker compose up -d

# Verifiera
docker compose ps
```

## Felsökning

### Tjänster startar inte
```bash
# Kontrollera loggar för den felande tjänsten
docker compose logs <service-name>

# Vanligt problem: PostgreSQL inte redo ännu
# Lösning: vänta och försök igen, eller öka healthcheck-retries
```

### Kan inte nå instrumentpanelen
- Verifiera att port 443 är öppen i din brandvägg
- Kontrollera att certifikaten finns i certs-katalogen
- Verifiera att domänens DNS pekar mot din server

### Databasanslutningsfel
- Verifiera att PostgreSQL är frisk: `docker compose exec postgres pg_isready`
- Kontrollera att autentiseringsuppgifterna i `.env` stämmer överens i alla tjänster

## Vanliga frågor

**F: Kan jag använda en extern PostgreSQL-databas?**
S: Ja. Ta bort `postgres`-tjänsten från docker-compose.yml och uppdatera miljövariabeln `DATABASE_URL` för att peka mot din externa databas.

**F: Hur skalar jag för hög tillgänglighet?**
S: För HA-distributioner, använd Kubernetes med de medföljande Helm-charts. Docker Compose är lämpligt för distributioner på en enskild server.

**F: Kan jag använda en annan reverse proxy (t.ex. Traefik, Caddy)?**
S: Ja. Ersätt Nginx-tjänsten med din föredragna reverse proxy. Se till att den vidarebefordrar till API Gateway på port 8000 och stödjer WebSocket-uppgraderingar.

För ytterligare hjälp, kontakta [support@netreconapp.com](mailto:support@netreconapp.com).
