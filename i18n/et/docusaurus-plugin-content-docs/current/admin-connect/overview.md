---
sidebar_position: 1
title: Admin Connecti ülevaade
description: Mobiilne haldusrakendus NetReconi sondide pargi administreerimiseks
---

# Admin Connect

Admin Connect on mobiilne haldusrakendus teie NetReconi sondide pargi kontrollimiseks ja jälgimiseks. See ühendub sondidega Cloudflare Tunneli kaudu turvaliseks kaugjuurdepääsuks kõikjalt.

## Põhifunktsioonid

- **Pargi haldamine** — hallake mitut sondi ühest rakendusest
- **Kaugjälgimine** — vaadake sondi tervist, skannimistulemusi ja hoiatusi reaalajas
- **IDS hoiatused** — saage ja vaadake üle Suricata IDS hoiatusi
- **Haavatavuse skannimine** — käivitage ja vaadake üle Nuclei haavatavuse skannimisi
- **PCAP salvestamine** — käivitage/peatage pakettide salvestamist kaugelt
- **Meepoti jälgimine** — jälgige meepoti tabamusi ja ründajate käitumist
- **Võltsimise tuvastamine** — saage hoiatusi võlts-DHCP/ARP tegevuse kohta
- **Võrgumonitor** — jälgige latentsust ja pakettide kadu kogu võrgus
- **WireGuard VPN** — hallake VPN-ühendusi sondidega
- **Piletisüsteemi integratsioon** — looge ja hallake tugipileteid
- **SSO/2FA** — ettevõtte autentimine ühekordse sisselogimise ja kaheastmelise autentimisega
- **Rollipõhine juurdepääs** — detailsed õigused kasutajarolli kohta

## Kuidas see töötab

Admin Connectil **pole** oma skannimimootorit. See on puhtalt NetReconi sondide kaughalduslides.

```
┌──────────────┐       HTTPS/WSS        ┌─────────────────┐
│ Admin Connect├───────────────────────►│ Cloudflare Tunnel│
│   (Mobile)   │   (via Cloudflare)      │                 │
└──────────────┘                         └────────┬────────┘
                                                  │
                                         ┌────────▼────────┐
                                         │  NetRecon Probe  │
                                         │  (REST + WS API) │
                                         └─────────────────┘
```

Kogu suhtlus Admin Connecti ja sondi vahel on krüpteeritud:
- **HTTPS** REST API päringute jaoks
- **WebSocket Secure (WSS)** reaalajas sündmuste jaoks
- **mTLS** vastastikuse sertifikaadi autentimise jaoks

## Alustamine

1. Installige Admin Connect Google Play poest (pakett: `com.netreconapp.connect`)
2. Avage rakendus ja looge konto või logige sisse SSO-ga
3. Lisage sond ühel neist viisidest:
   - **QR-kood** — skannige QR-kood sondi seadistusviisardist või juhtpaneelilt
   - **Käsitsi** — sisestage sondi tunneli URL ja autentimistõend
4. Sond ilmub teie pargi juhtpaneelile

Üksikasjalikke seadistamisjuhiseid vaadake [Registreerimisest](./enrollment.md).

## Reaalajas sündmused

Admin Connect hoiab püsiühendust iga sondiga WebSocketi kaudu. Saate koheseid teavitusi järgmiste sündmuste kohta:

| Sündmus | Kirjeldus |
|---|---|
| `ids_alert` | Suricata IDS käivitas reegli |
| `honeypot_hit` | Ründaja suhtles meepotiga |
| `rogue_detected` | Tuvastati võlts-DHCP või ARP-võltsimine |
| `vuln_found` | Haavatavuse skannimine leidis tulemuse |
| `host_found` | Võrgust avastati uus seade |
| `baseline_diff_alert` | Tuvastati võrgu baasjoonest kõrvalekalle |
| `probe_health_alert` | Sondi CPU, RAM või ketta lävi ületatud |
| `pcap_ready` | PCAP salvestusfail allalaadimiseks valmis |
| `dns_threat` | DNS sinkhole blokeeris ohu |

## Toetatud toimingud

Admin Connectist saate kaugelt:

- Käivitada/peatada võrgu skannimisi
- Vaadata ja eksportida skannimistulemusi
- Käivitada/peatada PCAP salvestamist ja faile alla laadida
- Lubada/keelata IDS jälgimist
- Käivitada haavatavuse skannimisi
- Konfigureerida ja hallata meepotti
- Seadistada võlts-DHCP/ARP tuvastamist
- Konfigureerida DNS sinkhole reegleid
- Hallata WireGuard VPN-ühendusi
- Luua varunduse hetktõmmiseid
- Taastada varundusest
- Vaadata süsteemi tervist ja ressursikasutust
- Hallata kasutajakontosid ja rolle

## KKK

**K: Kas Admin Connect töötab ilma internetita?**
V: Admin Connect vajab internetiühendust sondile juurdepääsuks Cloudflare Tunneli kaudu. Kohaliku võrgujuurdepääsu jaoks kasutage sondi veebijuhtpaneeli otse.

**K: Kui palju sonde saan hallata?**
V: Sondide arvul pole piirangut. Admin Connect toetab ettevõtte mastaabis pargi haldamist.

**K: Kas Admin Connect on saadaval iOS-ile?**
V: iOS-i versioon on planeeritud. Hetkel on Admin Connect saadaval Androidi jaoks.

Lisaabi saamiseks võtke ühendust [support@netreconapp.com](mailto:support@netreconapp.com).
