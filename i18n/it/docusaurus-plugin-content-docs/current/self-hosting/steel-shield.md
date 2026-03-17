---
sidebar_position: 3
title: Steel Shield
description: Funzionalità di hardening della sicurezza per deployment self-hosted
---

# Steel Shield

Steel Shield è il framework di hardening della sicurezza di NetRecon. Fornisce molteplici livelli di protezione per i deployment self-hosted, garantendo l'integrità e l'autenticità di tutti i componenti della piattaforma.

## Panoramica

Steel Shield include quattro meccanismi di sicurezza fondamentali:

| Funzionalità | Scopo |
|---|---|
| **Integrità dei Binari** | Verifica che gli eseguibili non siano stati manomessi |
| **Certificate Pinning** | Previene attacchi man-in-the-middle sulle comunicazioni API |
| **Risposta alla Manomissione** | Rileva e risponde a modifiche non autorizzate |
| **Protezione Runtime** | Protegge contro la manipolazione della memoria e il debugging |

## Verifica dell'Integrità dei Binari

Ogni binario NetRecon (backend della sonda, agent, servizi) è firmato digitalmente. All'avvio, ogni componente verifica la propria integrità.

### Come Funziona

1. Durante la compilazione, ogni binario viene firmato con una chiave privata detenuta da NetRecon
2. La firma viene incorporata nei metadati del binario
3. All'avvio, il binario calcola un hash SHA-256 di se stesso
4. L'hash viene verificato rispetto alla firma incorporata
5. Se la verifica fallisce, il binario rifiuta di avviarsi e registra un avviso

### Verifica Manuale

Verifica manualmente l'integrità di un binario:

```bash
# Verifica il backend della sonda
netrecon-verify /usr/local/bin/netrecon-probe

# Verifica un agent
netrecon-verify /usr/local/bin/netrecon-agent

# Output previsto:
# Binary: /usr/local/bin/netrecon-probe
# SHA-256: a1b2c3d4e5f6...
# Signature: VALID
# Signed by: NetRecon Build System
# Signed at: 2026-03-15T10:00:00Z
```

### Verifica delle Immagini Docker

Le immagini Docker sono firmate usando Docker Content Trust (DCT):

```bash
# Abilita il content trust
export DOCKER_CONTENT_TRUST=1

# Scarica con verifica della firma
docker pull netrecon/api-gateway:latest
```

## Certificate Pinning

Il certificate pinning garantisce che i componenti NetRecon comunichino solo con server legittimi, prevenendo l'intercettazione anche se un'autorità di certificazione viene compromessa.

### Connessioni con Pin

| Connessione | Tipo di Pin |
|---|---|
| Agent verso Sonda | Pin della chiave pubblica |
| Admin Connect verso Sonda | Impronta digitale del certificato |
| Sonda verso Update Server | Pin della chiave pubblica |
| Sonda verso License Server | Impronta digitale del certificato |

### Come Funziona

1. L'hash previsto della chiave pubblica del certificato è incorporato in ogni binario client
2. Quando si stabilisce una connessione TLS, il client estrae la chiave pubblica del server
3. Il client calcola un hash SHA-256 della chiave pubblica
4. Se l'hash non corrisponde al valore fissato, la connessione viene rifiutata
5. Una validazione del pin fallita attiva un avviso di sicurezza

### Rotazione dei Pin

Quando i certificati vengono ruotati:

1. I nuovi pin vengono distribuiti tramite l'update server prima della modifica del certificato
2. Sia i vecchi che i nuovi pin sono validi durante il periodo di transizione
3. Dopo la transizione, i vecchi pin vengono rimossi nel prossimo aggiornamento

Per i deployment self-hosted, aggiorna i pin nella configurazione:

```yaml
# /etc/netrecon/security.yaml
certificate_pins:
  api_gateway:
    - "sha256/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="  # Corrente
    - "sha256/BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB="  # Backup
```

## Risposta alla Manomissione

Steel Shield monitora file critici e configurazioni per modifiche non autorizzate.

### Elementi Monitorati

| Elemento | Frequenza di Controllo | Risposta |
|---|---|---|
| File binari | All'avvio + ogni ora | Avviso + arresto opzionale |
| File di configurazione | Ogni 5 minuti | Avviso + ripristino dal backup |
| Integrità del database | Ogni 15 minuti | Avviso + controllo di coerenza |
| Certificati TLS | Ogni 5 minuti | Avviso se modificati |
| Pacchetti di sistema | Giornaliero | Avviso se modifiche impreviste |

### Azioni di Risposta

Quando viene rilevata una manomissione, Steel Shield può:

1. **Registrare** — registrare l'evento nel log di audit della sicurezza
2. **Avvisare** — inviare una notifica tramite i canali configurati
3. **Ripristinare** — ripristinare il file manomesso da un backup noto
4. **Isolare** — limitare l'accesso alla rete solo alla gestione
5. **Arrestare** — fermare il servizio per prevenire ulteriori compromissioni

Configura il livello di risposta:

```yaml
# /etc/netrecon/security.yaml
tamper_response:
  level: "alert_and_revert"  # Opzioni: log, alert, alert_and_revert, isolate, shutdown
  notify_email: "sicurezza@tuaazienda.com"
```

### Database dell'Integrità dei File

Steel Shield mantiene un database di hash di tutti i file protetti:

```bash
# Inizializza il database dell'integrità
netrecon-shield init

# Controlla l'integrità manualmente
netrecon-shield verify

# Output previsto:
# Checked 47 files
# Status: ALL INTACT
# Last verified: 2026-03-15T14:30:00Z
```

## Protezione Runtime

### Anti-Debugging

In modalità produzione, i binari NetRecon includono misure anti-debugging:
- Rilevamento di debugger collegati (ptrace su Linux, IsDebuggerPresent su Windows)
- Controlli di temporizzazione per l'esecuzione passo-passo
- Quando il debugging viene rilevato in produzione, il processo si chiude in modo controllato

:::info
L'anti-debugging è disabilitato nelle build di sviluppo per consentire i normali flussi di lavoro di debugging.
:::

### Protezione della Memoria

- I dati sensibili (token, chiavi, password) sono archiviati in regioni di memoria protette
- La memoria viene azzerata dopo l'uso per prevenire l'esposizione di dati residui
- Su Linux, `mlock` viene usato per impedire che le pagine sensibili vengano scambiate su disco

## Configurazione

### Abilitare Steel Shield

Steel Shield è abilitato per impostazione predefinita nei deployment di produzione. Configuralo in:

```yaml
# /etc/netrecon/security.yaml
steel_shield:
  enabled: true
  binary_integrity: true
  certificate_pinning: true
  tamper_response: true
  runtime_protection: true
  integrity_check_interval: 3600  # secondi
  tamper_check_interval: 300      # secondi
```

### Disabilitare per lo Sviluppo

Per ambienti di sviluppo e test:

```yaml
steel_shield:
  enabled: false
```

Oppure disabilita funzionalità specifiche:

```yaml
steel_shield:
  enabled: true
  binary_integrity: false   # Salta la verifica degli hash durante lo sviluppo
  runtime_protection: false  # Permetti il collegamento del debugger
```

## Traccia di Audit

Tutti gli eventi di Steel Shield sono registrati nel log di audit della sicurezza:

```bash
# Visualizza gli eventi di sicurezza recenti
netrecon-shield audit --last 24h

# Esporta il log di audit
netrecon-shield audit --export csv --output security-audit.csv
```

Le voci del log di audit includono:
- Timestamp
- Tipo di evento (integrity_check, pin_validation, tamper_detected, ecc.)
- Componente interessato
- Risultato (superato/fallito)
- Azione intrapresa
- Dettagli aggiuntivi

## Considerazioni per il Self-Hosting

Per il self-hosting, tieni presente:

1. **Certificati personalizzati**: Se usi la tua CA, aggiorna la configurazione dei pin del certificato dopo il deployment
2. **Aggiornamenti dei binari**: Dopo l'aggiornamento dei binari, esegui `netrecon-shield init` per ricostruire il database dell'integrità
3. **Backup del database dell'integrità**: Includi `/etc/netrecon/integrity.db` nella tua routine di backup
4. **Monitora gli avvisi**: Configura notifiche via email o webhook per gli avvisi di manomissione

## FAQ

**D: Steel Shield può causare falsi positivi?**
R: I falsi positivi sono rari ma possono verificarsi dopo aggiornamenti di sistema che modificano le librerie condivise. Esegui `netrecon-shield init` dopo gli aggiornamenti di sistema per aggiornare il database dell'integrità.

**D: Steel Shield influisce sulle prestazioni?**
R: L'impatto sulle prestazioni è minimo. I controlli di integrità vengono eseguiti in un thread in background e tipicamente si completano in meno di 1 secondo.

**D: Posso integrare gli avvisi di Steel Shield con il mio SIEM?**
R: Sì. Configura l'output syslog nella configurazione della sicurezza per inoltrare gli eventi al tuo SIEM. Steel Shield supporta i formati di output syslog (RFC 5424) e JSON.

**D: Steel Shield è obbligatorio per i deployment in produzione?**
R: Steel Shield è fortemente consigliato ma non strettamente obbligatorio. Puoi disabilitarlo, ma facendolo rimuovi importanti protezioni di sicurezza.

Per ulteriore assistenza, contatta [support@netreconapp.com](mailto:support@netreconapp.com).
