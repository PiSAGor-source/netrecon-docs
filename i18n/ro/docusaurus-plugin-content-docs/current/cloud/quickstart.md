---
sidebar_position: 1
title: Pornire rapidă
description: Începeți cu NetRecon Cloud în câteva minute
---

# Pornire rapidă Cloud

NetRecon Cloud este cel mai rapid mod de a începe. Fără configurare de server, fără Docker — doar înregistrați-vă, implementați o sondă și începeți să descoperiți rețeaua.

## Pasul 1: Creați contul

1. Accesați [app.netreconapp.com](https://app.netreconapp.com) și faceți clic pe **Înregistrare**
2. Introduceți adresa de email, numele companiei și parola
3. Verificați adresa de email
4. Conectați-vă la tabloul de bord NetRecon

## Pasul 2: Adăugați primul site

1. În tabloul de bord, navigați la **Site-uri** din bara laterală
2. Faceți clic pe **Adaugă site**
3. Introduceți un nume și o adresă pentru site (de ex., „Sediul principal — București")
4. Salvați site-ul

## Pasul 3: Implementați o sondă

Fiecare site are nevoie de cel puțin o sondă pentru descoperirea rețelei și monitorizare.

### Opțiunea A: NetRecon OS (Recomandat)

1. Accesați **Site-uri → [Site-ul dvs.] → Sonde → Adaugă sondă**
2. Selectați **NetRecon OS** și descărcați imaginea pentru hardware-ul dvs.
3. Scrieți imaginea pe un card SD sau SSD folosind [balenaEtcher](https://etcher.balena.io/)
4. Conectați sonda la rețea prin Ethernet
5. Porniți — sonda se va conecta automat la contul cloud prin Cloudflare Tunnel

### Opțiunea B: Docker pe server existent

```bash
# Descărcați și rulați containerul sondă
docker run -d \
  --name netrecon-probe \
  --network host \
  --restart unless-stopped \
  -e ENROLLMENT_TOKEN="tokenul-dvs-din-tabloul-de-bord" \
  netrecon/probe:latest
```

Obțineți tokenul de înrolare din **Site-uri → [Site-ul dvs.] → Sonde → Adaugă sondă → Docker**.

### Opțiunea C: Mașină virtuală

1. Descărcați fișierul OVA din tabloul de bord
2. Importați în VMware, Proxmox sau Hyper-V
3. Configurați VM-ul cu **rețea bridge** (necesar pentru scanarea Layer 2)
4. Porniți VM-ul — va apărea automat în tabloul de bord

## Pasul 4: Începeți scanarea

Odată ce sonda este online:

1. Accesați **Site-uri → [Site-ul dvs.] → Dispozitive**
2. Faceți clic pe **Scanează acum** sau așteptați descoperirea automată (rulează la fiecare 15 minute)
3. Dispozitivele descoperite vor apărea în inventarul de dispozitive

## Pasul 5: Instalați aplicația mobilă

Descărcați **NetRecon Scanner** din Google Play Store pentru scanarea rețelei din mers:

- Scanați orice rețea la care este conectat telefonul dvs.
- Rezultatele se sincronizează automat cu tabloul de bord cloud
- Consultați [Prezentare generală Scanner](../scanner/overview) pentru detalii

## Ce urmează?

- **Implementați agenți** pe punctele terminale pentru vizibilitate mai bună → [Instalare agenți](../agents/overview)
- **Configurați alerte** pentru dispozitive noi, vulnerabilități sau perioade de nefuncționare
- **Configurați integrări** cu instrumentele existente (LDAP, SIEM, Jira, ServiceNow)
- **Invitați echipa** prin **Setări → Managementul echipei**

## Cloud vs Auto-găzduit

| Caracteristică | Cloud | Auto-găzduit |
|---|---|---|
| Gestionarea serverului | Gestionat de NetRecon | Gestionat de dvs. |
| Locația datelor | NetRecon Cloud (UE) | Infrastructura dvs. |
| Actualizări | Automate | Manuale (docker pull) |
| Cloudflare Tunnel | Inclus | Configurat de dvs. |
| Prețuri | Abonament | Cheie de licență |

Aveți nevoie de varianta auto-găzduită? Consultați [Ghidul de instalare](../self-hosting/installation).

Pentru ajutor, contactați [support@netreconapp.com](mailto:support@netreconapp.com).
