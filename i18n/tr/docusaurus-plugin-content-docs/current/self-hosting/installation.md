---
sidebar_position: 2
title: Kurulum
description: Adım adım kendi sunucunuzda dağıtım kılavuzu
---

# Kendi Sunucunuzda Kurulum

Bu kılavuz, NetRecon platformunu Docker Compose kullanarak kendi sunucunuza dağıtma adımlarını açıklar.

## Ön Koşullar

- Bir Linux sunucu (Ubuntu 22.04+ önerilir) veya Docker yüklü Windows Server
- Docker v24.0+ ve Docker Compose v2.20+
- Sunucunuza yönlendirilmiş bir alan adı (örn. `netrecon.yourcompany.com`)
- Alan adınız için TLS sertifikası (veya Let's Encrypt kullanın)
- En az 4 GB RAM ve 40 GB disk alanı

## Linux VPS Kurulumu

### Adım 1: Docker'ı Kurun

```bash
# Sistemi güncelleyin
sudo apt update && sudo apt upgrade -y

# Docker'ı kurun
curl -fsSL https://get.docker.com | sudo sh

# Kullanıcınızı docker grubuna ekleyin
sudo usermod -aG docker $USER

# Docker Compose eklentisini kurun
sudo apt install docker-compose-plugin -y

# Kurulumu doğrulayın
docker --version
docker compose version
```

### Adım 2: Proje Dizinini Oluşturun

```bash
sudo mkdir -p /opt/netrecon
cd /opt/netrecon
```

### Adım 3: Ortam Dosyasını Oluşturun

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
Dağıtmadan önce tüm yer tutucu parolaları ve gizli anahtarları değiştirin. Güvenli rastgele değerler oluşturmak için `openssl rand -hex 32` komutunu kullanın.
:::

### Adım 4: Docker Compose Dosyasını Oluşturun

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

### Adım 5: Nginx Yapılandırmasını Oluşturun

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

### Adım 6: TLS Sertifikalarını Ayarlayın

**Seçenek A: Let's Encrypt (internete açık sunucular için önerilir)**

```bash
sudo apt install certbot -y
sudo certbot certonly --standalone -d netrecon.yourcompany.com

# Sertifikaları kopyalayın
sudo mkdir -p /opt/netrecon/certs
sudo cp /etc/letsencrypt/live/netrecon.yourcompany.com/fullchain.pem /opt/netrecon/certs/
sudo cp /etc/letsencrypt/live/netrecon.yourcompany.com/privkey.pem /opt/netrecon/certs/
```

**Seçenek B: Kendinden imzalı sertifika (dahili/test için)**

```bash
sudo mkdir -p /opt/netrecon/certs
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /opt/netrecon/certs/privkey.pem \
  -out /opt/netrecon/certs/fullchain.pem \
  -subj "/CN=netrecon.yourcompany.com"
```

### Adım 7: Dağıtın

```bash
cd /opt/netrecon
sudo docker compose up -d
```

Tüm hizmetlerin çalıştığını doğrulayın:
```bash
sudo docker compose ps
```

### Adım 8: Kontrol Paneline Erişin

Tarayıcınızı açın ve şu adrese gidin:
```
https://netrecon.yourcompany.com
```

İlk erişimde başlangıç yönetici hesabını oluşturun.

## Windows Server Kurulumu

### Adım 1: Docker Desktop'ı Kurun

1. [docker.com](https://www.docker.com/products/docker-desktop/) adresinden Docker Desktop'ı indirin
2. WSL2 arka ucu etkinleştirilerek kurun
3. Sunucuyu yeniden başlatın

### Adım 2: Linux Adımlarını Takip Edin

Docker Compose kurulumu aynıdır. PowerShell'i açın ve yukarıdaki 2-8 arası adımları, yolları ayarlayarak takip edin:

```powershell
mkdir C:\netrecon
cd C:\netrecon
# Yukarıdaki gibi .env ve docker-compose.yml dosyalarını oluşturun
docker compose up -d
```

## Kurulum Sonrası

### Veritabanı Geçişleri

Geçişler ilk başlangıçta otomatik olarak çalışır. Manuel olarak tetiklemek için:

```bash
docker compose exec api-gateway python manage.py migrate
```

### Yedekleme Yapılandırması

Günlük PostgreSQL yedeklemesi ayarlayın:

```bash
# Crontab'a ekleyin
echo "0 2 * * * docker compose -f /opt/netrecon/docker-compose.yml exec -T postgres pg_dump -U netrecon netrecon | gzip > /opt/netrecon/backups/db-\$(date +\%Y\%m\%d).sql.gz" | sudo crontab -
```

### İzleme

Hizmet durumunu kontrol edin:

```bash
# Tüm hizmetlerin durumu
docker compose ps

# Hizmet günlükleri
docker compose logs -f api-gateway

# Kaynak kullanımı
docker stats
```

## Güncelleme

```bash
cd /opt/netrecon

# En son imajları çekin
docker compose pull

# Yeni imajlarla yeniden başlatın
docker compose up -d

# Doğrulayın
docker compose ps
```

## Sorun Giderme

### Hizmetler başlatılamıyor
```bash
# Başarısız olan hizmetin günlüklerini kontrol edin
docker compose logs <service-name>

# Yaygın sorun: PostgreSQL henüz hazır değil
# Çözüm: bekleyin ve tekrar deneyin veya healthcheck tekrar sayısını artırın
```

### Kontrol paneline erişilemiyor
- Güvenlik duvarınızda 443 portunun açık olduğunu doğrulayın
- Sertifikaların certs dizininde mevcut olduğunu kontrol edin
- Alan adı DNS'inin sunucunuza yönlendirildiğini doğrulayın

### Veritabanı bağlantı hataları
- PostgreSQL'in sağlıklı olduğunu doğrulayın: `docker compose exec postgres pg_isready`
- `.env` dosyasındaki kimlik bilgilerinin tüm hizmetlerde eşleştiğini kontrol edin

## SSS

**S: Harici bir PostgreSQL veritabanı kullanabilir miyim?**
C: Evet. docker-compose.yml dosyasından `postgres` hizmetini kaldırın ve `DATABASE_URL` ortam değişkenini harici veritabanınıza yönlendirecek şekilde güncelleyin.

**S: Yüksek erişilebilirlik için nasıl ölçeklendiririm?**
C: Yüksek erişilebilirlik dağıtımları için sağlanan Helm chart'larıyla Kubernetes kullanın. Docker Compose, tek sunucu dağıtımları için uygundur.

**S: Farklı bir ters proxy (örn. Traefik, Caddy) kullanabilir miyim?**
C: Evet. Nginx hizmetini tercih ettiğiniz ters proxy ile değiştirin. 8000 portundaki API Gateway'e yönlendirme yaptığından ve WebSocket yükseltmelerini desteklediğinden emin olun.

Ek yardım için [support@netreconapp.com](mailto:support@netreconapp.com) adresine başvurun.
