---
sidebar_position: 2
title: Authentification
---

# Authentification

NetRecon prend en charge deux méthodes d'authentification : les jetons JWT Bearer et les clés API. Les deux méthodes fonctionnent sur tous les points de terminaison.

## Authentification JWT

### Connexion

```
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@company.com",
  "password": "your-password",
  "totp_code": "123456"  // optionnel, requis si la 2FA est activée
}
```

Réponse :
```json
{
  "access_token": "eyJhbGciOi...",
  "refresh_token": "eyJhbGciOi...",
  "token_type": "bearer",
  "expires_in": 3600
}
```

### Utiliser le jeton

Incluez le jeton dans l'en-tête `Authorization` :
```
Authorization: Bearer eyJhbGciOi...
```

### Rafraîchir le jeton

Les jetons expirent après 1 heure. Utilisez le jeton de rafraîchissement pour obtenir un nouveau jeton d'accès :

```
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refresh_token": "eyJhbGciOi..."
}
```

## Authentification par clé API

Les clés API sont idéales pour les intégrations serveur à serveur, les pipelines CI/CD et les scripts d'automatisation.

### Créer une clé API

1. Accédez à **Settings > API Keys** dans le tableau de bord
2. Cliquez sur **Generate Key**
3. Définissez un nom, des permissions et une expiration optionnelle
4. Copiez la clé immédiatement — elle n'est affichée qu'une seule fois

### Utiliser une clé API

Incluez la clé dans l'en-tête `X-API-Key` :
```
X-API-Key: nr_live_a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6
```

### Format de clé

Toutes les clés API suivent le format : `nr_live_` suivi de 48 caractères hexadécimaux.

### Permissions

Chaque clé API possède des portées de permission granulaires :

| Permission | Description |
|---|---|
| `scans_read` | Lire les résultats de scan |
| `scans_write` | Démarrer/arrêter les scans |
| `devices_read` | Lire la liste des appareils |
| `devices_write` | Modifier les appareils |
| `alerts_read` | Lire les alertes |
| `alerts_write` | Gérer les alertes |
| `reports_read` | Lire les rapports |
| `reports_write` | Générer des rapports |
| `users_manage` | Gérer les utilisateurs |
| `billing` | Accès à la facturation |
| `cve_read` | Lire les données CVE |
| `ids_read` | Lire les alertes IDS |
| `backup_manage` | Gérer les sauvegardes |
| `api_keys_manage` | Gérer les clés API |

### Révoquer des clés

Révoquez une clé à tout moment depuis **Settings > API Keys** ou via l'API :

```
DELETE /api/v1/api-keys/{key_id}
```

## OAuth2 (Entreprise)

Les locataires entreprise peuvent configurer OAuth2/OIDC pour l'intégration SSO :

### Flux de code d'autorisation

```
GET /api/v1/auth/oauth2/authorize?
  client_id=YOUR_CLIENT_ID&
  redirect_uri=https://your-app.com/callback&
  response_type=code&
  scope=scans_read devices_read&
  state=random_state_string
```

### Échange de jeton

```
POST /api/v1/auth/oauth2/token
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code&
code=AUTH_CODE&
client_id=YOUR_CLIENT_ID&
client_secret=YOUR_CLIENT_SECRET&
redirect_uri=https://your-app.com/callback
```

## Bonnes pratiques de sécurité

1. **Rotation régulière des clés** — définissez une date d'expiration sur les clés de production
2. **Principe du moindre privilège** — n'assignez que les permissions nécessaires à votre intégration
3. **Ne jamais commiter les clés** — utilisez des variables d'environnement ou des gestionnaires de secrets
4. **Surveiller l'utilisation** — vérifiez la colonne « Last Used » dans le tableau de bord
5. **Activer la 2FA** — obligatoire pour les comptes qui gèrent les clés API
