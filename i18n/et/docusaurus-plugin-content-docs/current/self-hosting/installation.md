---
sidebar_position: 2
title: Paigaldamine
description: Samm-sammult isehallatava juurutuse juhend
---

# Isehallatav paigaldamine

See juhend juhendab teid NetReconi platvormi juurutamisel oma serveris Docker Compose'i abil.

## Eeltingimused

- Linux server (soovitatav Ubuntu 22.04+) või Windows Server koos Dockeriga
- Docker v24.0+ ja Docker Compose v2.20+
- Domeenimi, mis osutab teie serverile (nt `netrecon.yourcompany.com`)
- TLS-sertifikaat teie domeeni jaoks (või kasutage Let's Encrypt'i)
- Vähemalt 4 GB RAM ja 40 GB kettaruumi

## Linux VPS paigaldamine

### 1. samm: installige Docker

```bash
# Uuendage süsteemi
sudo apt update && sudo apt upgrade -y

# Installige Docker
curl -fsSL https://get.docker.com | sudo sh

# Lisage oma kasutaja docker-gruppi
sudo usermod -aG docker $USER

# Installige Docker Compose pistikprogramm
sudo apt install docker-compose-plugin -y

# Kontrollige paigaldust
docker --version
docker compose version
```

### 2. samm: looge projekti kaust

```bash
sudo mkdir -p /opt/netrecon
cd /opt/netrecon
```

### 3. samm: looge keskkonnafail

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
Muutke kõik kohatäite paroolid ja saladused enne juurutamist. Kasutage turvaliste juhuslike väärtuste genereerimiseks `openssl rand -hex 32`.
:::

### 4. samm: looge Docker Compose fail

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

### 5. samm: looge Nginx konfiguratsioon

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

### 6. samm: seadistage TLS-sertifikaadid

**Valik A: Let's Encrypt (soovitatav internetti suunatud serverite jaoks)**

```bash
sudo apt install certbot -y
sudo certbot certonly --standalone -d netrecon.yourcompany.com

# Kopeerige sertifikaadid
sudo mkdir -p /opt/netrecon/certs
sudo cp /etc/letsencrypt/live/netrecon.yourcompany.com/fullchain.pem /opt/netrecon/certs/
sudo cp /etc/letsencrypt/live/netrecon.yourcompany.com/privkey.pem /opt/netrecon/certs/
```

**Valik B: Iseallkirjastatud sertifikaat (sisekasutuseks/testimiseks)**

```bash
sudo mkdir -p /opt/netrecon/certs
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /opt/netrecon/certs/privkey.pem \
  -out /opt/netrecon/certs/fullchain.pem \
  -subj "/CN=netrecon.yourcompany.com"
```

### 7. samm: juurutage

```bash
cd /opt/netrecon
sudo docker compose up -d
```

Kontrollige, et kõik teenused töötavad:
```bash
sudo docker compose ps
```

### 8. samm: juurdepääs juhtpaneelile

Avage oma brauser ja navigeerige:
```
https://netrecon.yourcompany.com
```

Looge esmane administraatori konto esmakordsel juurdepääsul.

## Windows Serveri paigaldamine

### 1. samm: installige Docker Desktop

1. Laadige Docker Desktop alla [docker.com](https://www.docker.com/products/docker-desktop/) lehelt
2. Installige WSL2 taustaprogrammiga
3. Taaskäivitage server

### 2. samm: järgige Linuxi samme

Docker Compose'i seadistus on identne. Avage PowerShell ja järgige ülaltoodud samme 2-8, kohandades teid:

```powershell
mkdir C:\netrecon
cd C:\netrecon
# Looge .env ja docker-compose.yml nagu ülal
docker compose up -d
```

## Paigalduse järgsed toimingud

### Andmebaasi migratsioonid

Migratsioonid käivituvad automaatselt esmakordsel käivitamisel. Käsitsi käivitamiseks:

```bash
docker compose exec api-gateway python manage.py migrate
```

### Varunduse konfigureerimine

Seadistage igapäevane PostgreSQL varundamine:

```bash
# Lisage crontab'i
echo "0 2 * * * docker compose -f /opt/netrecon/docker-compose.yml exec -T postgres pg_dump -U netrecon netrecon | gzip > /opt/netrecon/backups/db-\$(date +\%Y\%m\%d).sql.gz" | sudo crontab -
```

### Jälgimine

Kontrollige teenuse tervist:

```bash
# Kõigi teenuste olek
docker compose ps

# Teenuse logid
docker compose logs -f api-gateway

# Ressursikasutus
docker stats
```

## Uuendamine

```bash
cd /opt/netrecon

# Tõmmake uusimad tõmmised
docker compose pull

# Taaskäivitage uute tõmmistega
docker compose up -d

# Kontrollige
docker compose ps
```

## Veaotsing

### Teenused ei käivitu
```bash
# Kontrollige ebaõnnestunud teenuse logisid
docker compose logs <service-name>

# Levinud probleem: PostgreSQL pole veel valmis
# Lahendus: oodake ja proovige uuesti või suurendage healthcheck korduskatseid
```

### Juhtpaneelile ei pääse ligi
- Veenduge, et port 443 on tulemüüris avatud
- Kontrollige, et sertifikaadid on sertifikaatide kaustas olemas
- Veenduge, et domeeni DNS osutab teie serverile

### Andmebaasi ühenduse vead
- Kontrollige PostgreSQL tervist: `docker compose exec postgres pg_isready`
- Veenduge, et mandaadid `.env` failis kattuvad kõigi teenuste vahel

## KKK

**K: Kas ma saan kasutada välist PostgreSQL andmebaasi?**
V: Jah. Eemaldage `postgres` teenus docker-compose.yml failist ja uuendage `DATABASE_URL` keskkonnamuutuja osutama teie välisele andmebaasile.

**K: Kuidas skaleerida kõrge käideldavuse jaoks?**
V: Kõrge käideldavusega juurutuste jaoks kasutage Kubernetest koos kaasasolevate Helm chart'idega. Docker Compose sobib ühe serveri juurutustele.

**K: Kas ma saan kasutada teist pöördproksit (nt Traefik, Caddy)?**
V: Jah. Asendage Nginx teenus oma eelistatud pöördproksiga. Veenduge, et see suunab API Gateway'le pordil 8000 ja toetab WebSocket uuendusi.

Lisaabi saamiseks võtke ühendust [support@netreconapp.com](mailto:support@netreconapp.com).
