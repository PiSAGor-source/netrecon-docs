---
sidebar_position: 1
title: Hurtigstart
description: Kom i gang med NetRecon Cloud pa noen minutter
---

# Hurtigstart for skytjenesten

NetRecon Cloud er den raskeste maten a komme i gang pa. Ingen serveroppsett, ingen Docker -- bare registrer deg, distribuer en probe og begynn a oppdage nettverket ditt.

## Trinn 1: Opprett kontoen din

1. Ga til [app.netreconapp.com](https://app.netreconapp.com) og klikk **Registrer deg**
2. Skriv inn e-post, firmanavn og passord
3. Bekreft e-postadressen din
4. Logg inn pa NetRecon-dashbordet

## Trinn 2: Legg til ditt forste omrade

1. I dashbordet, naviger til **Omrader** i sidepanelet
2. Klikk **Legg til omrade**
3. Skriv inn et navn og en adresse for omradet (f.eks. "Hovedkontor -- Oslo")
4. Lagre omradet

## Trinn 3: Distribuer en probe

Hvert omrade trenger minst en probe for nettverksoppdagelse og overvaking.

### Alternativ A: NetRecon OS (anbefalt)

1. Ga til **Omrader -> [Ditt omrade] -> Prober -> Legg til probe**
2. Velg **NetRecon OS** og last ned bildefilen for din maskinvare
3. Skriv bildefilen til et SD-kort eller SSD med [balenaEtcher](https://etcher.balena.io/)
4. Koble proben til nettverket via Ethernet
5. Sla pa strommen -- proben kobler seg automatisk til skykontoen din via Cloudflare Tunnel

### Alternativ B: Docker pa eksisterende server

```bash
# Hent og kjor probe-containeren
docker run -d \
  --name netrecon-probe \
  --network host \
  --restart unless-stopped \
  -e ENROLLMENT_TOKEN="ditt-token-fra-dashbordet" \
  netrecon/probe:latest
```

Hent registreringstokenet fra **Omrader -> [Ditt omrade] -> Prober -> Legg til probe -> Docker**.

### Alternativ C: Virtuell maskin

1. Last ned OVA-filen fra dashbordet
2. Importer til VMware, Proxmox eller Hyper-V
3. Konfigurer VM-en med **bridget nettverk** (pakrevd for Layer 2-skanning)
4. Start VM-en -- den vil vises i dashbordet ditt automatisk

## Trinn 4: Start skanning

Nar proben er tilkoblet:

1. Ga til **Omrader -> [Ditt omrade] -> Enheter**
2. Klikk **Skann na** eller vent pa automatisk oppdagelse (kjorer hvert 15. minutt)
3. Oppdagede enheter vil vises i enhetsoversikten

## Trinn 5: Installer mobilappen

Last ned **NetRecon Scanner** fra Google Play Store for nettverksskanning pa farten:

- Skann ethvert nettverk telefonen din er koblet til
- Resultater synkroniseres automatisk til sky-dashbordet ditt
- Se [Skanneroversikt](../scanner/overview) for detaljer

## Hva er neste steg?

- **Distribuer agenter** pa endepunkter for dypere innsikt -> [Agentinstallasjon](../agents/overview)
- **Sett opp varsler** for nye enheter, sarbarheter eller nedetid
- **Konfigurer integrasjoner** med eksisterende verktoy (LDAP, SIEM, Jira, ServiceNow)
- **Inviter teamet ditt** via **Innstillinger -> Teamadministrasjon**

## Sky vs. selvhostet

| Funksjon | Sky | Selvhostet |
|---|---|---|
| Serveradministrasjon | Administrert av NetRecon | Du administrerer |
| Dataplassering | NetRecon Cloud (EU) | Din infrastruktur |
| Oppdateringer | Automatisk | Manuell (docker pull) |
| Cloudflare Tunnel | Inkludert | Du konfigurerer |
| Prising | Abonnement | Lisensnokkel |

Trenger du selvhostet i stedet? Se [installasjonsguiden](../self-hosting/installation).

For hjelp, kontakt [support@netreconapp.com](mailto:support@netreconapp.com).
