---
sidebar_position: 1
title: Instalace
description: Instalace NetRecon OS na hardware sondy
---

# Instalace NetRecon OS

Tento průvodce vás provede instalací NetRecon OS na hardware vaší sondy. Proces trvá přibližně 15 minut od stažení po plně fungující sondu.

## Předpoklady

- Podporované hardwarové zařízení (viz [Požadavky](./requirements.md))
- MicroSD karta (minimum 16 GB, doporučeno 32 GB) nebo USB disk
- Nástroj pro zápis obrazů jako [balenaEtcher](https://etcher.balena.io/) nebo Raspberry Pi Imager
- Počítač pro stažení a zápis obrazu
- Ethernetový kabel připojený k vaší síti

## Krok 1: Stažení obrazu

Stáhněte odpovídající obraz pro váš hardware z zákaznického portálu NetRecon:

| Hardware | Soubor obrazu | Architektura |
|---|---|---|
| Orange Pi R2S | `netrecon-os-arm64.img.xz` | ARM64 |
| Raspberry Pi 4/5 | `netrecon-os-arm64.img.xz` | ARM64 |
| x86_64 Mini PC | `netrecon-os-amd64.iso` | x86_64 |

:::tip
Ověřte kontrolní součet staženého souboru proti hodnotě zobrazené na portálu, abyste zajistili integritu souboru.
:::

## Krok 2: Zápis obrazu

### Pro ARM64 zařízení (Orange Pi, Raspberry Pi)

1. Vložte microSD kartu do počítače
2. Otevřete balenaEtcher
3. Vyberte stažený soubor `.img.xz` (není potřeba extrahovat)
4. Vyberte vaši microSD kartu jako cíl
5. Klikněte na **Flash** a počkejte na dokončení

### Pro x86_64 zařízení

1. Vložte USB disk do počítače
2. Otevřete balenaEtcher
3. Vyberte stažený soubor `.iso`
4. Vyberte váš USB disk jako cíl
5. Klikněte na **Flash** a počkejte na dokončení
6. Nastartujte mini PC z USB disku a postupujte podle pokynů na obrazovce

## Krok 3: První spuštění

1. Vložte microSD kartu (nebo interní disk pro x86_64) do zařízení sondy
2. Připojte alespoň jeden ethernetový kabel k vaší síti
3. Zapněte zařízení
4. Počkejte přibližně 60 sekund na inicializaci systému

Sonda při prvním spuštění získá IP adresu přes DHCP.

## Krok 4: Spuštění průvodce nastavením

1. Z jakéhokoli zařízení na stejné síti otevřete webový prohlížeč
2. Přejděte na `http://<ip-sondy>:8080`
3. Průvodce nastavením vás provede počáteční konfigurací

Průvodce vám pomůže nakonfigurovat:
- Přihlašovací údaje administrátorského účtu
- Role síťových rozhraní
- Režim skenování sítě
- Připojení Cloudflare Tunnel
- Bezpečnostní nastavení

Podrobnou dokumentaci průvodce najdete v [Přehledu průvodce nastavením](../setup-wizard/overview.md).

## Krok 5: Připojení vašich aplikací

Po dokončení průvodce:

- **NetRecon Scanner**: Může zjistit sondu přes mDNS na lokální síti
- **Admin Connect**: Naskenujte QR kód zobrazený v průvodci nebo se připojte přes `https://probe.netreconapp.com`

## Hardwarové požadavky

| Požadavek | Minimum | Doporučeno |
|---|---|---|
| CPU | ARM64 nebo x86_64 | ARM64 čtyřjádrový nebo x86_64 |
| RAM | 4 GB | 8 GB |
| Úložiště | 16 GB | 32 GB |
| Ethernet | 1 port | 2+ portů |
| Síť | Dostupné DHCP | Preferována statická IP |

## Řešení problémů

### Nelze najít sondu v síti

- Ujistěte se, že ethernetový kabel je správně zapojen a LED indikátor spojení svítí
- Zkontrolujte tabulku DHCP pronájmů na vašem routeru pro nové zařízení s názvem `netrecon`
- Zkuste připojit monitor a klávesnici pro zobrazení IP adresy sondy na konzoli

### Průvodce se nenačítá

- Ověřte, že přistupujete na port 8080: `http://<ip-sondy>:8080`
- Služba průvodce se spouští přibližně 60 sekund po spuštění
- Zkontrolujte, že váš počítač je na stejné síti/VLAN jako sonda

### Zápis obrazu selže

- Zkuste jinou microSD kartu; některé karty mají problémy s kompatibilitou
- Stáhněte obraz znovu a ověřte kontrolní součet
- Zkuste alternativní nástroj pro zápis obrazů

## Často kladené otázky

**Otázka: Mohu nainstalovat NetRecon OS na virtuální stroj?**
Odpověď: Ano, x86_64 ISO lze nainstalovat ve VMware, Proxmox nebo Hyper-V. Přidělte alespoň 4 GB RAM a ujistěte se, že VM má přemostěný síťový adaptér.

**Otázka: Jak aktualizuji NetRecon OS po instalaci?**
Odpověď: Aktualizace jsou doručovány prostřednictvím aplikace Admin Connect nebo přes webový řídicí panel sondy v **Nastavení > Systémová aktualizace**.

**Otázka: Mohu použít Wi-Fi místo Ethernetu?**
Odpověď: Sonda vyžaduje alespoň jedno drátové ethernetové připojení pro spolehlivé skenování sítě. Wi-Fi není podporováno jako primární rozhraní pro skenování.

Pro další pomoc kontaktujte [support@netreconapp.com](mailto:support@netreconapp.com).
