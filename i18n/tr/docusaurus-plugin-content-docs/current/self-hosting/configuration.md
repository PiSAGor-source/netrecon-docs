---
sidebar_position: 3
title: Yapılandırma
description: Kendi sunucunuzda barındırılan NetRecon için ortam değişkenleri ve yapılandırma referansı
---

# Yapılandırma Referansı

Tüm NetRecon hizmetleri, `/opt/netrecon/.env` konumundaki tek bir `.env` dosyası aracılığıyla yapılandırılır. Bu sayfa mevcut tüm ortam değişkenlerini belgelemektedir.

## Temel Ayarlar

| Değişken | Zorunlu | Varsayılan | Açıklama |
|---|---|---|---|
| `NETRECON_DOMAIN` | Evet | — | Alan adınız (örn. `netrecon.yourcompany.com`) |
| `NETRECON_EMAIL` | Evet | — | Let's Encrypt ve bildirimler için yönetici e-postası |

## Veritabanı (PostgreSQL)

| Değişken | Zorunlu | Varsayılan | Açıklama |
|---|---|---|---|
| `POSTGRES_USER` | Evet | — | PostgreSQL kullanıcı adı |
| `POSTGRES_PASSWORD` | Evet | — | PostgreSQL parolası |
| `POSTGRES_DB` | Evet | `netrecon` | Veritabanı adı |
| `DATABASE_URL` | Otomatik | — | Yukarıdaki değerlerden otomatik oluşturulur |

:::tip
Güçlü, rastgele oluşturulmuş bir parola kullanın. Şu komutla oluşturabilirsiniz:
```bash
openssl rand -base64 24
```
:::

## Önbellek (Redis)

| Değişken | Zorunlu | Varsayılan | Açıklama |
|---|---|---|---|
| `REDIS_PASSWORD` | Evet | — | Redis kimlik doğrulama parolası |
| `REDIS_URL` | Otomatik | — | Otomatik oluşturulur |

## Kimlik Doğrulama

| Değişken | Zorunlu | Varsayılan | Açıklama |
|---|---|---|---|
| `JWT_SECRET` | Evet | — | JWT jetonlarını imzalamak için gizli anahtar (min 32 karakter) |
| `JWT_EXPIRE_MINUTES` | Hayır | `1440` | Jeton süre sonu (varsayılan: 24 saat) |

Güvenli bir JWT gizli anahtarı oluşturun:
```bash
openssl rand -hex 32
```

## Ajan Kayıt Defteri

| Değişken | Zorunlu | Varsayılan | Açıklama |
|---|---|---|---|
| `AGENT_REGISTRY_SECRET` | Evet | — | Ajan kaydı için gizli anahtar |
| `AGENT_JWT_SECRET` | Evet | — | Ajan kimlik doğrulaması için JWT gizli anahtarı |
| `AGENT_TOKEN_EXPIRE_MINUTES` | Hayır | `1440` | Ajan jeton süre sonu |
| `AGENT_HEARTBEAT_INTERVAL` | Hayır | `30` | Saniye cinsinden heartbeat aralığı |
| `AGENT_HEARTBEAT_TIMEOUT` | Hayır | `90` | Ajanı çevrimdışı olarak işaretlemeden önceki süre (saniye) |

## E-posta (SMTP)

| Değişken | Zorunlu | Varsayılan | Açıklama |
|---|---|---|---|
| `SMTP_HOST` | Evet | — | SMTP sunucu ana bilgisayar adı |
| `SMTP_PORT` | Hayır | `587` | SMTP portu (STARTTLS için 587, SSL için 465) |
| `SMTP_USER` | Evet | — | SMTP kullanıcı adı |
| `SMTP_PASSWORD` | Evet | — | SMTP parolası |
| `SMTP_FROM` | Evet | — | Gönderici adresi (örn. `NetRecon <noreply@yourcompany.com>`) |

## Lisans

| Değişken | Zorunlu | Varsayılan | Açıklama |
|---|---|---|---|
| `LICENSE_KEY` | Evet | — | NetRecon lisans anahtarınız |

Lisans anahtarı almak için [sales@netreconapp.com](mailto:sales@netreconapp.com) adresine başvurun.

## Yedekleme Hizmeti

| Değişken | Zorunlu | Varsayılan | Açıklama |
|---|---|---|---|
| `BACKUP_S3_ENDPOINT` | Hayır | — | S3 uyumlu depolama uç noktası |
| `BACKUP_S3_BUCKET` | Hayır | — | Yedeklemeler için bucket adı |
| `BACKUP_S3_ACCESS_KEY` | Hayır | — | S3 erişim anahtarı |
| `BACKUP_S3_SECRET_KEY` | Hayır | — | S3 gizli anahtar |
| `BACKUP_ENCRYPTION_KEY` | Hayır | — | Yedeklemeler için AES-256-GCM şifreleme anahtarı |
| `BACKUP_RETENTION_DAYS` | Hayır | `30` | Yedekleme dosyalarının saklanma süresi (gün) |

## Bildirimler

| Değişken | Zorunlu | Varsayılan | Açıklama |
|---|---|---|---|
| `TELEGRAM_BOT_TOKEN` | Hayır | — | Uyarılar için Telegram bot jetonu |
| `TELEGRAM_CHAT_ID` | Hayır | — | Uyarı teslimi için Telegram sohbet kimliği |

## Örnek `.env` Dosyası

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
`.env` dosyasını asla sürüm kontrolüne eklemeyin. Yukarıda gösterilen tüm değerler örnektir — dağıtmadan önce kendi güvenli değerlerinizle değiştirin.
:::

## Yapılandırma Değişikliklerini Uygulama

`.env` dosyasını değiştirdikten sonra etkilenen hizmetleri yeniden başlatın:

```bash
cd /opt/netrecon

# Tüm hizmetleri yeniden başlatın
docker compose down && docker compose up -d

# Veya belirli bir hizmeti yeniden başlatın
docker compose restart api-gateway
```

## Hizmet Portları

Tüm hizmetler Nginx ters proxy'si arkasında 80/443 portlarında çalışır. Dahili hizmet portları varsayılan olarak dışarıya açık değildir:

| Hizmet | Dahili Port | Açıklama |
|---|---|---|
| API Gateway | 8000 | Ana API uç noktası |
| Vault Server | 8001 | Gizli bilgi yönetimi |
| License Server | 8002 | Lisans doğrulama |
| Email Service | 8003 | SMTP aktarma |
| Notification Service | 8004 | Anlık bildirimler ve uyarılar |
| Update Server | 8005 | Ajan ve prob güncellemeleri |
| Agent Registry | 8006 | Ajan kaydı ve yönetimi |
| Warranty Service | 8007 | Donanım garanti sorgulamaları |
| CMod Service | 8008 | Yapılandırma yönetimi |
| IPAM Service | 8009 | IP adres yönetimi |

Bir hizmet portunu doğrudan açmak için (üretim ortamı için önerilmez), `docker-compose.yml` dosyasındaki ilgili hizmetin `ports` eşlemesine ekleyin.

Yardım için [support@netreconapp.com](mailto:support@netreconapp.com) adresine başvurun.
