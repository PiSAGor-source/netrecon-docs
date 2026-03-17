---
sidebar_position: 3
title: Конфігурація
description: Змінні середовища та довідник конфігурації для self-hosted NetRecon
---

# Довідник конфігурації

Усі сервіси NetRecon конфігуруються через один файл `.env`, розташований у `/opt/netrecon/.env`. На цій сторінці задокументовано кожну доступну змінну середовища.

## Основні налаштування

| Змінна | Обов'язково | За замовчуванням | Опис |
|---|---|---|---|
| `NETRECON_DOMAIN` | Так | — | Ваше доменне ім'я (наприклад, `netrecon.yourcompany.com`) |
| `NETRECON_EMAIL` | Так | — | Електронна пошта адміністратора для Let's Encrypt та сповіщень |

## База даних (PostgreSQL)

| Змінна | Обов'язково | За замовчуванням | Опис |
|---|---|---|---|
| `POSTGRES_USER` | Так | — | Ім'я користувача PostgreSQL |
| `POSTGRES_PASSWORD` | Так | — | Пароль PostgreSQL |
| `POSTGRES_DB` | Так | `netrecon` | Назва бази даних |
| `DATABASE_URL` | Авто | — | Формується автоматично з наведених вище значень |

:::tip
Використовуйте надійний, випадково згенерований пароль. Згенеруйте його за допомогою:
```bash
openssl rand -base64 24
```
:::

## Кеш (Redis)

| Змінна | Обов'язково | За замовчуванням | Опис |
|---|---|---|---|
| `REDIS_PASSWORD` | Так | — | Пароль автентифікації Redis |
| `REDIS_URL` | Авто | — | Формується автоматично |

## Автентифікація

| Змінна | Обов'язково | За замовчуванням | Опис |
|---|---|---|---|
| `JWT_SECRET` | Так | — | Секретний ключ для підпису JWT-токенів (мін. 32 символи) |
| `JWT_EXPIRE_MINUTES` | Ні | `1440` | Час закінчення дії токена (за замовчуванням: 24 години) |

Згенеруйте безпечний JWT-секрет:
```bash
openssl rand -hex 32
```

## Реєстр агентів

| Змінна | Обов'язково | За замовчуванням | Опис |
|---|---|---|---|
| `AGENT_REGISTRY_SECRET` | Так | — | Секрет для реєстрації агентів |
| `AGENT_JWT_SECRET` | Так | — | JWT-секрет для автентифікації агентів |
| `AGENT_TOKEN_EXPIRE_MINUTES` | Ні | `1440` | Час закінчення дії токена агента |
| `AGENT_HEARTBEAT_INTERVAL` | Ні | `30` | Інтервал heartbeat у секундах |
| `AGENT_HEARTBEAT_TIMEOUT` | Ні | `90` | Секунди до позначення агента як офлайн |

## Електронна пошта (SMTP)

| Змінна | Обов'язково | За замовчуванням | Опис |
|---|---|---|---|
| `SMTP_HOST` | Так | — | Ім'я хоста SMTP-сервера |
| `SMTP_PORT` | Ні | `587` | Порт SMTP (587 для STARTTLS, 465 для SSL) |
| `SMTP_USER` | Так | — | Ім'я користувача SMTP |
| `SMTP_PASSWORD` | Так | — | Пароль SMTP |
| `SMTP_FROM` | Так | — | Адреса відправника (наприклад, `NetRecon <noreply@yourcompany.com>`) |

## Ліцензія

| Змінна | Обов'язково | За замовчуванням | Опис |
|---|---|---|---|
| `LICENSE_KEY` | Так | — | Ваш ліцензійний ключ NetRecon |

Зверніться до [sales@netreconapp.com](mailto:sales@netreconapp.com) для отримання ліцензійного ключа.

## Сервіс резервного копіювання

| Змінна | Обов'язково | За замовчуванням | Опис |
|---|---|---|---|
| `BACKUP_S3_ENDPOINT` | Ні | — | Кінцева точка S3-сумісного сховища |
| `BACKUP_S3_BUCKET` | Ні | — | Назва кошика для резервних копій |
| `BACKUP_S3_ACCESS_KEY` | Ні | — | Ключ доступу S3 |
| `BACKUP_S3_SECRET_KEY` | Ні | — | Секретний ключ S3 |
| `BACKUP_ENCRYPTION_KEY` | Ні | — | Ключ шифрування AES-256-GCM для резервних копій |
| `BACKUP_RETENTION_DAYS` | Ні | `30` | Кількість днів зберігання файлів резервних копій |

## Сповіщення

| Змінна | Обов'язково | За замовчуванням | Опис |
|---|---|---|---|
| `TELEGRAM_BOT_TOKEN` | Ні | — | Токен Telegram-бота для сповіщень |
| `TELEGRAM_CHAT_ID` | Ні | — | ID чату Telegram для доставки сповіщень |

## Приклад файлу `.env`

```bash
# Основні
NETRECON_DOMAIN=netrecon.yourcompany.com
NETRECON_EMAIL=admin@yourcompany.com

# PostgreSQL
POSTGRES_USER=netrecon
POSTGRES_PASSWORD=xK9mP2vL8nQ4wR7j
POSTGRES_DB=netrecon

# Redis
REDIS_PASSWORD=hT6yN3bF9cM1pW5s

# Автентифікація
JWT_SECRET=a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2

# Реєстр агентів
AGENT_REGISTRY_SECRET=r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3
AGENT_JWT_SECRET=h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9

# Електронна пошта
SMTP_HOST=smtp.yourcompany.com
SMTP_PORT=587
SMTP_USER=noreply@yourcompany.com
SMTP_PASSWORD=your-smtp-password
SMTP_FROM=NetRecon <noreply@yourcompany.com>

# Ліцензія
LICENSE_KEY=your-license-key
```

:::warning
Ніколи не додавайте файл `.env` до системи контролю версій. Усі значення, наведені вище, є прикладами — замініть їх на власні безпечні значення перед розгортанням.
:::

## Застосування змін конфігурації

Після зміни файлу `.env` перезапустіть відповідні сервіси:

```bash
cd /opt/netrecon

# Перезапуск усіх сервісів
docker compose down && docker compose up -d

# Або перезапуск конкретного сервісу
docker compose restart api-gateway
```

## Порти сервісів

Усі сервіси працюють за зворотним проксі Nginx на портах 80/443. Внутрішні порти сервісів за замовчуванням не відкриваються:

| Сервіс | Внутрішній порт | Опис |
|---|---|---|
| API Gateway | 8000 | Основна кінцева точка API |
| Vault Server | 8001 | Управління секретами |
| License Server | 8002 | Перевірка ліцензій |
| Email Service | 8003 | Ретрансляція SMTP |
| Notification Service | 8004 | Push-сповіщення та оповіщення |
| Update Server | 8005 | Оновлення агентів та зондів |
| Agent Registry | 8006 | Реєстрація та управління агентами |
| Warranty Service | 8007 | Перевірка гарантій обладнання |
| CMod Service | 8008 | Управління конфігурацією |
| IPAM Service | 8009 | Управління IP-адресами |

Щоб відкрити порт сервісу напряму (не рекомендується для продакшну), додайте його до маппінгу `ports` сервісу в `docker-compose.yml`.

Для допомоги зверніться до [support@netreconapp.com](mailto:support@netreconapp.com).
