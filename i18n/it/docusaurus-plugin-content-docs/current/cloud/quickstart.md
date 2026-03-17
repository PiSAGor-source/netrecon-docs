---
sidebar_position: 1
title: Guida Rapida
description: Inizia con NetRecon Cloud in pochi minuti
---

# Guida Rapida Cloud

NetRecon Cloud è il modo più veloce per iniziare. Nessuna configurazione server, nessun Docker — basta registrarsi, distribuire una sonda e iniziare a scoprire la tua rete.

## Passo 1: Crea il Tuo Account

1. Vai su [app.netreconapp.com](https://app.netreconapp.com) e clicca **Registrati**
2. Inserisci la tua email, il nome dell'azienda e la password
3. Verifica il tuo indirizzo email
4. Accedi alla Dashboard di NetRecon

## Passo 2: Aggiungi il Tuo Primo Sito

1. Nella Dashboard, vai su **Siti** nella barra laterale
2. Clicca **Aggiungi Sito**
3. Inserisci un nome e un indirizzo per il sito (es. "Ufficio Principale — Milano")
4. Salva il sito

## Passo 3: Distribuisci una Sonda

Ogni sito necessita di almeno una sonda per il discovery e il monitoraggio della rete.

### Opzione A: NetRecon OS (Consigliato)

1. Vai su **Siti → [Il Tuo Sito] → Sonde → Aggiungi Sonda**
2. Seleziona **NetRecon OS** e scarica l'immagine per il tuo hardware
3. Scrivi l'immagine su una scheda SD o SSD usando [balenaEtcher](https://etcher.balena.io/)
4. Collega la sonda alla tua rete tramite Ethernet
5. Accendi — la sonda si collegherà automaticamente al tuo account cloud tramite Cloudflare Tunnel

### Opzione B: Docker su Server Esistente

```bash
# Scarica ed esegui il container della sonda
docker run -d \
  --name netrecon-probe \
  --network host \
  --restart unless-stopped \
  -e ENROLLMENT_TOKEN="il-tuo-token-dalla-dashboard" \
  netrecon/probe:latest
```

Ottieni il token di registrazione da **Siti → [Il Tuo Sito] → Sonde → Aggiungi Sonda → Docker**.

### Opzione C: Macchina Virtuale

1. Scarica il file OVA dalla Dashboard
2. Importa in VMware, Proxmox o Hyper-V
3. Configura la VM con **rete a bridge** (necessario per la scansione Layer 2)
4. Avvia la VM — apparirà automaticamente nella tua Dashboard

## Passo 4: Inizia la Scansione

Una volta che la sonda è online:

1. Vai su **Siti → [Il Tuo Sito] → Dispositivi**
2. Clicca **Scansiona Ora** o attendi il discovery automatico (ogni 15 minuti)
3. I dispositivi scoperti appariranno nell'inventario

## Passo 5: Installa l'App Mobile

Scarica **NetRecon Scanner** dal Google Play Store per la scansione di rete in mobilità:

- Scansiona qualsiasi rete a cui il tuo telefono è connesso
- I risultati si sincronizzano automaticamente con la tua dashboard cloud
- Vedi la [Panoramica dello Scanner](../scanner/overview) per i dettagli

## Cosa Fare Dopo?

- **Distribuisci agent** sugli endpoint per una visibilità più approfondita → [Installazione Agent](../agents/overview)
- **Configura gli avvisi** per nuovi dispositivi, vulnerabilità o downtime
- **Configura le integrazioni** con i tuoi strumenti esistenti (LDAP, SIEM, Jira, ServiceNow)
- **Invita il tuo team** tramite **Impostazioni → Gestione Team**

## Cloud vs Self-Hosted

| Funzionalità | Cloud | Self-Hosted |
|---|---|---|
| Gestione server | Gestito da NetRecon | Gestisci tu |
| Posizione dei dati | NetRecon Cloud (EU) | La tua infrastruttura |
| Aggiornamenti | Automatici | Manuali (docker pull) |
| Cloudflare Tunnel | Incluso | Da configurare |
| Prezzi | Abbonamento | Chiave di licenza |

Preferisci il self-hosted? Vedi la [Guida all'Installazione](../self-hosting/installation).

Per assistenza, contatta [support@netreconapp.com](mailto:support@netreconapp.com).
