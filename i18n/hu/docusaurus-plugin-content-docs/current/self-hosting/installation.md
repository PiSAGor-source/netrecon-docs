---
sidebar_position: 2
title: Telepites
description: Lepesrol lepesre sajat szerveres telepitesi utmutato
---

# Sajat szerveres telepites

Ez az utmutato vegigvezeti a NetRecon platform sajat szerverre torteno telepitesen Docker Compose segitsegevel.

## Elofeltetelek

- Linux szerver (Ubuntu 22.04+ ajanlott) vagy Windows Server Docker-rel
- Docker v24.0+ es Docker Compose v2.20+
- A szerverre mutato domainnev (pl. `netrecon.yourcompany.com`)
- TLS tanusitvany a domainhez (vagy Let's Encrypt hasznalata)
- Legalabb 4 GB RAM es 40 GB lemezterulet

## Linux VPS telepites

### 1. lepes: Docker telepitese

```bash
# Rendszer frissitese
sudo apt update && sudo apt upgrade -y

# Docker telepitese
curl -fsSL https://get.docker.com | sudo sh

# Felhasznalo hozzaadasa a docker csoporthoz
sudo usermod -aG docker $USER

# Docker Compose plugin telepitese
sudo apt install docker-compose-plugin -y

# Telepites ellenorzese
docker --version
docker compose version
```

### 2. lepes: Projekt konyvtar letrehozasa

```bash
sudo mkdir -p /opt/netrecon
cd /opt/netrecon
```

### 3. lepes: Kornyezeti valtozok fajl letrehozasa

```bash
sudo tee /opt/netrecon/.env << 'EOF'
# NetRecon sajat szerveres konfigurcio
NETRECON_DOMAIN=netrecon.yourcompany.com
NETRECON_EMAIL=admin@yourcompany.com

# PostgreSQL
POSTGRES_USER=netrecon
POSTGRES_PASSWORD=CSERELD_EROS_JELSZORA
POSTGRES_DB=netrecon

# Redis
REDIS_PASSWORD=CSERELD_EROS_JELSZORA

# JWT titok (generalas: openssl rand -hex 32)
JWT_SECRET=CSERELD_VELETLENSZERU_HEX_KARAKTERSORRA

# Agensnyilvantarto
AGENT_REGISTRY_SECRET=CSERELD_VELETLENSZERU_HEX_KARAKTERSORRA
AGENT_JWT_SECRET=CSERELD_VELETLENSZERU_HEX_KARAKTERSORRA

# E-mail (SMTP)
SMTP_HOST=smtp.yourcompany.com
SMTP_PORT=587
SMTP_USER=noreply@yourcompany.com
SMTP_PASSWORD=CSERELD_KI
SMTP_FROM=NetRecon <noreply@yourcompany.com>

# Licenc
LICENSE_KEY=az-on-licenckulcsa
EOF
```

:::warning
Cserlje ki az osszes helyorzo jelszot es titkot a telepites elott. Hasznaljon `openssl rand -hex 32` parancsot biztonsagos veletlenszeru ertekek generalahoz.
:::

### 4. lepes: Docker Compose fajl letrehozasa

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

### 5. lepes: Nginx konfigurcio letrehozasa

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

### 6. lepes: TLS tanusitvanyok beallitasa

**A lehetoseg: Let's Encrypt (ajanlott interneten elerheto szerverekhez)**

```bash
sudo apt install certbot -y
sudo certbot certonly --standalone -d netrecon.yourcompany.com

# Tanusitvanyok masolasa
sudo mkdir -p /opt/netrecon/certs
sudo cp /etc/letsencrypt/live/netrecon.yourcompany.com/fullchain.pem /opt/netrecon/certs/
sudo cp /etc/letsencrypt/live/netrecon.yourcompany.com/privkey.pem /opt/netrecon/certs/
```

**B lehetoseg: Onalairt tanusitvany (belso/tesztelesi celra)**

```bash
sudo mkdir -p /opt/netrecon/certs
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /opt/netrecon/certs/privkey.pem \
  -out /opt/netrecon/certs/fullchain.pem \
  -subj "/CN=netrecon.yourcompany.com"
```

### 7. lepes: Telepites

```bash
cd /opt/netrecon
sudo docker compose up -d
```

Ellenorizze, hogy az osszes szolgaltatas fut:
```bash
sudo docker compose ps
```

### 8. lepes: Hozzaferes a vezerlopulthoz

Nyissa meg a bongeszot es navigaljon ide:
```
https://netrecon.yourcompany.com
```

Az elso hozzafereskor hozza letre az adminisztratori fiokot.

## Windows Server telepites

### 1. lepes: Docker Desktop telepitese

1. Toltse le a Docker Desktop-ot a [docker.com](https://www.docker.com/products/docker-desktop/) oldalrol
2. Telepitse WSL2 backend engedelyezesevel
3. Inditsa ujra a szervert

### 2. lepes: Kovesse a Linux lepeseket

A Docker Compose beallitas megegyezik. Nyissa meg a PowerShell-t es kovesse a 2-8. lepeseket, az utvonalak modositasaval:

```powershell
mkdir C:\netrecon
cd C:\netrecon
# Hozza letre az .env es docker-compose.yml fajlokat a fentiek szerint
docker compose up -d
```

## Telepites utani teendok

### Adatbazis migracioik

A migracioik automatikusan lefutnak az elso inditaskor. Manualis inditashoz:

```bash
docker compose exec api-gateway python manage.py migrate
```

### Mentesi konfigurcio

Napi PostgreSQL mentesek beallitasa:

```bash
# Hozzaadas a crontab-hoz
echo "0 2 * * * docker compose -f /opt/netrecon/docker-compose.yml exec -T postgres pg_dump -U netrecon netrecon | gzip > /opt/netrecon/backups/db-\$(date +\%Y\%m\%d).sql.gz" | sudo crontab -
```

### Monitorozas

Szolgaltatas allapot ellenorzese:

```bash
# Osszes szolgaltatas allapota
docker compose ps

# Szolgaltatas naplok
docker compose logs -f api-gateway

# Eroforras hasznalat
docker stats
```

## Frissites

```bash
cd /opt/netrecon

# Legujabb kepfajlok letoltese
docker compose pull

# Ujrainditaas uj kepfajlokkal
docker compose up -d

# Ellenorzes
docker compose ps
```

## Hibaelharitas

### A szolgaltatasok nem indulnak
```bash
# Naplok ellenorzese a hibas szolgaltatashoz
docker compose logs <szolgaltatas-neve>

# Gyakori problema: a PostgreSQL meg nem kesz
# Megoldas: varjon es probalkozzon ujra, vagy novelje a healthcheck ujraprobalasok szamat
```

### Nem erheto el a vezerlopult
- Ellenorizze, hogy a 443-as port nyitva van a tuzfalban
- Ellenorizze, hogy a tanusitvanyok leteznek a certs konyvtarban
- Ellenorizze, hogy a domain DNS a szerverre mutat

### Adatbazis-kapcsolati hibak
- Ellenorizze, hogy a PostgreSQL egeszseges: `docker compose exec postgres pg_isready`
- Ellenorizze, hogy az `.env` fajlban levo hitelesito adatok megegyeznek az osszes szolgaltatasban

## GYIK

**K: Hasznalhatok kulso PostgreSQL adatbazist?**
V: Igen. Tavolitsa el a `postgres` szolgaltatast a docker-compose.yml fajlbol es frissitse a `DATABASE_URL` kornyezeti valtozot a kulso adatbazisra mutatva.

**K: Hogyan skalazzak magas rendelkezesre allas erdekeben?**
V: HA telepitesekhez hasznaljon Kubernetes-t a mellekelt Helm chartokkal. A Docker Compose egyetlen szerveres telepitesekhez alkalmas.

**K: Hasznalhatok mas reverse proxyt (pl. Traefik, Caddy)?**
V: Igen. Cserlje ki az Nginx szolgaltatast a kedvelt reverse proxyjara. Biztositsa, hogy a 8000-es porton az API Gateway fele tovabbitson es tamogassa a WebSocket frissiteseket.

Segitsegert forduljon a [support@netreconapp.com](mailto:support@netreconapp.com) cimhez.
