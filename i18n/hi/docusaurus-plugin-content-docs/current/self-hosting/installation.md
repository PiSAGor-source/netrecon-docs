---
sidebar_position: 2
title: इंस्टॉलेशन
description: चरण-दर-चरण सेल्फ-होस्टेड डिप्लॉयमेंट गाइड
---

# सेल्फ-होस्टेड इंस्टॉलेशन

यह गाइड आपको Docker Compose का उपयोग करके अपने सर्वर पर NetRecon प्लेटफ़ॉर्म डिप्लॉय करने की प्रक्रिया के बारे में बताती है।

## पूर्वापेक्षाएँ

- एक Linux सर्वर (Ubuntu 22.04+ अनुशंसित) या Docker वाला Windows Server
- Docker v24.0+ और Docker Compose v2.20+
- आपके सर्वर की ओर इंगित एक डोमेन नाम (उदा., `netrecon.yourcompany.com`)
- आपके डोमेन के लिए TLS प्रमाणपत्र (या Let's Encrypt उपयोग करें)
- कम से कम 4 GB RAM और 40 GB डिस्क स्पेस

## Linux VPS इंस्टॉलेशन

### चरण 1: Docker इंस्टॉल करें

```bash
# सिस्टम अपडेट करें
sudo apt update && sudo apt upgrade -y

# Docker इंस्टॉल करें
curl -fsSL https://get.docker.com | sudo sh

# अपने यूज़र को docker ग्रुप में जोड़ें
sudo usermod -aG docker $USER

# Docker Compose प्लगइन इंस्टॉल करें
sudo apt install docker-compose-plugin -y

# इंस्टॉलेशन सत्यापित करें
docker --version
docker compose version
```

### चरण 2: प्रोजेक्ट डायरेक्टरी बनाएँ

```bash
sudo mkdir -p /opt/netrecon
cd /opt/netrecon
```

### चरण 3: एनवायरनमेंट फ़ाइल बनाएँ

```bash
sudo tee /opt/netrecon/.env << 'EOF'
# NetRecon सेल्फ-होस्टेड कॉन्फ़िगरेशन
NETRECON_DOMAIN=netrecon.yourcompany.com
NETRECON_EMAIL=admin@yourcompany.com

# PostgreSQL
POSTGRES_USER=netrecon
POSTGRES_PASSWORD=CHANGE_ME_TO_A_STRONG_PASSWORD
POSTGRES_DB=netrecon

# Redis
REDIS_PASSWORD=CHANGE_ME_TO_A_STRONG_PASSWORD

# JWT Secret (इससे जनरेट करें: openssl rand -hex 32)
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
डिप्लॉय करने से पहले सभी प्लेसहोल्डर पासवर्ड और सीक्रेट बदलें। सुरक्षित रैंडम वैल्यू जनरेट करने के लिए `openssl rand -hex 32` उपयोग करें।
:::

### चरण 4: Docker Compose फ़ाइल बनाएँ

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

### चरण 5: Nginx कॉन्फ़िगरेशन बनाएँ

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

### चरण 6: TLS प्रमाणपत्र सेट अप करें

**विकल्प A: Let's Encrypt (इंटरनेट-फ़ेसिंग सर्वर के लिए अनुशंसित)**

```bash
sudo apt install certbot -y
sudo certbot certonly --standalone -d netrecon.yourcompany.com

# प्रमाणपत्र कॉपी करें
sudo mkdir -p /opt/netrecon/certs
sudo cp /etc/letsencrypt/live/netrecon.yourcompany.com/fullchain.pem /opt/netrecon/certs/
sudo cp /etc/letsencrypt/live/netrecon.yourcompany.com/privkey.pem /opt/netrecon/certs/
```

**विकल्प B: सेल्फ-साइन्ड प्रमाणपत्र (आंतरिक/परीक्षण के लिए)**

```bash
sudo mkdir -p /opt/netrecon/certs
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /opt/netrecon/certs/privkey.pem \
  -out /opt/netrecon/certs/fullchain.pem \
  -subj "/CN=netrecon.yourcompany.com"
```

### चरण 7: डिप्लॉय करें

```bash
cd /opt/netrecon
sudo docker compose up -d
```

सत्यापित करें कि सभी सर्विसेज़ चल रही हैं:
```bash
sudo docker compose ps
```

### चरण 8: डैशबोर्ड एक्सेस करें

अपना ब्राउज़र खोलें और यहाँ नेविगेट करें:
```
https://netrecon.yourcompany.com
```

पहली बार एक्सेस पर प्रारंभिक एडमिन अकाउंट बनाएँ।

## Windows Server इंस्टॉलेशन

### चरण 1: Docker Desktop इंस्टॉल करें

1. [docker.com](https://www.docker.com/products/docker-desktop/) से Docker Desktop डाउनलोड करें
2. WSL2 बैकएंड सक्षम करके इंस्टॉल करें
3. सर्वर रीस्टार्ट करें

### चरण 2: Linux चरणों का पालन करें

Docker Compose सेटअप समान है। PowerShell खोलें और ऊपर दिए गए चरण 2-8 का पालन करें, पथ समायोजित करें:

```powershell
mkdir C:\netrecon
cd C:\netrecon
# ऊपर दिए अनुसार .env और docker-compose.yml बनाएँ
docker compose up -d
```

## इंस्टॉलेशन के बाद

### डेटाबेस माइग्रेशन

माइग्रेशन पहले स्टार्ट पर स्वचालित रूप से चलते हैं। मैन्युअल रूप से ट्रिगर करने के लिए:

```bash
docker compose exec api-gateway python manage.py migrate
```

### बैकअप कॉन्फ़िगरेशन

दैनिक PostgreSQL बैकअप सेट अप करें:

```bash
# crontab में जोड़ें
echo "0 2 * * * docker compose -f /opt/netrecon/docker-compose.yml exec -T postgres pg_dump -U netrecon netrecon | gzip > /opt/netrecon/backups/db-\$(date +\%Y\%m\%d).sql.gz" | sudo crontab -
```

### निगरानी

सर्विस स्वास्थ्य जाँचें:

```bash
# सभी सर्विसेज़ की स्थिति
docker compose ps

# सर्विस लॉग
docker compose logs -f api-gateway

# रिसोर्स उपयोग
docker stats
```

## अपडेट करना

```bash
cd /opt/netrecon

# नवीनतम इमेज पुल करें
docker compose pull

# नई इमेज के साथ रीस्टार्ट करें
docker compose up -d

# सत्यापित करें
docker compose ps
```

## समस्या निवारण

### सर्विसेज़ शुरू होने में विफल
```bash
# विफल सर्विस के लॉग जाँचें
docker compose logs <service-name>

# सामान्य समस्या: PostgreSQL अभी तैयार नहीं है
# समाधान: प्रतीक्षा करें और पुनः प्रयास करें, या healthcheck retries बढ़ाएँ
```

### डैशबोर्ड एक्सेस नहीं हो पा रहा
- सत्यापित करें कि आपके फ़ायरवॉल में पोर्ट 443 खुला है
- जाँचें कि certs डायरेक्टरी में प्रमाणपत्र मौजूद हैं
- सत्यापित करें कि डोमेन DNS आपके सर्वर की ओर इंगित करता है

### डेटाबेस कनेक्शन त्रुटियाँ
- सत्यापित करें कि PostgreSQL स्वस्थ है: `docker compose exec postgres pg_isready`
- जाँचें कि `.env` में क्रेडेंशियल सभी सर्विसेज़ में मेल खाते हैं

## अक्सर पूछे जाने वाले प्रश्न

**प्रश्न: क्या मैं बाहरी PostgreSQL डेटाबेस उपयोग कर सकता हूँ?**
उत्तर: हाँ। docker-compose.yml से `postgres` सर्विस हटाएँ और `DATABASE_URL` एनवायरनमेंट वेरिएबल को अपने बाहरी डेटाबेस की ओर इंगित करने के लिए अपडेट करें।

**प्रश्न: उच्च उपलब्धता के लिए स्केल कैसे करें?**
उत्तर: HA डिप्लॉयमेंट के लिए, प्रदान किए गए Helm चार्ट के साथ Kubernetes उपयोग करें। Docker Compose सिंगल-सर्वर डिप्लॉयमेंट के लिए उपयुक्त है।

**प्रश्न: क्या मैं कोई अलग रिवर्स प्रॉक्सी (जैसे Traefik, Caddy) उपयोग कर सकता हूँ?**
उत्तर: हाँ। Nginx सर्विस को अपने पसंदीदा रिवर्स प्रॉक्सी से बदलें। सुनिश्चित करें कि यह पोर्ट 8000 पर API Gateway को फ़ॉरवर्ड करता है और WebSocket अपग्रेड का समर्थन करता है।

अतिरिक्त सहायता के लिए, [support@netreconapp.com](mailto:support@netreconapp.com) से संपर्क करें।
