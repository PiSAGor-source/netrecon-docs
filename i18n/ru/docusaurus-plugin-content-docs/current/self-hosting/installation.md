---
sidebar_position: 2
title: Установка
description: Пошаговое руководство по локальному развёртыванию
---

# Локальная установка

Данное руководство проведёт вас через процесс развёртывания платформы NetRecon на вашем собственном сервере с помощью Docker Compose.

## Предварительные требования

- Сервер Linux (рекомендуется Ubuntu 22.04+) или Windows Server с Docker
- Docker v24.0+ и Docker Compose v2.20+
- Доменное имя, направленное на ваш сервер (например, `netrecon.yourcompany.com`)
- TLS-сертификат для вашего домена (или используйте Let's Encrypt)
- Минимум 4 ГБ ОЗУ и 40 ГБ дискового пространства

## Установка на Linux VPS

### Шаг 1: Установите Docker

```bash
# Обновление системы
sudo apt update && sudo apt upgrade -y

# Установка Docker
curl -fsSL https://get.docker.com | sudo sh

# Добавление пользователя в группу docker
sudo usermod -aG docker $USER

# Установка плагина Docker Compose
sudo apt install docker-compose-plugin -y

# Проверка установки
docker --version
docker compose version
```

### Шаг 2: Создайте директорию проекта

```bash
sudo mkdir -p /opt/netrecon
cd /opt/netrecon
```

### Шаг 3: Создайте файл окружения

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
Замените все пароли-заглушки и секреты перед развёртыванием. Используйте `openssl rand -hex 32` для генерации безопасных случайных значений.
:::

### Шаг 4: Создайте файл Docker Compose

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

### Шаг 5: Создайте конфигурацию Nginx

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

### Шаг 6: Настройте TLS-сертификаты

**Вариант A: Let's Encrypt (рекомендуется для серверов с доступом из интернета)**

```bash
sudo apt install certbot -y
sudo certbot certonly --standalone -d netrecon.yourcompany.com

# Копирование сертификатов
sudo mkdir -p /opt/netrecon/certs
sudo cp /etc/letsencrypt/live/netrecon.yourcompany.com/fullchain.pem /opt/netrecon/certs/
sudo cp /etc/letsencrypt/live/netrecon.yourcompany.com/privkey.pem /opt/netrecon/certs/
```

**Вариант B: Самоподписанный сертификат (для внутреннего использования/тестирования)**

```bash
sudo mkdir -p /opt/netrecon/certs
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /opt/netrecon/certs/privkey.pem \
  -out /opt/netrecon/certs/fullchain.pem \
  -subj "/CN=netrecon.yourcompany.com"
```

### Шаг 7: Запустите

```bash
cd /opt/netrecon
sudo docker compose up -d
```

Проверьте, что все сервисы работают:
```bash
sudo docker compose ps
```

### Шаг 8: Откройте панель управления

Откройте браузер и перейдите по адресу:
```
https://netrecon.yourcompany.com
```

Создайте начальную учётную запись администратора при первом входе.

## Установка на Windows Server

### Шаг 1: Установите Docker Desktop

1. Скачайте Docker Desktop с [docker.com](https://www.docker.com/products/docker-desktop/)
2. Установите с включённым бэкендом WSL2
3. Перезагрузите сервер

### Шаг 2: Следуйте шагам для Linux

Настройка Docker Compose идентична. Откройте PowerShell и выполните шаги 2-8 выше, адаптировав пути:

```powershell
mkdir C:\netrecon
cd C:\netrecon
# Создайте .env и docker-compose.yml, как описано выше
docker compose up -d
```

## После установки

### Миграции базы данных

Миграции выполняются автоматически при первом запуске. Для ручного запуска:

```bash
docker compose exec api-gateway python manage.py migrate
```

### Настройка резервного копирования

Настройте ежедневное резервное копирование PostgreSQL:

```bash
# Добавьте в crontab
echo "0 2 * * * docker compose -f /opt/netrecon/docker-compose.yml exec -T postgres pg_dump -U netrecon netrecon | gzip > /opt/netrecon/backups/db-\$(date +\%Y\%m\%d).sql.gz" | sudo crontab -
```

### Мониторинг

Проверка состояния сервисов:

```bash
# Статус всех сервисов
docker compose ps

# Журналы сервиса
docker compose logs -f api-gateway

# Использование ресурсов
docker stats
```

## Обновление

```bash
cd /opt/netrecon

# Загрузите последние образы
docker compose pull

# Перезапустите с новыми образами
docker compose up -d

# Проверьте
docker compose ps
```

## Устранение неполадок

### Сервисы не запускаются
```bash
# Проверьте журналы проблемного сервиса
docker compose logs <service-name>

# Частая проблема: PostgreSQL ещё не готов
# Решение: подождите и повторите, или увеличьте количество попыток healthcheck
```

### Нет доступа к панели управления
- Убедитесь, что порт 443 открыт в вашем файрволе
- Проверьте наличие сертификатов в директории certs
- Убедитесь, что DNS домена указывает на ваш сервер

### Ошибки подключения к базе данных
- Убедитесь, что PostgreSQL работает: `docker compose exec postgres pg_isready`
- Проверьте, что учётные данные в `.env` совпадают во всех сервисах

## Часто задаваемые вопросы

**В: Можно ли использовать внешнюю базу данных PostgreSQL?**
О: Да. Удалите сервис `postgres` из docker-compose.yml и обновите переменную окружения `DATABASE_URL`, указав адрес вашей внешней базы данных.

**В: Как масштабировать для высокой доступности?**
О: Для развёртываний с высокой доступностью используйте Kubernetes с предоставленными Helm-чартами. Docker Compose подходит для развёртываний на одном сервере.

**В: Можно ли использовать другой обратный прокси (например, Traefik, Caddy)?**
О: Да. Замените сервис Nginx на предпочитаемый обратный прокси. Убедитесь, что он перенаправляет запросы на API Gateway на порт 8000 и поддерживает обновление WebSocket-соединений.

Для получения дополнительной помощи свяжитесь с [support@netreconapp.com](mailto:support@netreconapp.com).
