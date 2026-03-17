---
sidebar_position: 2
title: Installazione
description: Guida passo passo al deployment self-hosted
---

# Installazione Self-Hosted

Questa guida ti accompagna nel deployment della piattaforma NetRecon sul tuo server utilizzando Docker Compose.

## Prerequisiti

- Un server Linux (Ubuntu 22.04+ consigliato) o Windows Server con Docker
- Docker v24.0+ e Docker Compose v2.20+
- Un nome di dominio puntato al tuo server (es. `netrecon.tuaazienda.com`)
- Certificato TLS per il tuo dominio (o usa Let's Encrypt)
- Almeno 4 GB di RAM e 40 GB di spazio su disco

## Installazione su VPS Linux

### Passo 1: Installa Docker

```bash
# Aggiorna il sistema
sudo apt update && sudo apt upgrade -y

# Installa Docker
curl -fsSL https://get.docker.com | sudo sh

# Aggiungi il tuo utente al gruppo docker
sudo usermod -aG docker $USER

# Installa il plugin Docker Compose
sudo apt install docker-compose-plugin -y

# Verifica l'installazione
docker --version
docker compose version
```

### Passo 2: Crea la Directory del Progetto

```bash
sudo mkdir -p /opt/netrecon
cd /opt/netrecon
```

### Passo 3: Crea il File di Ambiente

```bash
sudo tee /opt/netrecon/.env << 'EOF'
# Configurazione Self-Hosted di NetRecon
NETRECON_DOMAIN=netrecon.tuaazienda.com
NETRECON_EMAIL=admin@tuaazienda.com

# PostgreSQL
POSTGRES_USER=netrecon
POSTGRES_PASSWORD=CAMBIA_CON_UNA_PASSWORD_SICURA
POSTGRES_DB=netrecon

# Redis
REDIS_PASSWORD=CAMBIA_CON_UNA_PASSWORD_SICURA

# JWT Secret (genera con: openssl rand -hex 32)
JWT_SECRET=CAMBIA_CON_UNA_STRINGA_HEX_CASUALE

# Agent Registry
AGENT_REGISTRY_SECRET=CAMBIA_CON_UNA_STRINGA_HEX_CASUALE
AGENT_JWT_SECRET=CAMBIA_CON_UNA_STRINGA_HEX_CASUALE

# Email (SMTP)
SMTP_HOST=smtp.tuaazienda.com
SMTP_PORT=587
SMTP_USER=noreply@tuaazienda.com
SMTP_PASSWORD=CAMBIA_ME
SMTP_FROM=NetRecon <noreply@tuaazienda.com>

# Licenza
LICENSE_KEY=la-tua-chiave-di-licenza
EOF
```

:::warning
Cambia tutte le password e i segreti segnaposto prima del deployment. Usa `openssl rand -hex 32` per generare valori casuali sicuri.
:::

### Passo 4: Crea il File Docker Compose

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

### Passo 5: Crea la Configurazione Nginx

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

### Passo 6: Configura i Certificati TLS

**Opzione A: Let's Encrypt (consigliato per server esposti a internet)**

```bash
sudo apt install certbot -y
sudo certbot certonly --standalone -d netrecon.tuaazienda.com

# Copia i certificati
sudo mkdir -p /opt/netrecon/certs
sudo cp /etc/letsencrypt/live/netrecon.tuaazienda.com/fullchain.pem /opt/netrecon/certs/
sudo cp /etc/letsencrypt/live/netrecon.tuaazienda.com/privkey.pem /opt/netrecon/certs/
```

**Opzione B: Certificato autofirmato (per uso interno/test)**

```bash
sudo mkdir -p /opt/netrecon/certs
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /opt/netrecon/certs/privkey.pem \
  -out /opt/netrecon/certs/fullchain.pem \
  -subj "/CN=netrecon.tuaazienda.com"
```

### Passo 7: Deploy

```bash
cd /opt/netrecon
sudo docker compose up -d
```

Verifica che tutti i servizi siano in esecuzione:
```bash
sudo docker compose ps
```

### Passo 8: Accedi alla Dashboard

Apri il tuo browser e naviga su:
```
https://netrecon.tuaazienda.com
```

Crea l'account amministratore iniziale al primo accesso.

## Installazione su Windows Server

### Passo 1: Installa Docker Desktop

1. Scarica Docker Desktop da [docker.com](https://www.docker.com/products/docker-desktop/)
2. Installa con il backend WSL2 abilitato
3. Riavvia il server

### Passo 2: Segui i Passi per Linux

La configurazione di Docker Compose è identica. Apri PowerShell e segui i Passi 2-8 sopra, adattando i percorsi:

```powershell
mkdir C:\netrecon
cd C:\netrecon
# Crea .env e docker-compose.yml come sopra
docker compose up -d
```

## Post-Installazione

### Migrazioni del Database

Le migrazioni vengono eseguite automaticamente al primo avvio. Per attivarle manualmente:

```bash
docker compose exec api-gateway python manage.py migrate
```

### Configurazione dei Backup

Configura backup giornalieri di PostgreSQL:

```bash
# Aggiungi al crontab
echo "0 2 * * * docker compose -f /opt/netrecon/docker-compose.yml exec -T postgres pg_dump -U netrecon netrecon | gzip > /opt/netrecon/backups/db-\$(date +\%Y\%m\%d).sql.gz" | sudo crontab -
```

### Monitoraggio

Controlla lo stato dei servizi:

```bash
# Stato di tutti i servizi
docker compose ps

# Log dei servizi
docker compose logs -f api-gateway

# Utilizzo delle risorse
docker stats
```

## Aggiornamento

```bash
cd /opt/netrecon

# Scarica le ultime immagini
docker compose pull

# Riavvia con le nuove immagini
docker compose up -d

# Verifica
docker compose ps
```

## Risoluzione dei Problemi

### I servizi non si avviano
```bash
# Controlla i log del servizio che non funziona
docker compose logs <nome-servizio>

# Problema comune: PostgreSQL non ancora pronto
# Soluzione: attendi e riprova, o aumenta i tentativi dell'healthcheck
```

### Impossibile accedere alla dashboard
- Verifica che la porta 443 sia aperta nel tuo firewall
- Controlla che i certificati esistano nella directory certs
- Verifica che il DNS del dominio punti al tuo server

### Errori di connessione al database
- Verifica che PostgreSQL sia in salute: `docker compose exec postgres pg_isready`
- Controlla che le credenziali in `.env` corrispondano in tutti i servizi

## FAQ

**D: Posso usare un database PostgreSQL esterno?**
R: Sì. Rimuovi il servizio `postgres` dal docker-compose.yml e aggiorna la variabile d'ambiente `DATABASE_URL` per puntare al tuo database esterno.

**D: Come posso scalare per l'alta disponibilità?**
R: Per deployment ad alta disponibilità, usa Kubernetes con i chart Helm forniti. Docker Compose è adatto per deployment su singolo server.

**D: Posso usare un reverse proxy diverso (es. Traefik, Caddy)?**
R: Sì. Sostituisci il servizio Nginx con il tuo reverse proxy preferito. Assicurati che inoltri all'API Gateway sulla porta 8000 e supporti gli upgrade WebSocket.

Per ulteriore assistenza, contatta [support@netreconapp.com](mailto:support@netreconapp.com).
