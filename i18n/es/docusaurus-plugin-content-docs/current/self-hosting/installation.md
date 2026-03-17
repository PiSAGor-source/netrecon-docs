---
sidebar_position: 2
title: Instalación
description: Guía paso a paso para el despliegue autoalojado
---

# Instalación Autoalojada

Esta guía le lleva paso a paso por el despliegue de la plataforma NetRecon en su propio servidor usando Docker Compose.

## Requisitos Previos

- Un servidor Linux (Ubuntu 22.04+ recomendado) o Windows Server con Docker
- Docker v24.0+ y Docker Compose v2.20+
- Un nombre de dominio apuntando a su servidor (ej., `netrecon.yourcompany.com`)
- Certificado TLS para su dominio (o use Let's Encrypt)
- Al menos 4 GB de RAM y 40 GB de espacio en disco

## Instalación en VPS Linux

### Paso 1: Instalar Docker

```bash
# Actualizar el sistema
sudo apt update && sudo apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com | sudo sh

# Agregar su usuario al grupo docker
sudo usermod -aG docker $USER

# Instalar el plugin Docker Compose
sudo apt install docker-compose-plugin -y

# Verificar la instalación
docker --version
docker compose version
```

### Paso 2: Crear el Directorio del Proyecto

```bash
sudo mkdir -p /opt/netrecon
cd /opt/netrecon
```

### Paso 3: Crear el Archivo de Entorno

```bash
sudo tee /opt/netrecon/.env << 'EOF'
# Configuración Autoalojada de NetRecon
NETRECON_DOMAIN=netrecon.yourcompany.com
NETRECON_EMAIL=admin@yourcompany.com

# PostgreSQL
POSTGRES_USER=netrecon
POSTGRES_PASSWORD=CAMBIE_ESTO_POR_UNA_CONTRASEÑA_SEGURA
POSTGRES_DB=netrecon

# Redis
REDIS_PASSWORD=CAMBIE_ESTO_POR_UNA_CONTRASEÑA_SEGURA

# JWT Secret (genere con: openssl rand -hex 32)
JWT_SECRET=CAMBIE_ESTO_POR_UNA_CADENA_HEX_ALEATORIA

# Agent Registry
AGENT_REGISTRY_SECRET=CAMBIE_ESTO_POR_UNA_CADENA_HEX_ALEATORIA
AGENT_JWT_SECRET=CAMBIE_ESTO_POR_UNA_CADENA_HEX_ALEATORIA

# Email (SMTP)
SMTP_HOST=smtp.yourcompany.com
SMTP_PORT=587
SMTP_USER=noreply@yourcompany.com
SMTP_PASSWORD=CAMBIE_ESTO
SMTP_FROM=NetRecon <noreply@yourcompany.com>

# Licencia
LICENSE_KEY=su-clave-de-licencia
EOF
```

:::warning
Cambie todas las contraseñas y secretos de ejemplo antes del despliegue. Use `openssl rand -hex 32` para generar valores aleatorios seguros.
:::

### Paso 4: Crear el Archivo Docker Compose

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

### Paso 5: Crear la Configuración de Nginx

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

### Paso 6: Configurar Certificados TLS

**Opción A: Let's Encrypt (recomendado para servidores con acceso a internet)**

```bash
sudo apt install certbot -y
sudo certbot certonly --standalone -d netrecon.yourcompany.com

# Copiar certificados
sudo mkdir -p /opt/netrecon/certs
sudo cp /etc/letsencrypt/live/netrecon.yourcompany.com/fullchain.pem /opt/netrecon/certs/
sudo cp /etc/letsencrypt/live/netrecon.yourcompany.com/privkey.pem /opt/netrecon/certs/
```

**Opción B: Certificado autofirmado (para uso interno/pruebas)**

```bash
sudo mkdir -p /opt/netrecon/certs
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /opt/netrecon/certs/privkey.pem \
  -out /opt/netrecon/certs/fullchain.pem \
  -subj "/CN=netrecon.yourcompany.com"
```

### Paso 7: Desplegar

```bash
cd /opt/netrecon
sudo docker compose up -d
```

Verifique que todos los servicios estén ejecutándose:
```bash
sudo docker compose ps
```

### Paso 8: Acceder al Dashboard

Abra su navegador y navegue a:
```
https://netrecon.yourcompany.com
```

Cree la cuenta de administrador inicial en el primer acceso.

## Instalación en Windows Server

### Paso 1: Instalar Docker Desktop

1. Descargue Docker Desktop desde [docker.com](https://www.docker.com/products/docker-desktop/)
2. Instale con el backend WSL2 habilitado
3. Reinicie el servidor

### Paso 2: Seguir los Pasos de Linux

La configuración de Docker Compose es idéntica. Abra PowerShell y siga los Pasos 2-8 anteriores, ajustando las rutas:

```powershell
mkdir C:\netrecon
cd C:\netrecon
# Cree .env y docker-compose.yml como se indica arriba
docker compose up -d
```

## Post-Instalación

### Migraciones de Base de Datos

Las migraciones se ejecutan automáticamente en el primer inicio. Para ejecutarlas manualmente:

```bash
docker compose exec api-gateway python manage.py migrate
```

### Configuración de Respaldos

Configure respaldos diarios de PostgreSQL:

```bash
# Agregar al crontab
echo "0 2 * * * docker compose -f /opt/netrecon/docker-compose.yml exec -T postgres pg_dump -U netrecon netrecon | gzip > /opt/netrecon/backups/db-\$(date +\%Y\%m\%d).sql.gz" | sudo crontab -
```

### Monitoreo

Verifique el estado de los servicios:

```bash
# Estado de todos los servicios
docker compose ps

# Registros del servicio
docker compose logs -f api-gateway

# Uso de recursos
docker stats
```

## Actualización

```bash
cd /opt/netrecon

# Descargar las últimas imágenes
docker compose pull

# Reiniciar con las nuevas imágenes
docker compose up -d

# Verificar
docker compose ps
```

## Resolución de Problemas

### Los servicios no inician
```bash
# Revise los registros del servicio que falla
docker compose logs <nombre-del-servicio>

# Problema común: PostgreSQL aún no está listo
# Solución: espere y reintente, o aumente los reintentos del healthcheck
```

### No puede acceder al dashboard
- Verifique que el puerto 443 esté abierto en su firewall
- Compruebe que los certificados existan en el directorio de certificados
- Verifique que el DNS del dominio apunte a su servidor

### Errores de conexión a la base de datos
- Verifique que PostgreSQL esté saludable: `docker compose exec postgres pg_isready`
- Compruebe que las credenciales en `.env` coincidan en todos los servicios

## Preguntas Frecuentes

**P: ¿Puedo usar una base de datos PostgreSQL externa?**
R: Sí. Elimine el servicio `postgres` del docker-compose.yml y actualice la variable de entorno `DATABASE_URL` para apuntar a su base de datos externa.

**P: ¿Cómo escalo para alta disponibilidad?**
R: Para despliegues de alta disponibilidad, use Kubernetes con los Helm charts proporcionados. Docker Compose es adecuado para despliegues en un solo servidor.

**P: ¿Puedo usar un proxy inverso diferente (ej., Traefik, Caddy)?**
R: Sí. Reemplace el servicio Nginx con su proxy inverso preferido. Asegúrese de que redirija al API Gateway en el puerto 8000 y soporte actualizaciones WebSocket.

Para ayuda adicional, contacte a [support@netreconapp.com](mailto:support@netreconapp.com).
