---
sidebar_position: 1
title: Přehled skeneru
description: Aplikace NetRecon Scanner — samostatný síťový skener pro Android
---

# NetRecon Scanner

NetRecon Scanner je samostatný nástroj pro audit síťové bezpečnosti na platformě Android. Funguje nezávisle na vašem Android zařízení bez nutnosti sondy, což ho činí ideálním pro terénní práci, rychlé posouzení a průzkum sítě na cestách.

## Klíčové funkce

- **ARP zjišťování** — nalezení všech zařízení v lokální síti pomocí ARP požadavků
- **Skenování portů** — skenování TCP portů pro nalezení otevřených služeb na zjištěných hostitelích
- **Detekce služeb** — identifikace běžících služeb a jejich verzí pomocí analýzy bannerů
- **Profilování zařízení** — klasifikace zařízení kombinací OUI lookupu, otevřených portů a signatur služeb
- **WiFi heatmapa** — vizualizace síly bezdrátového signálu v různých fyzických lokacích
- **PDF reporty** — generování profesionálních reportů z bezpečnostního auditu
- **SSH terminál** — připojení k zařízením přímo z aplikace
- **CVE inteligence** — offline CVE databáze pro vyhledávání zranitelností
- **Mapa útočné plochy** — vizuální reprezentace expozice sítě
- **Pasivní monitor** — nepřetržité monitorování nových zařízení na pozadí
- **11 jazyků** — plná podpora lokalizace

## Provozní režimy

NetRecon Scanner podporuje tři provozní režimy v závislosti na možnostech vašeho zařízení:

### Standardní režim
Funguje na jakémkoli Android zařízení bez speciálních oprávnění. Používá standardní Android síťová API pro zjišťování a skenování.

### Režim Shizuku
Využívá službu [Shizuku](https://shizuku.rikka.app/) pro zvýšený síťový přístup bez root. Umožňuje rychlejší ARP skenování a přístup k raw socketům.

### Režim Root
Plný přístup ke všem síťovým možnostem. Umožňuje nejrychlejší rychlost skenování, zachytávání v promiskuitním režimu a pokročilé funkce jako detekce ARP spoofingu.

| Funkce | Standardní | Shizuku | Root |
|---|---|---|---|
| ARP zjišťování | Pomalé | Rychlé | Nejrychlejší |
| Skenování portů | Ano | Ano | Ano |
| Raw sockety | Ne | Ano | Ano |
| PCAP zachytávání | Ne | Omezené | Plné |
| Pasivní monitorování | Omezené | Ano | Ano |

## Typy skenů

### ARP zjišťování
Vysílá ARP požadavky na každou IP v cílové podsíti pro identifikaci aktivních hostitelů. Toto je nejrychlejší a nejspolehlivější metoda zjišťování zařízení v lokální síti.

### TCP sken portů
Připojuje se ke specifikovaným TCP portům na každém zjištěném hostiteli. Podporuje konfigurovatelné rozsahy portů a limity souběžných připojení.

### Detekce služeb
Po nalezení otevřených portů skener vysílá protokolově specifické sondy pro identifikaci běžící služby. Rozpoznává stovky běžných služeb včetně HTTP, SSH, FTP, SMB, RDP, databází a dalších.

### Profilování zařízení
Kombinuje více datových zdrojů pro identifikaci typu zařízení:
- OUI (výrobce) lookup z MAC adresy
- Porovnávání otisku otevřených portů
- Analýza bannerů služeb
- Oznámení služeb mDNS/SSDP

## Integrace se sondou

Zatímco Scanner funguje nezávisle, může se také připojit k NetRecon Probe pro rozšířené možnosti:

- Zobrazení výsledků skenování sondy vedle lokálních skenů
- Spuštění vzdálených skenů z aplikace
- Přístup k IDS upozorněním a datům o zranitelnostech ze sondy
- Kombinace lokálních dat a dat ze sondy v reportech

Pro připojení k sondě přejděte na **Nastavení > Připojení k sondě** a zadejte IP adresu sondy nebo naskenujte QR kód z řídicího panelu sondy.

## Výkon

Skener je optimalizován pro mobilní zařízení:
- Maximálně 40 souběžných socketových připojení (adaptivně na základě úrovně baterie)
- Výpočetně náročné profilování běží v dedikovaném izolovaném prostředí pro zachování odezvy UI
- OUI databáze je líně načítána s LRU cache (500 záznamů)
- Skenování zohledňující baterii snižuje souběžnost při nízké úrovni baterie

## Často kladené otázky

**Otázka: Vyžaduje Scanner přístup k internetu?**
Odpověď: Ne. Všechny skenovací funkce fungují offline. Internet je potřeba pouze pro počáteční stažení CVE databáze a aktualizace.

**Otázka: Mohu skenovat sítě, ke kterým nejsem připojen?**
Odpověď: Scanner může zjišťovat zařízení pouze v síti, ke které je vaše Android zařízení aktuálně připojeno přes Wi-Fi. Pro skenování vzdálených sítí použijte sondu.

**Otázka: Jak přesné je profilování zařízení?**
Odpověď: Profilování zařízení správně identifikuje typ zařízení přibližně v 85-90 % případů. Přesnost se zvyšuje, když je detekováno více portů a služeb (použijte profil Standardní nebo Hloubkový).

Pro další pomoc kontaktujte [support@netreconapp.com](mailto:support@netreconapp.com).
