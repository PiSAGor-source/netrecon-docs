---
sidebar_position: 1
title: Gyors kezdes
description: Percek alatt elkezdheti hasznalni a NetRecon Felhot
---

# Felhos gyors kezdes

A NetRecon Felho a leggyorsabb modja az indulasnak. Nincs szerver beallitas, nincs Docker — csak regisztraljon, telepitsen egy szondat, es kezdje meg a halozat felderiteseert.

## 1. lepes: Fiok letrehozasa

1. Latogasson el az [app.netreconapp.com](https://app.netreconapp.com) oldalra es kattintson a **Regisztracio** gombra
2. Adja meg az e-mail cimet, cegnevet es jelszot
3. Erositse meg az e-mail cimet
4. Jelentkezzen be a NetRecon Vezerlopultba

## 2. lepes: Elso telephely hozzaadasa

1. A Vezerlopulton navigaljon a **Telephelyek** menupontra az oldalsavon
2. Kattintson a **Telephely hozzaadasa** gombra
3. Adjon meg egy nevet es cimet a telephelyhez (pl. "Kozponti iroda — Budapest")
4. Mentse el a telephelyet

## 3. lepes: Szonda telepitese

Minden telephelyhez szukseg van legalabb egy szondara a halozatfelderitest es monitorozashoz.

### A lehetoseg: NetRecon OS (Ajanlott)

1. Navigaljon a **Telephelyek → [Telephelye] → Szondak → Szonda hozzaadasa** menupontba
2. Valassza a **NetRecon OS**-t es toltse le a kepfajlt a hardverehez
3. Irja a kepfajlt egy SD kartyara vagy SSD-re a [balenaEtcher](https://etcher.balena.io/) segitsegevel
4. Csatlakoztassa a szondat a halozathoz Ethernet kabelel
5. Kapcsolja be — a szonda automatikusan csatlakozik a felhos fiokjahoz a Cloudflare Tunnel segitsegevel

### B lehetoseg: Docker meglevo szerveren

```bash
# Szonda kontener letoltese es futtatasa
docker run -d \
  --name netrecon-probe \
  --network host \
  --restart unless-stopped \
  -e ENROLLMENT_TOKEN="a-tokenje-a-vezerlopultrol" \
  netrecon/probe:latest
```

A belepesi tokent a **Telephelyek → [Telephelye] → Szondak → Szonda hozzaadasa → Docker** menupontban talalja.

### C lehetoseg: Virtualis gep

1. Toltse le az OVA fajlt a Vezerlopultrol
2. Importalja VMware, Proxmox vagy Hyper-V kornyezetbe
3. Allitsa be a VM-et **bridged halozati modra** (szukseges a Layer 2 vizsgalathoz)
4. Inditsa el a VM-et — automatikusan megjelenik a Vezerlopulton

## 4. lepes: Vizsgalat inditasa

Amint a szonda online:

1. Navigaljon a **Telephelyek → [Telephelye] → Eszkozok** menupontba
2. Kattintson a **Vizsgalat inditasa** gombra, vagy varja meg az automatikus felderites (15 percenkent fut)
3. A felfedezett eszkozok megjelennek az eszkozleltarban

## 5. lepes: Mobil alkalmazas telepitese

Toltse le a **NetRecon Scanner** alkalmazast a Google Play Aruhazbol halozati vizsgalathoz utkovzben:

- Vizsgaljon barmely halozatot, amelyhez telefonja csatlakozik
- Az eredmenyek automatikusan szinkronizalodnak a felhos vezerlopulttal
- Reszletekert lasd: [Scanner attekintes](../scanner/overview)

## Mi kovetkezik?

- **Agensek telepitese** a vegpontokra a melyebb lathatosagert → [Agenstelepites](../agents/overview)
- **Riasztasok beallitasa** uj eszkozokre, sebezhetosegekre vagy leallasokra
- **Integraciok konfiguracia** meglevo eszkozeihez (LDAP, SIEM, Jira, ServiceNow)
- **Csapata meghivasa** a **Beallitasok → Csapatkezeles** menupontban

## Felho vs. sajat szerver

| Funkcio | Felho | Sajat szerver |
|---|---|---|
| Szerverk ezeles | A NetRecon kezeli | On kezeli |
| Adatok helye | NetRecon Felho (EU) | Sajat infrastruktura |
| Frissitesek | Automatikus | Manualis (docker pull) |
| Cloudflare Tunnel | Benne foglalt | On konfiguralj |
| Arazas | Elofizetes | Licenckulcs |

Inkabb sajat szerverre telepitene? Lasd a [Telepitesi utmutatot](../self-hosting/installation).

Segitsegert forduljon a [support@netreconapp.com](mailto:support@netreconapp.com) cimhez.
