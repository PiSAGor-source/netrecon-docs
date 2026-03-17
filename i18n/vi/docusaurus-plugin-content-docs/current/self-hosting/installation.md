---
sidebar_position: 2
title: Cài đặt
description: Hướng dẫn triển khai tự lưu trữ từng bước
---

# Cài đặt tự lưu trữ

Hướng dẫn này sẽ giúp bạn triển khai nền tảng NetRecon trên máy chủ của riêng bạn bằng Docker Compose.

## Yêu cầu tiên quyết

- Máy chủ Linux (khuyến nghị Ubuntu 22.04+) hoặc Windows Server có Docker
- Docker v24.0+ và Docker Compose v2.20+
- Tên miền trỏ đến máy chủ của bạn (ví dụ: `netrecon.yourcompany.com`)
- Chứng chỉ TLS cho tên miền (hoặc sử dụng Let's Encrypt)
- Tối thiểu 4 GB RAM và 40 GB dung lượng ổ đĩa

## Cài đặt trên VPS Linux

### Bước 1: Cài đặt Docker

```bash
# Cập nhật hệ thống
sudo apt update && sudo apt upgrade -y

# Cài đặt Docker
curl -fsSL https://get.docker.com | sudo sh

# Thêm người dùng vào nhóm docker
sudo usermod -aG docker $USER

# Cài đặt plugin Docker Compose
sudo apt install docker-compose-plugin -y

# Xác minh cài đặt
docker --version
docker compose version
```

### Bước 2: Tạo thư mục dự án

```bash
sudo mkdir -p /opt/netrecon
cd /opt/netrecon
```

### Bước 3: Tạo tệp biến môi trường

```bash
sudo tee /opt/netrecon/.env << 'EOF'
# Cấu hình tự lưu trữ NetRecon
NETRECON_DOMAIN=netrecon.yourcompany.com
NETRECON_EMAIL=admin@yourcompany.com

# PostgreSQL
POSTGRES_USER=netrecon
POSTGRES_PASSWORD=THAY_DOI_THANH_MAT_KHAU_MANH
POSTGRES_DB=netrecon

# Redis
REDIS_PASSWORD=THAY_DOI_THANH_MAT_KHAU_MANH

# JWT Secret (tạo bằng: openssl rand -hex 32)
JWT_SECRET=THAY_DOI_THANH_CHUOI_HEX_NGAU_NHIEN

# Agent Registry
AGENT_REGISTRY_SECRET=THAY_DOI_THANH_CHUOI_HEX_NGAU_NHIEN
AGENT_JWT_SECRET=THAY_DOI_THANH_CHUOI_HEX_NGAU_NHIEN

# Email (SMTP)
SMTP_HOST=smtp.yourcompany.com
SMTP_PORT=587
SMTP_USER=noreply@yourcompany.com
SMTP_PASSWORD=THAY_DOI
SMTP_FROM=NetRecon <noreply@yourcompany.com>

# Giấy phép
LICENSE_KEY=khoa-giay-phep-cua-ban
EOF
```

:::warning
Thay đổi tất cả mật khẩu và bí mật placeholder trước khi triển khai. Sử dụng `openssl rand -hex 32` để tạo các giá trị ngẫu nhiên an toàn.
:::

### Bước 4: Tạo tệp Docker Compose

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

### Bước 5: Tạo cấu hình Nginx

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

### Bước 6: Thiết lập chứng chỉ TLS

**Phương án A: Let's Encrypt (khuyến nghị cho máy chủ có internet)**

```bash
sudo apt install certbot -y
sudo certbot certonly --standalone -d netrecon.yourcompany.com

# Sao chép chứng chỉ
sudo mkdir -p /opt/netrecon/certs
sudo cp /etc/letsencrypt/live/netrecon.yourcompany.com/fullchain.pem /opt/netrecon/certs/
sudo cp /etc/letsencrypt/live/netrecon.yourcompany.com/privkey.pem /opt/netrecon/certs/
```

**Phương án B: Chứng chỉ tự ký (cho nội bộ/thử nghiệm)**

```bash
sudo mkdir -p /opt/netrecon/certs
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /opt/netrecon/certs/privkey.pem \
  -out /opt/netrecon/certs/fullchain.pem \
  -subj "/CN=netrecon.yourcompany.com"
```

### Bước 7: Triển khai

```bash
cd /opt/netrecon
sudo docker compose up -d
```

Xác minh tất cả dịch vụ đang chạy:
```bash
sudo docker compose ps
```

### Bước 8: Truy cập bảng điều khiển

Mở trình duyệt và điều hướng đến:
```
https://netrecon.yourcompany.com
```

Tạo tài khoản quản trị viên ban đầu khi truy cập lần đầu.

## Cài đặt trên Windows Server

### Bước 1: Cài đặt Docker Desktop

1. Tải Docker Desktop từ [docker.com](https://www.docker.com/products/docker-desktop/)
2. Cài đặt với backend WSL2 được bật
3. Khởi động lại máy chủ

### Bước 2: Làm theo các bước Linux

Thiết lập Docker Compose hoàn toàn giống nhau. Mở PowerShell và làm theo Bước 2-8 ở trên, điều chỉnh đường dẫn:

```powershell
mkdir C:\netrecon
cd C:\netrecon
# Tạo .env và docker-compose.yml như trên
docker compose up -d
```

## Sau khi cài đặt

### Di chuyển cơ sở dữ liệu

Di chuyển chạy tự động khi khởi động lần đầu. Để kích hoạt thủ công:

```bash
docker compose exec api-gateway python manage.py migrate
```

### Cấu hình sao lưu

Thiết lập sao lưu PostgreSQL hàng ngày:

```bash
# Thêm vào crontab
echo "0 2 * * * docker compose -f /opt/netrecon/docker-compose.yml exec -T postgres pg_dump -U netrecon netrecon | gzip > /opt/netrecon/backups/db-\$(date +\%Y\%m\%d).sql.gz" | sudo crontab -
```

### Giám sát

Kiểm tra tình trạng dịch vụ:

```bash
# Trạng thái tất cả dịch vụ
docker compose ps

# Nhật ký dịch vụ
docker compose logs -f api-gateway

# Sử dụng tài nguyên
docker stats
```

## Cập nhật

```bash
cd /opt/netrecon

# Kéo image mới nhất
docker compose pull

# Khởi động lại với image mới
docker compose up -d

# Xác minh
docker compose ps
```

## Khắc phục sự cố

### Dịch vụ không khởi động được
```bash
# Kiểm tra nhật ký của dịch vụ bị lỗi
docker compose logs <tên-dịch-vụ>

# Vấn đề thường gặp: PostgreSQL chưa sẵn sàng
# Giải pháp: chờ và thử lại, hoặc tăng số lần thử healthcheck
```

### Không thể truy cập bảng điều khiển
- Xác minh cổng 443 đã mở trong tường lửa
- Kiểm tra chứng chỉ có tồn tại trong thư mục certs
- Xác minh DNS tên miền trỏ đến máy chủ của bạn

### Lỗi kết nối cơ sở dữ liệu
- Xác minh PostgreSQL hoạt động bình thường: `docker compose exec postgres pg_isready`
- Kiểm tra thông tin đăng nhập trong `.env` khớp nhau trên tất cả dịch vụ

## Câu hỏi thường gặp

**H: Tôi có thể sử dụng cơ sở dữ liệu PostgreSQL bên ngoài không?**
Đ: Có. Xóa dịch vụ `postgres` khỏi docker-compose.yml và cập nhật biến môi trường `DATABASE_URL` để trỏ đến cơ sở dữ liệu bên ngoài.

**H: Làm thế nào để mở rộng cho tính sẵn sàng cao?**
Đ: Cho triển khai HA, sử dụng Kubernetes với Helm chart được cung cấp. Docker Compose phù hợp cho triển khai đơn máy chủ.

**H: Tôi có thể sử dụng reverse proxy khác (ví dụ: Traefik, Caddy) không?**
Đ: Có. Thay thế dịch vụ Nginx bằng reverse proxy ưa thích. Đảm bảo nó chuyển tiếp đến API Gateway trên cổng 8000 và hỗ trợ nâng cấp WebSocket.

Để được trợ giúp thêm, liên hệ [support@netreconapp.com](mailto:support@netreconapp.com).
