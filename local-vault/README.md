# NetRecon Local Vault — Self-Hosted Setup Guide

A standalone, self-hosted secrets vault for on-premise NetRecon deployments. This vault stores probe credentials, API tokens, TLS certificates, and other sensitive configuration data with encryption at rest.

---

## Prerequisites

- Docker Engine 24.0+ and Docker Compose v2
- A Linux host with at least 1 GB RAM and 10 GB disk (Ubuntu 22.04+ recommended)
- OpenSSL (for generating keys and certificates)
- Network access from the probe or server to the vault host on port 8443

---

## 1. Generate Encryption Keys

The vault requires two independent encryption keys and a TLS certificate pair.

### 1.1 Master Key

The master key encrypts all secrets stored in the database. **If you lose this key, all stored secrets are unrecoverable.** Store a backup copy in a physically secure location.

```bash
openssl rand -hex 32
```

### 1.2 Backup Encryption Key

A separate key used to encrypt vault backup files. Keep this distinct from the master key.

```bash
openssl rand -hex 32
```

### 1.3 TLS Certificate

Generate a self-signed certificate (valid for 1 year):

```bash
mkdir -p certs
openssl req -x509 -newkey rsa:4096 \
  -keyout certs/server.key \
  -out certs/server.crt \
  -days 365 -nodes \
  -subj "/CN=netrecon-vault/O=NetRecon"
```

For production, use a certificate issued by your organization's internal CA or a public CA.

---

## 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and set the following values:

| Variable | Description |
|----------|-------------|
| `POSTGRES_PASSWORD` | Strong random password for the PostgreSQL user |
| `VAULT_MASTER_KEY` | The master encryption key from step 1.1 |
| `VAULT_BACKUP_ENCRYPTION_KEY` | The backup key from step 1.2 |
| `VAULT_PORT` | HTTPS port (default: 8443) |
| `VAULT_LOG_LEVEL` | Log verbosity: `debug`, `info`, `warn`, `error` |

---

## 3. Deploy the Vault

### 3.1 Copy TLS Certificates into the Volume

```bash
# Create the named volume and copy certs into it
docker volume create vault-certs

docker run --rm \
  -v vault-certs:/certs \
  -v "$(pwd)/certs":/src:ro \
  alpine sh -c "cp /src/server.crt /src/server.key /certs/ && chmod 600 /certs/server.key"
```

### 3.2 Start the Stack

```bash
docker compose -f docker-compose.local-vault.yml up -d
```

### 3.3 Verify

```bash
# Check container health
docker compose -f docker-compose.local-vault.yml ps

# Test the health endpoint
curl -k https://localhost:8443/health
# Expected: {"status": "ok"}

# Check logs
docker logs netrecon-vault --tail 50
```

---

## 4. Register in the NetRecon Dashboard

Once the vault is running, register it in the NetRecon server dashboard so probes can discover and use it.

1. Log in to the NetRecon dashboard at `https://dashboard.netreconapp.com`.
2. Navigate to **Settings > Vault Servers**.
3. Click **Add Vault**.
4. Fill in:
   - **Name:** A descriptive label (e.g., "HQ Vault", "Branch Office Vault")
   - **URL:** `https://<vault-host>:8443`
   - **TLS Verification:** Upload the CA certificate if using self-signed certs, or enable strict verification for CA-signed certs.
5. Click **Test Connection** to verify reachability.
6. Save.

Probes assigned to this vault will automatically retrieve their secrets from it.

---

## 5. Security Recommendations

### Network

- **Firewall:** Restrict port 8443 to only the IP addresses of probes and the NetRecon server. Block all other inbound traffic.
- **No public exposure:** The vault should never be accessible from the public internet. Use a VPN or private network.
- **TLS only:** Never disable TLS. All vault communication must be encrypted.

### Host

- Run the vault on a dedicated host or VM, not shared with untrusted workloads.
- Keep Docker and the host OS updated with security patches.
- Enable audit logging on the host (`auditd` or equivalent).
- Use a non-root user for Docker if your setup supports rootless Docker.

### Secrets Management

- **Rotate the master key** periodically (at least annually). The vault supports key rotation without downtime — create a new key, re-encrypt, then retire the old key.
- **Rotate the PostgreSQL password** periodically and update `.env`.
- **Never commit** `.env` or key files to version control.
- Store a physical backup of the master key in a safe or HSM.

### Access Control

- Use strong, unique API tokens for each probe connecting to the vault.
- Revoke tokens immediately when a probe is decommissioned.
- Enable rate limiting on the vault if exposed beyond a private network.

---

## 6. Backup and Restore

### 6.1 Create a Backup

Backups are encrypted with the `VAULT_BACKUP_ENCRYPTION_KEY` and stored in the `vault-backups` volume.

```bash
# Trigger a backup via the vault API
curl -k -X POST https://localhost:8443/api/backup/create \
  -H "Authorization: Bearer <admin-token>"

# List available backups
curl -k https://localhost:8443/api/backup/list \
  -H "Authorization: Bearer <admin-token>"
```

### 6.2 Export a Backup File

```bash
# Copy from the Docker volume to the host
docker run --rm \
  -v vault-backups:/backups:ro \
  -v "$(pwd)":/out \
  alpine sh -c "cp /backups/<backup-filename>.enc /out/"
```

### 6.3 Restore from Backup

```bash
# Stop the vault
docker compose -f docker-compose.local-vault.yml stop vault-server

# Copy the backup file into the volume
docker run --rm \
  -v vault-backups:/backups \
  -v "$(pwd)":/src:ro \
  alpine sh -c "cp /src/<backup-filename>.enc /backups/"

# Start the vault
docker compose -f docker-compose.local-vault.yml start vault-server

# Trigger restore via the API
curl -k -X POST https://localhost:8443/api/backup/restore \
  -H "Authorization: Bearer <admin-token>" \
  -d '{"filename": "<backup-filename>.enc"}'
```

### 6.4 Offsite Backup

For disaster recovery, regularly copy encrypted backup files to an offsite location:

```bash
# Example: sync to an S3-compatible bucket
aws s3 cp <backup-filename>.enc s3://netrecon-backups/vault/ --sse AES256
```

Keep at least 7 days of daily backups and 4 weeks of weekly backups.

---

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| `connection refused` on port 8443 | Vault container not running | `docker compose ... up -d` and check logs |
| `certificate verify failed` | Self-signed cert not trusted | Use `-k` for curl testing, or install the CA cert on the client |
| PostgreSQL health check failing | Wrong password or DB name | Verify `.env` values match between vault and postgres services |
| `unable to decrypt` errors | Wrong master key | Ensure `VAULT_MASTER_KEY` matches the key used when secrets were stored |
| Container keeps restarting | Port conflict or missing certs | Check `docker logs netrecon-vault` for the specific error |
