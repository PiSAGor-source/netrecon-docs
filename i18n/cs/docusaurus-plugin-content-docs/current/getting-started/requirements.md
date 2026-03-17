---
sidebar_position: 3
title: Požadavky
description: Hardwarové, softwarové a síťové požadavky pro NetRecon
---

# Požadavky

Tato stránka uvádí minimální a doporučené požadavky pro všechny komponenty NetRecon.

## Hardware sondy

### Podporované platformy

| Zařízení | Úroveň podpory | Poznámky |
|---|---|---|
| Orange Pi R2S (8 GB) | Primární | Dvojitý Ethernet, kompaktní formát |
| Raspberry Pi 4 (4/8 GB) | Primární | Široce dostupný, dobrý výkon |
| Raspberry Pi 5 (4/8 GB) | Primární | Nejlepší ARM výkon |
| x86_64 Mini PC (Intel N100+) | Primární | Nejlepší celkový výkon, více NIC |
| Ostatní ARM64 SBC | Pokročilé | Může vyžadovat ruční konfiguraci |
| Virtuální stroje (VMware/Proxmox/Hyper-V) | Podporováno | Vyžadováno přemostěné síťování |

### Hardwarové specifikace

| Požadavek | Minimum | Doporučeno |
|---|---|---|
| Architektura | ARM64 nebo x86_64 | ARM64 čtyřjádrový nebo x86_64 |
| Jádra CPU | 2 | 4+ |
| RAM | 4 GB | 8 GB |
| Úložiště | 16 GB (eMMC/SD/SSD) | 32 GB SSD |
| Ethernetové porty | 1 | 2+ (pro bridge/TAP režim) |
| USB | Není vyžadováno | USB-A pro sériový konzolový adaptér |
| Napájení | 5V/3A (SBC) | PoE nebo napájecí konektor |

### Poznámky k úložišti

- **16 GB** je dostatečných pro základní skenování a monitorování
- **32 GB+** je doporučeno, pokud povolíte zachytávání PCAP, logování IDS nebo skenování zranitelností
- PCAP soubory mohou na vytížených sítích rychle narůstat; zvažte externí úložiště pro dlouhodobé zachytávání
- SQLite databáze používá WAL režim pro optimální výkon zápisu

## Aplikace NetRecon Scanner (Android)

| Požadavek | Podrobnosti |
|---|---|
| Verze Androidu | 8.0 (API 26) nebo vyšší |
| RAM | Minimum 2 GB |
| Úložiště | 100 MB pro aplikaci + data |
| Síť | Wi-Fi připojená k cílové síti |
| Root přístup | Volitelný (umožňuje pokročilé režimy skenování) |
| Shizuku | Volitelný (umožňuje některé funkce bez root) |

## Aplikace Admin Connect

| Požadavek | Podrobnosti |
|---|---|
| Verze Androidu | 8.0 (API 26) nebo vyšší |
| RAM | Minimum 2 GB |
| Úložiště | 80 MB pro aplikaci + data |
| Síť | Připojení k internetu (připojuje se přes Cloudflare Tunnel) |

## Self-Hosted server

| Požadavek | Minimum | Doporučeno |
|---|---|---|
| OS | Ubuntu 22.04 LTS / Debian 12 | Ubuntu 24.04 LTS |
| CPU | 2 jádra | 4+ jader |
| RAM | 4 GB | 8 GB |
| Úložiště | 40 GB | 100 GB SSD |
| Docker | v24.0+ | Nejnovější stabilní |
| Docker Compose | v2.20+ | Nejnovější stabilní |

Windows Server je také podporován s Docker Desktop nebo WSL2.

## Síťové požadavky

### Síťový přístup sondy

| Směr | Port | Protokol | Účel |
|---|---|---|---|
| Sonda -> LAN | ARP | Vrstva 2 | Zjišťování hostitelů |
| Sonda -> LAN | TCP (různé) | Vrstva 4 | Skenování portů |
| Sonda -> LAN | UDP 5353 | mDNS | Zjišťování služeb |
| Sonda -> Internet | TCP 443 | HTTPS | Cloudflare Tunnel, aktualizace |
| LAN -> Sonda | TCP 3000 | HTTPS | Webový řídicí panel |
| LAN -> Sonda | TCP 8080 | HTTP | Průvodce nastavením (pouze první spuštění) |

### Poznámky k firewallu

- Sonda **nevyžaduje žádné příchozí porty** z internetu při použití Cloudflare Tunnel
- Sonda potřebuje **odchozí HTTPS (443)** pro připojení tunelu a systémové aktualizace
- Pro skenování lokální sítě musí být sonda na stejném L2 segmentu jako cílová zařízení (nebo použijte SPAN/mirror port)

### Cloudflare Tunnel

Vzdálený přístup k sondě je poskytován prostřednictvím Cloudflare Tunnel. To vyžaduje:
- Aktivní připojení k internetu na sondě
- Odchozí TCP 443 přístup (nejsou potřeba příchozí porty)
- Cloudflare účet (bezplatná úroveň je dostatečná)

## Požadavky na prohlížeč (webový řídicí panel)

| Prohlížeč | Minimální verze |
|---|---|
| Google Chrome | 90+ |
| Mozilla Firefox | 90+ |
| Microsoft Edge | 90+ |
| Safari | 15+ |

JavaScript musí být povolen.

## Často kladené otázky

**Otázka: Mohu provozovat sondu na Raspberry Pi 3?**
Odpověď: Raspberry Pi 3 má pouze 1 GB RAM, což je pod minimálním požadavkem. Může fungovat pro základní skenování, ale není podporován.

**Otázka: Potřebuje sonda přístup k internetu?**
Odpověď: Přístup k internetu je vyžadován pouze pro Cloudflare Tunnel (vzdálený přístup) a systémové aktualizace. Veškerá skenovací funkčnost funguje bez internetu.

**Otázka: Mohu použít USB Wi-Fi adaptér pro skenování?**
Odpověď: Wi-Fi skenování není podporováno. Sonda vyžaduje drátový Ethernet pro spolehlivé a kompletní zjišťování sítě.

Pro další pomoc kontaktujte [support@netreconapp.com](mailto:support@netreconapp.com).
