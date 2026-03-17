---
sidebar_position: 3
title: Netzwerkmodi
description: Single, Dual Scan, Bridge und TAP Netzwerkmodi verstehen
---

# Netzwerkmodi

NetRecon unterstützt vier Netzwerkmodi, die bestimmen, wie sich die Probe mit Ihrem Netzwerk verbindet und es überwacht. Die Wahl des richtigen Modus hängt von Ihrer Hardware, Netzwerktopologie und Ihren Überwachungszielen ab.

## Voraussetzungen

- Mindestens eine Ethernet-Schnittstelle erkannt und mit einer Rolle versehen
- Verständnis Ihrer Netzwerktopologie (Switch-Konfiguration, VLANs usw.)

## Modusvergleich

| Funktion | Single | Dual Scan | Bridge | TAP |
|---|---|---|---|---|
| Mindest-NICs | 1 | 2 | 2 | 2 |
| Aktives Scanning | Ja | Ja | Ja | Nein |
| Passives Monitoring | Eingeschränkt | Eingeschränkt | Ja | Ja |
| Netzwerkunterbrechung | Keine | Keine | Minimal | Keine |
| Inline-Bereitstellung | Nein | Nein | Ja | Nein |
| Am besten für | Kleine Netzwerke | Segmentierte Netzwerke | Volle Sichtbarkeit | Produktionsnetzwerke |

## Single-Interface-Modus

Die einfachste Konfiguration. Ein Ethernet-Port übernimmt alles: Scanning, Management und Internetzugang.

```
┌─────────────────────────────────────────┐
│              Network Switch             │
│                                         │
│  Port 1    Port 2    Port 3    Port 4   │
│    │         │         │         │      │
│    │         │         │         │      │
└────┼─────────┼─────────┼─────────┼──────┘
     │         │         │         │
   Probe    PC/Server  PC/Server  Router
  (eth0)
```

**Funktionsweise:**
- Die Probe verbindet sich mit einem regulären Switch-Port
- ARP-Erkennung und Port-Scanning laufen über dieselbe Schnittstelle
- Management-Dashboard und Fernzugriff nutzen ebenfalls diese Schnittstelle

**Verwendung:**
- Sie haben ein Single-NIC-Gerät (z.B. Raspberry Pi ohne USB-Adapter)
- Kleine Netzwerke (< 50 Geräte)
- Schnelle Bereitstellung, bei der Einfachheit bevorzugt wird

**Einschränkungen:**
- Scan-Datenverkehr teilt sich Bandbreite mit Management-Datenverkehr
- Kann keinen Datenverkehr zwischen anderen Geräten sehen (nur Datenverkehr zur/von der Probe)

## Dual-Scan-Modus

Zwei getrennte Schnittstellen: eine für Scanning und eine für Management/Uplink.

```
┌─────────────────────────────────────────┐
│            Target Network Switch        │
│  Port 1    Port 2    Port 3    Port 4   │
│    │         │         │         │      │
└────┼─────────┼─────────┼─────────┼──────┘
     │         │         │         │
   Probe    PC/Server  PC/Server  │
  (eth0)                          │
                                  │
┌──────────────────────────────────┼──────┐
│         Management Switch        │      │
│  Port 1         Port 2         Port 3   │
│    │               │             │      │
└────┼───────────────┼─────────────┼──────┘
     │               │             │
   Probe          Admin PC       Router
  (eth1)
```

**Funktionsweise:**
- `eth0` (Scan) verbindet sich mit dem Zielnetzwerk für Erkennung und Scanning
- `eth1` (Management) verbindet sich mit Ihrem Admin-Netzwerk für Dashboard-Zugriff

**Verwendung:**
- Sie möchten Scan-Datenverkehr von Management-Datenverkehr trennen
- Zielnetzwerk und Management-Netzwerk befinden sich in unterschiedlichen Subnetzen/VLANs
- Orange Pi R2S oder jedes Dual-NIC-Gerät

**Vorteile:**
- Saubere Trennung von Scan- und Management-Datenverkehr
- Management-Schnittstelle bleibt bei intensiven Scans reaktionsfähig
- Kann ein Netzwerk scannen, auf dem Sie keinen Management-Datenverkehr wünschen

## Bridge-Modus

Die Probe sitzt inline zwischen zwei Netzwerksegmenten, leitet Datenverkehr transparent weiter und inspiziert alle durchlaufenden Pakete.

```
                    ┌──────────┐
                    │  Probe   │
                    │          │
                    │ eth0  eth1│
                    └──┬────┬──┘
                       │    │
          ┌────────────┘    └────────────┐
          │                              │
┌─────────┼──────────┐    ┌─────────────┼─────┐
│   Switch A         │    │       Switch B     │
│   (Upstream)       │    │    (Downstream)    │
│                    │    │                    │
│  Servers / Router  │    │   Workstations     │
└────────────────────┘    └────────────────────┘
```

**Funktionsweise:**
- Die Probe überbrückt `eth0` und `eth1` auf Layer 2
- Sämtlicher Datenverkehr zwischen den beiden Segmenten fließt durch die Probe
- Die Probe inspiziert jedes Paket, ohne ein Routing-Hop zu sein
- Aktives Scanning kann ebenfalls über die Bridge-Schnittstellen durchgeführt werden

**Verwendung:**
- Sie benötigen vollständige Datenverkehrssichtbarkeit (IDS, PCAP-Erfassung)
- Sie möchten Datenverkehr zwischen Netzwerksegmenten überwachen
- Bereitstellung zwischen einem Core-Switch und einem Access-Switch

**Hinweise:**
- Die Probe wird zu einem Single Point of Failure für den überbrückten Pfad
- NetRecon enthält Fail-Open-Fähigkeit: Falls die Probe ausfällt, fließt der Datenverkehr weiter über Hardware-Bypass (auf unterstützten Geräten)
- Fügt minimale Latenz hinzu (< 1ms auf typischer Hardware)

## TAP-Modus

Die Probe empfängt eine Kopie des Netzwerkdatenverkehrs von einem TAP-Gerät oder Switch SPAN/Mirror-Port. Sie arbeitet vollständig passiv.

```
┌─────────────────────────────────────────┐
│              Network Switch             │
│                                         │
│  Port 1    Port 2    SPAN Port          │
│    │         │         │                │
└────┼─────────┼─────────┼────────────────┘
     │         │         │
   Server    Server    Probe
                      (eth0 — Monitor)

                      (eth1 — Management,
                       verbunden mit Admin-Netzwerk)
```

**Funktionsweise:**
- Der Switch sendet eine Kopie des Datenverkehrs an seinen SPAN/Mirror-Port
- Die Scan-Schnittstelle der Probe empfängt diesen gespiegelten Datenverkehr im Promiscuous-Modus
- Keine Pakete werden von der Scan-Schnittstelle zurück ins Netzwerk injiziert
- Eine separate Management-Schnittstelle bietet Dashboard-Zugriff

**Verwendung:**
- Produktionsnetzwerke, in denen das Injizieren von Scan-Datenverkehr nicht akzeptabel ist
- Compliance-Umgebungen, die ausschließlich passives Monitoring erfordern
- Wenn Sie IDS und Datenverkehrsanalyse ohne aktives Scanning wünschen

**Switch konfigurieren:**
- Auf Cisco: `monitor session 1 source vlan 10` / `monitor session 1 destination interface Gi0/24`
- Auf HP/Aruba: `mirror-port <port>`
- Auf Juniper: `set forwarding-options port-mirroring input ingress interface <source>`

**Einschränkungen:**
- Kann kein aktives Scanning (ARP-Erkennung, Port-Scanning) über die TAP-Schnittstelle durchführen
- Geräteerkennung basiert ausschließlich auf beobachtetem Datenverkehr
- Sie könnten Geräte verpassen, die inaktiv sind und während des Beobachtungszeitraums keinen Datenverkehr erzeugen

## Modi nach dem Setup ändern

Sie können den Netzwerkmodus jederzeit über das Probe-Dashboard ändern:

1. Navigieren Sie zu **Einstellungen > Netzwerk**
2. Neuen Modus auswählen
3. Schnittstellenrollen bei Bedarf neu zuweisen
4. Klicken Sie auf **Anwenden**

:::warning
Das Ändern von Netzwerkmodi unterbricht kurzzeitig die Probe-Dienste. Planen Sie Moduswechsel während eines Wartungsfensters.
:::

## FAQ

**F: Welchen Modus empfehlen Sie für die Ersteinrichtung?**
A: Beginnen Sie mit dem **Single-Interface**-Modus für Einfachheit. Sie können später auf Dual Scan oder Bridge-Modus upgraden, wenn sich Ihre Anforderungen weiterentwickeln.

**F: Kann ich den TAP-Modus mit aktivem Scanning kombinieren?**
A: Ja, wenn Sie drei oder mehr Schnittstellen haben. Weisen Sie eine dem TAP (passiv), eine dem aktiven Scanning und eine dem Management zu.

**F: Beeinflusst der Bridge-Modus die Netzwerkleistung?**
A: Die Probe fügt im Bridge-Modus weniger als 1ms Latenz hinzu. Auf dem Orange Pi R2S mit 2,5G-Ports bleibt der Durchsatz bei typischen Unternehmens-Datenverkehrslasten auf Leitungsgeschwindigkeit.

Für weitere Hilfe kontaktieren Sie [support@netreconapp.com](mailto:support@netreconapp.com).
