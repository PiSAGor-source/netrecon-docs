---
sidebar_position: 2
title: Installation
description: Trin-for-trin self-hosted implementeringsguide
---

# Self-Hosted installation

Denne guide fører dig igennem implementeringen af NetRecon-platformen på din egen server ved hjælp af Docker Compose.

## Forudsætninger

- En Linux-server (Ubuntu 22.04+ anbefales) eller Windows Server med Docker
- Docker v24.0+ og Docker Compose v2.20+
- Et domænenavn peget mod din server (f.eks. `netrecon.yourcompany.com`)
- TLS-certifikat til dit domæne (eller brug Let's Encrypt)
- Mindst 4 GB RAM og 40 GB diskplads

## Linux VPS-installation

### Trin 1: Installer Docker

```bash
# Opdater systemet
sudo apt update && sudo apt upgrade -y

# Installer Docker
curl -fsSL https://get.docker.com | sudo sh

# Tilføj din bruger til docker-gruppen
sudo usermod -aG docker $USER

# Installer Docker Compose plugin
sudo apt install docker-compose-plugin -y

# Verificer installationen
docker --version
docker compose version
```

### Trin 2: Opret projektmappen

```bash
sudo mkdir -p /opt/netrecon
cd /opt/netrecon
```

### Trin 3: Opret miljøfilen

```bash
sudo tee /opt/netrecon/.env << 'EOF'
# NetRecon Self-Hosted Konfiguration
NETRECON_DOMAIN=netrecon.yourcompany.com
NETRECON_EMAIL=admin@yourcompany.com

# PostgreSQL
POSTGRES_USER=netrecon
POSTGRES_PASSWORD=CHANGE_ME_TO_A_STRONG_PASSWORD
POSTGRES_DB=netrecon

# Redis
REDIS_PASSWORD=CHANGE_ME_TO_A_STRONG_PASSWORD

# JWT Secret (generer med: openssl rand -hex 32)
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

# Licens
LICENSE_KEY=your-license-key
EOF
```

:::warning
Skift alle pladsholder-adgangskoder og hemmeligheder før implementering. Brug `openssl rand -hex 32` til at generere sikre tilfældige værdier.
:::

### Trin 4: Opret Docker Compose-filen

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

### Trin 5: Opret Nginx-konfigurationen

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

### Trin 6: Opsæt TLS-certifikater

**Mulighed A: Let's Encrypt (anbefalet til internetvendte servere)**

```bash
sudo apt install certbot -y
sudo certbot certonly --standalone -d netrecon.yourcompany.com

# Kopier certifikater
sudo mkdir -p /opt/netrecon/certs
sudo cp /etc/letsencrypt/live/netrecon.yourcompany.com/fullchain.pem /opt/netrecon/certs/
sudo cp /etc/letsencrypt/live/netrecon.yourcompany.com/privkey.pem /opt/netrecon/certs/
```

**Mulighed B: Selvsigneret certifikat (til intern brug/test)**

```bash
sudo mkdir -p /opt/netrecon/certs
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /opt/netrecon/certs/privkey.pem \
  -out /opt/netrecon/certs/fullchain.pem \
  -subj "/CN=netrecon.yourcompany.com"
```

### Trin 7: Implementer

```bash
cd /opt/netrecon
sudo docker compose up -d
```

Verificer at alle tjenester kører:
```bash
sudo docker compose ps
```

### Trin 8: Tilgå Dashboard'et

Åbn din browser og naviger til:
```
https://netrecon.yourcompany.com
```

Opret den første administratorkonto ved første adgang.

## Windows Server-installation

### Trin 1: Installer Docker Desktop

1. Download Docker Desktop fra [docker.com](https://www.docker.com/products/docker-desktop/)
2. Installer med WSL2-backend aktiveret
3. Genstart serveren

### Trin 2: Følg Linux-trinnene

Docker Compose-opsætningen er identisk. Åbn PowerShell og følg trin 2-8 ovenfor med tilpassede stier:

```powershell
mkdir C:\netrecon
cd C:\netrecon
# Opret .env og docker-compose.yml som ovenfor
docker compose up -d
```

## Efter installation

### Databasemigreringer

Migreringer kører automatisk ved første start. For at udløse manuelt:

```bash
docker compose exec api-gateway python manage.py migrate
```

### Sikkerhedskopiering

Opsæt daglige PostgreSQL-sikkerhedskopier:

```bash
# Tilføj til crontab
echo "0 2 * * * docker compose -f /opt/netrecon/docker-compose.yml exec -T postgres pg_dump -U netrecon netrecon | gzip > /opt/netrecon/backups/db-\$(date +\%Y\%m\%d).sql.gz" | sudo crontab -
```

### Overvågning

Kontroller tjenesternes tilstand:

```bash
# Alle tjenesters status
docker compose ps

# Tjenestelogfiler
docker compose logs -f api-gateway

# Ressourceforbrug
docker stats
```

## Opdatering

```bash
cd /opt/netrecon

# Hent seneste images
docker compose pull

# Genstart med nye images
docker compose up -d

# Verificer
docker compose ps
```

## Fejlfinding

### Tjenester kan ikke starte
```bash
# Kontroller logfiler for den fejlende tjeneste
docker compose logs <service-name>

# Almindeligt problem: PostgreSQL er ikke klar endnu
# Løsning: vent og prøv igen, eller forøg healthcheck-genforsøg
```

### Kan ikke tilgå dashboard'et
- Verificer at port 443 er åben i din firewall
- Kontroller at certifikater findes i certs-mappen
- Verificer at domæne-DNS peger mod din server

### Databaseforbindelsesfejl
- Verificer at PostgreSQL er sund: `docker compose exec postgres pg_isready`
- Kontroller at legitimationsoplysninger i `.env` matcher på tværs af alle tjenester

## FAQ

**Sp: Kan jeg bruge en ekstern PostgreSQL-database?**
Sv: Ja. Fjern `postgres`-tjenesten fra docker-compose.yml og opdater `DATABASE_URL`-miljøvariablen til at pege på din eksterne database.

**Sp: Hvordan skalerer jeg til høj tilgængelighed?**
Sv: Til HA-implementeringer, brug Kubernetes med de medfølgende Helm charts. Docker Compose er egnet til enkeltserver-implementeringer.

**Sp: Kan jeg bruge en anden reverse proxy (f.eks. Traefik, Caddy)?**
Sv: Ja. Erstat Nginx-tjenesten med din foretrukne reverse proxy. Sørg for at den videresender til API Gateway'en på port 8000 og understøtter WebSocket-opgraderinger.

For yderligere hjælp, kontakt [support@netreconapp.com](mailto:support@netreconapp.com).
