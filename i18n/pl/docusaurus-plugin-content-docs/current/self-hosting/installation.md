---
sidebar_position: 2
title: Instalacja
description: Poradnik wdrozenia krok po kroku na wlasnym serwerze
---

# Instalacja na wlasnym serwerze

Ten poradnik przeprowadzi Cie przez wdrozenie platformy NetRecon na wlasnym serwerze za pomoca Docker Compose.

## Wymagania wstepne

- Serwer Linux (zalecany Ubuntu 22.04+) lub Windows Server z Dockerem
- Docker v24.0+ i Docker Compose v2.20+
- Domena wskazujaca na Twoj serwer (np. `netrecon.twojafirma.com`)
- Certyfikat TLS dla domeny (lub uzyj Let's Encrypt)
- Minimum 4 GB RAM i 40 GB przestrzeni dyskowej

## Instalacja na Linux VPS

### Krok 1: Zainstaluj Dockera

```bash
# Aktualizacja systemu
sudo apt update && sudo apt upgrade -y

# Instalacja Dockera
curl -fsSL https://get.docker.com | sudo sh

# Dodanie uzytkownika do grupy docker
sudo usermod -aG docker $USER

# Instalacja wtyczki Docker Compose
sudo apt install docker-compose-plugin -y

# Weryfikacja instalacji
docker --version
docker compose version
```

### Krok 2: Utworz katalog projektu

```bash
sudo mkdir -p /opt/netrecon
cd /opt/netrecon
```

### Krok 3: Utworz plik srodowiskowy

```bash
sudo tee /opt/netrecon/.env << 'EOF'
# Konfiguracja NetRecon na wlasnym serwerze
NETRECON_DOMAIN=netrecon.twojafirma.com
NETRECON_EMAIL=admin@twojafirma.com

# PostgreSQL
POSTGRES_USER=netrecon
POSTGRES_PASSWORD=ZMIEN_NA_SILNE_HASLO
POSTGRES_DB=netrecon

# Redis
REDIS_PASSWORD=ZMIEN_NA_SILNE_HASLO

# Sekret JWT (wygeneruj poleceniem: openssl rand -hex 32)
JWT_SECRET=ZMIEN_NA_LOSOWY_CIAG_HEX

# Rejestr agentow
AGENT_REGISTRY_SECRET=ZMIEN_NA_LOSOWY_CIAG_HEX
AGENT_JWT_SECRET=ZMIEN_NA_LOSOWY_CIAG_HEX

# E-mail (SMTP)
SMTP_HOST=smtp.twojafirma.com
SMTP_PORT=587
SMTP_USER=noreply@twojafirma.com
SMTP_PASSWORD=ZMIEN
SMTP_FROM=NetRecon <noreply@twojafirma.com>

# Licencja
LICENSE_KEY=twoj-klucz-licencyjny
EOF
```

:::warning
Zmien wszystkie przykladowe hasla i sekrety przed wdrozeniem. Uzyj `openssl rand -hex 32`, aby wygenerowac bezpieczne losowe wartosci.
:::

### Krok 4: Utworz plik Docker Compose

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

### Krok 5: Utworz konfiguracje Nginx

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

### Krok 6: Skonfiguruj certyfikaty TLS

**Opcja A: Let's Encrypt (zalecana dla serwerow dostepnych z internetu)**

```bash
sudo apt install certbot -y
sudo certbot certonly --standalone -d netrecon.twojafirma.com

# Kopiowanie certyfikatow
sudo mkdir -p /opt/netrecon/certs
sudo cp /etc/letsencrypt/live/netrecon.twojafirma.com/fullchain.pem /opt/netrecon/certs/
sudo cp /etc/letsencrypt/live/netrecon.twojafirma.com/privkey.pem /opt/netrecon/certs/
```

**Opcja B: Certyfikat samopodpisany (do uzytku wewnetrznego/testowego)**

```bash
sudo mkdir -p /opt/netrecon/certs
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /opt/netrecon/certs/privkey.pem \
  -out /opt/netrecon/certs/fullchain.pem \
  -subj "/CN=netrecon.twojafirma.com"
```

### Krok 7: Wdrozenie

```bash
cd /opt/netrecon
sudo docker compose up -d
```

Sprawdz, czy wszystkie uslugi dzialaja:
```bash
sudo docker compose ps
```

### Krok 8: Dostep do panelu

Otworz przegladarke i przejdz pod adres:
```
https://netrecon.twojafirma.com
```

Utworz poczatkowe konto administratora przy pierwszym dostepie.

## Instalacja na Windows Server

### Krok 1: Zainstaluj Docker Desktop

1. Pobierz Docker Desktop z [docker.com](https://www.docker.com/products/docker-desktop/)
2. Zainstaluj z wlaczonym backendem WSL2
3. Uruchom ponownie serwer

### Krok 2: Postepuj wedlug krokow dla Linuxa

Konfiguracja Docker Compose jest identyczna. Otworz PowerShell i postepuj wedlug krokow 2-8 powyzej, dostosowujac sciezki:

```powershell
mkdir C:\netrecon
cd C:\netrecon
# Utworz .env i docker-compose.yml jak wyzej
docker compose up -d
```

## Po instalacji

### Migracje bazy danych

Migracje uruchamiaja sie automatycznie przy pierwszym starcie. Aby uruchomic recznie:

```bash
docker compose exec api-gateway python manage.py migrate
```

### Konfiguracja kopii zapasowych

Skonfiguruj codzienne kopie zapasowe PostgreSQL:

```bash
# Dodaj do crontab
echo "0 2 * * * docker compose -f /opt/netrecon/docker-compose.yml exec -T postgres pg_dump -U netrecon netrecon | gzip > /opt/netrecon/backups/db-\$(date +\%Y\%m\%d).sql.gz" | sudo crontab -
```

### Monitorowanie

Sprawdz stan uslug:

```bash
# Status wszystkich uslug
docker compose ps

# Logi uslugi
docker compose logs -f api-gateway

# Zuzycie zasobow
docker stats
```

## Aktualizacja

```bash
cd /opt/netrecon

# Pobierz najnowsze obrazy
docker compose pull

# Uruchom ponownie z nowymi obrazami
docker compose up -d

# Weryfikacja
docker compose ps
```

## Rozwiazywanie problemow

### Uslugi nie uruchamiaja sie
```bash
# Sprawdz logi problematycznej uslugi
docker compose logs <nazwa-uslugi>

# Czesty problem: PostgreSQL jeszcze nie jest gotowy
# Rozwiazanie: poczekaj i sprobuj ponownie lub zwieksz liczbe prob healthcheck
```

### Nie mozna uzyskac dostepu do panelu
- Sprawdz, czy port 443 jest otwarty w zaporze sieciowej
- Upewnij sie, ze certyfikaty istnieja w katalogu certs
- Zweryfikuj, ze DNS domeny wskazuje na Twoj serwer

### Bledy polaczenia z baza danych
- Sprawdz, czy PostgreSQL jest zdrowy: `docker compose exec postgres pg_isready`
- Upewnij sie, ze dane logowania w `.env` sa spojne we wszystkich uslugach

## FAQ

**P: Czy moge uzyc zewnetrznej bazy danych PostgreSQL?**
O: Tak. Usun usluge `postgres` z docker-compose.yml i zaktualizuj zmienna srodowiskowa `DATABASE_URL`, aby wskazywala na zewnetrzna baze danych.

**P: Jak skalowac do wysokiej dostepnosci?**
O: Dla wdrozen HA uzyj Kubernetesa z dostarczonymi wykresami Helm. Docker Compose jest odpowiedni dla wdrozen na jednym serwerze.

**P: Czy moge uzyc innego reverse proxy (np. Traefik, Caddy)?**
O: Tak. Zastap usluge Nginx preferowanym reverse proxy. Upewnij sie, ze przekierowuje do API Gateway na porcie 8000 i obsluguje uaktualnienia WebSocket.

Aby uzyskac dodatkowa pomoc, skontaktuj sie z [support@netreconapp.com](mailto:support@netreconapp.com).
