---
sidebar_position: 2
title: 安装
description: 逐步自托管部署指南
---

# 自托管安装

本指南将引导您使用 Docker Compose 在自己的服务器上部署 NetRecon 平台。

## 前提条件

- 一台 Linux 服务器（推荐 Ubuntu 22.04+）或带有 Docker 的 Windows Server
- Docker v24.0+ 和 Docker Compose v2.20+
- 指向您服务器的域名（例如 `netrecon.yourcompany.com`）
- 您域名的 TLS 证书（或使用 Let's Encrypt）
- 至少 4 GB 内存和 40 GB 磁盘空间

## Linux VPS 安装

### 第 1 步：安装 Docker

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装 Docker
curl -fsSL https://get.docker.com | sudo sh

# 将您的用户添加到 docker 组
sudo usermod -aG docker $USER

# 安装 Docker Compose 插件
sudo apt install docker-compose-plugin -y

# 验证安装
docker --version
docker compose version
```

### 第 2 步：创建项目目录

```bash
sudo mkdir -p /opt/netrecon
cd /opt/netrecon
```

### 第 3 步：创建环境配置文件

```bash
sudo tee /opt/netrecon/.env << 'EOF'
# NetRecon 自托管配置
NETRECON_DOMAIN=netrecon.yourcompany.com
NETRECON_EMAIL=admin@yourcompany.com

# PostgreSQL
POSTGRES_USER=netrecon
POSTGRES_PASSWORD=CHANGE_ME_TO_A_STRONG_PASSWORD
POSTGRES_DB=netrecon

# Redis
REDIS_PASSWORD=CHANGE_ME_TO_A_STRONG_PASSWORD

# JWT 密钥（使用以下命令生成：openssl rand -hex 32）
JWT_SECRET=CHANGE_ME_TO_A_RANDOM_HEX_STRING

# 代理注册
AGENT_REGISTRY_SECRET=CHANGE_ME_TO_A_RANDOM_HEX_STRING
AGENT_JWT_SECRET=CHANGE_ME_TO_A_RANDOM_HEX_STRING

# 邮件 (SMTP)
SMTP_HOST=smtp.yourcompany.com
SMTP_PORT=587
SMTP_USER=noreply@yourcompany.com
SMTP_PASSWORD=CHANGE_ME
SMTP_FROM=NetRecon <noreply@yourcompany.com>

# 许可证
LICENSE_KEY=your-license-key
EOF
```

:::warning
部署前请更改所有占位符密码和密钥。使用 `openssl rand -hex 32` 生成安全的随机值。
:::

### 第 4 步：创建 Docker Compose 文件

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

### 第 5 步：创建 Nginx 配置

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

### 第 6 步：设置 TLS 证书

**方案 A：Let's Encrypt（推荐用于面向互联网的服务器）**

```bash
sudo apt install certbot -y
sudo certbot certonly --standalone -d netrecon.yourcompany.com

# 复制证书
sudo mkdir -p /opt/netrecon/certs
sudo cp /etc/letsencrypt/live/netrecon.yourcompany.com/fullchain.pem /opt/netrecon/certs/
sudo cp /etc/letsencrypt/live/netrecon.yourcompany.com/privkey.pem /opt/netrecon/certs/
```

**方案 B：自签名证书（用于内部/测试）**

```bash
sudo mkdir -p /opt/netrecon/certs
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /opt/netrecon/certs/privkey.pem \
  -out /opt/netrecon/certs/fullchain.pem \
  -subj "/CN=netrecon.yourcompany.com"
```

### 第 7 步：部署

```bash
cd /opt/netrecon
sudo docker compose up -d
```

验证所有服务是否正在运行：
```bash
sudo docker compose ps
```

### 第 8 步：访问仪表板

打开浏览器并导航至：
```
https://netrecon.yourcompany.com
```

首次访问时创建初始管理员账户。

## Windows Server 安装

### 第 1 步：安装 Docker Desktop

1. 从 [docker.com](https://www.docker.com/products/docker-desktop/) 下载 Docker Desktop
2. 启用 WSL2 后端进行安装
3. 重启服务器

### 第 2 步：按照 Linux 步骤操作

Docker Compose 的设置完全相同。打开 PowerShell 并按照上述第 2-8 步操作，调整路径：

```powershell
mkdir C:\netrecon
cd C:\netrecon
# 按上述方式创建 .env 和 docker-compose.yml
docker compose up -d
```

## 安装后配置

### 数据库迁移

迁移会在首次启动时自动运行。如需手动触发：

```bash
docker compose exec api-gateway python manage.py migrate
```

### 备份配置

设置每日 PostgreSQL 备份：

```bash
# 添加到 crontab
echo "0 2 * * * docker compose -f /opt/netrecon/docker-compose.yml exec -T postgres pg_dump -U netrecon netrecon | gzip > /opt/netrecon/backups/db-\$(date +\%Y\%m\%d).sql.gz" | sudo crontab -
```

### 监控

检查服务健康状态：

```bash
# 所有服务状态
docker compose ps

# 服务日志
docker compose logs -f api-gateway

# 资源使用情况
docker stats
```

## 更新

```bash
cd /opt/netrecon

# 拉取最新镜像
docker compose pull

# 使用新镜像重启
docker compose up -d

# 验证
docker compose ps
```

## 故障排除

### 服务无法启动
```bash
# 检查故障服务的日志
docker compose logs <service-name>

# 常见问题：PostgreSQL 尚未准备好
# 解决方案：等待并重试，或增加健康检查重试次数
```

### 无法访问仪表板
- 验证防火墙中 443 端口是否已开放
- 检查证书目录中是否存在证书
- 验证域名 DNS 指向您的服务器

### 数据库连接错误
- 验证 PostgreSQL 是否健康：`docker compose exec postgres pg_isready`
- 检查 `.env` 中的凭据是否在所有服务中一致

## 常见问题

**问：可以使用外部 PostgreSQL 数据库吗？**
答：可以。从 docker-compose.yml 中移除 `postgres` 服务，并将 `DATABASE_URL` 环境变量更新为指向您的外部数据库。

**问：如何为高可用性扩展？**
答：对于高可用部署，请使用 Kubernetes 和提供的 Helm charts。Docker Compose 适用于单服务器部署。

**问：可以使用其他反向代理（如 Traefik、Caddy）吗？**
答：可以。用您首选的反向代理替换 Nginx 服务。确保它转发到端口 8000 上的 API Gateway 并支持 WebSocket 升级。

如需更多帮助，请联系 [support@netreconapp.com](mailto:support@netreconapp.com)。
