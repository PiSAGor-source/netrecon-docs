---
sidebar_position: 4
title: Appareils
---

# API des appareils

Gérer les appareils réseau découverts, leurs propriétés et leurs relations.

## Lister les appareils

```
GET /api/v1/devices?page=1&per_page=25
```

### Paramètres de requête

| Paramètre | Type | Description |
|---|---|---|
| `site_id` | string | Filtrer par site |
| `is_online` | boolean | Filtrer par statut en ligne |
| `vendor` | string | Filtrer par nom de fabricant |
| `os` | string | Filtrer par OS |
| `search` | string | Rechercher par nom d'hôte, IP ou MAC |
| `sort` | string | Trier par : `ip`, `hostname`, `last_seen`, `vendor` |

Réponse :
```json
{
  "data": [
    {
      "id": "device-uuid",
      "ip": "192.168.1.10",
      "mac": "AA:BB:CC:DD:EE:FF",
      "hostname": "workstation-01",
      "vendor": "Dell Inc.",
      "os_guess": "Windows 11",
      "device_type": "workstation",
      "is_online": true,
      "first_seen": "2026-01-15T08:30:00Z",
      "last_seen": "2026-03-15T10:30:00Z",
      "site_id": "site-uuid",
      "open_ports": [22, 80, 443, 3389],
      "tags": ["production", "finance-dept"]
    }
  ],
  "meta": {"page": 1, "per_page": 25, "total": 142}
}
```

## Obtenir les détails d'un appareil

```
GET /api/v1/devices/{device_id}
```

Renvoie le profil complet de l'appareil incluant les détails des ports, les services, les correspondances CVE et l'historique.

## Créer un appareil (manuel)

```
POST /api/v1/devices
Content-Type: application/json

{
  "ip": "10.0.0.50",
  "mac": "11:22:33:44:55:66",
  "hostname": "server-db-01",
  "device_type": "server",
  "site_id": "site-uuid",
  "tags": ["database", "production"]
}
```

## Mettre à jour un appareil

```
PUT /api/v1/devices/{device_id}
Content-Type: application/json

{
  "hostname": "server-db-01-renamed",
  "tags": ["database", "production", "critical"]
}
```

## Supprimer un appareil

```
DELETE /api/v1/devices/{device_id}
```

## Obtenir les ports d'un appareil

```
GET /api/v1/devices/{device_id}/ports
```

Réponse :
```json
{
  "data": [
    {
      "port": 443,
      "protocol": "tcp",
      "state": "open",
      "service": "HTTPS",
      "version": "nginx/1.24.0",
      "banner": "Server: nginx/1.24.0",
      "last_scanned": "2026-03-15T10:30:00Z"
    }
  ]
}
```

## Types d'appareils

| Type | Description |
|---|---|
| `workstation` | Poste de travail/ordinateur portable |
| `server` | Serveur |
| `router` | Routeur |
| `switch` | Commutateur réseau |
| `firewall` | Pare-feu |
| `printer` | Imprimante |
| `camera` | Caméra IP |
| `phone` | Téléphone VoIP |
| `iot` | Appareil IoT |
| `access_point` | Point d'accès sans fil |
| `unknown` | Non classifié |
