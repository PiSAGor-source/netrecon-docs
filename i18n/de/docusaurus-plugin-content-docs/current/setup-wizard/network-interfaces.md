---
sidebar_position: 2
title: Netzwerkschnittstellen
description: NIC-Rollenzuweisung und Treiberwiederherstellung im Einrichtungsassistenten
---

# Netzwerkschnittstellen

Der Schritt Netzwerkschnittstellen des Einrichtungsassistenten erkennt alle Ethernet-Ports Ihrer Probe und ermöglicht es Ihnen, jedem eine Rolle zuzuweisen. Eine korrekte Schnittstellenzuweisung ist entscheidend für zuverlässiges Scanning und Management-Zugriff.

## Voraussetzungen

- Mindestens ein Ethernet-Kabel vor dem Start des Assistenten angeschlossen
- Bei Multi-NIC-Setups beschriften Sie Ihre Kabel vor dem Einstecken, damit Sie wissen, welcher Port wohin führt

## Schnittstellenerkennung

Wenn Sie Schritt 4 des Assistenten erreichen, sucht das System nach allen verfügbaren Netzwerkschnittstellen und zeigt an:

- **Schnittstellenname** (z.B. `eth0`, `eth1`, `enp1s0`)
- **MAC-Adresse**
- **Verbindungsstatus** (verbunden / getrennt)
- **Geschwindigkeit** (z.B. 1 Gbps, 2,5 Gbps)
- **Treiber** (z.B. `r8169`, `r8152`)

## Schnittstellenrollen

Jeder erkannten Schnittstelle kann eine der folgenden Rollen zugewiesen werden:

### Scan

Die Hauptrolle für Netzwerkerkennung. Diese Schnittstelle sendet ARP-Anfragen, führt Port-Scans durch und erfasst Datenverkehr. Sie sollte mit dem Netzwerksegment verbunden sein, das Sie überwachen möchten.

**Best Practice:** Verbinden Sie mit einem Access-Port Ihres Switches oder einem SPAN/Mirror-Port für passives Monitoring.

### Management

Wird für den Zugriff auf das Probe-Dashboard, den Empfang von Remote-Verbindungen und Systemupdates verwendet. Diese Schnittstelle sollte eine zuverlässige Verbindung haben.

**Best Practice:** Weisen Sie der Management-Schnittstelle eine statische IP zu, damit sich ihre Adresse nicht ändert.

### Uplink

Die Schnittstelle, die mit Ihrem Internet-Gateway verbunden ist. Wird für Cloudflare Tunnel, Systemupdates und externe Konnektivität verwendet. In vielen Setups können die Management- und Uplink-Rollen dieselbe Schnittstelle teilen.

### Unbenutzt

Als „Unbenutzt" gesetzte Schnittstellen werden deaktiviert und nehmen an keiner Netzwerkaktivität teil.

## Beispiele für Rollenzuweisung

### Orange Pi R2S (2 Ports)

```
eth0 (2.5G) → Scan       — verbunden mit Zielnetzwerk-Switch
eth1 (1G)   → Management  — verbunden mit Ihrem Admin-VLAN
```

### Raspberry Pi 4 (1 eingebauter Port + USB-Adapter)

```
eth0        → Scan       — eingebauter Port, verbunden mit Zielnetzwerk
eth1 (USB)  → Management — USB-Ethernet-Adapter, verbunden mit Admin-Netzwerk
```

### x86_64 Mini-PC (4 Ports)

```
eth0  → Scan        — verbunden mit Ziel-VLAN 1
eth1  → Scan        — verbunden mit Ziel-VLAN 2
eth2  → Management  — verbunden mit Admin-Netzwerk
eth3  → Uplink      — verbunden mit Internet-Gateway
```

## Treiberwiederherstellung

Wenn eine Schnittstelle erkannt wird, aber „Kein Treiber" oder „Treiberfehler" anzeigt, enthält der Assistent eine Treiberwiederherstellungsfunktion:

1. Der Assistent prüft seine integrierte Treiberdatenbank auf kompatible Treiber
2. Wenn eine Übereinstimmung gefunden wird, klicken Sie auf **Treiber installieren**, um ihn zu laden
3. Nach der Treiberinstallation erscheint die Schnittstelle mit vollständigen Details
4. Wenn kein passender Treiber gefunden wird, müssen Sie ihn möglicherweise nach Abschluss des Assistenten manuell installieren

:::tip
Das häufigste Treiberproblem tritt bei Realtek USB-Ethernet-Adaptern (`r8152`) auf. NetRecon OS enthält Treiber für die beliebtesten Adapter ab Werk.
:::

## Schnittstellenidentifikation

Wenn Sie unsicher sind, welcher physische Port welchem Schnittstellennamen entspricht:

1. Klicken Sie auf die Schaltfläche **Identifizieren** neben einer Schnittstelle im Assistenten
2. Die Probe lässt die Link-LED an diesem Port 10 Sekunden lang blinken
3. Schauen Sie auf Ihr Probe-Gerät, um zu sehen, welcher Port blinkt

Alternativ können Sie Kabel einzeln ein- und ausstecken und die Änderung des Verbindungsstatus im Assistenten beobachten.

## VLAN-Unterstützung

Wenn Ihr Netzwerk VLANs verwendet, können Sie VLAN-Tagging auf jeder Schnittstelle konfigurieren:

1. Schnittstelle auswählen
2. **VLAN-Tagging** aktivieren
3. VLAN-ID eingeben (1-4094)
4. Die Probe erstellt eine virtuelle Schnittstelle (z.B. `eth0.100`) für dieses VLAN

Dies ist nützlich zum Scannen mehrerer VLANs von einer einzelnen physischen Schnittstelle, die mit einem Trunk-Port verbunden ist.

## FAQ

**F: Kann ich einer Schnittstelle mehrere Rollen zuweisen?**
A: Im Single-Interface-Modus teilen sich Scan- und Management-Rollen einen Port. In anderen Modi sollte jede Schnittstelle eine einzelne dedizierte Rolle haben.

**F: Mein USB-Ethernet-Adapter wird nicht erkannt. Was soll ich tun?**
A: Versuchen Sie einen anderen USB-Port. Wenn der Adapter immer noch nicht erkannt wird, ist er möglicherweise nicht kompatibel. Unterstützte Chipsätze sind Realtek RTL8153, RTL8152, ASIX AX88179 und Intel I225.

**F: Kann ich Schnittstellenrollen nach dem Assistenten ändern?**
A: Ja. Gehen Sie zu **Einstellungen > Netzwerk** im Probe-Dashboard, um Schnittstellenrollen jederzeit neu zuzuweisen.

Für weitere Hilfe kontaktieren Sie [support@netreconapp.com](mailto:support@netreconapp.com).
