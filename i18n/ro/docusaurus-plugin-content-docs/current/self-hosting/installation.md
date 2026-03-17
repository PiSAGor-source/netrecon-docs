---
sidebar_position: 2
title: Instalare
description: Ghid pas cu pas pentru implementarea auto-găzduită
---

# Instalare auto-găzduită

Acest ghid vă prezintă implementarea platformei NetRecon pe propriul server folosind Docker Compose.

## Cerințe prealabile

- Un server Linux (Ubuntu 22.04+ recomandat) sau Windows Server cu Docker
- Docker v24.0+ și Docker Compose v2.20+
- Un nume de domeniu care indică către serverul dvs. (de ex., `netrecon.yourcompany.com`)
- Certificat TLS pentru domeniul dvs. (sau folosiți Let's Encrypt)
- Cel puțin 4 GB RAM și 40 GB spațiu pe disc

## Instalare pe VPS Linux

### Pasul 1: Instalați Docker

```bash
# Actualizați sistemul
sudo apt update && sudo apt upgrade -y

# Instalați Docker
curl -fsSL https://get.docker.com | sudo sh

# Adăugați utilizatorul la grupul docker
sudo usermod -aG docker $USER

# Instalați pluginul Docker Compose
sudo apt install docker-compose-plugin -y

# Verificați instalarea
docker --version
docker compose version
```

### Pasul 2: Creați directorul proiectului

```bash
sudo mkdir -p /opt/netrecon
cd /opt/netrecon
```

### Pasul 3: Creați fișierul de mediu

```bash
sudo tee /opt/netrecon/.env << 'EOF'
# Configurare NetRecon auto-găzduit
NETRECON_DOMAIN=netrecon.yourcompany.com
NETRECON_EMAIL=admin@yourcompany.com

# PostgreSQL
POSTGRES_USER=netrecon
POSTGRES_PASSWORD=SCHIMBATI_CU_O_PAROLA_PUTERNICA
POSTGRES_DB=netrecon

# Redis
REDIS_PASSWORD=SCHIMBATI_CU_O_PAROLA_PUTERNICA

# Secret JWT (generați cu: openssl rand -hex 32)
JWT_SECRET=SCHIMBATI_CU_UN_SIR_HEX_ALEATORIU

# Registru agenți
AGENT_REGISTRY_SECRET=SCHIMBATI_CU_UN_SIR_HEX_ALEATORIU
AGENT_JWT_SECRET=SCHIMBATI_CU_UN_SIR_HEX_ALEATORIU

# Email (SMTP)
SMTP_HOST=smtp.yourcompany.com
SMTP_PORT=587
SMTP_USER=noreply@yourcompany.com
SMTP_PASSWORD=SCHIMBATI
SMTP_FROM=NetRecon <noreply@yourcompany.com>

# Licență
LICENSE_KEY=cheia-dvs-de-licenta
EOF
```

:::warning
Schimbați toate parolele și secretele placeholder înainte de implementare. Folosiți `openssl rand -hex 32` pentru a genera valori aleatoare securizate.
:::

### Pasul 4: Creați fișierul Docker Compose

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

### Pasul 5: Creați configurația Nginx

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

### Pasul 6: Configurați certificatele TLS

**Opțiunea A: Let's Encrypt (recomandat pentru servere accesibile din internet)**

```bash
sudo apt install certbot -y
sudo certbot certonly --standalone -d netrecon.yourcompany.com

# Copiați certificatele
sudo mkdir -p /opt/netrecon/certs
sudo cp /etc/letsencrypt/live/netrecon.yourcompany.com/fullchain.pem /opt/netrecon/certs/
sudo cp /etc/letsencrypt/live/netrecon.yourcompany.com/privkey.pem /opt/netrecon/certs/
```

**Opțiunea B: Certificat auto-semnat (pentru medii interne/de testare)**

```bash
sudo mkdir -p /opt/netrecon/certs
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /opt/netrecon/certs/privkey.pem \
  -out /opt/netrecon/certs/fullchain.pem \
  -subj "/CN=netrecon.yourcompany.com"
```

### Pasul 7: Implementați

```bash
cd /opt/netrecon
sudo docker compose up -d
```

Verificați că toate serviciile rulează:
```bash
sudo docker compose ps
```

### Pasul 8: Accesați tabloul de bord

Deschideți browserul și navigați la:
```
https://netrecon.yourcompany.com
```

Creați contul inițial de administrator la prima accesare.

## Instalare pe Windows Server

### Pasul 1: Instalați Docker Desktop

1. Descărcați Docker Desktop de pe [docker.com](https://www.docker.com/products/docker-desktop/)
2. Instalați cu backend-ul WSL2 activat
3. Reporniți serverul

### Pasul 2: Urmați pașii pentru Linux

Configurarea Docker Compose este identică. Deschideți PowerShell și urmați pașii 2-8 de mai sus, ajustând căile:

```powershell
mkdir C:\netrecon
cd C:\netrecon
# Creați .env și docker-compose.yml ca mai sus
docker compose up -d
```

## Post-instalare

### Migrări baza de date

Migrările rulează automat la prima pornire. Pentru a le declanșa manual:

```bash
docker compose exec api-gateway python manage.py migrate
```

### Configurare backup

Configurați backup-uri zilnice PostgreSQL:

```bash
# Adăugați în crontab
echo "0 2 * * * docker compose -f /opt/netrecon/docker-compose.yml exec -T postgres pg_dump -U netrecon netrecon | gzip > /opt/netrecon/backups/db-\$(date +\%Y\%m\%d).sql.gz" | sudo crontab -
```

### Monitorizare

Verificați starea serviciilor:

```bash
# Starea tuturor serviciilor
docker compose ps

# Jurnale serviciu
docker compose logs -f api-gateway

# Utilizare resurse
docker stats
```

## Actualizare

```bash
cd /opt/netrecon

# Descărcați ultimele imagini
docker compose pull

# Reporniți cu imaginile noi
docker compose up -d

# Verificați
docker compose ps
```

## Depanare

### Serviciile nu pornesc
```bash
# Verificați jurnalele serviciului cu probleme
docker compose logs <nume-serviciu>

# Problemă frecventă: PostgreSQL nu este încă gata
# Soluție: așteptați și reîncercați sau măriți numărul de reîncercări la healthcheck
```

### Nu se poate accesa tabloul de bord
- Verificați că portul 443 este deschis în firewall
- Verificați că certificatele există în directorul certs
- Verificați că DNS-ul domeniului indică către serverul dvs.

### Erori de conectare la baza de date
- Verificați că PostgreSQL este sănătos: `docker compose exec postgres pg_isready`
- Verificați că credențialele din `.env` corespund în toate serviciile

## Întrebări frecvente

**Î: Pot folosi o bază de date PostgreSQL externă?**
R: Da. Eliminați serviciul `postgres` din docker-compose.yml și actualizați variabila de mediu `DATABASE_URL` pentru a indica către baza de date externă.

**Î: Cum scalez pentru disponibilitate ridicată?**
R: Pentru implementări HA, folosiți Kubernetes cu chart-urile Helm furnizate. Docker Compose este potrivit pentru implementări pe un singur server.

**Î: Pot folosi un proxy invers diferit (de ex., Traefik, Caddy)?**
R: Da. Înlocuiți serviciul Nginx cu proxy-ul invers preferat. Asigurați-vă că redirecționează către API Gateway pe portul 8000 și suportă upgrade-uri WebSocket.

Pentru ajutor suplimentar, contactați [support@netreconapp.com](mailto:support@netreconapp.com).
