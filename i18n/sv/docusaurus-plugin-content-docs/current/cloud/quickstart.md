---
sidebar_position: 1
title: Snabbstart
description: Kom igång med NetRecon Cloud på några minuter
---

# Molnsnabbstart

NetRecon Cloud är det snabbaste sättet att komma igång. Ingen serverinstallation, ingen Docker — registrera dig bara, distribuera en prob och börja upptäcka ditt nätverk.

## Steg 1: Skapa ditt konto

1. Gå till [app.netreconapp.com](https://app.netreconapp.com) och klicka på **Registrera dig**
2. Ange din e-post, företagsnamn och lösenord
3. Verifiera din e-postadress
4. Logga in på NetRecon-instrumentpanelen

## Steg 2: Lägg till din första plats

1. I instrumentpanelen, navigera till **Platser** i sidofältet
2. Klicka på **Lägg till plats**
3. Ange ett namn och adress för platsen (t.ex. "Huvudkontoret — Stockholm")
4. Spara platsen

## Steg 3: Distribuera en prob

Varje plats behöver minst en prob för nätverksupptäckt och övervakning.

### Alternativ A: NetRecon OS (rekommenderat)

1. Gå till **Platser → [Din plats] → Prober → Lägg till prob**
2. Välj **NetRecon OS** och ladda ner avbildningen för din hårdvara
3. Skriv avbildningen till ett SD-kort eller SSD med [balenaEtcher](https://etcher.balena.io/)
4. Anslut proben till ditt nätverk via Ethernet
5. Starta — proben ansluter automatiskt till ditt molnkonto via Cloudflare Tunnel

### Alternativ B: Docker på befintlig server

```bash
# Hämta och kör prob-containern
docker run -d \
  --name netrecon-probe \
  --network host \
  --restart unless-stopped \
  -e ENROLLMENT_TOKEN="din-token-från-instrumentpanelen" \
  netrecon/probe:latest
```

Hämta registreringstoken från **Platser → [Din plats] → Prober → Lägg till prob → Docker**.

### Alternativ C: Virtuell maskin

1. Ladda ner OVA-filen från instrumentpanelen
2. Importera till VMware, Proxmox eller Hyper-V
3. Konfigurera VM:en med **bryggat nätverk** (krävs för Layer 2-skanning)
4. Starta VM:en — den visas automatiskt i din instrumentpanel

## Steg 4: Börja skanna

När proben är online:

1. Gå till **Platser → [Din plats] → Enheter**
2. Klicka på **Skanna nu** eller vänta på automatisk upptäckt (körs var 15:e minut)
3. Upptäckta enheter visas i enhetsinventeringen

## Steg 5: Installera mobilappen

Ladda ner **NetRecon Scanner** från Google Play Store för nätverksskanning i fält:

- Skanna alla nätverk din telefon är ansluten till
- Resultat synkroniseras automatiskt till din molninstrumentpanel
- Se [Scanneröversikt](../scanner/overview) för detaljer

## Vad händer nu?

- **Distribuera agenter** på enheter för djupare insyn → [Agentinstallation](../agents/overview)
- **Ställ in varningar** för nya enheter, sårbarheter eller driftstopp
- **Konfigurera integrationer** med dina befintliga verktyg (LDAP, SIEM, Jira, ServiceNow)
- **Bjud in ditt team** via **Inställningar → Teamhantering**

## Moln vs egen hosting

| Funktion | Moln | Egen hosting |
|---|---|---|
| Serverhantering | Hanteras av NetRecon | Du hanterar |
| Dataplats | NetRecon Cloud (EU) | Din infrastruktur |
| Uppdateringar | Automatiska | Manuella (docker pull) |
| Cloudflare Tunnel | Inkluderat | Du konfigurerar |
| Prissättning | Prenumeration | Licensnyckel |

Behöver du egen hosting istället? Se [Installationsguiden](../self-hosting/installation).

För hjälp, kontakta [support@netreconapp.com](mailto:support@netreconapp.com).
