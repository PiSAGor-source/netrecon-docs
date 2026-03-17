---
sidebar_position: 3
title: कॉन्फ़िगरेशन
description: सेल्फ-होस्टेड NetRecon के लिए एनवायरनमेंट वेरिएबल और कॉन्फ़िगरेशन संदर्भ
---

# कॉन्फ़िगरेशन संदर्भ

सभी NetRecon सर्विसेज़ `/opt/netrecon/.env` पर स्थित एक एकल `.env` फ़ाइल के माध्यम से कॉन्फ़िगर की जाती हैं। यह पेज प्रत्येक उपलब्ध एनवायरनमेंट वेरिएबल का दस्तावेज़ीकरण करता है।

## मुख्य सेटिंग्स

| वेरिएबल | आवश्यक | डिफ़ॉल्ट | विवरण |
|---|---|---|---|
| `NETRECON_DOMAIN` | हाँ | — | आपका डोमेन नाम (उदा., `netrecon.yourcompany.com`) |
| `NETRECON_EMAIL` | हाँ | — | Let's Encrypt और सूचनाओं के लिए एडमिन ईमेल |

## डेटाबेस (PostgreSQL)

| वेरिएबल | आवश्यक | डिफ़ॉल्ट | विवरण |
|---|---|---|---|
| `POSTGRES_USER` | हाँ | — | PostgreSQL यूज़रनेम |
| `POSTGRES_PASSWORD` | हाँ | — | PostgreSQL पासवर्ड |
| `POSTGRES_DB` | हाँ | `netrecon` | डेटाबेस नाम |
| `DATABASE_URL` | स्वतः | — | उपरोक्त मानों से स्वचालित रूप से बनाया जाता है |

:::tip
एक मजबूत, रैंडम रूप से जनरेट किया गया पासवर्ड उपयोग करें। इससे जनरेट करें:
```bash
openssl rand -base64 24
```
:::

## कैश (Redis)

| वेरिएबल | आवश्यक | डिफ़ॉल्ट | विवरण |
|---|---|---|---|
| `REDIS_PASSWORD` | हाँ | — | Redis प्रमाणीकरण पासवर्ड |
| `REDIS_URL` | स्वतः | — | स्वचालित रूप से बनाया जाता है |

## प्रमाणीकरण

| वेरिएबल | आवश्यक | डिफ़ॉल्ट | विवरण |
|---|---|---|---|
| `JWT_SECRET` | हाँ | — | JWT टोकन साइन करने के लिए सीक्रेट कुंजी (न्यूनतम 32 अक्षर) |
| `JWT_EXPIRE_MINUTES` | नहीं | `1440` | टोकन समाप्ति समय (डिफ़ॉल्ट: 24 घंटे) |

सुरक्षित JWT सीक्रेट जनरेट करें:
```bash
openssl rand -hex 32
```

## Agent Registry

| वेरिएबल | आवश्यक | डिफ़ॉल्ट | विवरण |
|---|---|---|---|
| `AGENT_REGISTRY_SECRET` | हाँ | — | एजेंट एनरोलमेंट के लिए सीक्रेट |
| `AGENT_JWT_SECRET` | हाँ | — | एजेंट प्रमाणीकरण के लिए JWT सीक्रेट |
| `AGENT_TOKEN_EXPIRE_MINUTES` | नहीं | `1440` | एजेंट टोकन समाप्ति |
| `AGENT_HEARTBEAT_INTERVAL` | नहीं | `30` | हार्टबीट अंतराल सेकंड में |
| `AGENT_HEARTBEAT_TIMEOUT` | नहीं | `90` | एजेंट को ऑफ़लाइन चिह्नित करने से पहले सेकंड |

## ईमेल (SMTP)

| वेरिएबल | आवश्यक | डिफ़ॉल्ट | विवरण |
|---|---|---|---|
| `SMTP_HOST` | हाँ | — | SMTP सर्वर होस्टनेम |
| `SMTP_PORT` | नहीं | `587` | SMTP पोर्ट (STARTTLS के लिए 587, SSL के लिए 465) |
| `SMTP_USER` | हाँ | — | SMTP यूज़रनेम |
| `SMTP_PASSWORD` | हाँ | — | SMTP पासवर्ड |
| `SMTP_FROM` | हाँ | — | प्रेषक पता (उदा., `NetRecon <noreply@yourcompany.com>`) |

## लाइसेंस

| वेरिएबल | आवश्यक | डिफ़ॉल्ट | विवरण |
|---|---|---|---|
| `LICENSE_KEY` | हाँ | — | आपकी NetRecon लाइसेंस कुंजी |

लाइसेंस कुंजी प्राप्त करने के लिए [sales@netreconapp.com](mailto:sales@netreconapp.com) से संपर्क करें।

## बैकअप सर्विस

| वेरिएबल | आवश्यक | डिफ़ॉल्ट | विवरण |
|---|---|---|---|
| `BACKUP_S3_ENDPOINT` | नहीं | — | S3-संगत स्टोरेज एंडपॉइंट |
| `BACKUP_S3_BUCKET` | नहीं | — | बैकअप के लिए बकेट नाम |
| `BACKUP_S3_ACCESS_KEY` | नहीं | — | S3 एक्सेस कुंजी |
| `BACKUP_S3_SECRET_KEY` | नहीं | — | S3 सीक्रेट कुंजी |
| `BACKUP_ENCRYPTION_KEY` | नहीं | — | बैकअप के लिए AES-256-GCM एन्क्रिप्शन कुंजी |
| `BACKUP_RETENTION_DAYS` | नहीं | `30` | बैकअप फ़ाइलें रखने के दिन |

## सूचनाएँ

| वेरिएबल | आवश्यक | डिफ़ॉल्ट | विवरण |
|---|---|---|---|
| `TELEGRAM_BOT_TOKEN` | नहीं | — | अलर्ट के लिए Telegram बॉट टोकन |
| `TELEGRAM_CHAT_ID` | नहीं | — | अलर्ट डिलीवरी के लिए Telegram चैट ID |

## उदाहरण `.env` फ़ाइल

```bash
# मुख्य
NETRECON_DOMAIN=netrecon.yourcompany.com
NETRECON_EMAIL=admin@yourcompany.com

# PostgreSQL
POSTGRES_USER=netrecon
POSTGRES_PASSWORD=xK9mP2vL8nQ4wR7j
POSTGRES_DB=netrecon

# Redis
REDIS_PASSWORD=hT6yN3bF9cM1pW5s

# प्रमाणीकरण
JWT_SECRET=a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2

# Agent Registry
AGENT_REGISTRY_SECRET=r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3
AGENT_JWT_SECRET=h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9

# ईमेल
SMTP_HOST=smtp.yourcompany.com
SMTP_PORT=587
SMTP_USER=noreply@yourcompany.com
SMTP_PASSWORD=your-smtp-password
SMTP_FROM=NetRecon <noreply@yourcompany.com>

# लाइसेंस
LICENSE_KEY=your-license-key
```

:::warning
`.env` फ़ाइल को कभी भी वर्ज़न कंट्रोल में कमिट न करें। ऊपर दिखाए गए सभी मान उदाहरण हैं — डिप्लॉय करने से पहले उन्हें अपने सुरक्षित मानों से बदलें।
:::

## कॉन्फ़िगरेशन परिवर्तन लागू करना

`.env` फ़ाइल को संशोधित करने के बाद, प्रभावित सर्विसेज़ रीस्टार्ट करें:

```bash
cd /opt/netrecon

# सभी सर्विसेज़ रीस्टार्ट करें
docker compose down && docker compose up -d

# या किसी विशिष्ट सर्विस को रीस्टार्ट करें
docker compose restart api-gateway
```

## सर्विस पोर्ट

सभी सर्विसेज़ पोर्ट 80/443 पर Nginx रिवर्स प्रॉक्सी के पीछे चलती हैं। आंतरिक सर्विस पोर्ट डिफ़ॉल्ट रूप से एक्सपोज़ नहीं होते:

| सर्विस | आंतरिक पोर्ट | विवरण |
|---|---|---|
| API Gateway | 8000 | मुख्य API एंडपॉइंट |
| Vault Server | 8001 | सीक्रेट्स प्रबंधन |
| License Server | 8002 | लाइसेंस सत्यापन |
| Email Service | 8003 | SMTP रिले |
| Notification Service | 8004 | पुश नोटिफ़िकेशन और अलर्ट |
| Update Server | 8005 | एजेंट और प्रोब अपडेट |
| Agent Registry | 8006 | एजेंट एनरोलमेंट और प्रबंधन |
| Warranty Service | 8007 | हार्डवेयर वारंटी लुकअप |
| CMod Service | 8008 | कॉन्फ़िगरेशन प्रबंधन |
| IPAM Service | 8009 | IP एड्रेस प्रबंधन |

सर्विस पोर्ट को सीधे एक्सपोज़ करने के लिए (प्रोडक्शन के लिए अनुशंसित नहीं), `docker-compose.yml` में सर्विस की `ports` मैपिंग में जोड़ें।

सहायता के लिए, [support@netreconapp.com](mailto:support@netreconapp.com) से संपर्क करें।
