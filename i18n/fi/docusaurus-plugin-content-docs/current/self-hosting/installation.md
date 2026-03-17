---
sidebar_position: 2
title: Asennus
description: Vaiheittainen itse isannoidyn kayttoonotto-opas
---

# Itse isannoitu asennus

Tama opas ohjaa sinua NetRecon-alustan kayttoonoton omalle palvelimellesi Docker Composen avulla.

## Esitiedot

- Linux-palvelin (Ubuntu 22.04+ suositeltu) tai Windows Server Dockerilla
- Docker v24.0+ ja Docker Compose v2.20+
- Verkkotunnus, joka osoittaa palvelimellesi (esim. `netrecon.yrityksesi.com`)
- TLS-varmenne verkkotunnuksellesi (tai kayta Let's Encryptia)
- Vahintaan 4 GB RAM ja 40 GB levytilaa

## Linux VPS -asennus

### Vaihe 1: Asenna Docker

```bash
# Paivita jarjestelma
sudo apt update && sudo apt upgrade -y

# Asenna Docker
curl -fsSL https://get.docker.com | sudo sh

# Lisaa kayttajasi docker-ryhmaan
sudo usermod -aG docker $USER

# Asenna Docker Compose -lisaosa
sudo apt install docker-compose-plugin -y

# Vahvista asennus
docker --version
docker compose version
```

### Vaihe 2: Luo projektikansio

```bash
sudo mkdir -p /opt/netrecon
cd /opt/netrecon
```

### Vaihe 3: Luo ymparistomuuttujatiedosto

```bash
sudo tee /opt/netrecon/.env << 'EOF'
# NetRecon itse isannoitu konfiguraatio
NETRECON_DOMAIN=netrecon.yrityksesi.com
NETRECON_EMAIL=admin@yrityksesi.com

# PostgreSQL
POSTGRES_USER=netrecon
POSTGRES_PASSWORD=VAIHDA_VAHVAAN_SALASANAAN
POSTGRES_DB=netrecon

# Redis
REDIS_PASSWORD=VAIHDA_VAHVAAN_SALASANAAN

# JWT-salaisuus (generoi komennolla: openssl rand -hex 32)
JWT_SECRET=VAIHDA_SATUNNAISEEN_HEX_MERKKIJONOON

# Agenttirekisteri
AGENT_REGISTRY_SECRET=VAIHDA_SATUNNAISEEN_HEX_MERKKIJONOON
AGENT_JWT_SECRET=VAIHDA_SATUNNAISEEN_HEX_MERKKIJONOON

# Sahkoposti (SMTP)
SMTP_HOST=smtp.yrityksesi.com
SMTP_PORT=587
SMTP_USER=noreply@yrityksesi.com
SMTP_PASSWORD=VAIHDA_TAMA
SMTP_FROM=NetRecon <noreply@yrityksesi.com>

# Lisenssi
LICENSE_KEY=lisenssiavaimesi
EOF
```

:::warning
Vaihda kaikki paikkamerkkisalasanat ja salaisuudet ennen kayttoonottoa. Kayta `openssl rand -hex 32` -komentoa turvallisten satunnaisarvojen generointiin.
:::

### Vaihe 4: Luo Docker Compose -tiedosto

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

### Vaihe 5: Luo Nginx-konfiguraatio

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

### Vaihe 6: Maarita TLS-varmenteet

**Vaihtoehto A: Let's Encrypt (suositeltu internetiin yhdistetyille palvelimille)**

```bash
sudo apt install certbot -y
sudo certbot certonly --standalone -d netrecon.yrityksesi.com

# Kopioi varmenteet
sudo mkdir -p /opt/netrecon/certs
sudo cp /etc/letsencrypt/live/netrecon.yrityksesi.com/fullchain.pem /opt/netrecon/certs/
sudo cp /etc/letsencrypt/live/netrecon.yrityksesi.com/privkey.pem /opt/netrecon/certs/
```

**Vaihtoehto B: Itseallekirjoitettu varmenne (sisaiseen kayttoon/testaukseen)**

```bash
sudo mkdir -p /opt/netrecon/certs
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /opt/netrecon/certs/privkey.pem \
  -out /opt/netrecon/certs/fullchain.pem \
  -subj "/CN=netrecon.yrityksesi.com"
```

### Vaihe 7: Kayttoonotto

```bash
cd /opt/netrecon
sudo docker compose up -d
```

Vahvista, etta kaikki palvelut ovat kaynissa:
```bash
sudo docker compose ps
```

### Vaihe 8: Avaa hallintapaneeli

Avaa selaimesi ja siirry osoitteeseen:
```
https://netrecon.yrityksesi.com
```

Luo ensimmainen yllapitajatili ensimmaisella kayttokerralla.

## Windows Server -asennus

### Vaihe 1: Asenna Docker Desktop

1. Lataa Docker Desktop osoitteesta [docker.com](https://www.docker.com/products/docker-desktop/)
2. Asenna WSL2-taustajaarjestelman kanssa
3. Kaynnista palvelin uudelleen

### Vaihe 2: Noudata Linux-vaiheita

Docker Compose -asennus on identtinen. Avaa PowerShell ja noudata vaiheita 2-8 muuttaen polut:

```powershell
mkdir C:\netrecon
cd C:\netrecon
# Luo .env ja docker-compose.yml kuten yllaa
docker compose up -d
```

## Asennuksen jalkeen

### Tietokantamigraatiot

Migraatiot suoritetaan automaattisesti ensimmaisella kaynistyskerralla. Manuaalinen kaynnistys:

```bash
docker compose exec api-gateway python manage.py migrate
```

### Varmuuskopiointikonfiguraatio

Maarita paivittainen PostgreSQL-varmuuskopiointi:

```bash
# Lisaa crontabiin
echo "0 2 * * * docker compose -f /opt/netrecon/docker-compose.yml exec -T postgres pg_dump -U netrecon netrecon | gzip > /opt/netrecon/backups/db-\$(date +\%Y\%m\%d).sql.gz" | sudo crontab -
```

### Valvonta

Tarkista palveluiden tila:

```bash
# Kaikkien palveluiden tila
docker compose ps

# Palvelun lokit
docker compose logs -f api-gateway

# Resurssien kaytto
docker stats
```

## Paivittaminen

```bash
cd /opt/netrecon

# Hae uusimmat levykuvat
docker compose pull

# Kaynnista uudelleen uusilla levykuvilla
docker compose up -d

# Vahvista
docker compose ps
```

## Vianmaaritys

### Palvelut eivat kaynnisty
```bash
# Tarkista epaaonnistuneen palvelun lokit
docker compose logs <palvelun-nimi>

# Yleinen ongelma: PostgreSQL ei ole viela valmis
# Ratkaisu: odota ja yrita uudelleen tai lisaa terveystarkistuksen yrityskertoja
```

### Hallintapaneeliin ei paase
- Vahvista, etta portti 443 on auki palomuurissasi
- Tarkista, etta varmenteet ovat certs-kansiossa
- Vahvista, etta verkkotunnuksen DNS osoittaa palvelimellesi

### Tietokantayhteysvirheet
- Vahvista PostgreSQL:n tila: `docker compose exec postgres pg_isready`
- Tarkista, etta tunnistetiedot `.env`-tiedostossa ovat samat kaikissa palveluissa

## UKK

**K: Voinko kayttaa ulkoista PostgreSQL-tietokantaa?**
V: Kylla. Poista `postgres`-palvelu docker-compose.yml-tiedostosta ja paivita `DATABASE_URL`-ymparistomuuttuja osoittamaan ulkoiseen tietokantaasi.

**K: Miten skaalaan korkean saatavuuden varmistamiseksi?**
V: Korkean saatavuuden kayttoonottoihin kayta Kubernetesia saatavilla olevien Helm-kaavioiden kanssa. Docker Compose sopii yhden palvelimen kayttoonottoihin.

**K: Voinko kayttaa toista kaanteista valityspalvelinta (esim. Traefik, Caddy)?**
V: Kylla. Korvaa Nginx-palvelu haluamallasi kaanteisella valityspalvelimella. Varmista, etta se valittaa API Gatewaylle portissa 8000 ja tukee WebSocket-paivityksia.

Lisaavun saamiseksi ota yhteytta osoitteeseen [support@netreconapp.com](mailto:support@netreconapp.com).
