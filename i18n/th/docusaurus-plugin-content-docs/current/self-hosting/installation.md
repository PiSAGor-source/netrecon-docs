---
sidebar_position: 2
title: การติดตั้ง
description: คู่มือการติดตั้งแบบ self-hosted ทีละขั้นตอน
---

# การติดตั้ง Self-Hosted

คู่มือนี้จะแนะนำคุณผ่านการติดตั้งแพลตฟอร์ม NetRecon บนเซิร์ฟเวอร์ของคุณเองโดยใช้ Docker Compose

## ข้อกำหนดเบื้องต้น

- เซิร์ฟเวอร์ Linux (แนะนำ Ubuntu 22.04+) หรือ Windows Server พร้อม Docker
- Docker v24.0+ และ Docker Compose v2.20+
- ชื่อโดเมนที่ชี้ไปยังเซิร์ฟเวอร์ของคุณ (เช่น `netrecon.yourcompany.com`)
- ใบรับรอง TLS สำหรับโดเมนของคุณ (หรือใช้ Let's Encrypt)
- RAM อย่างน้อย 4 GB และพื้นที่ดิสก์ 40 GB

## การติดตั้งบน Linux VPS

### ขั้นตอนที่ 1: ติดตั้ง Docker

```bash
# อัปเดตระบบ
sudo apt update && sudo apt upgrade -y

# ติดตั้ง Docker
curl -fsSL https://get.docker.com | sudo sh

# เพิ่มผู้ใช้ของคุณไปยังกลุ่ม docker
sudo usermod -aG docker $USER

# ติดตั้ง Docker Compose plugin
sudo apt install docker-compose-plugin -y

# ตรวจสอบการติดตั้ง
docker --version
docker compose version
```

### ขั้นตอนที่ 2: สร้างไดเรกทอรีโปรเจกต์

```bash
sudo mkdir -p /opt/netrecon
cd /opt/netrecon
```

### ขั้นตอนที่ 3: สร้างไฟล์ Environment

```bash
sudo tee /opt/netrecon/.env << 'EOF'
# คอนฟิกูเรชัน NetRecon Self-Hosted
NETRECON_DOMAIN=netrecon.yourcompany.com
NETRECON_EMAIL=admin@yourcompany.com

# PostgreSQL
POSTGRES_USER=netrecon
POSTGRES_PASSWORD=CHANGE_ME_TO_A_STRONG_PASSWORD
POSTGRES_DB=netrecon

# Redis
REDIS_PASSWORD=CHANGE_ME_TO_A_STRONG_PASSWORD

# JWT Secret (สร้างด้วย: openssl rand -hex 32)
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
เปลี่ยนรหัสผ่านและ secret ทั้งหมดก่อนการติดตั้ง ใช้ `openssl rand -hex 32` เพื่อสร้างค่าสุ่มที่ปลอดภัย
:::

### ขั้นตอนที่ 4: สร้างไฟล์ Docker Compose

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

### ขั้นตอนที่ 5: สร้างคอนฟิกูเรชัน Nginx

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

### ขั้นตอนที่ 6: ตั้งค่าใบรับรอง TLS

**ตัวเลือก A: Let's Encrypt (แนะนำสำหรับเซิร์ฟเวอร์ที่เข้าถึงได้ทางอินเทอร์เน็ต)**

```bash
sudo apt install certbot -y
sudo certbot certonly --standalone -d netrecon.yourcompany.com

# คัดลอกใบรับรอง
sudo mkdir -p /opt/netrecon/certs
sudo cp /etc/letsencrypt/live/netrecon.yourcompany.com/fullchain.pem /opt/netrecon/certs/
sudo cp /etc/letsencrypt/live/netrecon.yourcompany.com/privkey.pem /opt/netrecon/certs/
```

**ตัวเลือก B: ใบรับรองที่ลงนามเอง (สำหรับภายใน/การทดสอบ)**

```bash
sudo mkdir -p /opt/netrecon/certs
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /opt/netrecon/certs/privkey.pem \
  -out /opt/netrecon/certs/fullchain.pem \
  -subj "/CN=netrecon.yourcompany.com"
```

### ขั้นตอนที่ 7: ติดตั้ง

```bash
cd /opt/netrecon
sudo docker compose up -d
```

ตรวจสอบว่าบริการทั้งหมดกำลังทำงาน:
```bash
sudo docker compose ps
```

### ขั้นตอนที่ 8: เข้าถึง Dashboard

เปิดเบราว์เซอร์และไปที่:
```
https://netrecon.yourcompany.com
```

สร้างบัญชีผู้ดูแลระบบเริ่มต้นเมื่อเข้าถึงครั้งแรก

## การติดตั้งบน Windows Server

### ขั้นตอนที่ 1: ติดตั้ง Docker Desktop

1. ดาวน์โหลด Docker Desktop จาก [docker.com](https://www.docker.com/products/docker-desktop/)
2. ติดตั้งโดยเปิดใช้งาน WSL2 backend
3. รีสตาร์ทเซิร์ฟเวอร์

### ขั้นตอนที่ 2: ทำตามขั้นตอน Linux

การตั้งค่า Docker Compose เหมือนกัน เปิด PowerShell แล้วทำตามขั้นตอนที่ 2-8 ข้างต้น โดยปรับเส้นทาง:

```powershell
mkdir C:\netrecon
cd C:\netrecon
# สร้าง .env และ docker-compose.yml ตามข้างต้น
docker compose up -d
```

## หลังการติดตั้ง

### การย้ายฐานข้อมูล

การย้ายฐานข้อมูลจะทำงานโดยอัตโนมัติเมื่อเริ่มต้นครั้งแรก เพื่อทริกเกอร์ด้วยตนเอง:

```bash
docker compose exec api-gateway python manage.py migrate
```

### คอนฟิกูเรชันการสำรองข้อมูล

ตั้งค่าการสำรอง PostgreSQL รายวัน:

```bash
# เพิ่มไปยัง crontab
echo "0 2 * * * docker compose -f /opt/netrecon/docker-compose.yml exec -T postgres pg_dump -U netrecon netrecon | gzip > /opt/netrecon/backups/db-\$(date +\%Y\%m\%d).sql.gz" | sudo crontab -
```

### การตรวจสอบ

ตรวจสอบสุขภาพบริการ:

```bash
# สถานะบริการทั้งหมด
docker compose ps

# บันทึกบริการ
docker compose logs -f api-gateway

# การใช้ทรัพยากร
docker stats
```

## การอัปเดต

```bash
cd /opt/netrecon

# ดึงอิมเมจล่าสุด
docker compose pull

# รีสตาร์ทด้วยอิมเมจใหม่
docker compose up -d

# ตรวจสอบ
docker compose ps
```

## การแก้ไขปัญหา

### บริการไม่สามารถเริ่มต้นได้
```bash
# ตรวจสอบบันทึกสำหรับบริการที่ล้มเหลว
docker compose logs <service-name>

# ปัญหาที่พบบ่อย: PostgreSQL ยังไม่พร้อม
# แก้ไข: รอแล้วลองใหม่ หรือเพิ่มจำนวนครั้ง healthcheck retries
```

### ไม่สามารถเข้าถึง dashboard ได้
- ตรวจสอบว่าพอร์ต 443 เปิดอยู่ใน firewall ของคุณ
- ตรวจสอบว่าใบรับรองมีอยู่ในไดเรกทอรี certs
- ตรวจสอบว่า DNS ของโดเมนชี้ไปยังเซิร์ฟเวอร์ของคุณ

### ข้อผิดพลาดการเชื่อมต่อฐานข้อมูล
- ตรวจสอบว่า PostgreSQL สุขภาพดี: `docker compose exec postgres pg_isready`
- ตรวจสอบว่าข้อมูลรับรองใน `.env` ตรงกันในทุกบริการ

## คำถามที่พบบ่อย

**ถาม: ฉันสามารถใช้ฐานข้อมูล PostgreSQL ภายนอกได้ไหม?**
ตอบ: ได้ ลบบริการ `postgres` จาก docker-compose.yml และอัปเดตตัวแปร environment `DATABASE_URL` ให้ชี้ไปยังฐานข้อมูลภายนอกของคุณ

**ถาม: ฉันจะปรับขนาดเพื่อความพร้อมใช้งานสูงได้อย่างไร?**
ตอบ: สำหรับการติดตั้ง HA ใช้ Kubernetes พร้อม Helm charts ที่ให้มา Docker Compose เหมาะสำหรับการติดตั้งเซิร์ฟเวอร์เดียว

**ถาม: ฉันสามารถใช้ reverse proxy ตัวอื่น (เช่น Traefik, Caddy) ได้ไหม?**
ตอบ: ได้ แทนที่บริการ Nginx ด้วย reverse proxy ที่คุณต้องการ ตรวจสอบให้แน่ใจว่าส่งต่อไปยัง API Gateway บนพอร์ต 8000 และรองรับการอัปเกรด WebSocket

สำหรับความช่วยเหลือเพิ่มเติม ติดต่อ [support@netreconapp.com](mailto:support@netreconapp.com)
