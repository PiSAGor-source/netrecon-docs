---
sidebar_position: 2
title: Authentication
---

# Authentication

NetRecon supports two authentication methods: JWT bearer tokens and API keys. Both methods work across all endpoints.

## JWT Authentication

### Login

```
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@company.com",
  "password": "your-password",
  "totp_code": "123456"  // optional, required if 2FA enabled
}
```

Response:
```json
{
  "access_token": "eyJhbGciOi...",
  "refresh_token": "eyJhbGciOi...",
  "token_type": "bearer",
  "expires_in": 3600
}
```

### Using the Token

Include the token in the `Authorization` header:
```
Authorization: Bearer eyJhbGciOi...
```

### Refresh Token

Tokens expire after 1 hour. Use the refresh token to get a new access token:

```
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refresh_token": "eyJhbGciOi..."
}
```

## API Key Authentication

API keys are ideal for server-to-server integrations, CI/CD pipelines, and automation scripts.

### Creating an API Key

1. Go to **Settings > API Keys** in the dashboard
2. Click **Generate Key**
3. Set a name, permissions, and optional expiry
4. Copy the key immediately — it is shown only once

### Using an API Key

Include the key in the `X-API-Key` header:
```
X-API-Key: nr_live_a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6
```

### Key Format

All API keys follow the format: `nr_live_` followed by 48 hex characters.

### Permissions

Each API key has granular permission scopes:

| Permission | Description |
|---|---|
| `scans_read` | Read scan results |
| `scans_write` | Start/stop scans |
| `devices_read` | Read device list |
| `devices_write` | Modify devices |
| `alerts_read` | Read alerts |
| `alerts_write` | Manage alerts |
| `reports_read` | Read reports |
| `reports_write` | Generate reports |
| `users_manage` | Manage users |
| `billing` | Billing access |
| `cve_read` | Read CVE data |
| `ids_read` | Read IDS alerts |
| `backup_manage` | Manage backups |
| `api_keys_manage` | Manage API keys |

### Revoking Keys

Revoke a key at any time from **Settings > API Keys** or via the API:

```
DELETE /api/v1/api-keys/{key_id}
```

## OAuth2 (Enterprise)

Enterprise tenants can configure OAuth2/OIDC for SSO integration:

### Authorization Code Flow

```
GET /api/v1/auth/oauth2/authorize?
  client_id=YOUR_CLIENT_ID&
  redirect_uri=https://your-app.com/callback&
  response_type=code&
  scope=scans_read devices_read&
  state=random_state_string
```

### Token Exchange

```
POST /api/v1/auth/oauth2/token
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code&
code=AUTH_CODE&
client_id=YOUR_CLIENT_ID&
client_secret=YOUR_CLIENT_SECRET&
redirect_uri=https://your-app.com/callback
```

## Security Best Practices

1. **Rotate keys regularly** — set an expiry date on production keys
2. **Use least privilege** — only assign the permissions your integration needs
3. **Never commit keys** — use environment variables or secret managers
4. **Monitor usage** — check the "Last Used" column in the dashboard
5. **Enable 2FA** — required for accounts that manage API keys
