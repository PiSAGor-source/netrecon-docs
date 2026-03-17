---
sidebar_position: 1
title: Přehled self-hostingu
description: Provozujte platformu NetRecon na vlastní infrastruktuře
---

# Self-Hosting

NetRecon lze plně provozovat na vlastní infrastruktuře, což vám dává úplnou kontrolu nad vašimi daty, zabezpečením a nasazením.

## Proč self-hosting?

| Výhoda | Popis |
|---|---|
| **Datová suverenita** | Všechny výsledky skenování, konfigurace a logy zůstávají na vašich serverech |
| **Compliance** | Splnění regulačních požadavků vyžadujících lokální ukládání dat |
| **Izolace sítě** | Provoz v izolovaných prostředích bez závislosti na internetu |
| **Vlastní integrace** | Přímý přístup k databázi pro vlastní reporting a integraci |
| **Kontrola nákladů** | Žádné licencování za sondu pro serverovou infrastrukturu |

## Architektura

Self-hosted nasazení NetRecon sestává z několika mikroslužeb běžících v Docker kontejnerech:

```
┌────────────────────────────────────────────────────────┐
│                    Docker Host                         │
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
│  │   :6379      │  │ Reverse Proxy│                   │
│  └──────────────┘  └──────────────┘                   │
└────────────────────────────────────────────────────────┘
```

## Přehled služeb

| Služba | Port | Účel |
|---|---|---|
| API Gateway | 8000 | Centrální směrování API, autentizace |
| Vault Server | 8001 | Správa tajných klíčů, úložiště přihlašovacích údajů |
| License Server | 8002 | Validace a správa licencí |
| Email Service | 8003 | E-mailová oznámení a upozornění |
| Notification Service | 8004 | Push notifikace, webhooky |
| Update Server | 8005 | Distribuce aktualizací sond a agentů |
| Agent Registry | 8006 | Registrace a správa agentů |
| Warranty Service | 8007 | Sledování záruky hardwaru |
| CMod Service | 8008 | Správa konfigurace síťových zařízení |
| IPAM Service | 8009 | Správa IP adres |

## Možnosti nasazení

### Docker Compose (doporučeno)

Nejjednodušší způsob nasazení všech služeb. Vhodné pro malá a střední nasazení.

Viz [Průvodce instalací](./installation.md) pro podrobné pokyny.

### Kubernetes

Pro rozsáhlá nasazení vyžadující vysokou dostupnost a horizontální škálování. Helm charty jsou dostupné pro každou službu.

### Jeden binární soubor

Pro minimální nasazení, jeden binární soubor zahrnuje všechny služby. Vhodné pro testování nebo velmi malá prostředí.

## Systémové požadavky

| Požadavek | Minimum | Doporučeno |
|---|---|---|
| OS | Ubuntu 22.04 / Debian 12 | Ubuntu 24.04 LTS |
| CPU | 2 jádra | 4+ jader |
| RAM | 4 GB | 8 GB |
| Disk | 40 GB | 100 GB SSD |
| Docker | v24.0+ | Nejnovější stabilní |
| Docker Compose | v2.20+ | Nejnovější stabilní |

## Síťování

| Port | Protokol | Účel |
|---|---|---|
| 443 | HTTPS | Webový řídicí panel a API (přes reverzní proxy) |
| 80 | HTTP | Přesměrování na HTTPS |
| 5432 | TCP | PostgreSQL (interní, není vystaven) |
| 6379 | TCP | Redis (interní, není vystaven) |

Externě je potřeba vystavit pouze porty 80 a 443. Všechny interní porty služeb jsou přístupné pouze v rámci Docker sítě.

## Úložiště dat

| Data | Úložiště | Záloha |
|---|---|---|
| PostgreSQL databáze | Docker svazek | pg_dump denně |
| Konfigurační soubory | Bind mount | Záloha souborů |
| Nahrané soubory | Docker svazek | Záloha souborů |
| Logy | Docker svazek | Rotace logů |
| TLS certifikáty | Bind mount | Bezpečná záloha |

## Zabezpečení

Self-hosted nasazení zahrnují všechny bezpečnostní funkce:

- TLS šifrování pro veškerou externí komunikaci
- Autentizace pomocí JWT
- Řízení přístupu na základě rolí
- Auditní protokolování
- Ověření integrity Steel Shield (viz [Steel Shield](./steel-shield.md))

## Často kladené otázky

**Otázka: Mohu provozovat self-hosted bez Dockeru?**
Odpověď: Docker Compose je doporučený a podporovaný způsob nasazení. Spuštění služeb přímo na hostiteli je možné, ale není oficiálně podporováno.

**Otázka: Jak se sondy připojují k self-hosted serveru?**
Odpověď: Nakonfigurujte sondy tak, aby ukazovaly na URL vašeho serveru místo výchozího koncového bodu Cloudflare Tunnel. Aktualizujte `server_url` v konfiguraci sondy.

**Otázka: Je webový řídicí panel součástí?**
Odpověď: Ano. API Gateway obsluhuje webový řídicí panel na kořenové URL. Přistupujte k němu přes vaši nakonfigurovanou doménu (např. `https://netrecon.vasefirma.cz`).

**Otázka: Mohu to provozovat v izolovaném prostředí?**
Odpověď: Ano. Předem stáhněte Docker obrazy a přeneste je na váš izolovaný server. Validaci licence lze nakonfigurovat pro offline režim.

Pro další pomoc kontaktujte [support@netreconapp.com](mailto:support@netreconapp.com).
