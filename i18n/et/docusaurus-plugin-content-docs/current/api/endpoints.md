---
sidebar_position: 2
title: Lõpp-punktide viide
description: Täielik API lõpp-punktide viide teenuse ja kategooria kaupa
---

# Lõpp-punktide viide

See leht loetleb kõik REST API lõpp-punktid NetReconi platvormis, grupeeritud teenuse kategooria järgi. Kõik lõpp-punktid nõuavad JWT Bearer tõendi autentimist, kui pole teisiti märgitud. Autentimise ja piirangute üksikasju vaadake [API ülevaatest](./overview.md).

**Baas-URL:** `https://probe.netreconapp.com/api/`

---

## Sondi lõpp-punktid

Teenindab Go taustaprogramm, mis töötab sondi seadmel (Orange Pi R2S, Raspberry Pi või x86_64 mini PC).

### Tervis

| Meetod | Tee | Autent | Kirjeldus |
|---|---|---|---|
| `GET` | `/api/health` | Ei | Sondi terviskontroll. Tagastab `{"status": "ok", "version": "1.0.0"}`. |

### Skannimine

| Meetod | Tee | Kirjeldus |
|---|---|---|
| `POST` | `/api/scan/discover` | Käivita ARP hosti tuvastamine konfigureeritud alamvõrgus. |
| `POST` | `/api/scan/ports` | Käivita pordi skannimine avastatud hostide vastu. |
| `GET` | `/api/scan/status` | Hangi praegune skannimise olek (idle, running, complete). |

### Seadmed

| Meetod | Tee | Kirjeldus |
|---|---|---|
| `GET` | `/api/devices` | Loetlege kõik avastatud seadmed. Toetab lehekülgjaotust (`?page=&per_page=`). |
| `GET` | `/api/devices/:mac` | Hangi üksiku seadme üksikasjad MAC-aadressi järgi. |
| `PUT` | `/api/devices/:mac/note` | Uuendage seadme kasutaja märkust. Keha: `{"note": "..."}`. |

### Baasjoone

| Meetod | Tee | Kirjeldus |
|---|---|---|
| `GET` | `/api/baseline` | Loetlege kõik salvestatud võrgu baasjooned. |
| `POST` | `/api/baseline` | Looge uus baasjoone hetktõmmis praegusest seadmete loendist. |
| `GET` | `/api/baseline/:id/diff` | Võrrelge baasjoont praeguse võrgu olekuga. |

### Naabrid (CDP/LLDP)

| Meetod | Tee | Kirjeldus |
|---|---|---|
| `GET` | `/api/neighbors` | Loetlege avastatud CDP/LLDP naabrid. |
| `POST` | `/api/neighbors/start` | Käivitage naabrite tuvastamise kuulaja. |

### Konfiguratsioonide varundamine (sondi lokaalne)

| Meetod | Tee | Kirjeldus |
|---|---|---|
| `GET` | `/api/config/targets` | Loetlege konfigureeritud varunduse sihtseadmed. |
| `POST` | `/api/config/targets` | Lisage uus varunduse sihtseade. |
| `POST` | `/api/config/targets/:id/check` | Käivitage sihtseadme kohene konfiguratsioonikontroll. |

### PCAP salvestamine

| Meetod | Tee | Kirjeldus |
|---|---|---|
| `POST` | `/api/pcap/start` | Alusta pakettide salvestamist. Keha: `{"interface": "eth0", "filter": "tcp port 80"}`. |
| `POST` | `/api/pcap/stop` | Peata käimasolev pakettide salvestamine. |
| `GET` | `/api/pcap/files` | Loetlege saadaolevad PCAP salvestusfailid. |
| `GET` | `/api/pcap/download/:id` | Laadi alla PCAP fail ID järgi. Tagastab `application/octet-stream`. |

### IDS (Suricata)

| Meetod | Tee | Kirjeldus |
|---|---|---|
| `GET` | `/api/ids/status` | Hangi IDS teenuse olek (running, stopped, reeglite arv). |
| `POST` | `/api/ids/start` | Käivita Suricata IDS jälgimine. |
| `POST` | `/api/ids/stop` | Peata IDS jälgimine. |
| `GET` | `/api/ids/alerts` | Loetlege IDS hoiatused. Toetab `?since=24h` ajafiltrit. |

### Haavatavuse skannimine (Nuclei)

| Meetod | Tee | Kirjeldus |
|---|---|---|
| `POST` | `/api/vuln/scan` | Käivita haavatavuse skannimine määratud sihtmärkide vastu. |
| `POST` | `/api/vuln/stop` | Peata käimasolev haavatavuse skannimine. |
| `GET` | `/api/vuln/results` | Hangi haavatavuse skannimise tulemused. |
| `GET` | `/api/vuln/status` | Hangi haavatavuse skanneri olek. |

### Meepott

| Meetod | Tee | Kirjeldus |
|---|---|---|
| `GET` | `/api/honeypot/status` | Hangi meepoti teenuse olek. |
| `POST` | `/api/honeypot/start` | Käivita meepoti teenus. |
| `POST` | `/api/honeypot/stop` | Peata meepoti teenus. |
| `GET` | `/api/honeypot/hits` | Loetlege meepoti interaktsiooni sündmused. |

### Võltsimise tuvastamine

| Meetod | Tee | Kirjeldus |
|---|---|---|
| `GET` | `/api/rogue/status` | Hangi võltsimise tuvastamise teenuse olek. |
| `POST` | `/api/rogue/start` | Käivita võlts-DHCP/ARP tuvastamine. |
| `POST` | `/api/rogue/stop` | Peata võltsimise tuvastamine. |
| `GET` | `/api/rogue/alerts` | Loetlege võlts-DHCP ja ARP-võltsimise hoiatused. |

### Võrgumonitor

| Meetod | Tee | Kirjeldus |
|---|---|---|
| `POST` | `/api/monitor/targets` | Lisa jälgimise sihtmärk (IP või hostinimi). |
| `GET` | `/api/monitor/targets` | Loetlege konfigureeritud jälgimise sihtmärgid. |
| `POST` | `/api/monitor/start` | Käivita võrgu jälgimine. |
| `POST` | `/api/monitor/stop` | Peata võrgu jälgimine. |
| `GET` | `/api/monitor/latency` | Hangi jälgitavate sihtmärkide latentsusmõõtmised. |
| `GET` | `/api/monitor/packetloss` | Hangi jälgitavate sihtmärkide pakettide kao andmed. |
| `GET` | `/api/monitor/status` | Hangi monitori teenuse olek. |

### VPN (WireGuard)

| Meetod | Tee | Kirjeldus |
|---|---|---|
| `POST` | `/api/vpn/setup` | Konfigureeri WireGuard VPN-i parameetrid. |
| `GET` | `/api/vpn/status` | Hangi VPN-ühenduse olek. |
| `POST` | `/api/vpn/start` | Käivita VPN-tunnel. |
| `POST` | `/api/vpn/stop` | Peata VPN-tunnel. |
| `GET` | `/api/vpn/config` | Laadi alla WireGuardi konfiguratsioon. |

### DNS Sinkhole

| Meetod | Tee | Kirjeldus |
|---|---|---|
| `GET` | `/api/dns/status` | Hangi DNS sinkhole teenuse olek. |
| `POST` | `/api/dns/start` | Käivita DNS sinkhole. |
| `POST` | `/api/dns/stop` | Peata DNS sinkhole. |
| `GET` | `/api/dns/threats` | Loetlege blokeeritud DNS ohu kirjed. |

### Süsteemi tervis

| Meetod | Tee | Kirjeldus |
|---|---|---|
| `GET` | `/api/system/health` | Üksikasjalik süsteemi tervis (CPU, RAM, ketas, temperatuur). |
| `GET` | `/api/system/history` | Ajaloolised süsteemi tervise andmepunktid. |
| `GET` | `/api/system/alerts` | Loetlege süsteemi tervise läve hoiatused. |
| `POST` | `/api/system/thresholds` | Konfigureeri tervise hoiatuste läved (CPU %, RAM %, ketas %). |

### Varundamine ja taastamine

| Meetod | Tee | Kirjeldus |
|---|---|---|
| `POST` | `/api/backup/create` | Loo sondi täielik varundus (konfiguratsioon + andmebaas). |
| `GET` | `/api/backup/list` | Loetlege saadaolevad varundusfailid. |
| `GET` | `/api/backup/download/:id` | Laadi alla varundusarhiiv. Tagastab `application/octet-stream`. |
| `POST` | `/api/backup/restore` | Taasta sond varundusfailist. |

### Piletisüsteem

| Meetod | Tee | Kirjeldus |
|---|---|---|
| `GET` | `/api/ticketing/config` | Hangi praegune piletisüsteemi integratsiooni konfiguratsioon. |
| `POST` | `/api/ticketing/config` | Sea piletisüsteemi konfiguratsioon (ServiceNow, Jira, veebikonksu URL). |
| `POST` | `/api/ticketing/test` | Saada testpilet integratsiooni kontrollimiseks. |
| `POST` | `/api/ticketing/create` | Loo pilet hoiatusest või sündmusest. |
| `GET` | `/api/ticketing/history` | Loetlege varem loodud piletid. |

### WebSocket

| Meetod | Tee | Kirjeldus |
|---|---|---|
| `GET` | `/ws/events` | WebSocket ühendus reaalajas sondi sündmuste jaoks. Edasta tõend päringu kaudu: `?token=<jwt>`. |

#### WebSocket sündmuse tüübid

| Sündmus | Kirjeldus |
|---|---|
| `host_found` | Uus seade avastatud |
| `port_found` | Seadmel tuvastatud avatud port |
| `scan_complete` | Võrgu skannimine lõpetatud |
| `neighbor_discovered` | CDP/LLDP naaber leitud |
| `config_changed` | Seadme konfiguratsioon muutunud |
| `baseline_diff_alert` | Võrgu baasjoonest kõrvalekalle tuvastatud |
| `ids_alert` | IDS reegel käivitunud |
| `honeypot_hit` | Meepoti interaktsioon tuvastatud |
| `rogue_detected` | Võlts-DHCP või ARP tegevus |
| `pcap_ready` | PCAP fail allalaadimiseks valmis |
| `vuln_found` | Haavatavus avastatud |
| `dns_threat` | DNS oht blokeeritud |
| `probe_health_alert` | Sondi ressursi lävi ületatud |
| `error` | Veasündmus |

---

## API Gateway lõpp-punktid

Teenindab FastAPI API Gateway (port 8000). Tegeleb autentimise, kasutajahalduse, RBAC ja proksi marsruutimisega taustateenustesse.

### Autentimine

| Meetod | Tee | Kirjeldus |
|---|---|---|
| `POST` | `/api/auth/login` | Autentimine kasutajanime/parooliga, JWT tõendi vastuvõtmine. |
| `POST` | `/api/auth/refresh` | Aeguva JWT tõendi värskendamine. |

### Kasutajad

| Meetod | Tee | Kirjeldus |
|---|---|---|
| `GET` | `/api/users` | Loetlege organisatsiooni kasutajad. |
| `POST` | `/api/users` | Looge uus kasutajakonto. |
| `GET` | `/api/users/:id` | Hangi kasutaja üksikasjad. |
| `PUT` | `/api/users/:id` | Uuendage kasutajat. |
| `DELETE` | `/api/users/:id` | Kustutage kasutaja. |

### RBAC (rollipõhine juurdepääsukontroll)

| Meetod | Tee | Kirjeldus |
|---|---|---|
| `GET` | `/api/rbac/roles` | Loetlege kõik määratud rollid. |
| `POST` | `/api/rbac/roles` | Looge kohandatud roll konkreetsete õigustega. |
| `PUT` | `/api/rbac/roles/:id` | Uuendage rolli õigusi. |
| `DELETE` | `/api/rbac/roles/:id` | Kustutage roll. |
| `GET` | `/api/rbac/permissions` | Loetlege kõik saadaolevad õigused. |

### API võtmed

| Meetod | Tee | Kirjeldus |
|---|---|---|
| `GET` | `/api/keys` | Loetlege organisatsiooni API võtmed. |
| `POST` | `/api/keys` | Looge uus pikaajaline API võti. |
| `DELETE` | `/api/keys/:id` | Tühistage API võti. |

### IP lubatud nimekiri

| Meetod | Tee | Kirjeldus |
|---|---|---|
| `GET` | `/api/ip-allowlist` | Loetlege lubatud IP vahemikud. |
| `POST` | `/api/ip-allowlist` | Lisage IP või CIDR vahemik lubatud nimekirja. |
| `DELETE` | `/api/ip-allowlist/:id` | Eemaldage IP vahemik lubatud nimekirjast. |

### Jälgimine (Prometheus Proxy)

| Meetod | Tee | Kirjeldus |
|---|---|---|
| `GET` | `/api/monitoring/metrics` | Proksi Prometheus mõõdikute lõpp-punkti. |
| `GET` | `/api/monitoring/query` | Proksi PromQL päringu Prometheusele. |

### Oxidized (konfiguratsioonide varunduse proksi)

| Meetod | Tee | Kirjeldus |
|---|---|---|
| `GET` | `/api/oxidized/nodes` | Loetlege Oxidized hallatavad võrgusõlmed. |
| `GET` | `/api/oxidized/nodes/:name` | Hangi sõlme konfiguratsiooniajalugu. |
| `POST` | `/api/oxidized/nodes` | Lisage sõlm Oxidized haldusse. |

### Vault konfiguratsioon

| Meetod | Tee | Kirjeldus |
|---|---|---|
| `GET` | `/api/vault/config` | Hangi vault integratsiooni seaded. |
| `POST` | `/api/vault/config` | Uuendage vault integratsiooni seadeid. |

---

## IPAM teenuse lõpp-punktid

IP-aadresside haldamise teenus (port 8009). Kõik teed on eesliitega `/api/v1/ipam`.

### Prefiksid (alamvõrgud)

| Meetod | Tee | Kirjeldus |
|---|---|---|
| `GET` | `/api/v1/ipam/prefixes` | Loetlege kõik hallatavad prefiksid/alamvõrgud. |
| `POST` | `/api/v1/ipam/prefixes` | Looge uus prefiks. Keha: `prefix` (CIDR notatsioon), `description`, `site`, `status`, valikuline `vlan_id`. |
| `GET` | `/api/v1/ipam/prefixes/:id` | Hangi üksik prefiks ümberarvutatud kasutusprotsendiga. |
| `PUT` | `/api/v1/ipam/prefixes/:id` | Uuendage prefiksit. |
| `DELETE` | `/api/v1/ipam/prefixes/:id` | Kustutage prefiks. Tagastab `204 No Content`. |
| `GET` | `/api/v1/ipam/prefixes/:id/available` | Loetlege prefiksis eraldamata IP-d. Piiratud 256 tulemusele. |
| `POST` | `/api/v1/ipam/prefixes/:id/next-available` | Eraldage prefiksis järgmine vaba IP. Tagastab uue aadressikirje. |

### Aadressid

| Meetod | Tee | Kirjeldus |
|---|---|---|
| `GET` | `/api/v1/ipam/addresses` | Loetlege aadressid. Filtrid: `?prefix_id=`, `?status=`, `?vendor=`, `?search=`. Maks 1000 tulemust. |
| `POST` | `/api/v1/ipam/addresses` | Looge uus IP-aadressi kirje. |
| `GET` | `/api/v1/ipam/addresses/:id` | Hangi üksik aadress UUID järgi. |
| `PUT` | `/api/v1/ipam/addresses/:id` | Uuendage aadressikirjet. |
| `DELETE` | `/api/v1/ipam/addresses/:id` | Kustutage aadressikirje. Tagastab `204 No Content`. |
| `POST` | `/api/v1/ipam/addresses/bulk-import` | Hulgi upsert aadressid IP järgi. Olemasolevad kirjed uuendatakse, uued luuakse. |

### VLAN-id

| Meetod | Tee | Kirjeldus |
|---|---|---|
| `GET` | `/api/v1/ipam/vlans` | Loetlege kõik VLAN-id, järjestatud VLAN ID järgi. |
| `POST` | `/api/v1/ipam/vlans` | Looge uus VLAN-i kirje. Keha: `vlan_id`, `name`, `description`, `status`. |
| `PUT` | `/api/v1/ipam/vlans/:id` | Uuendage VLAN-i. |
| `DELETE` | `/api/v1/ipam/vlans/:id` | Kustutage VLAN. Tagastab `204 No Content`. |

### Analüütika

| Meetod | Tee | Kirjeldus |
|---|---|---|
| `GET` | `/api/v1/ipam/stats` | Üldine IPAM statistika: prefiksite koguarv, aadresside koguarv, keskmine kasutus, konfliktide arv. |
| `GET` | `/api/v1/ipam/utilization` | Prefiksipõhine kasutuse jaotus aadresside arvuga. |
| `GET` | `/api/v1/ipam/conflicts` | Leidke vastuolulised määramised (duplikaat-MAC-d erinevate IP-dega). |

### Import / eksport

| Meetod | Tee | Kirjeldus |
|---|---|---|
| `POST` | `/api/v1/ipam/import/scan` | Importige seadmed NetReconi skannimise koormast. Upsert IP järgi automaatse prefiksi sobitamisega. |
| `GET` | `/api/v1/ipam/export/csv` | Eksportige kõik aadressid CSV-na. Tagastab `text/csv` koos `Content-Disposition` päisega. |
| `GET` | `/api/v1/ipam/export/json` | Eksportige kõik IPAM andmed (prefiksid, aadressid, VLAN-id) JSON-ina. |

---

## CMod teenuse lõpp-punktid

Configuration Management on Demand (port 8008). Pakub SSH ja jadakonsooli juurdepääsu võrguseadmetele. Kõik teed on eesliitega `/api/v1/cmod`.

### Seansid

| Meetod | Tee | Kirjeldus |
|---|---|---|
| `POST` | `/api/v1/cmod/connect` | Ava uus SSH või jadaseansss. Keha: `host`, `device_type`, `username`, `password`, valikuline `port`, `serial_port`. Tagastab seansi teabe `session_id`-ga. |
| `POST` | `/api/v1/cmod/disconnect` | Sulge seanss. Päring: `?session_id=`. |
| `GET` | `/api/v1/cmod/sessions` | Loetlege kõik aktiivsed seansid. |
| `GET` | `/api/v1/cmod/sessions/:session_id` | Hangi seansi üksikasjad ja täielik käsulogi. |
| `DELETE` | `/api/v1/cmod/sessions/:session_id` | Lõpetage seanss. |

### Käsud

| Meetod | Tee | Kirjeldus |
|---|---|---|
| `POST` | `/api/v1/cmod/send-command` | Saada üksik käsk. Keha: `session_id`, `command`, valikuline `expect_string`, `read_timeout`. |
| `POST` | `/api/v1/cmod/send-batch` | Saada mitu käsku järjestikku. Keha: `session_id`, `commands[]`, valikuline `delay_factor`. |

### Konfiguratsiooni toimingud

| Meetod | Tee | Kirjeldus |
|---|---|---|
| `POST` | `/api/v1/cmod/backup` | Hangi seadmest töötav konfiguratsioon. Valib automaatselt õige käsu tootja järgi (Cisco IOS/NX-OS/XR, Huawei, Juniper, Arista, HP). |
| `POST` | `/api/v1/cmod/rollback` | Lükka konfiguratsioonilõik seadmesse konfiguratsioonirežiimis. Keha: `session_id`, `config` (mitmerealine string). |

### Mallid

| Meetod | Tee | Kirjeldus |
|---|---|---|
| `GET` | `/api/v1/cmod/templates` | Loetlege käsumallid. Filtrid: `?vendor=cisco_ios`, `?category=backup`. Eelseadistatud mallid Cisco IOS, Huawei ja Juniper JunOS jaoks. |
| `POST` | `/api/v1/cmod/templates` | Looge kohandatud käsumall. Keha: `name`, `vendor`, `category`, `commands[]`, `description`. |

---

## Agent Registry lõpp-punktid

Agentide haldamise teenus (port 8006). Tegeleb registreerimise, südamelöökide, inventuuri ja juurutamisega Windows, macOS ja Linux agentide jaoks.

### Agendi elutsükkel

| Meetod | Tee | Kirjeldus |
|---|---|---|
| `POST` | `/agents/enroll` | Registreeri uus agent juurutustõendi abil. Keha: `deployment_token`, `hostname`, `os_type`, `os_version`, `arch`, `agent_version`. |
| `POST` | `/agents/heartbeat` | Agendi südamelöök. Päised: `X-Agent-ID`, `X-Session-Key`. |
| `POST` | `/agents/inventory` | Lükka riistvara/tarkvara inventuur. Päised: `X-Agent-ID`, `X-Session-Key`. |
| `GET` | `/agents` | Loetlege kõik organisatsiooni agendid. Päis: `X-Org-ID`. |
| `GET` | `/agents/:agent_id` | Hangi agendi täielikud üksikasjad, sealhulgas riistvara spetsifikatsioonid ja garantii olek. |
| `DELETE` | `/agents/:agent_id` | Eemaldage agent registrist. |

### Juurutustõendid

| Meetod | Tee | Kirjeldus |
|---|---|---|
| `POST` | `/agents/tokens` | Looge juurutustõend. Päised: `X-Org-ID`, `X-User-ID`. Keha: `expires_in_hours`, `max_uses`, `label`, valikuline `site_id`, `metadata`. Tagastab tõendi stringi ja platvormispetsiifilised installimiskäsud. |
| `GET` | `/agents/tokens` | Loetlege organisatsiooni juurutustõendid. Päis: `X-Org-ID`. |
| `DELETE` | `/agents/tokens/:token_id` | Tühistage juurutustõend. |

### Juurutuspaketi generaator

| Meetod | Tee | Kirjeldus |
|---|---|---|
| `POST` | `/agents/deploy/generate` | Genereeri platvormispetsiifilised juurutusartefaktid. Keha: `platform` (windows, linux, macos, ios, android), `method` (msi, powershell, sccm, intune, gpo, pkg, brew, jamf, mdm, deb, rpm, bash, docker, qr, email, mdm_app, managed_play), `role`. Tagastab registreerimistõendi, installimiskäsud, skriptid või manifesti sisu. |
| `GET` | `/agents/deploy/quota` | Hangi organisatsiooni seadme kvoodi kasutus. Päis: `X-Org-ID`. |
| `GET` | `/agents/deploy/platforms` | Loetlege kõik toetatud platvormid ja nende saadaolevad juurutusmeetodid. Autentimist pole vaja. |

### Kaugühendus

| Meetod | Tee | Kirjeldus |
|---|---|---|
| `POST` | `/agents/:agent_id/remote/request` | Taotle uut kaugseanssi (RDP, SSH, VNC, ADB) registreeritud agendile. Päis: `X-User-ID`. Keha: `session_type`, valikuline `credential_id`, `timeout_hours`. |
| `GET` | `/agents/:agent_id/remote/status` | Hangi kaugvalmisoleku olek (võrgus olek, Headscale IP, saadaolevad seansi tüübid). |
| `POST` | `/agents/:agent_id/remote/end` | Lõpetage agendi aktiivne kaugseanss. Päis: `X-User-ID`. |
| `GET` | `/remote/sessions` | Loetlege organisatsiooni kaugseansid. Päis: `X-Org-ID`. Päring: `?active_only=true` (vaikimisi). |
| `POST` | `/agents/:agent_id/remote/ready` | Agendi tagasikutse, kui kaugteenus on ette valmistatud. Päised: `X-Agent-ID`, `X-Session-Key`. |
| `POST` | `/remote/cleanup` | Aegu vanad kaugseansid. Mõeldud sisemise ajastaja/croni kasutuseks. |

---

## Diplomat teenuse lõpp-punktid

E-posti klassifitseerimise ja logianalüüsi teenus (port 8010). Kõik teed on eesliitega `/api/v1/diplomat`.

### Klassifitseerimine

| Meetod | Tee | Kirjeldus |
|---|---|---|
| `POST` | `/api/v1/diplomat/classify` | Klassifitseerige sisendtekst (pilet, hoiatus, e-kiri) kategooriasse ja prioriteeditasemele. |
| `POST` | `/api/v1/diplomat/summarize` | Genereerige antud teksti kokkuvõte. |
| `POST` | `/api/v1/diplomat/translate` | Tõlkige tekst määratud sihtkeelde. |
| `POST` | `/api/v1/diplomat/analyze-log` | Analüüsige logi katkend ja eraldage võtmesündmused, vead ja mustrid. |

### E-posti torustik

| Meetod | Tee | Kirjeldus |
|---|---|---|
| `GET` | `/api/v1/diplomat/emails/stats` | Hangi e-posti töötlemise statistika (vastuvõetud, klassifitseeritud, vastatud arvud). |
| `GET` | `/api/v1/diplomat/emails/recent` | Loetlege hiljuti töödeldud e-kirjad. |

### Tervis

| Meetod | Tee | Autent | Kirjeldus |
|---|---|---|---|
| `GET` | `/api/v1/diplomat/health` | Ei | Diplomat teenuse terviskontroll. |

---

## Teenuse tervise lõpp-punktid

Iga mikroteenus pakub `/health` lõpp-punkti sisemise jälgimise ja koormuse tasakaalustaja kontrollide jaoks.

| Teenus | URL | Port |
|---|---|---|
| API Gateway | `/health` | 8000 |
| Vault Server | `/health` | 8001 |
| License Server | `/health` | 8002 |
| Email Service | `/health` | 8003 |
| Notification Service | `/health` | 8004 |
| Update Server | `/health` | 8005 |
| Agent Registry | `/health` | 8006 |
| Warranty Service | `/health` | 8007 |
| CMod Service | `/health` | 8008 |
| IPAM Service | `/health` | 8009 |
| Diplomat Service | `/health` | 8010 |

---

## Tugi

API-ga seotud küsimuste või probleemide korral võtke ühendust [support@netreconapp.com](mailto:support@netreconapp.com).
