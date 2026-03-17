---
sidebar_position: 1
title: Panoramica Self-Hosting
description: Esegui la piattaforma NetRecon sulla tua infrastruttura
---

# Self-Hosting

NetRecon può essere completamente self-hosted sulla tua infrastruttura, offrendoti il pieno controllo su dati, sicurezza e deployment.

## Perché il Self-Hosting?

| Vantaggio | Descrizione |
|---|---|
| **Sovranità dei Dati** | Tutti i risultati delle scansioni, le configurazioni e i log rimangono sui tuoi server |
| **Conformità** | Soddisfa i requisiti normativi che impongono l'archiviazione dei dati on-premises |
| **Isolamento di Rete** | Funziona in ambienti air-gapped senza dipendenza da internet |
| **Integrazione Personalizzata** | Accesso diretto al database per report e integrazioni personalizzate |
| **Controllo dei Costi** | Nessuna licenza per-sonda per l'infrastruttura server |

## Architettura

Un deployment self-hosted di NetRecon è composto da più microservizi eseguiti in container Docker:

```
┌────────────────────────────────────────────────────────┐
│                    Host Docker                          │
│                                                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐│
│  │ API Gateway  │  │ Vault Server │  │  License     ││
│  │   :8000      │  │   :8001      │  │  Server :8002││
│  └──────────────┘  └──────────────┘  └──────────────┘│
│                                                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐│
│  │ Email        │  │ Notification │  │  Update      ││
│  │ Service :8003│  │ Service :8004│  │  Server :8005││
│  └──────────────┘  └──────────────┘  └──────────────┘│
│                                                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐│
│  │ Agent        │  │ Warranty     │  │  CMod        ││
│  │ Registry:8006│  │ Service :8007│  │  Service:8008││
│  └──────────────┘  └──────────────┘  └──────────────┘│
│                                                        │
│  ┌──────────────┐  ┌──────────────┐                   │
│  │ IPAM         │  │ PostgreSQL   │                   │
│  │ Service :8009│  │   :5432      │                   │
│  └──────────────┘  └──────────────┘                   │
│                                                        │
│  ┌──────────────┐  ┌──────────────┐                   │
│  │ Redis        │  │ Nginx        │                   │
│  │   :6379      │  │ Reverse Proxy│                   │
│  └──────────────┘  └──────────────┘                   │
└────────────────────────────────────────────────────────┘
```

## Panoramica dei Servizi

| Servizio | Porta | Scopo |
|---|---|---|
| API Gateway | 8000 | Routing centrale delle API, autenticazione |
| Vault Server | 8001 | Gestione dei segreti, archiviazione delle credenziali |
| License Server | 8002 | Validazione e gestione delle licenze |
| Email Service | 8003 | Notifiche e avvisi via email |
| Notification Service | 8004 | Notifiche push, webhook |
| Update Server | 8005 | Distribuzione aggiornamenti per sonde e agent |
| Agent Registry | 8006 | Registrazione e gestione degli agent |
| Warranty Service | 8007 | Tracciamento delle garanzie hardware |
| CMod Service | 8008 | Gestione della configurazione dei dispositivi di rete |
| IPAM Service | 8009 | Gestione degli indirizzi IP |

## Opzioni di Deployment

### Docker Compose (Consigliato)

Il modo più semplice per distribuire tutti i servizi. Adatto per deployment di piccole e medie dimensioni.

Vedi la [Guida all'Installazione](./installation.md) per le istruzioni passo passo.

### Kubernetes

Per deployment su larga scala che richiedono alta disponibilità e scalabilità orizzontale. Chart Helm disponibili per ogni servizio.

### Binario Singolo

Per deployment minimali, un singolo binario include tutti i servizi. Adatto per test o ambienti molto piccoli.

## Requisiti di Sistema

| Requisito | Minimo | Consigliato |
|---|---|---|
| SO | Ubuntu 22.04 / Debian 12 | Ubuntu 24.04 LTS |
| CPU | 2 core | 4+ core |
| RAM | 4 GB | 8 GB |
| Disco | 40 GB | 100 GB SSD |
| Docker | v24.0+ | Ultima versione stabile |
| Docker Compose | v2.20+ | Ultima versione stabile |

## Rete

| Porta | Protocollo | Scopo |
|---|---|---|
| 443 | HTTPS | Dashboard web e API (tramite reverse proxy) |
| 80 | HTTP | Reindirizzamento a HTTPS |
| 5432 | TCP | PostgreSQL (interno, non esposto) |
| 6379 | TCP | Redis (interno, non esposto) |

Solo le porte 80 e 443 devono essere esposte esternamente. Tutte le porte dei servizi interni sono accessibili solo all'interno della rete Docker.

## Archiviazione dei Dati

| Dati | Archiviazione | Backup |
|---|---|---|
| Database PostgreSQL | Volume Docker | pg_dump giornaliero |
| File di configurazione | Bind mount | Backup file |
| File caricati | Volume Docker | Backup file |
| Log | Volume Docker | Rotazione dei log |
| Certificati TLS | Bind mount | Backup sicuro |

## Sicurezza

I deployment self-hosted includono tutte le funzionalità di sicurezza:

- Crittografia TLS per tutte le comunicazioni esterne
- Autenticazione basata su JWT
- Controllo degli accessi basato sui ruoli
- Registrazione degli audit
- Verifica dell'integrità Steel Shield (vedi [Steel Shield](./steel-shield.md))

## FAQ

**D: Posso eseguire il self-hosting senza Docker?**
R: Docker Compose è il metodo di deployment consigliato e supportato. Eseguire i servizi direttamente sull'host è possibile ma non ufficialmente supportato.

**D: Come si collegano le sonde a un server self-hosted?**
R: Configura le sonde per puntare all'URL del tuo server invece dell'endpoint predefinito di Cloudflare Tunnel. Aggiorna il `server_url` nella configurazione della sonda.

**D: È inclusa una dashboard web?**
R: Sì. L'API Gateway serve la dashboard web all'URL radice. Accedila tramite il dominio configurato (es. `https://netrecon.tuaazienda.com`).

**D: Posso eseguirlo in un ambiente air-gapped?**
R: Sì. Scarica preventivamente le immagini Docker e trasferiscile sul tuo server air-gapped. La validazione delle licenze può essere configurata per la modalità offline.

Per ulteriore assistenza, contatta [support@netreconapp.com](mailto:support@netreconapp.com).
