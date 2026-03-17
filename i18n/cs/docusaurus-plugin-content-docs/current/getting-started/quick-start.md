---
sidebar_position: 2
title: Rychlý start
description: Od rozbalení po první sken sítě za 10 minut
---

# Průvodce rychlým startem

Dostaňte se od nuly k prvnímu skenu sítě za méně než 10 minut. Tento průvodce předpokládá, že jste již zapsali obraz NetRecon OS na vaše úložné zařízení.

## Co budete potřebovat

- Zařízení sondy s nainstalovaným NetRecon OS (viz [Instalace](./installation.md))
- Ethernetový kabel připojený k vaší síti
- Chytrý telefon nebo počítač na stejné síti
- Aplikaci NetRecon Scanner (volitelné, pro mobilní skenování)

## Minuty 0-2: Spuštění sondy

1. Vložte připravenou microSD kartu nebo nastartujte z interního úložiště
2. Připojte ethernetový kabel k síťovému přepínači nebo routeru
3. Zapněte zařízení
4. Počkejte, až zelená stavová LED začne svítit trvale (přibližně 60 sekund)

## Minuty 2-5: Dokončení průvodce nastavením

1. Najděte IP adresu sondy v tabulce DHCP pronájmů routeru nebo na výstupu konzole
2. Otevřete `http://<ip-sondy>:8080` ve vašem prohlížeči
3. Dokončete tyto základní kroky průvodce:
   - **Nastavení hesla administrátora** — zvolte silné heslo
   - **Přiřazení síťových rozhraní** — vyberte, který port se připojuje k vaší skenované síti
   - **Volba režimu skenování** — vyberte „Jedno rozhraní" pro základní nastavení
   - **Konfigurace Cloudflare Tunnel** (volitelné) — umožňuje vzdálený přístup přes `https://probe.netreconapp.com`
4. Klikněte na **Dokončit nastavení**

## Minuty 5-7: Ověření řídicího panelu sondy

1. Po dokončení průvodce přejděte na `http://<ip-sondy>:3000`
2. Přihlaste se s přihlašovacími údaji administrátora, které jste vytvořili
3. Ověřte, že řídicí panel zobrazuje:
   - Stav systému: využití CPU, RAM, úložiště
   - Síťová rozhraní: alespoň jedno rozhraní v roli „skenování"
   - Služby: základní služby by měly zobrazovat zelený stav

## Minuty 7-10: Spuštění prvního skenu

### Možnost A: Z řídicího panelu sondy

1. Přejděte na **Sken > Spustit sken**
2. Vyberte cílovou podsíť (automaticky detekovanou z vašeho skenovacího rozhraní)
3. Zvolte **Rychlý** skenovací profil
4. Klikněte na **Start**
5. Sledujte, jak se zařízení objevují v reálném čase na řídicím panelu

### Možnost B: Z aplikace NetRecon Scanner

1. Otevřete aplikaci NetRecon Scanner na vašem Android zařízení
2. Aplikace detekuje sondu přes mDNS, pokud jste na stejné síti
3. Alternativně přejděte na **Nastavení > Připojení k sondě** a zadejte IP sondy
4. Klepněte na **Skenovat** na hlavní obrazovce
5. Vyberte vaši síť a klepněte na **Spustit sken**

## Co se děje během skenování

1. **ARP zjišťování** — sonda vysílá ARP požadavky k nalezení všech aktivních hostitelů v podsíti
2. **Skenování portů** — každý zjištěný hostitel je prověřen na otevřené TCP porty
3. **Detekce služeb** — otevřené porty jsou testovány pro identifikaci běžící služby a verze
4. **Profilování zařízení** — sonda kombinuje OUI lookup MAC adresy, otevřené porty a servisní bannery pro identifikaci typu zařízení

## Další kroky

Nyní, když jste dokončili svůj první sken, prozkoumejte tyto funkce:

- [Skenovací profily](../scanner/scan-profiles.md) — přizpůsobení hloubky a rychlosti skenování
- [Reporty](../scanner/reports.md) — generování PDF reportů z výsledků skenování
- [Admin Connect](../admin-connect/overview.md) — nastavení vzdálené správy
- [Nasazení agentů](../agents/overview.md) — nasazení agentů na vaše koncové stanice

## Často kladené otázky

**Otázka: Sken našel méně zařízení, než se očekávalo. Proč?**
Odpověď: Ujistěte se, že sonda je na správné VLAN/podsíti. Firewally nebo klientské firewally mohou blokovat ARP odpovědi. Zkuste spustit **Standardní** profil místo **Rychlého** pro důkladnější zjišťování.

**Otázka: Mohu skenovat více podsítí?**
Odpověď: Ano. Nakonfigurujte další podsítě v řídicím panelu sondy v **Nastavení > Cíle skenování**. Skenování více podsítí vyžaduje odpovídající směrování nebo více síťových rozhraní.

**Otázka: Jak dlouho trvá sken?**
Odpověď: Rychlý sken podsítě /24 se typicky dokončí za méně než 2 minuty. Standardní trvá 5-10 minut. Hloubkové skeny mohou trvat 15-30 minut v závislosti na počtu hostitelů a skenovaných portů.

Pro další pomoc kontaktujte [support@netreconapp.com](mailto:support@netreconapp.com).
