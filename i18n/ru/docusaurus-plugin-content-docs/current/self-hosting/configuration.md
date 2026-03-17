---
sidebar_position: 3
title: Конфигурация
description: Переменные окружения и справочник по конфигурации для локального развёртывания NetRecon
---

# Справочник по конфигурации

Все сервисы NetRecon настраиваются через единый файл `.env`, расположенный по пути `/opt/netrecon/.env`. На этой странице описаны все доступные переменные окружения.

## Основные настройки

| Переменная | Обязательна | По умолчанию | Описание |
|---|---|---|---|
| `NETRECON_DOMAIN` | Да | — | Ваше доменное имя (например, `netrecon.yourcompany.com`) |
| `NETRECON_EMAIL` | Да | — | Email администратора для Let's Encrypt и уведомлений |

## База данных (PostgreSQL)

| Переменная | Обязательна | По умолчанию | Описание |
|---|---|---|---|
| `POSTGRES_USER` | Да | — | Имя пользователя PostgreSQL |
| `POSTGRES_PASSWORD` | Да | — | Пароль PostgreSQL |
| `POSTGRES_DB` | Да | `netrecon` | Имя базы данных |
| `DATABASE_URL` | Авто | — | Формируется автоматически из вышеуказанных значений |

:::tip
Используйте надёжный, случайно сгенерированный пароль. Сгенерируйте его с помощью:
```bash
openssl rand -base64 24
```
:::

## Кэш (Redis)

| Переменная | Обязательна | По умолчанию | Описание |
|---|---|---|---|
| `REDIS_PASSWORD` | Да | — | Пароль аутентификации Redis |
| `REDIS_URL` | Авто | — | Формируется автоматически |

## Аутентификация

| Переменная | Обязательна | По умолчанию | Описание |
|---|---|---|---|
| `JWT_SECRET` | Да | — | Секретный ключ для подписи JWT-токенов (минимум 32 символа) |
| `JWT_EXPIRE_MINUTES` | Нет | `1440` | Время истечения токена (по умолчанию: 24 часа) |

Сгенерируйте безопасный JWT-секрет:
```bash
openssl rand -hex 32
```

## Реестр агентов

| Переменная | Обязательна | По умолчанию | Описание |
|---|---|---|---|
| `AGENT_REGISTRY_SECRET` | Да | — | Секрет для регистрации агентов |
| `AGENT_JWT_SECRET` | Да | — | JWT-секрет для аутентификации агентов |
| `AGENT_TOKEN_EXPIRE_MINUTES` | Нет | `1440` | Время истечения токена агента |
| `AGENT_HEARTBEAT_INTERVAL` | Нет | `30` | Интервал проверки связи в секундах |
| `AGENT_HEARTBEAT_TIMEOUT` | Нет | `90` | Секунды до пометки агента как оффлайн |

## Электронная почта (SMTP)

| Переменная | Обязательна | По умолчанию | Описание |
|---|---|---|---|
| `SMTP_HOST` | Да | — | Имя хоста SMTP-сервера |
| `SMTP_PORT` | Нет | `587` | Порт SMTP (587 для STARTTLS, 465 для SSL) |
| `SMTP_USER` | Да | — | Имя пользователя SMTP |
| `SMTP_PASSWORD` | Да | — | Пароль SMTP |
| `SMTP_FROM` | Да | — | Адрес отправителя (например, `NetRecon <noreply@yourcompany.com>`) |

## Лицензия

| Переменная | Обязательна | По умолчанию | Описание |
|---|---|---|---|
| `LICENSE_KEY` | Да | — | Ваш лицензионный ключ NetRecon |

Свяжитесь с [sales@netreconapp.com](mailto:sales@netreconapp.com) для получения лицензионного ключа.

## Сервис резервного копирования

| Переменная | Обязательна | По умолчанию | Описание |
|---|---|---|---|
| `BACKUP_S3_ENDPOINT` | Нет | — | Конечная точка S3-совместимого хранилища |
| `BACKUP_S3_BUCKET` | Нет | — | Имя бакета для резервных копий |
| `BACKUP_S3_ACCESS_KEY` | Нет | — | Ключ доступа S3 |
| `BACKUP_S3_SECRET_KEY` | Нет | — | Секретный ключ S3 |
| `BACKUP_ENCRYPTION_KEY` | Нет | — | Ключ шифрования AES-256-GCM для резервных копий |
| `BACKUP_RETENTION_DAYS` | Нет | `30` | Количество дней хранения файлов резервных копий |

## Уведомления

| Переменная | Обязательна | По умолчанию | Описание |
|---|---|---|---|
| `TELEGRAM_BOT_TOKEN` | Нет | — | Токен Telegram-бота для оповещений |
| `TELEGRAM_CHAT_ID` | Нет | — | ID чата Telegram для доставки оповещений |

## Пример файла `.env`

```bash
# Core
NETRECON_DOMAIN=netrecon.yourcompany.com
NETRECON_EMAIL=admin@yourcompany.com

# PostgreSQL
POSTGRES_USER=netrecon
POSTGRES_PASSWORD=xK9mP2vL8nQ4wR7j
POSTGRES_DB=netrecon

# Redis
REDIS_PASSWORD=hT6yN3bF9cM1pW5s

# Authentication
JWT_SECRET=a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2

# Agent Registry
AGENT_REGISTRY_SECRET=r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3
AGENT_JWT_SECRET=h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9

# Email
SMTP_HOST=smtp.yourcompany.com
SMTP_PORT=587
SMTP_USER=noreply@yourcompany.com
SMTP_PASSWORD=your-smtp-password
SMTP_FROM=NetRecon <noreply@yourcompany.com>

# License
LICENSE_KEY=your-license-key
```

:::warning
Никогда не добавляйте файл `.env` в систему контроля версий. Все значения, показанные выше, являются примерами — замените их своими безопасными значениями перед развёртыванием.
:::

## Применение изменений конфигурации

После изменения файла `.env` перезапустите затронутые сервисы:

```bash
cd /opt/netrecon

# Перезапуск всех сервисов
docker compose down && docker compose up -d

# Или перезапуск конкретного сервиса
docker compose restart api-gateway
```

## Порты сервисов

Все сервисы работают за обратным прокси Nginx на портах 80/443. Внутренние порты сервисов по умолчанию не открыты наружу:

| Сервис | Внутренний порт | Описание |
|---|---|---|
| API Gateway | 8000 | Основная конечная точка API |
| Vault Server | 8001 | Управление секретами |
| License Server | 8002 | Валидация лицензий |
| Email Service | 8003 | SMTP-ретранслятор |
| Notification Service | 8004 | Push-уведомления и оповещения |
| Update Server | 8005 | Обновления агентов и зондов |
| Agent Registry | 8006 | Регистрация и управление агентами |
| Warranty Service | 8007 | Проверка гарантии оборудования |
| CMod Service | 8008 | Управление конфигурацией |
| IPAM Service | 8009 | Управление IP-адресами |

Чтобы открыть порт сервиса напрямую (не рекомендуется для продуктивной среды), добавьте его в секцию `ports` соответствующего сервиса в `docker-compose.yml`.

Для получения помощи свяжитесь с [support@netreconapp.com](mailto:support@netreconapp.com).
