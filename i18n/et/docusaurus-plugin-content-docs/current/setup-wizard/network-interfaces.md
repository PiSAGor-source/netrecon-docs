---
sidebar_position: 2
title: Võrguliidesed
description: NIC rollide määramine ja draiveri taastamine seadistusviisardis
---

# Võrguliidesed

Seadistusviisardi võrguliideste samm tuvastab kõik teie sondi Etherneti pordid ja laseb teil igale rollid määrata. Õige liidese määramine on kriitilise tähtsusega usaldusväärse skannimise ja haldusjuurdepääsu jaoks.

## Eeltingimused

- Vähemalt üks Etherneti kaabel ühendatud enne viisardi käivitamist
- Mitme NIC-ga seadistuste puhul märgistage kaablid enne ühendamist, et teaksite, milline port kuhu ühendub

## Liidese tuvastamine

Kui jõuate viisardi 4. sammule, otsib süsteem kõik saadaolevad võrguliidesed ja kuvab:

- **Liidese nimi** (nt `eth0`, `eth1`, `enp1s0`)
- **MAC-aadress**
- **Ühenduse olek** (ühendatud / lahti ühendatud)
- **Kiirus** (nt 1 Gbps, 2.5 Gbps)
- **Draiver** (nt `r8169`, `r8152`)

## Liidese rollid

Igale tuvastatud liidesele saab määrata ühe järgmistest rollidest:

### Skannimine

Peamine roll võrgu avastamiseks. See liides saadab ARP-päringuid, teostab portide skannimisi ja hõivab liiklust. See peaks olema ühendatud võrgusegmendiga, mida soovite jälgida.

**Parim praktika:** ühendage kommutaatori juurdepääsupordiga või SPAN/peegelpordiga passiivseks jälgimiseks.

### Haldus

Kasutatakse sondi armatuurlauale juurdepääsuks, kaugühenduste vastuvõtmiseks ja süsteemiuuendusteks. Sellel liidesel peaks olema usaldusväärne ühenduvus.

**Parim praktika:** määrake haldusliidese jaoks staatiline IP, et selle aadress ei muutuks.

### Üleslink

Liides, mis on ühendatud teie interneti lüüsiga. Kasutatakse Cloudflare Tunneli, süsteemiuuenduste ja välise ühenduvuse jaoks. Paljudes seadistustes saavad halduse ja üleslingi rollid jagada sama liidest.

### Kasutamata

"Kasutamata" olekusse seatud liidesed on keelatud ega osale üheski võrgutegevuses.

## Rollide määramise näited

### Orange Pi R2S (2 porti)

```
eth0 (2.5G) → Skannimine  — ühendatud sihtvõrgu kommutaatoriga
eth1 (1G)   → Haldus      — ühendatud teie admin-VLAN-iga
```

### Raspberry Pi 4 (1 sisseehitatud port + USB adapter)

```
eth0        → Skannimine  — sisseehitatud port, ühendatud sihtvõrguga
eth1 (USB)  → Haldus      — USB Etherneti adapter, ühendatud admin-võrguga
```

### x86_64 Mini PC (4 porti)

```
eth0  → Skannimine  — ühendatud siht-VLAN 1-ga
eth1  → Skannimine  — ühendatud siht-VLAN 2-ga
eth2  → Haldus      — ühendatud admin-võrguga
eth3  → Üleslink    — ühendatud interneti lüüsiga
```

## Draiveri taastamine

Kui liides on tuvastatud, kuid näitab "Draiver puudub" või "Draiveri viga", sisaldab viisard draiveri taastamise funktsiooni:

1. Viisard kontrollib oma sisseehitatud draiveri andmebaasist ühilduvaid draivereid
2. Kui vaste leitakse, klõpsake **Paigalda draiver** selle laadimiseks
3. Pärast draiveri paigaldamist kuvatakse liides täielike andmetega
4. Kui ühilduvat draiverit ei leita, peate selle käsitsi paigaldama pärast viisardi lõpetamist

:::tip
Levinuim draiveriprobleem esineb Realtek USB Etherneti adapteritega (`r8152`). NetRecon OS sisaldab draivereid populaarseimate adapterite jaoks valmiskujul.
:::

## Liidese tuvastamine

Kui te pole kindel, milline füüsiline port vastab millisele liidese nimele:

1. Klõpsake nuppu **Tuvasta** liidese kõrval viisardis
2. Sond vilgutab selle pordi ühenduse LED-i 10 sekundit
3. Vaadake oma sondi seadet, et näha, milline port vilgub

Alternatiivina võite ühendada/lahti ühendada kaableid ükshaaval ja jälgida ühenduse oleku muutust viisardis.

## VLAN-i tugi

Kui teie võrk kasutab VLAN-e, saate igale liidesele konfigureerida VLAN-i märgistamise:

1. Valige liides
2. Lubage **VLAN-i märgistamine**
3. Sisestage VLAN ID (1-4094)
4. Sond loob selle VLAN-i jaoks virtuaalse liidese (nt `eth0.100`)

See on kasulik mitme VLAN-i skannimiseks ühest füüsilisest liidesest, mis on ühendatud trunk-pordiga.

## KKK

**K: Kas ma saan ühele liidesele mitu rolli määrata?**
V: Üksiku liidese režiimis jagavad skannimise ja halduse rollid ühte porti. Teistes režiimides peaks igal liidesel olema üks eraldiseisev roll.

**K: Minu USB Etherneti adapterit ei tuvastata. Mida teha?**
V: Proovige teist USB-porti. Kui adapterit ikka ei tuvastata, ei pruugi see olla ühilduv. Toetatud kiibistikud on Realtek RTL8153, RTL8152, ASIX AX88179 ja Intel I225.

**K: Kas ma saan liidese rolle pärast viisardit muuta?**
V: Jah. Navigeerige sondi armatuurlaual **Seaded > Võrk**, et liidese rolle igal ajal ümber määrata.

Täiendava abi saamiseks võtke ühendust [support@netreconapp.com](mailto:support@netreconapp.com).
