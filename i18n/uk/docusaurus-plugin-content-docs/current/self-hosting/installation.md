---
sidebar_position: 2
title: Встановлення
description: Покрокова інструкція з розгортання на власному сервері
---

# Встановлення на власному сервері

Ця інструкція проведе вас через розгортання платформи NetRecon на вашому власному сервері за допомогою Docker Compose.

## Передумови

- Сервер Linux (Ubuntu 22.04+ рекомендовано) або Windows Server з Docker
- Docker v24.0+ та Docker Compose v2.20+
- Доменне ім'я, спрямоване на ваш сервер (наприклад, `netrecon.yourcompany.com`)
- TLS-сертифікат для вашого домену (або використовуйте Let's Encrypt)
- Мінімум 4 ГБ ОЗП та 40 ГБ дискового простору

## Встановлення на Linux VPS

### Крок 1: Встановіть Docker

```bash
# Оновлення системи
sudo apt update && sudo apt upgrade -y

# Встановлення Docker
curl -fsSL https://get.docker.com | sudo sh

# Додайте свого користувача до групи docker
sudo usermod -aG docker $USER

# Встановлення плагіна Docker Compose
sudo apt install docker-compose-plugin -y

# Перевірка встановлення
docker --version
docker compose version
```

### Крок 2: Створіть каталог проекту

```bash
sudo mkdir -p /opt/netrecon
cd /opt/netrecon
```

### Крок 3: Створіть файл середовища

```bash
sudo tee /opt/netrecon/.env << 'EOF'
# Конфігурація NetRecon Self-Hosted
NETRECON_DOMAIN=netrecon.yourcompany.com
NETRECON_EMAIL=admin@yourcompany.com

# PostgreSQL
POSTGRES_USER=netrecon
POSTGRES_PASSWORD=CHANGE_ME_TO_A_STRONG_PASSWORD
POSTGRES_DB=netrecon

# Redis
REDIS_PASSWORD=CHANGE_ME_TO_A_STRONG_PASSWORD

# JWT Secret (згенеруйте: openssl rand -hex 32)
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

# Ліцензія
LICENSE_KEY=your-license-key
EOF
```

:::warning
Змініть усі паролі-заповнювачі та секрети перед розгортанням. Використовуйте `openssl rand -hex 32` для генерації безпечних випадкових значень.
:::

### Крок 4: Створіть файл Docker Compose

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

### Крок 5: Створіть конфігурацію Nginx

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

### Крок 6: Налаштуйте TLS-сертифікати

**Варіант A: Let's Encrypt (рекомендовано для серверів з доступом до інтернету)**

```bash
sudo apt install certbot -y
sudo certbot certonly --standalone -d netrecon.yourcompany.com

# Копіювання сертифікатів
sudo mkdir -p /opt/netrecon/certs
sudo cp /etc/letsencrypt/live/netrecon.yourcompany.com/fullchain.pem /opt/netrecon/certs/
sudo cp /etc/letsencrypt/live/netrecon.yourcompany.com/privkey.pem /opt/netrecon/certs/
```

**Варіант B: Самопідписаний сертифікат (для внутрішнього використання/тестування)**

```bash
sudo mkdir -p /opt/netrecon/certs
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /opt/netrecon/certs/privkey.pem \
  -out /opt/netrecon/certs/fullchain.pem \
  -subj "/CN=netrecon.yourcompany.com"
```

### Крок 7: Розгортання

```bash
cd /opt/netrecon
sudo docker compose up -d
```

Перевірте, що всі сервіси працюють:
```bash
sudo docker compose ps
```

### Крок 8: Доступ до панелі керування

Відкрийте браузер та перейдіть за адресою:
```
https://netrecon.yourcompany.com
```

Створіть початковий обліковий запис адміністратора при першому доступі.

## Встановлення на Windows Server

### Крок 1: Встановіть Docker Desktop

1. Завантажте Docker Desktop з [docker.com](https://www.docker.com/products/docker-desktop/)
2. Встановіть з увімкненим бекендом WSL2
3. Перезавантажте сервер

### Крок 2: Виконайте кроки для Linux

Налаштування Docker Compose ідентичне. Відкрийте PowerShell та виконайте кроки 2-8 вище, адаптувавши шляхи:

```powershell
mkdir C:\netrecon
cd C:\netrecon
# Створіть .env та docker-compose.yml як зазначено вище
docker compose up -d
```

## Після встановлення

### Міграції бази даних

Міграції виконуються автоматично при першому запуску. Для запуску вручну:

```bash
docker compose exec api-gateway python manage.py migrate
```

### Конфігурація резервного копіювання

Налаштуйте щоденне резервне копіювання PostgreSQL:

```bash
# Додайте до crontab
echo "0 2 * * * docker compose -f /opt/netrecon/docker-compose.yml exec -T postgres pg_dump -U netrecon netrecon | gzip > /opt/netrecon/backups/db-\$(date +\%Y\%m\%d).sql.gz" | sudo crontab -
```

### Моніторинг

Перевірка стану сервісів:

```bash
# Статус усіх сервісів
docker compose ps

# Журнали сервісів
docker compose logs -f api-gateway

# Використання ресурсів
docker stats
```

## Оновлення

```bash
cd /opt/netrecon

# Завантажте останні образи
docker compose pull

# Перезапуск з новими образами
docker compose up -d

# Перевірка
docker compose ps
```

## Усунення неполадок

### Сервіси не запускаються
```bash
# Перевірте журнали несправного сервісу
docker compose logs <service-name>

# Поширена проблема: PostgreSQL ще не готовий
# Рішення: зачекайте та повторіть, або збільшіть кількість спроб healthcheck
```

### Не вдається отримати доступ до панелі керування
- Переконайтесь, що порт 443 відкритий у вашому брандмауері
- Перевірте, що сертифікати існують у каталозі certs
- Переконайтесь, що DNS домену вказує на ваш сервер

### Помилки підключення до бази даних
- Переконайтесь, що PostgreSQL працює: `docker compose exec postgres pg_isready`
- Перевірте, що облікові дані в `.env` збігаються для всіх сервісів

## Часті запитання

**Q: Чи можна використовувати зовнішню базу даних PostgreSQL?**
A: Так. Видаліть сервіс `postgres` з docker-compose.yml та оновіть змінну середовища `DATABASE_URL`, щоб вона вказувала на вашу зовнішню базу даних.

**Q: Як масштабувати для високої доступності?**
A: Для розгортань з високою доступністю використовуйте Kubernetes з наданими Helm charts. Docker Compose підходить для розгортань на одному сервері.

**Q: Чи можна використовувати інший зворотний проксі (наприклад, Traefik, Caddy)?**
A: Так. Замініть сервіс Nginx на бажаний зворотний проксі. Переконайтесь, що він перенаправляє на API Gateway на порт 8000 та підтримує оновлення WebSocket.

Для додаткової допомоги зверніться до [support@netreconapp.com](mailto:support@netreconapp.com).
