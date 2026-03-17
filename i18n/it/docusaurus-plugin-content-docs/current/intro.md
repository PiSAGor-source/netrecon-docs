---
slug: /
sidebar_position: 1
title: Iniziare con NetRecon
description: Piattaforma di intelligence di rete per MSP e team IT
---

# Iniziare con NetRecon

NetRecon è una piattaforma di intelligence di rete progettata per MSP e team IT. Fornisce discovery automatico della rete, inventario dei dispositivi, scansione delle vulnerabilità, gestione della configurazione e monitoraggio in tempo reale — il tutto accessibile tramite una dashboard centralizzata, app mobile e API REST.

## Scegli il Tuo Tipo di Deployment

<div className="row" style={{marginTop: '1.5rem'}}>

<div className="col col--6" style={{marginBottom: '1rem'}}>

### Self-Hosted

Distribuisci NetRecon sulla tua infrastruttura utilizzando Docker Compose. Controllo completo sui tuoi dati, nessuna dipendenza esterna.

- [Requisiti di Sistema](self-hosting/requirements)
- [Guida all'Installazione](self-hosting/installation)
- [Riferimento alla Configurazione](self-hosting/configuration)

**Ideale per:** Organizzazioni con requisiti rigorosi di sovranità dei dati, reti air-gapped o infrastruttura server esistente.

</div>

<div className="col col--6" style={{marginBottom: '1rem'}}>

### Cloud (SaaS)

Inizia immediatamente con NetRecon Cloud. Nessuna configurazione server necessaria — basta distribuire le sonde e iniziare a scansionare.

- [Guida Rapida](cloud/quickstart)

**Ideale per:** Team che vogliono essere operativi rapidamente senza gestire l'infrastruttura server.

</div>

</div>

## Componenti della Piattaforma

| Componente | Descrizione |
|---|---|
| **Dashboard** | Pannello di controllo web per tutte le funzionalità di NetRecon |
| **NetRecon Scanner** | App Android per la scansione di rete in mobilità ([Scopri di più](scanner/overview)) |
| **Admin Connect** | App Android di gestione per l'amministrazione remota ([Scopri di più](admin-connect/overview)) |
| **Agent** | Agent leggeri per endpoint Windows, macOS e Linux ([Installazione](agents/overview)) |
| **Sonde** | Sensori di rete basati su hardware o VM per il monitoraggio continuo |
| **API** | API RESTful per automazione e integrazione ([Riferimento API](api/overview)) |

## Hai Bisogno di Aiuto?

- Sfoglia la documentazione usando la barra laterale
- Consulta il [Riferimento API](api/overview) per i dettagli sull'integrazione
- Contatta [support@netreconapp.com](mailto:support@netreconapp.com) per assistenza
