---
sidebar_position: 1
title: Skanneri ülevaade
description: NetRecon Scanner rakendus — iseseisev Android-võrguskanner
---

# NetRecon Scanner

NetRecon Scanner on iseseisev Android-võrgu turvaauditi tööriist. See töötab iseseisvalt teie Android-seadmes ilma sondi vajaduseta, mistõttu on see ideaalne välitööks, kiireks hindamiseks ja liikvel võrguluureks.

## Põhifunktsioonid

- **ARP-tuvastus** — leidke kõik kohaliku võrgu seadmed ARP-päringute abil
- **Pordi skannimine** — skannige TCP-porte avastatud hostide avatud teenuste leidmiseks
- **Teenuse tuvastamine** — tuvastage töötavad teenused ja nende versioonid bänneri hankimise kaudu
- **Seadme profileerimine** — klassifitseerige seadmed OUI otsingu, avatud portide ja teenuste signatuuride kombineerimise abil
- **WiFi soojuskaart** — visualiseerige traadita signaali tugevust füüsilistes asukohtades
- **PDF-aruanded** — genereerige professionaalsed turvaauditi aruanded
- **SSH terminal** — ühenduge seadmetega otse rakendusest
- **CVE luure** — võrguühenduseta CVE andmebaas haavatavuste otsimiseks
- **Ründepinna kaart** — võrgu avatuse visuaalne esitus
- **Passiivne jälgimine** — pidev taustamonitoring uute seadmete jaoks
- **11 keelt** — täielik lokaliseerimise tugi

## Töörežiimid

NetRecon Scanner toetab kolme töörežiimi, sõltuvalt teie seadme võimalustest:

### Standardrežiim
Töötab mis tahes Android-seadmes ilma eriliste õigusteta. Kasutab standardseid Android-võrgu API-sid tuvastamiseks ja skannimiseks.

### Shizuku režiim
Kasutab [Shizuku](https://shizuku.rikka.app/) teenust kõrgendatud võrgujuurdepääsuks ilma rootita. Võimaldab kiiremat ARP-skannimist ja töötlemata sokli juurdepääsu.

### Root-režiim
Täielik juurdepääs kõigile võrguvõimalustele. Võimaldab kiireimat skannimiskiirust, promiskuiitrežiimi salvestamist ja edasijõudnud funktsioone nagu ARP-võltsimise tuvastamine.

| Funktsioon | Standard | Shizuku | Root |
|---|---|---|---|
| ARP-tuvastus | Aeglane | Kiire | Kiireim |
| Pordi skannimine | Jah | Jah | Jah |
| Töötlemata soklid | Ei | Jah | Jah |
| PCAP salvestamine | Ei | Piiratud | Täielik |
| Passiivne jälgimine | Piiratud | Jah | Jah |

## Skannimistüübid

### ARP-tuvastus
Saadab ARP-päringud igale IP-le sihtmärgi alamvõrgus elavate hostide tuvastamiseks. See on kiireim ja usaldusväärseim meetod seadmete avastamiseks kohalikust võrgust.

### TCP pordi skannimine
Ühendub määratud TCP-portidega igal avastatud hostil. Toetab konfigureeritavaid pordivahemikke ja samaaegsete ühenduste piiranguid.

### Teenuse tuvastamine
Pärast avatud portide leidmist saadab skanner protokollispetsiifilisi sonde töötava teenuse tuvastamiseks. Tunneb ära sadu levinud teenuseid, sealhulgas HTTP, SSH, FTP, SMB, RDP, andmebaasid ja palju muud.

### Seadme profileerimine
Kombineerib mitu andmeallikat seadme tuvastamiseks:
- MAC-aadressi OUI (tootja) otsing
- Avatud portide sõrmejälje sobitamine
- Teenuse bänneri analüüs
- mDNS/SSDP teenuse teated

## Sondi integratsioon

Kuigi Scanner töötab iseseisvalt, saab seda ühendada ka NetRecon Probe'iga täiustatud võimaluste jaoks:

- Vaadake sondi skannimistulemusi kõrvuti kohalike skannimistega
- Käivitage kaugskannimisi rakendusest
- Juurdepääs IDS hoiatustele ja haavatavuse andmetele sondilt
- Kombineerige kohalikud ja sondi andmed aruannetes

Sondiga ühendumiseks minge **Seaded > Sondi ühendus** ja sisestage sondi IP-aadress või skannige sondi juhtpaneeli QR-kood.

## Jõudlus

Skanner on optimeeritud mobiilseadmete jaoks:
- Maksimaalselt 40 samaaegset sokliühendust (kohanduv aku taseme põhjal)
- CPU-intensiivne profileerimine käib eraldatud isolaadis, et hoida kasutajaliidest reageerivana
- OUI andmebaas on laiska laadimisega koos LRU vahemäluga (500 kirjet)
- Akuteadlik skannimine vähendab samaaegsust, kui aku on madal

## KKK

**K: Kas Scanner vajab internetiühendust?**
V: Ei. Kõik skannimise funktsioonid töötavad võrguühenduseta. Internetti on vaja ainult esialgse CVE andmebaasi allalaadimise ja uuenduste jaoks.

**K: Kas ma saan skannida võrke, millega ma pole ühendatud?**
V: Scanner saab avastada ainult seadmeid võrgus, millega teie Android-seade on hetkel Wi-Fi kaudu ühendatud. Kaugvõrkude skannimiseks kasutage sondi.

**K: Kui täpne on seadme profileerimine?**
V: Seadme profileerimine tuvastab seadme tüübi õigesti ligikaudu 85-90% juhtudest. Täpsus paraneb, kui tuvastatakse rohkem porte ja teenuseid (kasutage Standardset või Süva skannimisprofiili).

Lisaabi saamiseks võtke ühendust [support@netreconapp.com](mailto:support@netreconapp.com).
