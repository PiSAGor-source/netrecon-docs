---
sidebar_position: 3
title: 配置
description: 自托管 NetRecon 的环境变量和配置参考
---

# 配置参考

所有 NetRecon 服务通过位于 `/opt/netrecon/.env` 的单个 `.env` 文件进行配置。本页面记录了所有可用的环境变量。

## 核心设置

| 变量 | 必需 | 默认值 | 描述 |
|---|---|---|---|
| `NETRECON_DOMAIN` | 是 | — | 您的域名（例如 `netrecon.yourcompany.com`） |
| `NETRECON_EMAIL` | 是 | — | 用于 Let's Encrypt 和通知的管理员邮箱 |

## 数据库 (PostgreSQL)

| 变量 | 必需 | 默认值 | 描述 |
|---|---|---|---|
| `POSTGRES_USER` | 是 | — | PostgreSQL 用户名 |
| `POSTGRES_PASSWORD` | 是 | — | PostgreSQL 密码 |
| `POSTGRES_DB` | 是 | `netrecon` | 数据库名称 |
| `DATABASE_URL` | 自动 | — | 根据上述值自动构建 |

:::tip
请使用强随机密码。使用以下命令生成：
```bash
openssl rand -base64 24
```
:::

## 缓存 (Redis)

| 变量 | 必需 | 默认值 | 描述 |
|---|---|---|---|
| `REDIS_PASSWORD` | 是 | — | Redis 认证密码 |
| `REDIS_URL` | 自动 | — | 自动构建 |

## 认证

| 变量 | 必需 | 默认值 | 描述 |
|---|---|---|---|
| `JWT_SECRET` | 是 | — | 用于签署 JWT 令牌的密钥（最少 32 个字符） |
| `JWT_EXPIRE_MINUTES` | 否 | `1440` | 令牌过期时间（默认：24 小时） |

生成安全的 JWT 密钥：
```bash
openssl rand -hex 32
```

## 代理注册

| 变量 | 必需 | 默认值 | 描述 |
|---|---|---|---|
| `AGENT_REGISTRY_SECRET` | 是 | — | 代理注册密钥 |
| `AGENT_JWT_SECRET` | 是 | — | 代理认证的 JWT 密钥 |
| `AGENT_TOKEN_EXPIRE_MINUTES` | 否 | `1440` | 代理令牌过期时间 |
| `AGENT_HEARTBEAT_INTERVAL` | 否 | `30` | 心跳间隔（秒） |
| `AGENT_HEARTBEAT_TIMEOUT` | 否 | `90` | 标记代理离线前的超时秒数 |

## 邮件 (SMTP)

| 变量 | 必需 | 默认值 | 描述 |
|---|---|---|---|
| `SMTP_HOST` | 是 | — | SMTP 服务器主机名 |
| `SMTP_PORT` | 否 | `587` | SMTP 端口（587 用于 STARTTLS，465 用于 SSL） |
| `SMTP_USER` | 是 | — | SMTP 用户名 |
| `SMTP_PASSWORD` | 是 | — | SMTP 密码 |
| `SMTP_FROM` | 是 | — | 发件人地址（例如 `NetRecon <noreply@yourcompany.com>`） |

## 许可证

| 变量 | 必需 | 默认值 | 描述 |
|---|---|---|---|
| `LICENSE_KEY` | 是 | — | 您的 NetRecon 许可证密钥 |

联系 [sales@netreconapp.com](mailto:sales@netreconapp.com) 获取许可证密钥。

## 备份服务

| 变量 | 必需 | 默认值 | 描述 |
|---|---|---|---|
| `BACKUP_S3_ENDPOINT` | 否 | — | S3 兼容存储端点 |
| `BACKUP_S3_BUCKET` | 否 | — | 备份存储桶名称 |
| `BACKUP_S3_ACCESS_KEY` | 否 | — | S3 访问密钥 |
| `BACKUP_S3_SECRET_KEY` | 否 | — | S3 私密密钥 |
| `BACKUP_ENCRYPTION_KEY` | 否 | — | 备份的 AES-256-GCM 加密密钥 |
| `BACKUP_RETENTION_DAYS` | 否 | `30` | 备份文件保留天数 |

## 通知

| 变量 | 必需 | 默认值 | 描述 |
|---|---|---|---|
| `TELEGRAM_BOT_TOKEN` | 否 | — | 用于告警的 Telegram 机器人令牌 |
| `TELEGRAM_CHAT_ID` | 否 | — | 告警投递的 Telegram 聊天 ID |

## 示例 `.env` 文件

```bash
# 核心
NETRECON_DOMAIN=netrecon.yourcompany.com
NETRECON_EMAIL=admin@yourcompany.com

# PostgreSQL
POSTGRES_USER=netrecon
POSTGRES_PASSWORD=xK9mP2vL8nQ4wR7j
POSTGRES_DB=netrecon

# Redis
REDIS_PASSWORD=hT6yN3bF9cM1pW5s

# 认证
JWT_SECRET=a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2

# 代理注册
AGENT_REGISTRY_SECRET=r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3
AGENT_JWT_SECRET=h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9

# 邮件
SMTP_HOST=smtp.yourcompany.com
SMTP_PORT=587
SMTP_USER=noreply@yourcompany.com
SMTP_PASSWORD=your-smtp-password
SMTP_FROM=NetRecon <noreply@yourcompany.com>

# 许可证
LICENSE_KEY=your-license-key
```

:::warning
切勿将 `.env` 文件提交到版本控制。上面显示的所有值都是示例——在部署前请替换为您自己的安全值。
:::

## 应用配置更改

修改 `.env` 文件后，重启受影响的服务：

```bash
cd /opt/netrecon

# 重启所有服务
docker compose down && docker compose up -d

# 或重启特定服务
docker compose restart api-gateway
```

## 服务端口

所有服务在 Nginx 反向代理后面运行，对外使用 80/443 端口。默认情况下不暴露内部服务端口：

| 服务 | 内部端口 | 描述 |
|---|---|---|
| API Gateway | 8000 | 主 API 端点 |
| Vault Server | 8001 | 密钥管理 |
| License Server | 8002 | 许可证验证 |
| Email Service | 8003 | SMTP 中继 |
| Notification Service | 8004 | 推送通知和告警 |
| Update Server | 8005 | 代理和探针更新 |
| Agent Registry | 8006 | 代理注册和管理 |
| Warranty Service | 8007 | 硬件保修查询 |
| CMod Service | 8008 | 配置管理 |
| IPAM Service | 8009 | IP 地址管理 |

要直接暴露服务端口（不建议用于生产环境），请在 `docker-compose.yml` 中的服务 `ports` 映射中添加。

如需帮助，请联系 [support@netreconapp.com](mailto:support@netreconapp.com)。
