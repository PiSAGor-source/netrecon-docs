---
sidebar_position: 1
title: Snelstart
description: Ga in enkele minuten aan de slag met NetRecon Cloud
---

# Cloud Snelstart

NetRecon Cloud is de snelste manier om te beginnen. Geen serverinstallatie, geen Docker — meld u aan, implementeer een probe en begin met het ontdekken van uw netwerk.

## Stap 1: Maak uw account aan

1. Ga naar [app.netreconapp.com](https://app.netreconapp.com) en klik op **Aanmelden**
2. Voer uw e-mailadres, bedrijfsnaam en wachtwoord in
3. Verifieer uw e-mailadres
4. Log in op het NetRecon Dashboard

## Stap 2: Voeg uw eerste locatie toe

1. Navigeer in het Dashboard naar **Locaties** in de zijbalk
2. Klik op **Locatie toevoegen**
3. Voer een naam en adres in voor de locatie (bijv. "Hoofdkantoor — Amsterdam")
4. Sla de locatie op

## Stap 3: Implementeer een probe

Elke locatie heeft minstens een probe nodig voor netwerkdetectie en monitoring.

### Optie A: NetRecon OS (Aanbevolen)

1. Ga naar **Locaties → [Uw locatie] → Probes → Probe toevoegen**
2. Selecteer **NetRecon OS** en download het image voor uw hardware
3. Flash het image naar een SD-kaart of SSD met [balenaEtcher](https://etcher.balena.io/)
4. Verbind de probe via Ethernet met uw netwerk
5. Schakel in — de probe maakt automatisch verbinding met uw cloudaccount via Cloudflare Tunnel

### Optie B: Docker op bestaande server

```bash
# Pull en start de probe-container
docker run -d \
  --name netrecon-probe \
  --network host \
  --restart unless-stopped \
  -e ENROLLMENT_TOKEN="uw-token-uit-dashboard" \
  netrecon/probe:latest
```

Haal het inschrijvingstoken op via **Locaties → [Uw locatie] → Probes → Probe toevoegen → Docker**.

### Optie C: Virtuele machine

1. Download het OVA-bestand vanuit het Dashboard
2. Importeer in VMware, Proxmox of Hyper-V
3. Configureer de VM met **bridged netwerken** (vereist voor Layer 2-scanning)
4. Start de VM — deze verschijnt automatisch in uw Dashboard

## Stap 4: Begin met scannen

Zodra de probe online is:

1. Ga naar **Locaties → [Uw locatie] → Apparaten**
2. Klik op **Nu scannen** of wacht op de automatische detectie (elke 15 minuten)
3. Ontdekte apparaten verschijnen in de apparaatinventaris

## Stap 5: Installeer de mobiele app

Download **NetRecon Scanner** uit de Google Play Store voor netwerkscannen onderweg:

- Scan elk netwerk waarmee uw telefoon is verbonden
- Resultaten worden automatisch gesynchroniseerd met uw clouddashboard
- Zie [Scanner-overzicht](../scanner/overview) voor details

## Wat nu?

- **Implementeer agents** op eindpunten voor diepere zichtbaarheid → [Agent-installatie](../agents/overview)
- **Stel meldingen in** voor nieuwe apparaten, kwetsbaarheden of downtime
- **Configureer integraties** met uw bestaande tools (LDAP, SIEM, Jira, ServiceNow)
- **Nodig uw team uit** via **Instellingen → Teambeheer**

## Cloud vs Self-hosted

| Functie | Cloud | Self-hosted |
|---|---|---|
| Serverbeheer | Beheerd door NetRecon | U beheert |
| Gegevenslocatie | NetRecon Cloud (EU) | Uw infrastructuur |
| Updates | Automatisch | Handmatig (docker pull) |
| Cloudflare Tunnel | Inbegrepen | U configureert |
| Prijzen | Abonnement | Licentiesleutel |

Liever self-hosted? Zie de [Installatiehandleiding](../self-hosting/installation).

Voor hulp kunt u contact opnemen met [support@netreconapp.com](mailto:support@netreconapp.com).
