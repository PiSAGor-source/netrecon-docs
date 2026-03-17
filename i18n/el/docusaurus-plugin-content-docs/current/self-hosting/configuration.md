---
sidebar_position: 3
title: Παραμετροποίηση
description: Μεταβλητές περιβάλλοντος και αναφορά παραμετροποίησης για αυτο-φιλοξενούμενο NetRecon
---

# Αναφορά Παραμετροποίησης

Όλες οι υπηρεσίες του NetRecon παραμετροποιούνται μέσω ενός ενιαίου αρχείου `.env` που βρίσκεται στο `/opt/netrecon/.env`. Αυτή η σελίδα τεκμηριώνει κάθε διαθέσιμη μεταβλητή περιβάλλοντος.

## Βασικές Ρυθμίσεις

| Μεταβλητή | Απαιτείται | Προεπιλογή | Περιγραφή |
|---|---|---|---|
| `NETRECON_DOMAIN` | Ναι | — | Το domain name σας (π.χ. `netrecon.yourcompany.com`) |
| `NETRECON_EMAIL` | Ναι | — | Email διαχειριστή για Let's Encrypt και ειδοποιήσεις |

## Βάση Δεδομένων (PostgreSQL)

| Μεταβλητή | Απαιτείται | Προεπιλογή | Περιγραφή |
|---|---|---|---|
| `POSTGRES_USER` | Ναι | — | Όνομα χρήστη PostgreSQL |
| `POSTGRES_PASSWORD` | Ναι | — | Κωδικός PostgreSQL |
| `POSTGRES_DB` | Ναι | `netrecon` | Όνομα βάσης δεδομένων |
| `DATABASE_URL` | Αυτόματο | — | Κατασκευάζεται αυτόματα από τις παραπάνω τιμές |

:::tip
Χρησιμοποιήστε ισχυρό, τυχαία δημιουργημένο κωδικό. Δημιουργήστε έναν με:
```bash
openssl rand -base64 24
```
:::

## Προσωρινή Μνήμη (Redis)

| Μεταβλητή | Απαιτείται | Προεπιλογή | Περιγραφή |
|---|---|---|---|
| `REDIS_PASSWORD` | Ναι | — | Κωδικός αυθεντικοποίησης Redis |
| `REDIS_URL` | Αυτόματο | — | Κατασκευάζεται αυτόματα |

## Αυθεντικοποίηση

| Μεταβλητή | Απαιτείται | Προεπιλογή | Περιγραφή |
|---|---|---|---|
| `JWT_SECRET` | Ναι | — | Μυστικό κλειδί για υπογραφή JWT tokens (ελάχ. 32 χαρακτήρες) |
| `JWT_EXPIRE_MINUTES` | Όχι | `1440` | Χρόνος λήξης token (προεπιλογή: 24 ώρες) |

Δημιουργήστε ένα ασφαλές μυστικό JWT:
```bash
openssl rand -hex 32
```

## Μητρώο Agents

| Μεταβλητή | Απαιτείται | Προεπιλογή | Περιγραφή |
|---|---|---|---|
| `AGENT_REGISTRY_SECRET` | Ναι | — | Μυστικό για εγγραφή agents |
| `AGENT_JWT_SECRET` | Ναι | — | Μυστικό JWT για αυθεντικοποίηση agents |
| `AGENT_TOKEN_EXPIRE_MINUTES` | Όχι | `1440` | Λήξη token agent |
| `AGENT_HEARTBEAT_INTERVAL` | Όχι | `30` | Διάστημα heartbeat σε δευτερόλεπτα |
| `AGENT_HEARTBEAT_TIMEOUT` | Όχι | `90` | Δευτερόλεπτα πριν τη σήμανση agent ως εκτός σύνδεσης |

## Email (SMTP)

| Μεταβλητή | Απαιτείται | Προεπιλογή | Περιγραφή |
|---|---|---|---|
| `SMTP_HOST` | Ναι | — | Hostname διακομιστή SMTP |
| `SMTP_PORT` | Όχι | `587` | Θύρα SMTP (587 για STARTTLS, 465 για SSL) |
| `SMTP_USER` | Ναι | — | Όνομα χρήστη SMTP |
| `SMTP_PASSWORD` | Ναι | — | Κωδικός SMTP |
| `SMTP_FROM` | Ναι | — | Διεύθυνση αποστολέα (π.χ. `NetRecon <noreply@yourcompany.com>`) |

## Άδεια

| Μεταβλητή | Απαιτείται | Προεπιλογή | Περιγραφή |
|---|---|---|---|
| `LICENSE_KEY` | Ναι | — | Το κλειδί αδείας NetRecon σας |

Επικοινωνήστε με [sales@netreconapp.com](mailto:sales@netreconapp.com) για να αποκτήσετε κλειδί αδείας.

## Υπηρεσία Αντιγράφων Ασφαλείας

| Μεταβλητή | Απαιτείται | Προεπιλογή | Περιγραφή |
|---|---|---|---|
| `BACKUP_S3_ENDPOINT` | Όχι | — | Endpoint αποθήκευσης συμβατό με S3 |
| `BACKUP_S3_BUCKET` | Όχι | — | Όνομα bucket για αντίγραφα ασφαλείας |
| `BACKUP_S3_ACCESS_KEY` | Όχι | — | Κλειδί πρόσβασης S3 |
| `BACKUP_S3_SECRET_KEY` | Όχι | — | Μυστικό κλειδί S3 |
| `BACKUP_ENCRYPTION_KEY` | Όχι | — | Κλειδί κρυπτογράφησης AES-256-GCM για αντίγραφα ασφαλείας |
| `BACKUP_RETENTION_DAYS` | Όχι | `30` | Ημέρες διατήρησης αρχείων αντιγράφων ασφαλείας |

## Ειδοποιήσεις

| Μεταβλητή | Απαιτείται | Προεπιλογή | Περιγραφή |
|---|---|---|---|
| `TELEGRAM_BOT_TOKEN` | Όχι | — | Token bot Telegram για ειδοποιήσεις |
| `TELEGRAM_CHAT_ID` | Όχι | — | ID συνομιλίας Telegram για παράδοση ειδοποιήσεων |

## Παράδειγμα Αρχείου `.env`

```bash
# Βασικά
NETRECON_DOMAIN=netrecon.yourcompany.com
NETRECON_EMAIL=admin@yourcompany.com

# PostgreSQL
POSTGRES_USER=netrecon
POSTGRES_PASSWORD=xK9mP2vL8nQ4wR7j
POSTGRES_DB=netrecon

# Redis
REDIS_PASSWORD=hT6yN3bF9cM1pW5s

# Αυθεντικοποίηση
JWT_SECRET=a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2

# Μητρώο Agents
AGENT_REGISTRY_SECRET=r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3
AGENT_JWT_SECRET=h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9

# Email
SMTP_HOST=smtp.yourcompany.com
SMTP_PORT=587
SMTP_USER=noreply@yourcompany.com
SMTP_PASSWORD=your-smtp-password
SMTP_FROM=NetRecon <noreply@yourcompany.com>

# Άδεια
LICENSE_KEY=your-license-key
```

:::warning
Μην υποβάλλετε ποτέ το αρχείο `.env` σε σύστημα ελέγχου εκδόσεων. Όλες οι τιμές που εμφανίζονται παραπάνω είναι παραδείγματα — αντικαταστήστε τις με τις δικές σας ασφαλείς τιμές πριν την ανάπτυξη.
:::

## Εφαρμογή Αλλαγών Παραμετροποίησης

Μετά την τροποποίηση του αρχείου `.env`, επανεκκινήστε τις επηρεαζόμενες υπηρεσίες:

```bash
cd /opt/netrecon

# Επανεκκίνηση όλων των υπηρεσιών
docker compose down && docker compose up -d

# Ή επανεκκίνηση συγκεκριμένης υπηρεσίας
docker compose restart api-gateway
```

## Θύρες Υπηρεσιών

Όλες οι υπηρεσίες εκτελούνται πίσω από τον reverse proxy Nginx στις θύρες 80/443. Οι εσωτερικές θύρες υπηρεσιών δεν εκτίθενται από προεπιλογή:

| Υπηρεσία | Εσωτερική Θύρα | Περιγραφή |
|---|---|---|
| API Gateway | 8000 | Κύριο endpoint API |
| Vault Server | 8001 | Διαχείριση μυστικών |
| License Server | 8002 | Επικύρωση αδειών |
| Email Service | 8003 | Αναμετάδοση SMTP |
| Notification Service | 8004 | Push ειδοποιήσεις και ενημερώσεις |
| Update Server | 8005 | Ενημερώσεις agents και αισθητήρων |
| Agent Registry | 8006 | Εγγραφή και διαχείριση agents |
| Warranty Service | 8007 | Αναζητήσεις εγγύησης hardware |
| CMod Service | 8008 | Διαχείριση παραμετροποίησης |
| IPAM Service | 8009 | Διαχείριση διευθύνσεων IP |

Για να εκθέσετε μια θύρα υπηρεσίας απευθείας (δεν συνιστάται για παραγωγή), προσθέστε τη στην αντιστοίχιση `ports` της υπηρεσίας στο `docker-compose.yml`.

Για βοήθεια, επικοινωνήστε με [support@netreconapp.com](mailto:support@netreconapp.com).
