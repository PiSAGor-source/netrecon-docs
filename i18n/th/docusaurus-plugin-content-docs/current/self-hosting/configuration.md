---
sidebar_position: 3
title: คอนฟิกูเรชัน
description: ตัวแปร environment และเอกสารอ้างอิงคอนฟิกูเรชันสำหรับ NetRecon แบบ self-hosted
---

# เอกสารอ้างอิงคอนฟิกูเรชัน

บริการ NetRecon ทั้งหมดถูกกำหนดค่าผ่านไฟล์ `.env` เดียวที่อยู่ที่ `/opt/netrecon/.env` หน้านี้จะอธิบายตัวแปร environment ทั้งหมดที่มี

## การตั้งค่าหลัก

| ตัวแปร | จำเป็น | ค่าเริ่มต้น | รายละเอียด |
|---|---|---|---|
| `NETRECON_DOMAIN` | ใช่ | — | ชื่อโดเมนของคุณ (เช่น `netrecon.yourcompany.com`) |
| `NETRECON_EMAIL` | ใช่ | — | อีเมลผู้ดูแลระบบสำหรับ Let's Encrypt และการแจ้งเตือน |

## ฐานข้อมูล (PostgreSQL)

| ตัวแปร | จำเป็น | ค่าเริ่มต้น | รายละเอียด |
|---|---|---|---|
| `POSTGRES_USER` | ใช่ | — | ชื่อผู้ใช้ PostgreSQL |
| `POSTGRES_PASSWORD` | ใช่ | — | รหัสผ่าน PostgreSQL |
| `POSTGRES_DB` | ใช่ | `netrecon` | ชื่อฐานข้อมูล |
| `DATABASE_URL` | อัตโนมัติ | — | สร้างโดยอัตโนมัติจากค่าข้างต้น |

:::tip
ใช้รหัสผ่านที่แข็งแกร่งและสร้างแบบสุ่ม สร้างได้ด้วย:
```bash
openssl rand -base64 24
```
:::

## แคช (Redis)

| ตัวแปร | จำเป็น | ค่าเริ่มต้น | รายละเอียด |
|---|---|---|---|
| `REDIS_PASSWORD` | ใช่ | — | รหัสผ่านยืนยันตัวตน Redis |
| `REDIS_URL` | อัตโนมัติ | — | สร้างโดยอัตโนมัติ |

## การยืนยันตัวตน

| ตัวแปร | จำเป็น | ค่าเริ่มต้น | รายละเอียด |
|---|---|---|---|
| `JWT_SECRET` | ใช่ | — | คีย์ลับสำหรับลงนาม JWT token (ขั้นต่ำ 32 อักขระ) |
| `JWT_EXPIRE_MINUTES` | ไม่ | `1440` | เวลาหมดอายุ token (ค่าเริ่มต้น: 24 ชั่วโมง) |

สร้าง JWT secret ที่ปลอดภัย:
```bash
openssl rand -hex 32
```

## Agent Registry

| ตัวแปร | จำเป็น | ค่าเริ่มต้น | รายละเอียด |
|---|---|---|---|
| `AGENT_REGISTRY_SECRET` | ใช่ | — | Secret สำหรับการลงทะเบียน agent |
| `AGENT_JWT_SECRET` | ใช่ | — | JWT secret สำหรับการยืนยันตัวตน agent |
| `AGENT_TOKEN_EXPIRE_MINUTES` | ไม่ | `1440` | การหมดอายุ token ของ agent |
| `AGENT_HEARTBEAT_INTERVAL` | ไม่ | `30` | ช่วงเวลา heartbeat เป็นวินาที |
| `AGENT_HEARTBEAT_TIMEOUT` | ไม่ | `90` | วินาทีก่อนทำเครื่องหมาย agent ว่าออฟไลน์ |

## อีเมล (SMTP)

| ตัวแปร | จำเป็น | ค่าเริ่มต้น | รายละเอียด |
|---|---|---|---|
| `SMTP_HOST` | ใช่ | — | ชื่อโฮสต์เซิร์ฟเวอร์ SMTP |
| `SMTP_PORT` | ไม่ | `587` | พอร์ต SMTP (587 สำหรับ STARTTLS, 465 สำหรับ SSL) |
| `SMTP_USER` | ใช่ | — | ชื่อผู้ใช้ SMTP |
| `SMTP_PASSWORD` | ใช่ | — | รหัสผ่าน SMTP |
| `SMTP_FROM` | ใช่ | — | ที่อยู่ผู้ส่ง (เช่น `NetRecon <noreply@yourcompany.com>`) |

## ลิขสิทธิ์

| ตัวแปร | จำเป็น | ค่าเริ่มต้น | รายละเอียด |
|---|---|---|---|
| `LICENSE_KEY` | ใช่ | — | License key ของ NetRecon ของคุณ |

ติดต่อ [sales@netreconapp.com](mailto:sales@netreconapp.com) เพื่อรับ license key

## บริการสำรองข้อมูล

| ตัวแปร | จำเป็น | ค่าเริ่มต้น | รายละเอียด |
|---|---|---|---|
| `BACKUP_S3_ENDPOINT` | ไม่ | — | endpoint ที่รองรับ S3 |
| `BACKUP_S3_BUCKET` | ไม่ | — | ชื่อ bucket สำหรับการสำรอง |
| `BACKUP_S3_ACCESS_KEY` | ไม่ | — | S3 access key |
| `BACKUP_S3_SECRET_KEY` | ไม่ | — | S3 secret key |
| `BACKUP_ENCRYPTION_KEY` | ไม่ | — | คีย์เข้ารหัส AES-256-GCM สำหรับการสำรอง |
| `BACKUP_RETENTION_DAYS` | ไม่ | `30` | จำนวนวันที่เก็บไฟล์สำรอง |

## การแจ้งเตือน

| ตัวแปร | จำเป็น | ค่าเริ่มต้น | รายละเอียด |
|---|---|---|---|
| `TELEGRAM_BOT_TOKEN` | ไม่ | — | Telegram bot token สำหรับการแจ้งเตือน |
| `TELEGRAM_CHAT_ID` | ไม่ | — | Telegram chat ID สำหรับส่งการแจ้งเตือน |

## ตัวอย่างไฟล์ `.env`

```bash
# หลัก
NETRECON_DOMAIN=netrecon.yourcompany.com
NETRECON_EMAIL=admin@yourcompany.com

# PostgreSQL
POSTGRES_USER=netrecon
POSTGRES_PASSWORD=xK9mP2vL8nQ4wR7j
POSTGRES_DB=netrecon

# Redis
REDIS_PASSWORD=hT6yN3bF9cM1pW5s

# การยืนยันตัวตน
JWT_SECRET=a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2

# Agent Registry
AGENT_REGISTRY_SECRET=r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3
AGENT_JWT_SECRET=h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9

# อีเมล
SMTP_HOST=smtp.yourcompany.com
SMTP_PORT=587
SMTP_USER=noreply@yourcompany.com
SMTP_PASSWORD=your-smtp-password
SMTP_FROM=NetRecon <noreply@yourcompany.com>

# ลิขสิทธิ์
LICENSE_KEY=your-license-key
```

:::warning
อย่า commit ไฟล์ `.env` ไปยังระบบควบคุมเวอร์ชัน ค่าทั้งหมดที่แสดงข้างต้นเป็นตัวอย่าง แทนที่ด้วยค่าที่ปลอดภัยของคุณเองก่อนการติดตั้ง
:::

## การใช้การเปลี่ยนแปลงคอนฟิกูเรชัน

หลังจากแก้ไขไฟล์ `.env` รีสตาร์ทบริการที่ได้รับผลกระทบ:

```bash
cd /opt/netrecon

# รีสตาร์ทบริการทั้งหมด
docker compose down && docker compose up -d

# หรือรีสตาร์ทบริการเฉพาะ
docker compose restart api-gateway
```

## พอร์ตบริการ

บริการทั้งหมดทำงานอยู่หลัง Nginx reverse proxy บนพอร์ต 80/443 พอร์ตบริการภายในไม่ได้เปิดเผยโดยค่าเริ่มต้น:

| บริการ | พอร์ตภายใน | รายละเอียด |
|---|---|---|
| API Gateway | 8000 | endpoint API หลัก |
| Vault Server | 8001 | การจัดการความลับ |
| License Server | 8002 | การตรวจสอบลิขสิทธิ์ |
| Email Service | 8003 | SMTP relay |
| Notification Service | 8004 | Push notification และการแจ้งเตือน |
| Update Server | 8005 | การอัปเดต agent และ probe |
| Agent Registry | 8006 | การลงทะเบียนและจัดการ agent |
| Warranty Service | 8007 | การค้นหาการรับประกันฮาร์ดแวร์ |
| CMod Service | 8008 | การจัดการคอนฟิกูเรชัน |
| IPAM Service | 8009 | การจัดการ IP address |

หากต้องการเปิดเผยพอร์ตบริการโดยตรง (ไม่แนะนำสำหรับ production) ให้เพิ่มไปยังการแมป `ports` ของบริการใน `docker-compose.yml`

สำหรับความช่วยเหลือ ติดต่อ [support@netreconapp.com](mailto:support@netreconapp.com)
