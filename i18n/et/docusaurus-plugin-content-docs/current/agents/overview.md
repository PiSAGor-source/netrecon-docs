---
sidebar_position: 1
title: Agentide ülevaade
description: Juurutage kerged jälgimisagendid lõppseadmetele
---

# Agentide juurutamine

NetReconi agendid on kerged jälgimisprogrammid, mis installitakse lõppseadmetele (tööjaamad, serverid, sülearvutid) ja annavad sondile aru. Agendid pakuvad lõppseadme tasemel nähtavust, mida ainuüksi võrgu skannimine ei suuda saavutada.

## Mida agendid teevad

- **Südamelöögi jälgimine** — regulaarne kontroll kinnitamaks, et lõppseade on võrgus
- **Tarkvara inventuur** — installitud tarkvara ja versioonide raporteerimine
- **Avatud portide raporteerimine** — lokaalselt kuulatavate portide raporteerimine lõppseadme perspektiivist
- **Võrguliideste andmed** — kõigi NIC-de, IP-de, MAC-aadresside ja ühenduse oleku raporteerimine
- **OS-i teave** — operatsioonisüsteemi, versiooni ja paiga taseme raporteerimine
- **Riistvara teave** — CPU, RAM, ketas, seerianumber
- **Turvahoiak** — tulemüüri olek, viirusetõrje olek, krüpteerimise olek

## Toetatud platvormid

| Platvorm | Paketiformaat | Minimaalne versioon |
|---|---|---|
| Windows | MSI installer | Windows 10 / Server 2016 |
| macOS | PKG installer | macOS 12 (Monterey) |
| Linux (Debian/Ubuntu) | DEB pakett | Ubuntu 20.04 / Debian 11 |
| Linux (RHEL/Fedora) | RPM pakett | RHEL 8 / Fedora 36 |

## Arhitektuur

```
┌───────────────┐     HTTPS      ┌─────────────────┐
│   Endpoint    │  (heartbeat +  │   Agent         │
│   (Agent)     ├────────────────►  Registry       │
│               │   data upload) │   :8006         │
└───────────────┘                └────────┬────────┘
                                         │
                                ┌────────▼────────┐
                                │  Probe Dashboard │
                                │  (Agent view)    │
                                └─────────────────┘
```

Agendid suhtlevad Agent Registry teenusega (port 8006) sondil:
- **Südamelöök**: iga 30 sekundi järel (konfigureeritav)
- **Täisraport**: iga 15 minuti järel (konfigureeritav)
- **Protokoll**: HTTPS koos JWT autentimisega
- **Koormus**: JSON, gzip-tihendatud

## Juurutusmeetodid

### Käsitsi paigaldamine
Laadige alla ja installige agendi pakett otse igale lõppseadmele. Sobib kõige paremini väikeste juurutuste või testimise jaoks.

- [Windows agent](./windows.md)
- [macOS agent](./macos.md)
- [Linux agent](./linux.md)

### Ettevõtte juurutamine
Suuremahuliseks levitamiseks juurutage agendid oma olemasolevate haldustööriistade abil:

| Tööriist | Platvorm | Juhend |
|---|---|---|
| SCCM | Windows | [Windows agent](./windows.md#sccm-deployment) |
| Microsoft Intune | Windows | [Windows agent](./windows.md#intune-deployment) |
| Group Policy (GPO) | Windows | [Windows agent](./windows.md#gpo-deployment) |
| Jamf Pro | macOS | [macOS agent](./macos.md#jamf-deployment) |
| Üldine MDM | macOS | [macOS agent](./macos.md#mdm-deployment) |
| CLI / Ansible | Linux | [Linux agent](./linux.md#automated-deployment) |

### QR-koodi registreerimine

BYOD või välitöö juurutuse jaoks:
1. Genereerige QR-kood sondi juhtpaneelilt (**Agendid > Registreerimine**)
2. Kasutaja skannib QR-koodi oma seadmel
3. Agent laadib alla ja installitakse eelkonfigureeritud seadetega

## Agendi konfiguratsioon

Pärast paigaldamist konfigureeritakse agendid kohaliku konfiguratsioonifaili kaudu või kaugelt sondi juhtpaneeli kaudu:

| Seade | Vaikeväärtus | Kirjeldus |
|---|---|---|
| `server_url` | — | Sondi URL või Cloudflare Tunneli URL |
| `enrollment_token` | — | Ühekordne registreerimistõend |
| `heartbeat_interval` | 30s | Kui tihti agent end registreerib |
| `report_interval` | 15m | Kui tihti täieandmed laaditakse üles |
| `log_level` | info | Logimise detailsus |

## Agendi elutsükkel

1. **Paigaldamine** — agendi pakett installitakse lõppseadmele
2. **Registreerimine** — agent registreerub sondis registreerimistõendi abil
3. **Aktiivne** — agent saadab regulaarseid südamelööke ja raporteid
4. **Aegunud** — agent on jätnud südamelöögid ajalõpist kauemaks vahele (vaikimisi: 90 sekundit)
5. **Võrguühenduseta** — agent pole pikema perioodi jooksul end registreerinud
6. **Eemaldatud** — agent on pargist eemaldatud

## Juhtpaneeli integratsioon

Registreeritud agendid kuvatakse sondi juhtpaneelil **Agendid** all:

- **Agentide loend** — kõik registreeritud agendid koos olekuindikaatoritega
- **Agendi üksikasjad** — valitud agendi täielikud lõppseadme andmed
- **Hoiatused** — teavitused aegunud/võrguühenduseta agentide või turvahoiaku muutuste kohta
- **Grupid** — korraldage agendid loogilistesse gruppidesse (osakonna, asukoha jne järgi)

## Turvalisus

- Kogu agendi-sondi suhtlus on TLS-iga krüpteeritud
- Agendid autentivad registreerimise ajal väljastatud JWT tõenditega
- Registreerimistõendid on ühekordsed ja aeguvad konfigureeritava perioodi järel
- Agendi binaarid on allkirjastatud terviklikkuse kontrollimiseks
- Lõppseadmel pole sissetulevaid ühendusi vaja

## KKK

**K: Kui palju ribalaiust agent kasutab?**
V: Südamelöögid on ligikaudu 200 baiti igaüks (iga 30 sekundi järel). Täisraportid on tavaliselt 2-10 KB tihendatult (iga 15 minuti järel). Kogu ribalaiuse kasutus on tühine isegi aeglaste ühenduste puhul.

**K: Kas agent vajab administraatori/root õigusi?**
V: Agent töötab süsteemiteenusena ja vajab paigaldamiseks kõrgendatud õigusi. Pärast paigaldamist töötab see spetsiaalse teenusekonto all minimaalsete õigustega.

**K: Kas ma saan agendi kaugelt eemaldada?**
V: Jah. Sondi juhtpaneelilt valige agent ja klõpsake **Eemalda**. Agent eemaldab ennast järgmisel südamelöögil.

**K: Kas agent mõjutab lõppseadme jõudlust?**
V: Agent on loodud kergeks. See kasutab tavaliselt alla 20 MB RAM-i ja tühist CPU-d. Andmete kogumine käib madalal prioriteedil, et vältida kasutajakogemuse mõjutamist.

Lisaabi saamiseks võtke ühendust [support@netreconapp.com](mailto:support@netreconapp.com).
