---
sidebar_position: 1
title: Prezentare generală auto-găzduire
description: Rulați platforma NetRecon pe propria infrastructură
---

# Auto-găzduire

NetRecon poate fi găzduit complet pe propria infrastructură, oferindu-vă control total asupra datelor, securității și implementării.

## De ce auto-găzduire?

| Beneficiu | Descriere |
|---|---|
| **Suveranitatea datelor** | Toate rezultatele scanărilor, configurațiile și jurnalele rămân pe serverele dvs. |
| **Conformitate** | Respectarea cerințelor de reglementare care impun stocarea datelor la fața locului |
| **Izolare de rețea** | Funcționare în medii izolate fără dependență de internet |
| **Integrare personalizată** | Acces direct la baza de date pentru raportare și integrare personalizată |
| **Control al costurilor** | Fără licențiere per sondă pentru infrastructura server |

## Arhitectură

O implementare auto-găzduită NetRecon constă din mai multe microservicii care rulează în containere Docker:

```
┌────────────────────────────────────────────────────────┐
│                    Gazdă Docker                        │
│                                                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐│
│  │ API Gateway  │  │ Vault Server │  │  License     ││
│  │   :8000      │  │   :8001      │  │  Server :8002││
│  └──────────────┘  └──────────────┘  └──────────────┘│
│                                                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐│
│  │ Email        │  │ Notification │  │  Update      ││
│  │ Service :8003│  │ Service :8004│  │  Server :8005││
│  └──────────────┘  └──────────────┘  └──────────────┘│
│                                                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐│
│  │ Agent        │  │ Warranty     │  │  CMod        ││
│  │ Registry:8006│  │ Service :8007│  │  Service:8008││
│  └──────────────┘  └──────────────┘  └──────────────┘│
│                                                        │
│  ┌──────────────┐  ┌──────────────┐                   │
│  │ IPAM         │  │ PostgreSQL   │                   │
│  │ Service :8009│  │   :5432      │                   │
│  └──────────────┘  └──────────────┘                   │
│                                                        │
│  ┌──────────────┐  ┌──────────────┐                   │
│  │ Redis        │  │ Nginx        │                   │
│  │   :6379      │  │ Proxy invers │                   │
│  └──────────────┘  └──────────────┘                   │
└────────────────────────────────────────────────────────┘
```

## Prezentare generală servicii

| Serviciu | Port | Scop |
|---|---|---|
| API Gateway | 8000 | Rutare centrală API, autentificare |
| Vault Server | 8001 | Gestionare secrete, stocare credențiale |
| License Server | 8002 | Validare și gestionare licențe |
| Email Service | 8003 | Notificări și alerte prin email |
| Notification Service | 8004 | Notificări push, webhook-uri |
| Update Server | 8005 | Distribuire actualizări sonde și agenți |
| Agent Registry | 8006 | Înrolare și gestionare agenți |
| Warranty Service | 8007 | Urmărirea garanțiilor hardware |
| CMod Service | 8008 | Managementul configurării dispozitivelor de rețea |
| IPAM Service | 8009 | Managementul adreselor IP |

## Opțiuni de implementare

### Docker Compose (Recomandat)

Cel mai simplu mod de a implementa toate serviciile. Potrivit pentru implementări de dimensiuni mici și medii.

Consultați [Ghidul de instalare](./installation.md) pentru instrucțiuni pas cu pas.

### Kubernetes

Pentru implementări la scară largă care necesită disponibilitate ridicată și scalare orizontală. Sunt disponibile chart-uri Helm pentru fiecare serviciu.

### Binar unic

Pentru implementări minimale, un binar unic include toate serviciile. Potrivit pentru testare sau medii foarte mici.

## Cerințe de sistem

| Cerință | Minim | Recomandat |
|---|---|---|
| SO | Ubuntu 22.04 / Debian 12 | Ubuntu 24.04 LTS |
| CPU | 2 nuclee | 4+ nuclee |
| RAM | 4 GB | 8 GB |
| Disc | 40 GB | 100 GB SSD |
| Docker | v24.0+ | Ultima versiune stabilă |
| Docker Compose | v2.20+ | Ultima versiune stabilă |

## Rețea

| Port | Protocol | Scop |
|---|---|---|
| 443 | HTTPS | Tablou de bord web și API (prin proxy invers) |
| 80 | HTTP | Redirecționare către HTTPS |
| 5432 | TCP | PostgreSQL (intern, neexpus) |
| 6379 | TCP | Redis (intern, neexpus) |

Doar porturile 80 și 443 trebuie expuse extern. Toate porturile interne ale serviciilor sunt accesibile doar în rețeaua Docker.

## Stocare date

| Date | Stocare | Backup |
|---|---|---|
| Baza de date PostgreSQL | Volum Docker | pg_dump zilnic |
| Fișiere de configurare | Montare bind | Backup fișiere |
| Fișiere încărcate | Volum Docker | Backup fișiere |
| Jurnale | Volum Docker | Rotație jurnale |
| Certificate TLS | Montare bind | Backup securizat |

## Securitate

Implementările auto-găzduite includ toate funcționalitățile de securitate:

- Criptare TLS pentru toată comunicarea externă
- Autentificare bazată pe JWT
- Control al accesului bazat pe roluri
- Jurnalizare de audit
- Verificare integritate Steel Shield (consultați [Steel Shield](./steel-shield.md))

## Întrebări frecvente

**Î: Pot rula auto-găzduit fără Docker?**
R: Docker Compose este metoda de implementare recomandată și suportată. Rularea serviciilor direct pe gazdă este posibilă, dar nu este suportată oficial.

**Î: Cum se conectează sondele la un server auto-găzduit?**
R: Configurați sondele să indice către URL-ul serverului dvs. în loc de endpoint-ul implicit Cloudflare Tunnel. Actualizați `server_url` în configurația sondei.

**Î: Este inclus un tablou de bord web?**
R: Da. API Gateway servește tabloul de bord web la URL-ul rădăcină. Accesați-l prin domeniul configurat (de ex., `https://netrecon.yourcompany.com`).

**Î: Pot rula într-un mediu izolat de internet?**
R: Da. Descărcați în prealabil imaginile Docker și transferați-le pe serverul izolat. Validarea licenței poate fi configurată pentru mod offline.

Pentru ajutor suplimentar, contactați [support@netreconapp.com](mailto:support@netreconapp.com).
