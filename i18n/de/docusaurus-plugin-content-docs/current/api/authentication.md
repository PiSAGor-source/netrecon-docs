---
sidebar_position: 2
title: Authentifizierung
---

# Authentifizierung

NetRecon unterstützt zwei Authentifizierungsmethoden: JWT Bearer-Tokens und API-Schlüssel. Beide Methoden funktionieren über alle Endpunkte hinweg.

## JWT-Authentifizierung

### Anmeldung

```
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@company.com",
  "password": "your-password",
  "totp_code": "123456"  // optional, erforderlich wenn 2FA aktiviert
}
```

Antwort:
```json
{
  "access_token": "eyJhbGciOi...",
  "refresh_token": "eyJhbGciOi...",
  "token_type": "bearer",
  "expires_in": 3600
}
```

### Token verwenden

Fügen Sie den Token im `Authorization`-Header ein:
```
Authorization: Bearer eyJhbGciOi...
```

### Refresh-Token

Tokens laufen nach 1 Stunde ab. Verwenden Sie den Refresh-Token, um einen neuen Access-Token zu erhalten:

```
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refresh_token": "eyJhbGciOi..."
}
```

## API-Schlüssel-Authentifizierung

API-Schlüssel sind ideal für Server-zu-Server-Integrationen, CI/CD-Pipelines und Automatisierungsskripte.

### API-Schlüssel erstellen

1. Gehen Sie im Dashboard zu **Einstellungen > API-Schlüssel**
2. Klicken Sie auf **Schlüssel generieren**
3. Legen Sie einen Namen, Berechtigungen und optionales Ablaufdatum fest
4. Kopieren Sie den Schlüssel sofort — er wird nur einmal angezeigt

### API-Schlüssel verwenden

Fügen Sie den Schlüssel im `X-API-Key`-Header ein:
```
X-API-Key: nr_live_a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6
```

### Schlüsselformat

Alle API-Schlüssel folgen dem Format: `nr_live_` gefolgt von 48 Hex-Zeichen.

### Berechtigungen

Jeder API-Schlüssel hat granulare Berechtigungsbereiche:

| Berechtigung | Beschreibung |
|---|---|
| `scans_read` | Scanergebnisse lesen |
| `scans_write` | Scans starten/stoppen |
| `devices_read` | Geräteliste lesen |
| `devices_write` | Geräte ändern |
| `alerts_read` | Warnungen lesen |
| `alerts_write` | Warnungen verwalten |
| `reports_read` | Berichte lesen |
| `reports_write` | Berichte erstellen |
| `users_manage` | Benutzer verwalten |
| `billing` | Abrechnungszugriff |
| `cve_read` | CVE-Daten lesen |
| `ids_read` | IDS-Warnungen lesen |
| `backup_manage` | Backups verwalten |
| `api_keys_manage` | API-Schlüssel verwalten |

### Schlüssel widerrufen

Widerrufen Sie einen Schlüssel jederzeit unter **Einstellungen > API-Schlüssel** oder über die API:

```
DELETE /api/v1/api-keys/{key_id}
```

## OAuth2 (Enterprise)

Enterprise-Mandanten können OAuth2/OIDC für SSO-Integration konfigurieren:

### Authorization Code Flow

```
GET /api/v1/auth/oauth2/authorize?
  client_id=YOUR_CLIENT_ID&
  redirect_uri=https://your-app.com/callback&
  response_type=code&
  scope=scans_read devices_read&
  state=random_state_string
```

### Token-Austausch

```
POST /api/v1/auth/oauth2/token
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code&
code=AUTH_CODE&
client_id=YOUR_CLIENT_ID&
client_secret=YOUR_CLIENT_SECRET&
redirect_uri=https://your-app.com/callback
```

## Bewährte Sicherheitspraktiken

1. **Schlüssel regelmäßig rotieren** — setzen Sie ein Ablaufdatum für Produktionsschlüssel
2. **Minimale Rechte verwenden** — weisen Sie nur die Berechtigungen zu, die Ihre Integration benötigt
3. **Schlüssel nie committen** — verwenden Sie Umgebungsvariablen oder Secret Manager
4. **Nutzung überwachen** — prüfen Sie die Spalte „Zuletzt verwendet" im Dashboard
5. **2FA aktivieren** — erforderlich für Konten, die API-Schlüssel verwalten
