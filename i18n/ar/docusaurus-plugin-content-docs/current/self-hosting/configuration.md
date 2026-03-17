---
sidebar_position: 3
title: التكوين
description: متغيرات البيئة ومرجع التكوين لـ NetRecon المستضاف ذاتيًا
---

# مرجع التكوين

يتم تكوين جميع خدمات NetRecon من خلال ملف `.env` واحد موجود في `/opt/netrecon/.env`. توثق هذه الصفحة جميع متغيرات البيئة المتاحة.

## الإعدادات الأساسية

| المتغير | مطلوب | الافتراضي | الوصف |
|---|---|---|---|
| `NETRECON_DOMAIN` | نعم | — | اسم نطاقك (مثل `netrecon.yourcompany.com`) |
| `NETRECON_EMAIL` | نعم | — | بريد المسؤول لـ Let's Encrypt والإشعارات |

## قاعدة البيانات (PostgreSQL)

| المتغير | مطلوب | الافتراضي | الوصف |
|---|---|---|---|
| `POSTGRES_USER` | نعم | — | اسم مستخدم PostgreSQL |
| `POSTGRES_PASSWORD` | نعم | — | كلمة مرور PostgreSQL |
| `POSTGRES_DB` | نعم | `netrecon` | اسم قاعدة البيانات |
| `DATABASE_URL` | تلقائي | — | يُبنى تلقائيًا من القيم أعلاه |

:::tip
استخدم كلمة مرور قوية ومولدة عشوائيًا. أنشئ واحدة بـ:
```bash
openssl rand -base64 24
```
:::

## التخزين المؤقت (Redis)

| المتغير | مطلوب | الافتراضي | الوصف |
|---|---|---|---|
| `REDIS_PASSWORD` | نعم | — | كلمة مرور مصادقة Redis |
| `REDIS_URL` | تلقائي | — | يُبنى تلقائيًا |

## المصادقة

| المتغير | مطلوب | الافتراضي | الوصف |
|---|---|---|---|
| `JWT_SECRET` | نعم | — | مفتاح سري لتوقيع رموز JWT (32 حرفًا على الأقل) |
| `JWT_EXPIRE_MINUTES` | لا | `1440` | وقت انتهاء صلاحية الرمز (الافتراضي: 24 ساعة) |

أنشئ مفتاح JWT آمن:
```bash
openssl rand -hex 32
```

## سجل الوكلاء

| المتغير | مطلوب | الافتراضي | الوصف |
|---|---|---|---|
| `AGENT_REGISTRY_SECRET` | نعم | — | السر الخاص بتسجيل الوكلاء |
| `AGENT_JWT_SECRET` | نعم | — | مفتاح JWT لمصادقة الوكلاء |
| `AGENT_TOKEN_EXPIRE_MINUTES` | لا | `1440` | انتهاء صلاحية رمز الوكيل |
| `AGENT_HEARTBEAT_INTERVAL` | لا | `30` | فترة نبضات القلب بالثواني |
| `AGENT_HEARTBEAT_TIMEOUT` | لا | `90` | الثواني قبل اعتبار الوكيل غير متصل |

## البريد الإلكتروني (SMTP)

| المتغير | مطلوب | الافتراضي | الوصف |
|---|---|---|---|
| `SMTP_HOST` | نعم | — | اسم مضيف خادم SMTP |
| `SMTP_PORT` | لا | `587` | منفذ SMTP (587 لـ STARTTLS، 465 لـ SSL) |
| `SMTP_USER` | نعم | — | اسم مستخدم SMTP |
| `SMTP_PASSWORD` | نعم | — | كلمة مرور SMTP |
| `SMTP_FROM` | نعم | — | عنوان المرسل (مثل `NetRecon <noreply@yourcompany.com>`) |

## الترخيص

| المتغير | مطلوب | الافتراضي | الوصف |
|---|---|---|---|
| `LICENSE_KEY` | نعم | — | مفتاح ترخيص NetRecon الخاص بك |

تواصل مع [sales@netreconapp.com](mailto:sales@netreconapp.com) للحصول على مفتاح ترخيص.

## خدمة النسخ الاحتياطي

| المتغير | مطلوب | الافتراضي | الوصف |
|---|---|---|---|
| `BACKUP_S3_ENDPOINT` | لا | — | نقطة نهاية تخزين متوافقة مع S3 |
| `BACKUP_S3_BUCKET` | لا | — | اسم الحاوية للنسخ الاحتياطية |
| `BACKUP_S3_ACCESS_KEY` | لا | — | مفتاح وصول S3 |
| `BACKUP_S3_SECRET_KEY` | لا | — | مفتاح S3 السري |
| `BACKUP_ENCRYPTION_KEY` | لا | — | مفتاح تشفير AES-256-GCM للنسخ الاحتياطية |
| `BACKUP_RETENTION_DAYS` | لا | `30` | أيام الاحتفاظ بملفات النسخ الاحتياطي |

## الإشعارات

| المتغير | مطلوب | الافتراضي | الوصف |
|---|---|---|---|
| `TELEGRAM_BOT_TOKEN` | لا | — | رمز بوت Telegram للتنبيهات |
| `TELEGRAM_CHAT_ID` | لا | — | معرف محادثة Telegram لتسليم التنبيهات |

## مثال على ملف `.env`

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
لا تقم أبدًا بإيداع ملف `.env` في نظام التحكم بالإصدار. جميع القيم المعروضة أعلاه هي أمثلة — استبدلها بقيمك الآمنة الخاصة قبل النشر.
:::

## تطبيق تغييرات التكوين

بعد تعديل ملف `.env`، أعد تشغيل الخدمات المتأثرة:

```bash
cd /opt/netrecon

# إعادة تشغيل جميع الخدمات
docker compose down && docker compose up -d

# أو إعادة تشغيل خدمة محددة
docker compose restart api-gateway
```

## منافذ الخدمات

تعمل جميع الخدمات خلف الوكيل العكسي Nginx على المنفذين 80/443. لا يتم كشف منافذ الخدمات الداخلية افتراضيًا:

| الخدمة | المنفذ الداخلي | الوصف |
|---|---|---|
| API Gateway | 8000 | نقطة نهاية API الرئيسية |
| Vault Server | 8001 | إدارة الأسرار |
| License Server | 8002 | التحقق من التراخيص |
| Email Service | 8003 | ترحيل SMTP |
| Notification Service | 8004 | الإشعارات الفورية والتنبيهات |
| Update Server | 8005 | تحديثات الوكلاء والمجسات |
| Agent Registry | 8006 | تسجيل الوكلاء وإدارتهم |
| Warranty Service | 8007 | البحث عن ضمان الأجهزة |
| CMod Service | 8008 | إدارة التكوين |
| IPAM Service | 8009 | إدارة عناوين IP |

لكشف منفذ خدمة مباشرة (غير موصى به للإنتاج)، أضفه إلى تعيين `ports` للخدمة في `docker-compose.yml`.

للمساعدة، تواصل مع [support@netreconapp.com](mailto:support@netreconapp.com).
