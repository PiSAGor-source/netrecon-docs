---
sidebar_position: 2
title: Autentimine
---

# Autentimine

NetRecon toetab kahte autentimismeetodit: JWT kandjatõendid ja API võtmed. Mõlemad meetodid töötavad kõigi lõpp-punktide jaoks.

## JWT autentimine

### Sisselogimine

```
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@company.com",
  "password": "your-password",
  "totp_code": "123456"  // optional, required if 2FA enabled
}
```

Vastus:
```json
{
  "access_token": "eyJhbGciOi...",
  "refresh_token": "eyJhbGciOi...",
  "token_type": "bearer",
  "expires_in": 3600
}
```

### Tõendi kasutamine

Lisage tõend `Authorization` päisesse:
```
Authorization: Bearer eyJhbGciOi...
```

### Värskendamistõend

Tõendid aeguvad 1 tunni pärast. Kasutage uue juurdepääsutõendi saamiseks värskendamistõendit:

```
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refresh_token": "eyJhbGciOi..."
}
```

## API võtme autentimine

API võtmed on ideaalsed serverilt-serverile integratsioonide, CI/CD torustike ja automatiseerimisskriptide jaoks.

### API võtme loomine

1. Minge juhtpaneelil **Seaded > API võtmed**
2. Klõpsake **Genereeri võti**
3. Seadistage nimi, õigused ja valikuline aegumine
4. Kopeerige võti kohe — seda näidatakse ainult üks kord

### API võtme kasutamine

Lisage võti `X-API-Key` päisesse:
```
X-API-Key: nr_live_a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6
```

### Võtme vorming

Kõik API võtmed järgivad vormingut: `nr_live_`, millele järgneb 48 kuueteistkümnendsüsteemi märki.

### Õigused

Igal API võtmel on detailsed õiguste ulatused:

| Õigus | Kirjeldus |
|---|---|
| `scans_read` | Loe skannimistulemusi |
| `scans_write` | Käivita/peata skannimisi |
| `devices_read` | Loe seadmete loendit |
| `devices_write` | Muuda seadmeid |
| `alerts_read` | Loe hoiatusi |
| `alerts_write` | Halda hoiatusi |
| `reports_read` | Loe aruandeid |
| `reports_write` | Genereeri aruandeid |
| `users_manage` | Halda kasutajaid |
| `billing` | Arveldusjuurdepääs |
| `cve_read` | Loe CVE andmeid |
| `ids_read` | Loe IDS hoiatusi |
| `backup_manage` | Halda varundusi |
| `api_keys_manage` | Halda API võtmeid |

### Võtmete tühistamine

Tühistage võti igal ajal menüüst **Seaded > API võtmed** või API kaudu:

```
DELETE /api/v1/api-keys/{key_id}
```

## OAuth2 (ettevõte)

Ettevõtte üürnikud saavad konfigureerida OAuth2/OIDC SSO integratsiooni jaoks:

### Autoriseerimiskoodi voog

```
GET /api/v1/auth/oauth2/authorize?
  client_id=YOUR_CLIENT_ID&
  redirect_uri=https://your-app.com/callback&
  response_type=code&
  scope=scans_read devices_read&
  state=random_state_string
```

### Tõendivahetus

```
POST /api/v1/auth/oauth2/token
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code&
code=AUTH_CODE&
client_id=YOUR_CLIENT_ID&
client_secret=YOUR_CLIENT_SECRET&
redirect_uri=https://your-app.com/callback
```

## Turvalisuse parimad tavad

1. **Roteerige võtmeid regulaarselt** — seadistage tootmisvõtmetele aegumiskuupäev
2. **Kasutage minimaalseid õigusi** — määrake ainult õigused, mida teie integratsioon vajab
3. **Ärge kunagi lisage võtmeid versioonihaldusse** — kasutage keskkonnamuutujaid või saladuste haldureid
4. **Jälgige kasutust** — kontrollige juhtpaneelil veergu "Viimati kasutatud"
5. **Lubage 2FA** — nõutav kontodele, mis haldavad API võtmeid
