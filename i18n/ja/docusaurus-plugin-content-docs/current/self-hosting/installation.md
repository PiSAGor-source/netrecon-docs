---
sidebar_position: 2
title: インストール
description: セルフホストデプロイメントのステップバイステップガイド
---

# セルフホストインストール

このガイドでは、Docker Composeを使用してお客様自身のサーバーにNetReconプラットフォームをデプロイする手順を説明します。

## 前提条件

- Linuxサーバー（Ubuntu 22.04以上推奨）またはDockerを搭載したWindows Server
- Docker v24.0以上およびDocker Compose v2.20以上
- サーバーに向けたドメイン名（例：`netrecon.yourcompany.com`）
- ドメイン用のTLS証明書（またはLet's Encryptを使用）
- 最低4 GB RAMと40 GBのディスク容量

## Linux VPSインストール

### ステップ1：Dockerのインストール

```bash
# システムの更新
sudo apt update && sudo apt upgrade -y

# Dockerのインストール
curl -fsSL https://get.docker.com | sudo sh

# ユーザーをdockerグループに追加
sudo usermod -aG docker $USER

# Docker Composeプラグインのインストール
sudo apt install docker-compose-plugin -y

# インストールの確認
docker --version
docker compose version
```

### ステップ2：プロジェクトディレクトリの作成

```bash
sudo mkdir -p /opt/netrecon
cd /opt/netrecon
```

### ステップ3：環境ファイルの作成

```bash
sudo tee /opt/netrecon/.env << 'EOF'
# NetRecon セルフホスト設定
NETRECON_DOMAIN=netrecon.yourcompany.com
NETRECON_EMAIL=admin@yourcompany.com

# PostgreSQL
POSTGRES_USER=netrecon
POSTGRES_PASSWORD=CHANGE_ME_TO_A_STRONG_PASSWORD
POSTGRES_DB=netrecon

# Redis
REDIS_PASSWORD=CHANGE_ME_TO_A_STRONG_PASSWORD

# JWT Secret (生成コマンド: openssl rand -hex 32)
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
デプロイ前にすべてのプレースホルダーのパスワードとシークレットを変更してください。`openssl rand -hex 32`を使用して安全なランダム値を生成してください。
:::

### ステップ4：Docker Composeファイルの作成

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

### ステップ5：Nginx設定の作成

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

### ステップ6：TLS証明書のセットアップ

**オプションA：Let's Encrypt（インターネットに面したサーバー向け推奨）**

```bash
sudo apt install certbot -y
sudo certbot certonly --standalone -d netrecon.yourcompany.com

# 証明書のコピー
sudo mkdir -p /opt/netrecon/certs
sudo cp /etc/letsencrypt/live/netrecon.yourcompany.com/fullchain.pem /opt/netrecon/certs/
sudo cp /etc/letsencrypt/live/netrecon.yourcompany.com/privkey.pem /opt/netrecon/certs/
```

**オプションB：自己署名証明書（内部/テスト用）**

```bash
sudo mkdir -p /opt/netrecon/certs
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /opt/netrecon/certs/privkey.pem \
  -out /opt/netrecon/certs/fullchain.pem \
  -subj "/CN=netrecon.yourcompany.com"
```

### ステップ7：デプロイ

```bash
cd /opt/netrecon
sudo docker compose up -d
```

すべてのサービスが実行中であることを確認：
```bash
sudo docker compose ps
```

### ステップ8：ダッシュボードへのアクセス

ブラウザを開き、以下にアクセス：
```
https://netrecon.yourcompany.com
```

初回アクセス時に初期管理者アカウントを作成します。

## Windows Serverインストール

### ステップ1：Docker Desktopのインストール

1. [docker.com](https://www.docker.com/products/docker-desktop/)からDocker Desktopをダウンロード
2. WSL2バックエンドを有効にしてインストール
3. サーバーを再起動

### ステップ2：Linuxの手順に従う

Docker Composeのセットアップは同一です。PowerShellを開き、上記のステップ2〜8に従い、パスを調整してください：

```powershell
mkdir C:\netrecon
cd C:\netrecon
# 上記と同様に.envとdocker-compose.ymlを作成
docker compose up -d
```

## インストール後

### データベースマイグレーション

マイグレーションは初回起動時に自動実行されます。手動でトリガーするには：

```bash
docker compose exec api-gateway python manage.py migrate
```

### バックアップ設定

毎日のPostgreSQLバックアップを設定：

```bash
# crontabに追加
echo "0 2 * * * docker compose -f /opt/netrecon/docker-compose.yml exec -T postgres pg_dump -U netrecon netrecon | gzip > /opt/netrecon/backups/db-\$(date +\%Y\%m\%d).sql.gz" | sudo crontab -
```

### 監視

サービスの正常性を確認：

```bash
# すべてのサービスのステータス
docker compose ps

# サービスログ
docker compose logs -f api-gateway

# リソース使用状況
docker stats
```

## アップデート

```bash
cd /opt/netrecon

# 最新イメージの取得
docker compose pull

# 新しいイメージで再起動
docker compose up -d

# 確認
docker compose ps
```

## トラブルシューティング

### サービスが起動しない
```bash
# 失敗しているサービスのログを確認
docker compose logs <service-name>

# よくある問題：PostgreSQLの準備ができていない
# 解決策：待ってリトライするか、ヘルスチェックのリトライ回数を増やす
```

### ダッシュボードにアクセスできない
- ファイアウォールでポート443が開いていることを確認
- certsディレクトリに証明書が存在することを確認
- ドメインのDNSがサーバーを指していることを確認

### データベース接続エラー
- PostgreSQLが正常であることを確認：`docker compose exec postgres pg_isready`
- `.env`の資格情報がすべてのサービスで一致していることを確認

## よくある質問

**Q：外部のPostgreSQLデータベースを使用できますか？**
A：はい。docker-compose.ymlから`postgres`サービスを削除し、`DATABASE_URL`環境変数を外部データベースを指すように更新してください。

**Q：高可用性のためにスケールするにはどうすればよいですか？**
A：HAデプロイメントでは、提供されるHelmチャートとKubernetesを使用してください。Docker Composeは単一サーバーデプロイメントに適しています。

**Q：別のリバースプロキシ（例：Traefik、Caddy）を使用できますか？**
A：はい。Nginxサービスをお好みのリバースプロキシに置き換えてください。ポート8000のAPI Gatewayに転送し、WebSocketアップグレードをサポートすることを確認してください。

追加のヘルプが必要な場合は[support@netreconapp.com](mailto:support@netreconapp.com)までお問い合わせください。
