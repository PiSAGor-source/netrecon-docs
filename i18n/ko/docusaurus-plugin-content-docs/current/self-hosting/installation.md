---
sidebar_position: 2
title: 설치
description: 단계별 자체 호스팅 배포 가이드
---

# 자체 호스팅 설치

이 가이드는 Docker Compose를 사용하여 자체 서버에 NetRecon 플랫폼을 배포하는 과정을 안내합니다.

## 사전 요구 사항

- Linux 서버 (Ubuntu 22.04+ 권장) 또는 Docker가 설치된 Windows Server
- Docker v24.0+ 및 Docker Compose v2.20+
- 서버를 가리키는 도메인 이름 (예: `netrecon.yourcompany.com`)
- 도메인에 대한 TLS 인증서 (또는 Let's Encrypt 사용)
- 최소 4 GB RAM 및 40 GB 디스크 공간

## Linux VPS 설치

### 1단계: Docker 설치

```bash
# 시스템 업데이트
sudo apt update && sudo apt upgrade -y

# Docker 설치
curl -fsSL https://get.docker.com | sudo sh

# 사용자를 docker 그룹에 추가
sudo usermod -aG docker $USER

# Docker Compose 플러그인 설치
sudo apt install docker-compose-plugin -y

# 설치 확인
docker --version
docker compose version
```

### 2단계: 프로젝트 디렉터리 생성

```bash
sudo mkdir -p /opt/netrecon
cd /opt/netrecon
```

### 3단계: 환경 파일 생성

```bash
sudo tee /opt/netrecon/.env << 'EOF'
# NetRecon 자체 호스팅 구성
NETRECON_DOMAIN=netrecon.yourcompany.com
NETRECON_EMAIL=admin@yourcompany.com

# PostgreSQL
POSTGRES_USER=netrecon
POSTGRES_PASSWORD=CHANGE_ME_TO_A_STRONG_PASSWORD
POSTGRES_DB=netrecon

# Redis
REDIS_PASSWORD=CHANGE_ME_TO_A_STRONG_PASSWORD

# JWT Secret (생성 명령: openssl rand -hex 32)
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
배포하기 전에 모든 플레이스홀더 비밀번호와 시크릿을 변경하세요. 안전한 무작위 값을 생성하려면 `openssl rand -hex 32`를 사용하세요.
:::

### 4단계: Docker Compose 파일 생성

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

### 5단계: Nginx 구성 생성

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

### 6단계: TLS 인증서 설정

**옵션 A: Let's Encrypt (인터넷에 노출된 서버에 권장)**

```bash
sudo apt install certbot -y
sudo certbot certonly --standalone -d netrecon.yourcompany.com

# 인증서 복사
sudo mkdir -p /opt/netrecon/certs
sudo cp /etc/letsencrypt/live/netrecon.yourcompany.com/fullchain.pem /opt/netrecon/certs/
sudo cp /etc/letsencrypt/live/netrecon.yourcompany.com/privkey.pem /opt/netrecon/certs/
```

**옵션 B: 자체 서명 인증서 (내부/테스트용)**

```bash
sudo mkdir -p /opt/netrecon/certs
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /opt/netrecon/certs/privkey.pem \
  -out /opt/netrecon/certs/fullchain.pem \
  -subj "/CN=netrecon.yourcompany.com"
```

### 7단계: 배포

```bash
cd /opt/netrecon
sudo docker compose up -d
```

모든 서비스가 실행 중인지 확인:
```bash
sudo docker compose ps
```

### 8단계: 대시보드 접근

브라우저를 열고 다음으로 이동:
```
https://netrecon.yourcompany.com
```

첫 접근 시 초기 관리자 계정을 생성합니다.

## Windows Server 설치

### 1단계: Docker Desktop 설치

1. [docker.com](https://www.docker.com/products/docker-desktop/)에서 Docker Desktop을 다운로드합니다
2. WSL2 백엔드를 활성화하여 설치합니다
3. 서버를 재시작합니다

### 2단계: Linux 단계 따르기

Docker Compose 설정은 동일합니다. PowerShell을 열고 위의 2-8단계를 따르되, 경로를 조정하세요:

```powershell
mkdir C:\netrecon
cd C:\netrecon
# 위와 같이 .env 및 docker-compose.yml 생성
docker compose up -d
```

## 설치 후 작업

### 데이터베이스 마이그레이션

마이그레이션은 첫 시작 시 자동으로 실행됩니다. 수동으로 트리거하려면:

```bash
docker compose exec api-gateway python manage.py migrate
```

### 백업 구성

매일 PostgreSQL 백업 설정:

```bash
# crontab에 추가
echo "0 2 * * * docker compose -f /opt/netrecon/docker-compose.yml exec -T postgres pg_dump -U netrecon netrecon | gzip > /opt/netrecon/backups/db-\$(date +\%Y\%m\%d).sql.gz" | sudo crontab -
```

### 모니터링

서비스 상태 확인:

```bash
# 모든 서비스 상태
docker compose ps

# 서비스 로그
docker compose logs -f api-gateway

# 리소스 사용량
docker stats
```

## 업데이트

```bash
cd /opt/netrecon

# 최신 이미지 풀
docker compose pull

# 새 이미지로 재시작
docker compose up -d

# 확인
docker compose ps
```

## 문제 해결

### 서비스 시작 실패
```bash
# 실패하는 서비스의 로그 확인
docker compose logs <service-name>

# 일반적인 문제: PostgreSQL이 아직 준비되지 않음
# 해결: 대기 후 재시도하거나 healthcheck 재시도 횟수 증가
```

### 대시보드에 접근할 수 없음
- 방화벽에서 포트 443이 열려 있는지 확인하세요
- certs 디렉터리에 인증서가 있는지 확인하세요
- 도메인 DNS가 서버를 가리키는지 확인하세요

### 데이터베이스 연결 오류
- PostgreSQL이 정상인지 확인: `docker compose exec postgres pg_isready`
- `.env`의 자격 증명이 모든 서비스에서 일치하는지 확인하세요

## FAQ

**Q: 외부 PostgreSQL 데이터베이스를 사용할 수 있나요?**
A: 네. docker-compose.yml에서 `postgres` 서비스를 제거하고 `DATABASE_URL` 환경 변수를 외부 데이터베이스를 가리키도록 업데이트하세요.

**Q: 고가용성을 위해 어떻게 확장하나요?**
A: HA 배포의 경우 제공된 Helm 차트와 함께 Kubernetes를 사용하세요. Docker Compose는 단일 서버 배포에 적합합니다.

**Q: 다른 리버스 프록시(예: Traefik, Caddy)를 사용할 수 있나요?**
A: 네. Nginx 서비스를 선호하는 리버스 프록시로 교체하세요. 포트 8000의 API Gateway로 전달하고 WebSocket 업그레이드를 지원하는지 확인하세요.

추가 도움이 필요하시면 [support@netreconapp.com](mailto:support@netreconapp.com)으로 연락하세요.
