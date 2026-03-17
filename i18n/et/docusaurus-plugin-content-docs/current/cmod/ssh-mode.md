---
sidebar_position: 2
title: SSH režiim
description: Ühenduge võrguseadmetega SSH kaudu konfiguratsiooni haldamiseks
---

# SSH režiim

SSH režiim võimaldab ühenduda võrguseadmetega üle võrgu SSH protokolli abil. See on levinuim ühendusmeetod kommutaatorite, ruuterite, tulemüüride ja serverite haldamiseks.

## Eeltingimused

- Sihtseadmel on SSH lubatud
- Sondil on võrguühendus seadme haldus-IP-ga
- Kehtivad SSH mandaadid (kasutajanimi/parool või SSH võti)
- Seadme SSH port on kättesaadav (vaikimisi: 22)

## SSH ühenduse seadistamine

### 1. samm: lisage seade

1. Navigeerige **CMod > Seadmed**
2. Klõpsake **Lisa seade**
3. Täitke ühenduse andmed:

| Väli | Kirjeldus | Näide |
|---|---|---|
| Nimi | Sõbralik seadme nimi | Core-SW-01 |
| IP-aadress | Haldus-IP | 192.168.1.1 |
| Port | SSH port | 22 |
| Seadme tüüp | Tootja/OS | Cisco IOS |
| Kasutajanimi | SSH kasutajanimi | admin |
| Autentimine | Parool või SSH võti | Parool |
| Parool | SSH parool | (krüpteeritud) |

4. Klõpsake **Salvesta ja testi**

### 2. samm: testige ühenduvust

Kui klõpsate **Salvesta ja testi**, CMod:
1. Proovib TCP-ühendust määratud IP-le ja pordile
2. Teostab SSH võtmevahetuse
3. Autendib esitatud mandaatidega
4. Täidab põhikäsu (nt `show version`), et kontrollida seansi toimimist
5. Kuvab tulemuse ja märgib seadme olekusse "Ühendatud" või teatab veast

### 3. samm: avage terminal

1. Klõpsake seadmel CMod seadmete loendis
2. Klõpsake **Terminal**
3. Interaktiivne SSH terminal avaneb teie brauseris WebSocket kaudu
4. Saate tippida käske nagu oleksite otse seadmega ühendatud

## SSH võtme autentimine

Võtmepõhise autentimise jaoks:

1. Seadme lisamisel valige autentimismeetodiks **SSH võti**
2. Kleepige oma privaatvõti (PEM-vormingus) võtme väljale
3. Vajadusel sisestage võtme parool
4. Avalik võti peab olema juba sihtseadmesse paigaldatud

:::tip
SSH võtme autentimine on turvalisem ja soovitatav tootmiskeskkondade jaoks. See võimaldab ka järelevalveta toiminguid nagu ajastatud konfiguratsiooni varundamised.
:::

## Ühenduse seaded

### Ajalõpu konfiguratsioon

| Seade | Vaikeväärtus | Vahemik |
|---|---|---|
| Ühenduse ajalõpp | 10 sekundit | 5-60 sekundit |
| Käsu ajalõpp | 30 sekundit | 10-300 sekundit |
| Jõudeoleku ajalõpp | 15 minutit | 5-60 minutit |
| Elushoidmise intervall | 30 sekundit | 10-120 sekundit |

Konfigureerige neid menüüs **CMod > Seaded > SSH**.

### SSH valikud

| Valik | Vaikeväärtus | Kirjeldus |
|---|---|---|
| Range hostivõtme kontroll | Keelatud | Seadme SSH hostivõtme kontrollimine |
| Eelistatud šifrid | Automaatne | Šifriläbirääkimiste järjekorra ülekirjutamine |
| Terminali tüüp | xterm-256color | Terminali emulatsiooni tüüp |
| Terminali suurus | 80x24 | Veerud x Read |

## Käskude käivitamine

### Interaktiivne terminal

WebSocket terminal pakub reaalajas interaktiivset seanssi:
- Täielik ANSI värvitugi
- Tab-lõpetamine (edastatakse seadmele)
- Käskude ajalugu (üles/alla nooled)
- Kopeeri/kleebi tugi
- Seansi salvestamine (valikuline)

### Käsumallid

Eelmääratud käskude jadade täitmine:

1. Valige seade
2. Klõpsake **Käivita mall**
3. Valige mall
4. Kui mallil on muutujad, täitke väärtused
5. Klõpsake **Täida**

Muutujatega malli näide:

```
configure terminal
interface {{interface}}
description {{description}}
switchport mode access
switchport access vlan {{vlan_id}}
no shutdown
end
write memory
```

### Hulgitäitmine

Käivitage sama käsk või mall mitmes seadmes:

1. Navigeerige **CMod > Hulgioperatsioonid**
2. Valige sihtseadmed (märkeruudud)
3. Valige mall või sisestage käsk
4. Klõpsake **Täida valitutel**
5. Tulemused kuvatakse seadme kohta sakitud vaates

## Konfiguratsiooni varundamine SSH kaudu

CMod saab automaatselt seadmete konfiguratsioone varundada:

1. Navigeerige **CMod > Varunduse ajakava**
2. Klõpsake **Lisa ajakava**
3. Valige varundatavad seadmed
4. Seadistage ajakava (iga päev, iga nädal või kohandatud cron)
5. Valige varunduse käsumall (nt "Show Running Config")
6. Klõpsake **Salvesta**

Varundatud konfiguratsioonid salvestatakse sondile ja sisaldavad:
- Ajatempel
- Seadme hostinimi
- Konfiguratsiooni erinevus eelmisest varundusest
- Täielik konfiguratsiooni tekst

## Veaotsing

### Ühendus keelduti
- Veenduge, et SSH on sihtseadmes lubatud
- Kinnitage, et IP-aadress ja port on õiged
- Kontrollige, et tulemüür ei blokeeri ühendust sondi ja seadme vahel

### Autentimine ebaõnnestus
- Veenduge, et kasutajanimi ja parool/võti on õiged
- Mõned seadmed lukustavad pärast mitut ebaõnnestunud katset; oodake ja proovige uuesti
- Kontrollige, kas seade nõuab kindlat SSH protokolli versiooni (SSHv2)

### Terminal hangub või ei reageeri
- Seade võib oodata käsu lõpetamist; vajutage Ctrl+C
- Kontrollige käsu ajalõpu seadet
- Veenduge, et elushoidmise intervall on konfigureeritud

### Käsud annavad ootamatut väljundit
- Veenduge, et valitud on õige seadme tüüp; erinevad tootjad kasutavad erinevat käsusüntaksit
- Mõned käsud nõuavad kõrgendatud õiguste režiimi (nt `enable` Ciscol)

## KKK

**K: Kas ma saan kasutada SSH hüppehoste / bastionhoste?**
V: Praegu mitte. CMod ühendub otse sondilt sihtseadmesse. Veenduge, et sondil on marsruutimine kõigi hallatavate seadmeteni.

**K: Kas SSH seansid logitakse?**
V: Jah. Kõik CMod kaudu täidetud käsud logitakse auditi jälgimisse kasutajanime, ajatempli, seadme ja käsu tekstiga.

**K: Kas ma saan faile seadmesse SSH kaudu üles laadida?**
V: SCP/SFTP failiedastus on planeeritud tulevasse väljalasskesse. Praegu toetab CMod ainult käsurea interaktsiooni.

Täiendava abi saamiseks võtke ühendust [support@netreconapp.com](mailto:support@netreconapp.com).
