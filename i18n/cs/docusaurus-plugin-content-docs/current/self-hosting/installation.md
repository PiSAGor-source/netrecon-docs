---
sidebar_position: 2
title: Instalace
description: Podrobný průvodce nasazením self-hosted řešení
---

# Self-Hosted instalace

Tento průvodce vás provede nasazením platformy NetRecon na vlastním serveru pomocí Docker Compose.

## Předpoklady

- Linux server (doporučen Ubuntu 22.04+) nebo Windows Server s Dockerem
- Docker v24.0+ a Docker Compose v2.20+
- Doménové jméno směrující na váš server (např. `netrecon.vasefirma.cz`)
- TLS certifikát pro vaši doménu (nebo použijte Let's Encrypt)
- Alespoň 4 GB RAM a 40 GB místa na disku

## Instalace na Linux VPS

### Krok 1: Instalace Dockeru

```bash
# Aktualizace systému
sudo apt update && sudo apt upgrade -y

# Instalace Dockeru
curl -fsSL https://get.docker.com | sudo sh

# Přidání uživatele do skupiny docker
sudo usermod -aG docker $USER

# Instalace Docker Compose pluginu
sudo apt install docker-compose-plugin -y

# Ověření instalace
docker --version
docker compose version
```

### Krok 2: Vytvoření projektového adresáře

```bash
sudo mkdir -p /opt/netrecon
cd /opt/netrecon
```

### Krok 3: Vytvoření souboru prostředí

```bash
sudo tee /opt/netrecon/.env << 'EOF'
# Konfigurace NetRecon Self-Hosted
NETRECON_DOMAIN=netrecon.vasefirma.cz
NETRECON_EMAIL=admin@vasefirma.cz

# PostgreSQL
POSTGRES_USER=netrecon
POSTGRES_PASSWORD=ZMENTE_NA_SILNE_HESLO
POSTGRES_DB=netrecon

# Redis
REDIS_PASSWORD=ZMENTE_NA_SILNE_HESLO

# JWT Secret (vygenerujte pomocí: openssl rand -hex 32)
JWT_SECRET=ZMENTE_NA_NAHODNY_HEX_RETEZEC

# Agent Registry
AGENT_REGISTRY_SECRET=ZMENTE_NA_NAHODNY_HEX_RETEZEC
AGENT_JWT_SECRET=ZMENTE_NA_NAHODNY_HEX_RETEZEC

# Email (SMTP)
SMTP_HOST=smtp.vasefirma.cz
SMTP_PORT=587
SMTP_USER=noreply@vasefirma.cz
SMTP_PASSWORD=ZMENTE
SMTP_FROM=NetRecon <noreply@vasefirma.cz>

# Licence
LICENSE_KEY=vas-licencni-klic
EOF
```

:::warning
Před nasazením změňte všechna zástupná hesla a tajné klíče. Pro generování bezpečných náhodných hodnot použijte `openssl rand -hex 32`.
:::

### Krok 4: Vytvoření Docker Compose souboru

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

### Krok 5: Vytvoření konfigurace Nginx

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

### Krok 6: Nastavení TLS certifikátů

**Možnost A: Let's Encrypt (doporučeno pro servery dostupné z internetu)**

```bash
sudo apt install certbot -y
sudo certbot certonly --standalone -d netrecon.vasefirma.cz

# Kopírování certifikátů
sudo mkdir -p /opt/netrecon/certs
sudo cp /etc/letsencrypt/live/netrecon.vasefirma.cz/fullchain.pem /opt/netrecon/certs/
sudo cp /etc/letsencrypt/live/netrecon.vasefirma.cz/privkey.pem /opt/netrecon/certs/
```

**Možnost B: Self-signed certifikát (pro interní/testovací účely)**

```bash
sudo mkdir -p /opt/netrecon/certs
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /opt/netrecon/certs/privkey.pem \
  -out /opt/netrecon/certs/fullchain.pem \
  -subj "/CN=netrecon.vasefirma.cz"
```

### Krok 7: Nasazení

```bash
cd /opt/netrecon
sudo docker compose up -d
```

Ověřte, že všechny služby běží:
```bash
sudo docker compose ps
```

### Krok 8: Přístup k řídicímu panelu

Otevřete prohlížeč a přejděte na:
```
https://netrecon.vasefirma.cz
```

Při prvním přístupu vytvořte počáteční administrátorský účet.

## Instalace na Windows Server

### Krok 1: Instalace Docker Desktop

1. Stáhněte Docker Desktop z [docker.com](https://www.docker.com/products/docker-desktop/)
2. Nainstalujte s povoleným WSL2 backendem
3. Restartujte server

### Krok 2: Postupujte podle kroků pro Linux

Nastavení Docker Compose je identické. Otevřete PowerShell a postupujte podle kroků 2-8 výše, přizpůsobte cesty:

```powershell
mkdir C:\netrecon
cd C:\netrecon
# Vytvořte .env a docker-compose.yml dle výše uvedeného
docker compose up -d
```

## Po instalaci

### Databázové migrace

Migrace se spouštějí automaticky při prvním startu. Pro ruční spuštění:

```bash
docker compose exec api-gateway python manage.py migrate
```

### Konfigurace zálohování

Nastavte denní zálohy PostgreSQL:

```bash
# Přidejte do crontab
echo "0 2 * * * docker compose -f /opt/netrecon/docker-compose.yml exec -T postgres pg_dump -U netrecon netrecon | gzip > /opt/netrecon/backups/db-\$(date +\%Y\%m\%d).sql.gz" | sudo crontab -
```

### Monitorování

Kontrola stavu služeb:

```bash
# Stav všech služeb
docker compose ps

# Logy služby
docker compose logs -f api-gateway

# Využití prostředků
docker stats
```

## Aktualizace

```bash
cd /opt/netrecon

# Stažení nejnovějších obrazů
docker compose pull

# Restart s novými obrazy
docker compose up -d

# Ověření
docker compose ps
```

## Řešení problémů

### Služby se nepodaří spustit
```bash
# Zkontrolujte logy selhávající služby
docker compose logs <nazev-sluzby>

# Častý problém: PostgreSQL ještě není připraven
# Řešení: počkejte a zkuste znovu, nebo zvyšte počet opakování healthcheck
```

### Nelze přistoupit k řídicímu panelu
- Ověřte, že port 443 je otevřený ve vašem firewallu
- Zkontrolujte, že certifikáty existují v adresáři certs
- Ověřte, že DNS domény směruje na váš server

### Chyby připojení k databázi
- Ověřte, že PostgreSQL je zdravý: `docker compose exec postgres pg_isready`
- Zkontrolujte, že přihlašovací údaje v `.env` se shodují napříč všemi službami

## Často kladené otázky

**Otázka: Mohu použít externí PostgreSQL databázi?**
Odpověď: Ano. Odstraňte službu `postgres` z docker-compose.yml a aktualizujte proměnnou prostředí `DATABASE_URL` tak, aby směřovala na vaši externí databázi.

**Otázka: Jak škálovat pro vysokou dostupnost?**
Odpověď: Pro HA nasazení použijte Kubernetes s poskytovanými Helm charty. Docker Compose je vhodný pro nasazení na jednom serveru.

**Otázka: Mohu použít jiný reverzní proxy (např. Traefik, Caddy)?**
Odpověď: Ano. Nahraďte službu Nginx vaším preferovaným reverzním proxy. Ujistěte se, že směruje na API Gateway na portu 8000 a podporuje WebSocket upgrade.

Pro další pomoc kontaktujte [support@netreconapp.com](mailto:support@netreconapp.com).
