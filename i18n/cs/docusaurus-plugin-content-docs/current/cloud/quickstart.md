---
sidebar_position: 1
title: Rychlý start
description: Začněte s NetRecon Cloud během několika minut
---

# Rychlý start s cloudem

NetRecon Cloud je nejrychlejší způsob, jak začít. Žádné nastavení serveru, žádný Docker — stačí se zaregistrovat, nasadit sondu a začít zjišťovat svou síť.

## Krok 1: Vytvořte si účet

1. Přejděte na [app.netreconapp.com](https://app.netreconapp.com) a klikněte na **Registrace**
2. Zadejte svůj e-mail, název společnosti a heslo
3. Ověřte svou e-mailovou adresu
4. Přihlaste se do řídicího panelu NetRecon

## Krok 2: Přidejte svou první lokalitu

1. V řídicím panelu přejděte na **Lokality** v postranním panelu
2. Klikněte na **Přidat lokalitu**
3. Zadejte název a adresu lokality (např. „Hlavní kancelář — Praha")
4. Uložte lokalitu

## Krok 3: Nasaďte sondu

Každá lokalita potřebuje alespoň jednu sondu pro zjišťování sítě a monitorování.

### Možnost A: NetRecon OS (doporučeno)

1. Přejděte na **Lokality → [Vaše lokalita] → Sondy → Přidat sondu**
2. Vyberte **NetRecon OS** a stáhněte obraz pro váš hardware
3. Zapište obraz na SD kartu nebo SSD pomocí [balenaEtcher](https://etcher.balena.io/)
4. Připojte sondu k síti pomocí Ethernetu
5. Zapněte — sonda se automaticky připojí k vašemu cloudovému účtu přes Cloudflare Tunnel

### Možnost B: Docker na existujícím serveru

```bash
# Stáhněte a spusťte kontejner sondy
docker run -d \
  --name netrecon-probe \
  --network host \
  --restart unless-stopped \
  -e ENROLLMENT_TOKEN="váš-token-z-řídicího-panelu" \
  netrecon/probe:latest
```

Token pro registraci získáte v **Lokality → [Vaše lokalita] → Sondy → Přidat sondu → Docker**.

### Možnost C: Virtuální stroj

1. Stáhněte OVA soubor z řídicího panelu
2. Importujte do VMware, Proxmox nebo Hyper-V
3. Nakonfigurujte VM s **přemostěným síťováním** (nutné pro skenování na vrstvě 2)
4. Spusťte VM — automaticky se objeví ve vašem řídicím panelu

## Krok 4: Zahajte skenování

Jakmile je sonda online:

1. Přejděte na **Lokality → [Vaše lokalita] → Zařízení**
2. Klikněte na **Skenovat nyní** nebo počkejte na automatické zjišťování (spouští se každých 15 minut)
3. Zjištěná zařízení se objeví v inventáři zařízení

## Krok 5: Nainstalujte mobilní aplikaci

Stáhněte si **NetRecon Scanner** z Google Play Store pro skenování sítě na cestách:

- Skenujte jakoukoli síť, ke které je váš telefon připojen
- Výsledky se automaticky synchronizují s vaším cloudovým řídicím panelem
- Podrobnosti najdete v [Přehledu skeneru](../scanner/overview)

## Co dál?

- **Nasaďte agenty** na koncové stanice pro hlubší přehled → [Instalace agentů](../agents/overview)
- **Nastavte upozornění** na nová zařízení, zranitelnosti nebo výpadky
- **Nakonfigurujte integrace** s vašimi stávajícími nástroji (LDAP, SIEM, Jira, ServiceNow)
- **Pozvěte svůj tým** přes **Nastavení → Správa týmu**

## Cloud vs. Self-Hosted

| Funkce | Cloud | Self-Hosted |
|---|---|---|
| Správa serveru | Spravuje NetRecon | Spravujete vy |
| Umístění dat | NetRecon Cloud (EU) | Vaše infrastruktura |
| Aktualizace | Automatické | Ruční (docker pull) |
| Cloudflare Tunnel | Zahrnuto | Konfigurujete vy |
| Ceny | Předplatné | Licenční klíč |

Potřebujete raději self-hosted? Podívejte se na [Průvodce instalací](../self-hosting/installation).

Pro pomoc kontaktujte [support@netreconapp.com](mailto:support@netreconapp.com).
