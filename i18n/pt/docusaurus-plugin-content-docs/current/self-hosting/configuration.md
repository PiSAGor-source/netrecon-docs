---
sidebar_position: 3
title: Configuração
description: Variáveis de ambiente e referência de configuração para o NetRecon auto-hospedado
---

# Referência de Configuração

Todos os serviços do NetRecon são configurados por meio de um único arquivo `.env` localizado em `/opt/netrecon/.env`. Esta página documenta todas as variáveis de ambiente disponíveis.

## Configurações Principais

| Variável | Obrigatória | Padrão | Descrição |
|---|---|---|---|
| `NETRECON_DOMAIN` | Sim | — | Seu nome de domínio (ex.: `netrecon.suaempresa.com`) |
| `NETRECON_EMAIL` | Sim | — | E-mail do administrador para Let's Encrypt e notificações |

## Banco de Dados (PostgreSQL)

| Variável | Obrigatória | Padrão | Descrição |
|---|---|---|---|
| `POSTGRES_USER` | Sim | — | Nome de usuário do PostgreSQL |
| `POSTGRES_PASSWORD` | Sim | — | Senha do PostgreSQL |
| `POSTGRES_DB` | Sim | `netrecon` | Nome do banco de dados |
| `DATABASE_URL` | Auto | — | Construída automaticamente a partir dos valores acima |

:::tip
Use uma senha forte gerada aleatoriamente. Gere uma com:
```bash
openssl rand -base64 24
```
:::

## Cache (Redis)

| Variável | Obrigatória | Padrão | Descrição |
|---|---|---|---|
| `REDIS_PASSWORD` | Sim | — | Senha de autenticação do Redis |
| `REDIS_URL` | Auto | — | Construída automaticamente |

## Autenticação

| Variável | Obrigatória | Padrão | Descrição |
|---|---|---|---|
| `JWT_SECRET` | Sim | — | Chave secreta para assinar tokens JWT (mín. 32 caracteres) |
| `JWT_EXPIRE_MINUTES` | Não | `1440` | Tempo de expiração do token (padrão: 24 horas) |

Gere um segredo JWT seguro:
```bash
openssl rand -hex 32
```

## Registro de Agentes

| Variável | Obrigatória | Padrão | Descrição |
|---|---|---|---|
| `AGENT_REGISTRY_SECRET` | Sim | — | Segredo para registro de agentes |
| `AGENT_JWT_SECRET` | Sim | — | Segredo JWT para autenticação de agentes |
| `AGENT_TOKEN_EXPIRE_MINUTES` | Não | `1440` | Expiração do token do agente |
| `AGENT_HEARTBEAT_INTERVAL` | Não | `30` | Intervalo de heartbeat em segundos |
| `AGENT_HEARTBEAT_TIMEOUT` | Não | `90` | Segundos antes de marcar o agente como offline |

## E-mail (SMTP)

| Variável | Obrigatória | Padrão | Descrição |
|---|---|---|---|
| `SMTP_HOST` | Sim | — | Hostname do servidor SMTP |
| `SMTP_PORT` | Não | `587` | Porta SMTP (587 para STARTTLS, 465 para SSL) |
| `SMTP_USER` | Sim | — | Nome de usuário SMTP |
| `SMTP_PASSWORD` | Sim | — | Senha SMTP |
| `SMTP_FROM` | Sim | — | Endereço do remetente (ex.: `NetRecon <noreply@suaempresa.com>`) |

## Licença

| Variável | Obrigatória | Padrão | Descrição |
|---|---|---|---|
| `LICENSE_KEY` | Sim | — | Sua chave de licença do NetRecon |

Entre em contato com [sales@netreconapp.com](mailto:sales@netreconapp.com) para obter uma chave de licença.

## Serviço de Backup

| Variável | Obrigatória | Padrão | Descrição |
|---|---|---|---|
| `BACKUP_S3_ENDPOINT` | Não | — | Endpoint de armazenamento compatível com S3 |
| `BACKUP_S3_BUCKET` | Não | — | Nome do bucket para backups |
| `BACKUP_S3_ACCESS_KEY` | Não | — | Chave de acesso S3 |
| `BACKUP_S3_SECRET_KEY` | Não | — | Chave secreta S3 |
| `BACKUP_ENCRYPTION_KEY` | Não | — | Chave de criptografia AES-256-GCM para backups |
| `BACKUP_RETENTION_DAYS` | Não | `30` | Dias para reter arquivos de backup |

## Notificações

| Variável | Obrigatória | Padrão | Descrição |
|---|---|---|---|
| `TELEGRAM_BOT_TOKEN` | Não | — | Token do bot Telegram para alertas |
| `TELEGRAM_CHAT_ID` | Não | — | ID do chat Telegram para entrega de alertas |

## Exemplo de Arquivo `.env`

```bash
# Principal
NETRECON_DOMAIN=netrecon.suaempresa.com
NETRECON_EMAIL=admin@suaempresa.com

# PostgreSQL
POSTGRES_USER=netrecon
POSTGRES_PASSWORD=xK9mP2vL8nQ4wR7j
POSTGRES_DB=netrecon

# Redis
REDIS_PASSWORD=hT6yN3bF9cM1pW5s

# Autenticação
JWT_SECRET=a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2

# Registro de Agentes
AGENT_REGISTRY_SECRET=r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3
AGENT_JWT_SECRET=h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9

# E-mail
SMTP_HOST=smtp.suaempresa.com
SMTP_PORT=587
SMTP_USER=noreply@suaempresa.com
SMTP_PASSWORD=sua-senha-smtp
SMTP_FROM=NetRecon <noreply@suaempresa.com>

# Licença
LICENSE_KEY=sua-chave-de-licenca
```

:::warning
Nunca faça commit do arquivo `.env` no controle de versão. Todos os valores mostrados acima são exemplos — substitua-os por seus próprios valores seguros antes de implantar.
:::

## Aplicando Alterações de Configuração

Após modificar o arquivo `.env`, reinicie os serviços afetados:

```bash
cd /opt/netrecon

# Reiniciar todos os serviços
docker compose down && docker compose up -d

# Ou reiniciar um serviço específico
docker compose restart api-gateway
```

## Portas dos Serviços

Todos os serviços são executados atrás do proxy reverso Nginx nas portas 80/443. As portas internas dos serviços não são expostas por padrão:

| Serviço | Porta Interna | Descrição |
|---|---|---|
| API Gateway | 8000 | Endpoint principal da API |
| Vault Server | 8001 | Gerenciamento de segredos |
| License Server | 8002 | Validação de licenças |
| Email Service | 8003 | Relay SMTP |
| Notification Service | 8004 | Notificações push e alertas |
| Update Server | 8005 | Atualizações de agentes e probes |
| Agent Registry | 8006 | Registro e gerenciamento de agentes |
| Warranty Service | 8007 | Consultas de garantia de hardware |
| CMod Service | 8008 | Gerenciamento de configuração |
| IPAM Service | 8009 | Gerenciamento de endereços IP |

Para expor uma porta de serviço diretamente (não recomendado para produção), adicione-a ao mapeamento `ports` do serviço no `docker-compose.yml`.

Para ajuda, entre em contato com [support@netreconapp.com](mailto:support@netreconapp.com).
