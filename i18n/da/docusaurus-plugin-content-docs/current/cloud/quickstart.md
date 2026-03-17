---
sidebar_position: 1
title: Hurtigstart
description: Kom i gang med NetRecon Cloud på få minutter
---

# Cloud Hurtigstart

NetRecon Cloud er den hurtigste måde at komme i gang på. Ingen serveropsætning, ingen Docker — bare tilmeld dig, deploy en probe og begynd at opdage dit netværk.

## Trin 1: Opret din konto

1. Gå til [app.netreconapp.com](https://app.netreconapp.com) og klik på **Tilmeld**
2. Indtast din e-mail, firmanavn og adgangskode
3. Bekræft din e-mailadresse
4. Log ind på NetRecon Dashboard

## Trin 2: Tilføj dit første site

1. I Dashboard'et, naviger til **Sites** i sidepanelet
2. Klik på **Tilføj site**
3. Indtast et navn og en adresse for sitet (f.eks. "Hovedkontor — København")
4. Gem sitet

## Trin 3: Deploy en probe

Hvert site skal have mindst én probe til netværksopdagelse og overvågning.

### Mulighed A: NetRecon OS (Anbefalet)

1. Gå til **Sites → [Dit site] → Prober → Tilføj probe**
2. Vælg **NetRecon OS** og download imaget til din hardware
3. Skriv imaget til et SD-kort eller SSD med [balenaEtcher](https://etcher.balena.io/)
4. Tilslut proben til dit netværk via Ethernet
5. Tænd — proben vil automatisk oprette forbindelse til din cloud-konto via Cloudflare Tunnel

### Mulighed B: Docker på eksisterende server

```bash
# Hent og kør probe-containeren
docker run -d \
  --name netrecon-probe \
  --network host \
  --restart unless-stopped \
  -e ENROLLMENT_TOKEN="dit-token-fra-dashboard" \
  netrecon/probe:latest
```

Hent enrollment-tokenet fra **Sites → [Dit site] → Prober → Tilføj probe → Docker**.

### Mulighed C: Virtuel maskine

1. Download OVA-filen fra Dashboard'et
2. Importer i VMware, Proxmox eller Hyper-V
3. Konfigurer VM'en med **bridged networking** (påkrævet for Layer 2-scanning)
4. Start VM'en — den vises automatisk i dit Dashboard

## Trin 4: Begynd at scanne

Når proben er online:

1. Gå til **Sites → [Dit site] → Enheder**
2. Klik på **Scan nu** eller vent på den automatiske opdagelse (kører hvert 15. minut)
3. Opdagede enheder vises i enhedsoversigten

## Trin 5: Installer mobilappen

Download **NetRecon Scanner** fra Google Play Store til netværksscanning på farten:

- Scan ethvert netværk din telefon er forbundet til
- Resultater synkroniseres automatisk til dit cloud-dashboard
- Se [Scanner-oversigt](../scanner/overview) for detaljer

## Hvad er det næste?

- **Deploy agenter** på endepunkter for dybere indsigt → [Agentinstallation](../agents/overview)
- **Opsæt alarmer** for nye enheder, sårbarheder eller nedetid
- **Konfigurer integrationer** med dine eksisterende værktøjer (LDAP, SIEM, Jira, ServiceNow)
- **Inviter dit team** via **Indstillinger → Teamadministration**

## Cloud vs Self-Hosted

| Funktion | Cloud | Self-Hosted |
|---|---|---|
| Serveradministration | Administreret af NetRecon | Du administrerer |
| Dataplacering | NetRecon Cloud (EU) | Din infrastruktur |
| Opdateringer | Automatiske | Manuelle (docker pull) |
| Cloudflare Tunnel | Inkluderet | Du konfigurerer |
| Prissætning | Abonnement | Licensnøgle |

Har du brug for self-hosted i stedet? Se [Installationsguiden](../self-hosting/installation).

For hjælp, kontakt [support@netreconapp.com](mailto:support@netreconapp.com).
