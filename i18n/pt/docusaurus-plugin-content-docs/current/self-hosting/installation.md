---
sidebar_position: 2
title: Instalação
description: Guia passo a passo de implantação auto-hospedada
---

# Instalação Auto-Hospedada

Este guia orienta você na implantação da plataforma NetRecon em seu próprio servidor usando Docker Compose.

## Pré-requisitos

- Um servidor Linux (Ubuntu 22.04+ recomendado) ou Windows Server com Docker
- Docker v24.0+ e Docker Compose v2.20+
- Um nome de domínio apontando para seu servidor (ex.: `netrecon.suaempresa.com`)
- Certificado TLS para seu domínio (ou use Let's Encrypt)
- Pelo menos 4 GB de RAM e 40 GB de espaço em disco

## Instalação em VPS Linux

### Passo 1: Instale o Docker

```bash
# Atualize o sistema
sudo apt update && sudo apt upgrade -y

# Instale o Docker
curl -fsSL https://get.docker.com | sudo sh

# Adicione seu usuário ao grupo docker
sudo usermod -aG docker $USER

# Instale o plugin Docker Compose
sudo apt install docker-compose-plugin -y

# Verifique a instalação
docker --version
docker compose version
```

### Passo 2: Crie o Diretório do Projeto

```bash
sudo mkdir -p /opt/netrecon
cd /opt/netrecon
```

### Passo 3: Crie o Arquivo de Ambiente

```bash
sudo tee /opt/netrecon/.env << 'EOF'
# Configuração Auto-Hospedada do NetRecon
NETRECON_DOMAIN=netrecon.suaempresa.com
NETRECON_EMAIL=admin@suaempresa.com

# PostgreSQL
POSTGRES_USER=netrecon
POSTGRES_PASSWORD=ALTERE_PARA_UMA_SENHA_FORTE
POSTGRES_DB=netrecon

# Redis
REDIS_PASSWORD=ALTERE_PARA_UMA_SENHA_FORTE

# JWT Secret (gere com: openssl rand -hex 32)
JWT_SECRET=ALTERE_PARA_UMA_STRING_HEX_ALEATORIA

# Agent Registry
AGENT_REGISTRY_SECRET=ALTERE_PARA_UMA_STRING_HEX_ALEATORIA
AGENT_JWT_SECRET=ALTERE_PARA_UMA_STRING_HEX_ALEATORIA

# Email (SMTP)
SMTP_HOST=smtp.suaempresa.com
SMTP_PORT=587
SMTP_USER=noreply@suaempresa.com
SMTP_PASSWORD=ALTERE_AQUI
SMTP_FROM=NetRecon <noreply@suaempresa.com>

# Licença
LICENSE_KEY=sua-chave-de-licenca
EOF
```

:::warning
Altere todas as senhas e segredos de exemplo antes de implantar. Use `openssl rand -hex 32` para gerar valores aleatórios seguros.
:::

### Passo 4: Crie o Arquivo Docker Compose

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

### Passo 5: Crie a Configuração do Nginx

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

### Passo 6: Configure os Certificados TLS

**Opção A: Let's Encrypt (recomendado para servidores com acesso à internet)**

```bash
sudo apt install certbot -y
sudo certbot certonly --standalone -d netrecon.suaempresa.com

# Copie os certificados
sudo mkdir -p /opt/netrecon/certs
sudo cp /etc/letsencrypt/live/netrecon.suaempresa.com/fullchain.pem /opt/netrecon/certs/
sudo cp /etc/letsencrypt/live/netrecon.suaempresa.com/privkey.pem /opt/netrecon/certs/
```

**Opção B: Certificado autoassinado (para uso interno/testes)**

```bash
sudo mkdir -p /opt/netrecon/certs
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /opt/netrecon/certs/privkey.pem \
  -out /opt/netrecon/certs/fullchain.pem \
  -subj "/CN=netrecon.suaempresa.com"
```

### Passo 7: Implante

```bash
cd /opt/netrecon
sudo docker compose up -d
```

Verifique se todos os serviços estão em execução:
```bash
sudo docker compose ps
```

### Passo 8: Acesse o Painel

Abra seu navegador e acesse:
```
https://netrecon.suaempresa.com
```

Crie a conta de administrador inicial no primeiro acesso.

## Instalação no Windows Server

### Passo 1: Instale o Docker Desktop

1. Baixe o Docker Desktop em [docker.com](https://www.docker.com/products/docker-desktop/)
2. Instale com o backend WSL2 habilitado
3. Reinicie o servidor

### Passo 2: Siga os Passos do Linux

A configuração do Docker Compose é idêntica. Abra o PowerShell e siga os Passos 2-8 acima, ajustando os caminhos:

```powershell
mkdir C:\netrecon
cd C:\netrecon
# Crie .env e docker-compose.yml conforme acima
docker compose up -d
```

## Pós-Instalação

### Migrações do Banco de Dados

As migrações são executadas automaticamente na primeira inicialização. Para executar manualmente:

```bash
docker compose exec api-gateway python manage.py migrate
```

### Configuração de Backup

Configure backups diários do PostgreSQL:

```bash
# Adicione ao crontab
echo "0 2 * * * docker compose -f /opt/netrecon/docker-compose.yml exec -T postgres pg_dump -U netrecon netrecon | gzip > /opt/netrecon/backups/db-\$(date +\%Y\%m\%d).sql.gz" | sudo crontab -
```

### Monitoramento

Verifique a saúde dos serviços:

```bash
# Status de todos os serviços
docker compose ps

# Logs dos serviços
docker compose logs -f api-gateway

# Uso de recursos
docker stats
```

## Atualização

```bash
cd /opt/netrecon

# Baixe as imagens mais recentes
docker compose pull

# Reinicie com as novas imagens
docker compose up -d

# Verifique
docker compose ps
```

## Solução de Problemas

### Serviços falham ao iniciar
```bash
# Verifique os logs do serviço com falha
docker compose logs <service-name>

# Problema comum: PostgreSQL ainda não está pronto
# Solução: aguarde e tente novamente, ou aumente as tentativas do healthcheck
```

### Não é possível acessar o painel
- Verifique se a porta 443 está aberta no seu firewall
- Confirme que os certificados existem no diretório de certificados
- Verifique se o DNS do domínio aponta para seu servidor

### Erros de conexão com o banco de dados
- Verifique se o PostgreSQL está saudável: `docker compose exec postgres pg_isready`
- Confirme que as credenciais no `.env` estão consistentes em todos os serviços

## Perguntas Frequentes

**P: Posso usar um banco de dados PostgreSQL externo?**
R: Sim. Remova o serviço `postgres` do docker-compose.yml e atualize a variável de ambiente `DATABASE_URL` para apontar para seu banco de dados externo.

**P: Como faço para escalar para alta disponibilidade?**
R: Para implantações de alta disponibilidade, use Kubernetes com os Helm charts fornecidos. Docker Compose é adequado para implantações em um único servidor.

**P: Posso usar um proxy reverso diferente (ex.: Traefik, Caddy)?**
R: Sim. Substitua o serviço Nginx pelo proxy reverso de sua preferência. Certifique-se de que ele encaminha para o API Gateway na porta 8000 e suporta upgrades WebSocket.

Para ajuda adicional, entre em contato com [support@netreconapp.com](mailto:support@netreconapp.com).
