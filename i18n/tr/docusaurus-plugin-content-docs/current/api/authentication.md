---
sidebar_position: 2
title: Kimlik Doğrulama
---

# Kimlik Doğrulama

NetRecon iki kimlik doğrulama yöntemini destekler: JWT bearer jetonları ve API anahtarları. Her iki yöntem de tüm uç noktalarda çalışır.

## JWT Kimlik Doğrulaması

### Giriş

```
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@company.com",
  "password": "your-password",
  "totp_code": "123456"  // isteğe bağlı, 2FA etkinse zorunlu
}
```

Yanıt:
```json
{
  "access_token": "eyJhbGciOi...",
  "refresh_token": "eyJhbGciOi...",
  "token_type": "bearer",
  "expires_in": 3600
}
```

### Jetonu Kullanma

Jetonu `Authorization` başlığına ekleyin:
```
Authorization: Bearer eyJhbGciOi...
```

### Jeton Yenileme

Jetonlar 1 saat sonra sona erer. Yeni bir erişim jetonu almak için yenileme jetonunu kullanın:

```
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refresh_token": "eyJhbGciOi..."
}
```

## API Anahtarı Kimlik Doğrulaması

API anahtarları; sunucular arası entegrasyonlar, CI/CD işlem hatları ve otomasyon betikleri için idealdir.

### API Anahtarı Oluşturma

1. Kontrol panelindeki **Ayarlar > API Anahtarları** bölümüne gidin
2. **Anahtar Oluştur**'a tıklayın
3. Bir ad, izinler ve isteğe bağlı son kullanma tarihi belirleyin
4. Anahtarı hemen kopyalayın — yalnızca bir kez gösterilir

### API Anahtarı Kullanma

Anahtarı `X-API-Key` başlığına ekleyin:
```
X-API-Key: nr_live_a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6
```

### Anahtar Formatı

Tüm API anahtarları şu formatı izler: `nr_live_` ardından 48 onaltılık karakter.

### İzinler

Her API anahtarının ayrıntılı izin kapsamları vardır:

| İzin | Açıklama |
|---|---|
| `scans_read` | Tarama sonuçlarını okuma |
| `scans_write` | Tarama başlatma/durdurma |
| `devices_read` | Cihaz listesini okuma |
| `devices_write` | Cihazları değiştirme |
| `alerts_read` | Uyarıları okuma |
| `alerts_write` | Uyarıları yönetme |
| `reports_read` | Raporları okuma |
| `reports_write` | Rapor oluşturma |
| `users_manage` | Kullanıcıları yönetme |
| `billing` | Faturalama erişimi |
| `cve_read` | CVE verilerini okuma |
| `ids_read` | IDS uyarılarını okuma |
| `backup_manage` | Yedeklemeleri yönetme |
| `api_keys_manage` | API anahtarlarını yönetme |

### Anahtarları İptal Etme

Bir anahtarı istediğiniz zaman **Ayarlar > API Anahtarları** bölümünden veya API aracılığıyla iptal edin:

```
DELETE /api/v1/api-keys/{key_id}
```

## OAuth2 (Kurumsal)

Kurumsal kiracılar SSO entegrasyonu için OAuth2/OIDC yapılandırabilir:

### Yetkilendirme Kodu Akışı

```
GET /api/v1/auth/oauth2/authorize?
  client_id=YOUR_CLIENT_ID&
  redirect_uri=https://your-app.com/callback&
  response_type=code&
  scope=scans_read devices_read&
  state=random_state_string
```

### Jeton Değişimi

```
POST /api/v1/auth/oauth2/token
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code&
code=AUTH_CODE&
client_id=YOUR_CLIENT_ID&
client_secret=YOUR_CLIENT_SECRET&
redirect_uri=https://your-app.com/callback
```

## Güvenlik En İyi Uygulamaları

1. **Anahtarları düzenli olarak yenileyin** — üretim anahtarlarına son kullanma tarihi belirleyin
2. **En az ayrıcalık ilkesini kullanın** — yalnızca entegrasyonunuzun ihtiyaç duyduğu izinleri atayın
3. **Anahtarları asla kaynak kontrolüne eklemeyin** — ortam değişkenleri veya gizli bilgi yöneticileri kullanın
4. **Kullanımı izleyin** — kontrol panelindeki "Son Kullanım" sütununu kontrol edin
5. **2FA'yı etkinleştirin** — API anahtarlarını yöneten hesaplar için zorunlu
