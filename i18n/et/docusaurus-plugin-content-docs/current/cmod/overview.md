---
sidebar_position: 1
title: CMod ülevaade
description: Võrguseadmete konfiguratsiooni haldamine SSH ja jadakonsooli kaudu
---

# CMod — konfiguratsiooni haldamine

CMod (Configuration Module) võimaldab hallata võrguseadmete konfiguratsioone otse NetRecon armatuurlaualt. Ühenduge kommutaatorite, ruuterite, tulemüüride ja muude võrguseadmetega SSH või jadakonsooli kaudu käskude täitmiseks, mallide rakendamiseks ja konfiguratsioonimuudatuste jälgimiseks.

## Põhifunktsioonid

- **SSH ühendused** — ühenduge mis tahes võrguseadmega SSH kaudu
- **Jadakonsool** — ühenduge seadmetega USB-jadaadapteri kaudu ribaväliseks juurdepääsuks
- **Käsumallid** — valmis ja kohandatud käsumallid tavapäraste toimingute jaoks
- **Hulgioperatsioonid** — käivitage käske mitmes seadmes samaaegselt
- **Reaalajas terminal** — interaktiivne WebSocket-põhine terminal teie brauseris
- **Konfiguratsiooni varundamine** — salvestage jooksvad konfiguratsioonid automaatselt
- **Muudatuste jälgimine** — erinevuspõhine konfiguratsioonimuudatuste jälgimine aja jooksul

## Arhitektuur

CMod töötab eraldiseisva teenusena sondil (port 8008) ja ühendub teie nimel võrguseadmetega:

```
┌──────────┐    WebSocket     ┌──────────┐    SSH/Serial    ┌──────────────┐
│ Dashboard ├─────────────────► CMod     ├──────────────────► Network      │
│ (Browser) │                 │ Service  │                  │ Device       │
└──────────┘                  │ :8008    │                  │ (Switch/     │
                              └──────────┘                  │  Router/FW)  │
                                                            └──────────────┘
```

## Toetatud seadmed

CMod toetab mis tahes seadet, mis aktsepteerib SSH või jadakonsooli ühendusi. Testitud ja optimeeritud:

| Tootja | Seadme tüübid | SSH | Jadaühendus |
|---|---|---|---|
| Cisco | IOS, IOS-XE, NX-OS, ASA | Jah | Jah |
| Juniper | Junos | Jah | Jah |
| HP/Aruba | ProCurve, ArubaOS-Switch, ArubaOS-CX | Jah | Jah |
| MikroTik | RouterOS | Jah | Jah |
| Ubiquiti | EdgeOS, UniFi | Jah | Ei |
| Fortinet | FortiOS | Jah | Jah |
| Palo Alto | PAN-OS | Jah | Jah |
| Linux | Mis tahes SSH-toega süsteem | Jah | Jah |

## Alustamine

### 1. samm: lisage seade

1. Navigeerige **CMod > Seadmed** sondi armatuurlaual
2. Klõpsake **Lisa seade**
3. Sisestage seadme andmed:
   - **Nimi**: sõbralik identifikaator (nt "Tuumkommutaator 1")
   - **IP-aadress**: seadme haldus-IP
   - **Seadme tüüp**: valige tootjate loendist
   - **Ühenduse tüüp**: SSH või jadaühendus
4. Sisestage mandaadid (salvestatakse krüpteeritult sondi kohalikku andmebaasi)
5. Klõpsake **Salvesta ja testi** ühenduvuse kontrollimiseks

### 2. samm: ühenduge seadmega

1. Klõpsake seadmel CMod seadmete loendis
2. Valige **Terminal** interaktiivse seansi jaoks või **Käivita mall** eelmääratud käskude komplekti jaoks
3. Terminal avaneb teie brauseris otseühendusega seadmesse

### 3. samm: rakendage mall

1. Valige seade ja klõpsake **Käivita mall**
2. Valige mall teegist (nt "Show Running Config", "Show Interfaces")
3. Vaadake üle käsud, mis täidetakse
4. Klõpsake **Täida**
5. Vaadake väljundit reaalajas

Vt [SSH režiim](./ssh-mode.md) ja [Jadarežiim](./serial-mode.md) üksikasjalike ühendusjuhendite jaoks.

## Käsumallid

Mallid on korduvkasutatavad käskude komplektid, mis on korraldatud seadme tüübi järgi:

### Sisseehitatud mallid

| Mall | Cisco IOS | Junos | ArubaOS | FortiOS |
|---|---|---|---|---|
| Jooksva konfiguratsiooni kuvamine | `show run` | `show config` | `show run` | `show full-config` |
| Liideste kuvamine | `show ip int brief` | `show int terse` | `show int brief` | `get system interface` |
| Marsruutimistabeli kuvamine | `show ip route` | `show route` | `show ip route` | `get router info routing` |
| ARP-tabeli kuvamine | `show arp` | `show arp` | `show arp` | `get system arp` |
| MAC-tabeli kuvamine | `show mac add` | `show eth-switch table` | `show mac-address` | `get system arp` |
| Konfiguratsiooni salvestamine | `write memory` | `commit` | `write memory` | `execute backup config` |

### Kohandatud mallid

Looge oma mallid:

1. Navigeerige **CMod > Mallid**
2. Klõpsake **Loo mall**
3. Valige sihtseadme tüüp
4. Sisestage käskude järjekord (üks käsk rea kohta)
5. Lisage muutujad dünaamiliste väärtuste jaoks (nt `{{interface}}`, `{{vlan_id}}`)
6. Salvestage mall

## KKK

**K: Kas seadme mandaadid salvestatakse turvaliselt?**
V: Jah. Kõik mandaadid on krüpteeritud puhkeolekus sondi kohalikus SQLite andmebaasis AES-256 krüpteeringuga. Mandaate ei edastata kunagi lihttekstina.

**K: Kas ma saan CMod-i kasutada ilma sondita?**
V: Ei. CMod töötab teenusena sondi riistvaral. See nõuab, et sond oleks sihtseadmetega samas võrgus (või omaks nendeni marsruutimist).

**K: Kas CMod toetab SNMP-d?**
V: CMod keskendub CLI-põhisele haldamisele (SSH ja jadaühendus). SNMP jälgimist käsitleb sondi võrguseire mootor.

Täiendava abi saamiseks võtke ühendust [support@netreconapp.com](mailto:support@netreconapp.com).
