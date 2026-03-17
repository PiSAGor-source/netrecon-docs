---
sidebar_position: 1
title: Pika-aloitus
description: Aloita NetRecon Cloudin kaytto minuuteissa
---

# Pilvipalvelun pika-aloitus

NetRecon Cloud on nopein tapa aloittaa. Ei palvelimen asennusta, ei Dockeria -- rekisteroidy, ota mittari kayttoon ja aloita verkon loytaminen.

## Vaihe 1: Luo tilisi

1. Siirry osoitteeseen [app.netreconapp.com](https://app.netreconapp.com) ja napsauta **Rekisteroidy**
2. Syota sahkopostiosoitteesi, yrityksen nimi ja salasana
3. Vahvista sahkopostiosoitteesi
4. Kirjaudu sisaan NetReconin hallintapaneeliin

## Vaihe 2: Lisaa ensimmainen toimipaikkasi

1. Hallintapaneelissa siirry sivupalkissa kohtaan **Toimipaikat**
2. Napsauta **Lisaa toimipaikka**
3. Syota toimipaikan nimi ja osoite (esim. "Paatoimisto -- Helsinki")
4. Tallenna toimipaikka

## Vaihe 3: Ota mittari kayttoon

Jokainen toimipaikka tarvitsee vahintaan yhden mittarin verkon loytamista ja valvontaa varten.

### Vaihtoehto A: NetRecon OS (suositeltu)

1. Siirry kohtaan **Toimipaikat > [Toimipaikkasi] > Mittarit > Lisaa mittari**
2. Valitse **NetRecon OS** ja lataa laitteistollesi sopiva levykuva
3. Kirjoita levykuva SD-kortille tai SSD:lle [balenaEtcherin](https://etcher.balena.io/) avulla
4. Kytke mittari verkkoon Ethernet-kaapelilla
5. Kaynnista -- mittari yhdistaa automaattisesti pilvitiiliisi Cloudflare Tunnelin kautta

### Vaihtoehto B: Docker olemassa olevalla palvelimella

```bash
# Hae ja kaynnista mittarikontti
docker run -d \
  --name netrecon-probe \
  --network host \
  --restart unless-stopped \
  -e ENROLLMENT_TOKEN="rekisteroitymistunnisteesi-hallintapaneelista" \
  netrecon/probe:latest
```

Hanki rekisteroitymistunniste kohdasta **Toimipaikat > [Toimipaikkasi] > Mittarit > Lisaa mittari > Docker**.

### Vaihtoehto C: Virtuaalikone

1. Lataa OVA-tiedosto hallintapaneelista
2. Tuo VMwareen, Proxmoxiin tai Hyper-V:hen
3. Maarita VM:lle **sillattu verkko** (vaaditaan Layer 2 -skannaukseen)
4. Kaynnista VM -- se ilmestyy automaattisesti hallintapaneeliisi

## Vaihe 4: Aloita skannaus

Kun mittari on verkossa:

1. Siirry kohtaan **Toimipaikat > [Toimipaikkasi] > Laitteet**
2. Napsauta **Skannaa nyt** tai odota automaattista loytamista (suoritetaan 15 minuutin valein)
3. Loytyneet laitteet ilmestyvat laiterekisteriin

## Vaihe 5: Asenna mobiilisovellus

Lataa **NetRecon Scanner** Google Play Kaupasta kenttaskannauskayttoon:

- Skannaa mika tahansa verkko, johon puhelimesi on yhdistetty
- Tulokset synkronoituvat automaattisesti pilvi-hallintapaneeliisi
- Katso [Skannerin yleiskatsaus](../scanner/overview) lisatietoja varten

## Mita seuraavaksi?

- **Ota agentit kayttoon** paatepisteilla syvempaa nakyvyytta varten > [Agenttien asennus](../agents/overview)
- **Maarita halytykset** uusille laitteille, haavoittuvuuksille tai katkoksille
- **Maarita integraatiot** olemassa olevien tyokalujesi kanssa (LDAP, SIEM, Jira, ServiceNow)
- **Kutsu tiimisi** kohdassa **Asetukset > Tiiminhallinata**

## Pilvi vs. itse isannoity

| Ominaisuus | Pilvi | Itse isannoity |
|---|---|---|
| Palvelinhallinta | NetReconin hallitsema | Sinun hallinnassasi |
| Tietojen sijainti | NetRecon Cloud (EU) | Oma infrastruktuurisi |
| Paivitykset | Automaattiset | Manuaaliset (docker pull) |
| Cloudflare Tunnel | Sisaltyy | Itse konfiguroit |
| Hinnoittelu | Tilaus | Lisenssiavain |

Tarvitsetko itse isannoidyn vaihtoehdon? Katso [Asennusopas](../self-hosting/installation).

Avun saamiseksi ota yhteytta osoitteeseen [support@netreconapp.com](mailto:support@netreconapp.com).
