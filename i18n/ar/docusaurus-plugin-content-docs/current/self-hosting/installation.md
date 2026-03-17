---
sidebar_position: 2
title: التثبيت
description: دليل نشر الاستضافة الذاتية خطوة بخطوة
---

# تثبيت الاستضافة الذاتية

يرشدك هذا الدليل خلال نشر منصة NetRecon على خادمك الخاص باستخدام Docker Compose.

## المتطلبات الأساسية

- خادم Linux (يُنصح بـ Ubuntu 22.04+) أو Windows Server مع Docker
- Docker v24.0+ و Docker Compose v2.20+
- اسم نطاق يشير إلى خادمك (مثل `netrecon.yourcompany.com`)
- شهادة TLS لنطاقك (أو استخدم Let's Encrypt)
- 4 جيجابايت ذاكرة على الأقل و40 جيجابايت مساحة تخزين

## تثبيت Linux VPS

### الخطوة 1: تثبيت Docker

```bash
# تحديث النظام
sudo apt update && sudo apt upgrade -y

# تثبيت Docker
curl -fsSL https://get.docker.com | sudo sh

# إضافة المستخدم إلى مجموعة docker
sudo usermod -aG docker $USER

# تثبيت إضافة Docker Compose
sudo apt install docker-compose-plugin -y

# التحقق من التثبيت
docker --version
docker compose version
```

### الخطوة 2: إنشاء مجلد المشروع

```bash
sudo mkdir -p /opt/netrecon
cd /opt/netrecon
```

### الخطوة 3: إنشاء ملف البيئة

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
غيّر جميع كلمات المرور والأسرار المؤقتة قبل النشر. استخدم `openssl rand -hex 32` لتوليد قيم عشوائية آمنة.
:::

### الخطوة 4: إنشاء ملف Docker Compose

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

### الخطوة 5: إنشاء تكوين Nginx

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

### الخطوة 6: إعداد شهادات TLS

**الخيار أ: Let's Encrypt (موصى به للخوادم المتصلة بالإنترنت)**

```bash
sudo apt install certbot -y
sudo certbot certonly --standalone -d netrecon.yourcompany.com

# نسخ الشهادات
sudo mkdir -p /opt/netrecon/certs
sudo cp /etc/letsencrypt/live/netrecon.yourcompany.com/fullchain.pem /opt/netrecon/certs/
sudo cp /etc/letsencrypt/live/netrecon.yourcompany.com/privkey.pem /opt/netrecon/certs/
```

**الخيار ب: شهادة موقعة ذاتيًا (للاستخدام الداخلي/الاختبار)**

```bash
sudo mkdir -p /opt/netrecon/certs
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /opt/netrecon/certs/privkey.pem \
  -out /opt/netrecon/certs/fullchain.pem \
  -subj "/CN=netrecon.yourcompany.com"
```

### الخطوة 7: النشر

```bash
cd /opt/netrecon
sudo docker compose up -d
```

تحقق من أن جميع الخدمات تعمل:
```bash
sudo docker compose ps
```

### الخطوة 8: الوصول إلى لوحة التحكم

افتح متصفحك وانتقل إلى:
```
https://netrecon.yourcompany.com
```

أنشئ حساب المسؤول الأولي عند الوصول لأول مرة.

## تثبيت Windows Server

### الخطوة 1: تثبيت Docker Desktop

1. حمّل Docker Desktop من [docker.com](https://www.docker.com/products/docker-desktop/)
2. ثبّت مع تفعيل واجهة WSL2 الخلفية
3. أعد تشغيل الخادم

### الخطوة 2: اتبع خطوات Linux

إعداد Docker Compose متطابق. افتح PowerShell واتبع الخطوات 2-8 أعلاه، مع تعديل المسارات:

```powershell
mkdir C:\netrecon
cd C:\netrecon
# أنشئ .env و docker-compose.yml كما هو موضح أعلاه
docker compose up -d
```

## ما بعد التثبيت

### ترحيل قاعدة البيانات

تعمل عمليات الترحيل تلقائيًا عند البدء لأول مرة. للتشغيل يدويًا:

```bash
docker compose exec api-gateway python manage.py migrate
```

### تكوين النسخ الاحتياطي

أعد نسخًا احتياطيًا يوميًا لـ PostgreSQL:

```bash
# أضف إلى crontab
echo "0 2 * * * docker compose -f /opt/netrecon/docker-compose.yml exec -T postgres pg_dump -U netrecon netrecon | gzip > /opt/netrecon/backups/db-\$(date +\%Y\%m\%d).sql.gz" | sudo crontab -
```

### المراقبة

تحقق من صحة الخدمات:

```bash
# حالة جميع الخدمات
docker compose ps

# سجلات الخدمة
docker compose logs -f api-gateway

# استخدام الموارد
docker stats
```

## التحديث

```bash
cd /opt/netrecon

# سحب أحدث الصور
docker compose pull

# إعادة التشغيل بالصور الجديدة
docker compose up -d

# التحقق
docker compose ps
```

## استكشاف الأخطاء وإصلاحها

### فشل بدء الخدمات
```bash
# تحقق من سجلات الخدمة المعطلة
docker compose logs <service-name>

# مشكلة شائعة: PostgreSQL غير جاهز بعد
# الحل: انتظر وأعد المحاولة، أو زد عدد محاولات فحص الصحة
```

### لا يمكن الوصول إلى لوحة التحكم
- تحقق من أن المنفذ 443 مفتوح في جدار الحماية
- تحقق من وجود الشهادات في مجلد certs
- تحقق من أن DNS للنطاق يشير إلى خادمك

### أخطاء اتصال قاعدة البيانات
- تحقق من صحة PostgreSQL: `docker compose exec postgres pg_isready`
- تحقق من تطابق بيانات الاعتماد في `.env` عبر جميع الخدمات

## الأسئلة الشائعة

**س: هل يمكنني استخدام قاعدة بيانات PostgreSQL خارجية؟**
ج: نعم. احذف خدمة `postgres` من docker-compose.yml وحدّث متغير البيئة `DATABASE_URL` للإشارة إلى قاعدة بياناتك الخارجية.

**س: كيف أقوم بالتوسع للتوفر العالي؟**
ج: لعمليات النشر عالية التوفر، استخدم Kubernetes مع مخططات Helm المقدمة. Docker Compose مناسب لعمليات النشر على خادم واحد.

**س: هل يمكنني استخدام وكيل عكسي مختلف (مثل Traefik أو Caddy)؟**
ج: نعم. استبدل خدمة Nginx بالوكيل العكسي المفضل لديك. تأكد من أنه يُحوّل إلى API Gateway على المنفذ 8000 ويدعم ترقية WebSocket.

للمساعدة الإضافية، تواصل مع [support@netreconapp.com](mailto:support@netreconapp.com).
