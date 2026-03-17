---
sidebar_position: 2
title: Εγκατάσταση
description: Βήμα-προς-βήμα οδηγός ανάπτυξης αυτο-φιλοξενίας
---

# Εγκατάσταση Αυτο-φιλοξενίας

Αυτός ο οδηγός σας καθοδηγεί στην ανάπτυξη της πλατφόρμας NetRecon στον δικό σας διακομιστή χρησιμοποιώντας Docker Compose.

## Προαπαιτούμενα

- Διακομιστής Linux (συνιστάται Ubuntu 22.04+) ή Windows Server με Docker
- Docker v24.0+ και Docker Compose v2.20+
- Ένα domain name που δείχνει στον διακομιστή σας (π.χ. `netrecon.yourcompany.com`)
- Πιστοποιητικό TLS για το domain σας (ή χρήση Let's Encrypt)
- Τουλάχιστον 4 GB RAM και 40 GB χώρο δίσκου

## Εγκατάσταση σε Linux VPS

### Βήμα 1: Εγκατάσταση Docker

```bash
# Ενημέρωση συστήματος
sudo apt update && sudo apt upgrade -y

# Εγκατάσταση Docker
curl -fsSL https://get.docker.com | sudo sh

# Προσθήκη του χρήστη σας στην ομάδα docker
sudo usermod -aG docker $USER

# Εγκατάσταση plugin Docker Compose
sudo apt install docker-compose-plugin -y

# Επιβεβαίωση εγκατάστασης
docker --version
docker compose version
```

### Βήμα 2: Δημιουργία Καταλόγου Έργου

```bash
sudo mkdir -p /opt/netrecon
cd /opt/netrecon
```

### Βήμα 3: Δημιουργία Αρχείου Περιβάλλοντος

```bash
sudo tee /opt/netrecon/.env << 'EOF'
# Παραμετροποίηση Αυτο-φιλοξενίας NetRecon
NETRECON_DOMAIN=netrecon.yourcompany.com
NETRECON_EMAIL=admin@yourcompany.com

# PostgreSQL
POSTGRES_USER=netrecon
POSTGRES_PASSWORD=CHANGE_ME_TO_A_STRONG_PASSWORD
POSTGRES_DB=netrecon

# Redis
REDIS_PASSWORD=CHANGE_ME_TO_A_STRONG_PASSWORD

# JWT Secret (δημιουργία με: openssl rand -hex 32)
JWT_SECRET=CHANGE_ME_TO_A_RANDOM_HEX_STRING

# Agent Registry
AGENT_REGISTRY_SECRET=CHANGE_ME_TO_A_RANDOM_HEX_STRING
AGENT_JWT_SECRET=CHANGE_ME_TO_A_RANDOM_HEX_STRING

# Email (SMTP)
SMTP_HOST=smtp.yourcompany.com
SMTP_PORT=587
SMTP_USER=noreply@yourcompany.com
SMTP_PASSWORD=CHANGE_ME
SMTP_FROM=NetRecon <noreply@yourcompany.com>

# Άδεια
LICENSE_KEY=your-license-key
EOF
```

:::warning
Αλλάξτε όλους τους προσωρινούς κωδικούς και μυστικά πριν την ανάπτυξη. Χρησιμοποιήστε `openssl rand -hex 32` για να δημιουργήσετε ασφαλείς τυχαίες τιμές.
:::

### Βήμα 4: Δημιουργία Αρχείου Docker Compose

```bash
sudo tee /opt/netrecon/docker-compose.yml << 'YAML'
version: "3.9"

services:
  postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "-a", "${REDIS_PASSWORD}", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  api-gateway:
    image: netrecon/api-gateway:latest
    restart: unless-stopped
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
      REDIS_URL: redis://:${REDIS_PASSWORD}@redis:6379/0
      JWT_SECRET: ${JWT_SECRET}
      LICENSE_KEY: ${LICENSE_KEY}
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy

  vault-server:
    image: netrecon/vault-server:latest
    restart: unless-stopped
    ports:
      - "8001:8001"
    environment:
      DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
      JWT_SECRET: ${JWT_SECRET}
    depends_on:
      postgres:
        condition: service_healthy

  license-server:
    image: netrecon/license-server:latest
    restart: unless-stopped
    ports:
      - "8002:8002"
    environment:
      DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
      LICENSE_KEY: ${LICENSE_KEY}
    depends_on:
      postgres:
        condition: service_healthy

  email-service:
    image: netrecon/email-service:latest
    restart: unless-stopped
    ports:
      - "8003:8003"
    environment:
      SMTP_HOST: ${SMTP_HOST}
      SMTP_PORT: ${SMTP_PORT}
      SMTP_USER: ${SMTP_USER}
      SMTP_PASSWORD: ${SMTP_PASSWORD}
      SMTP_FROM: ${SMTP_FROM}

  notification-service:
    image: netrecon/notification-service:latest
    restart: unless-stopped
    ports:
      - "8004:8004"
    environment:
      DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
      REDIS_URL: redis://:${REDIS_PASSWORD}@redis:6379/1
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy

  update-server:
    image: netrecon/update-server:latest
    restart: unless-stopped
    ports:
      - "8005:8005"
    volumes:
      - update_data:/data/updates

  agent-registry:
    image: netrecon/agent-registry:latest
    restart: unless-stopped
    ports:
      - "8006:8006"
    environment:
      DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
      AGENT_REGISTRY_SECRET: ${AGENT_REGISTRY_SECRET}
      AGENT_JWT_SECRET: ${AGENT_JWT_SECRET}
    depends_on:
      postgres:
        condition: service_healthy

  warranty-service:
    image: netrecon/warranty-service:latest
    restart: unless-stopped
    ports:
      - "8007:8007"
    environment:
      DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
    depends_on:
      postgres:
        condition: service_healthy

  cmod-service:
    image: netrecon/cmod-service:latest
    restart: unless-stopped
    ports:
      - "8008:8008"
    environment:
      DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
      REDIS_URL: redis://:${REDIS_PASSWORD}@redis:6379/2
    depends_on:
      postgres:
        condition: service_healthy

  ipam-service:
    image: netrecon/ipam-service:latest
    restart: unless-stopped
    ports:
      - "8009:8009"
    environment:
      DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
    depends_on:
      postgres:
        condition: service_healthy

  nginx:
    image: nginx:alpine
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./certs:/etc/nginx/certs:ro
    depends_on:
      - api-gateway

volumes:
  postgres_data:
  redis_data:
  update_data:
YAML
```

### Βήμα 5: Δημιουργία Παραμετροποίησης Nginx

```bash
sudo tee /opt/netrecon/nginx.conf << 'CONF'
events {
    worker_connections 1024;
}

http {
    upstream api_gateway {
        server api-gateway:8000;
    }

    server {
        listen 80;
        server_name ${NETRECON_DOMAIN};
        return 301 https://$host$request_uri;
    }

    server {
        listen 443 ssl;
        server_name ${NETRECON_DOMAIN};

        ssl_certificate /etc/nginx/certs/fullchain.pem;
        ssl_certificate_key /etc/nginx/certs/privkey.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;

        location / {
            proxy_pass http://api_gateway;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /ws {
            proxy_pass http://api_gateway;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
        }
    }
}
CONF
```

### Βήμα 6: Εγκατάσταση Πιστοποιητικών TLS

**Επιλογή A: Let's Encrypt (συνιστάται για διακομιστές με πρόσβαση στο διαδίκτυο)**

```bash
sudo apt install certbot -y
sudo certbot certonly --standalone -d netrecon.yourcompany.com

# Αντιγραφή πιστοποιητικών
sudo mkdir -p /opt/netrecon/certs
sudo cp /etc/letsencrypt/live/netrecon.yourcompany.com/fullchain.pem /opt/netrecon/certs/
sudo cp /etc/letsencrypt/live/netrecon.yourcompany.com/privkey.pem /opt/netrecon/certs/
```

**Επιλογή B: Αυτο-υπογεγραμμένο πιστοποιητικό (για εσωτερική χρήση/δοκιμές)**

```bash
sudo mkdir -p /opt/netrecon/certs
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /opt/netrecon/certs/privkey.pem \
  -out /opt/netrecon/certs/fullchain.pem \
  -subj "/CN=netrecon.yourcompany.com"
```

### Βήμα 7: Ανάπτυξη

```bash
cd /opt/netrecon
sudo docker compose up -d
```

Επιβεβαιώστε ότι όλες οι υπηρεσίες εκτελούνται:
```bash
sudo docker compose ps
```

### Βήμα 8: Πρόσβαση στον Πίνακα Ελέγχου

Ανοίξτε τον browser σας και μεταβείτε στο:
```
https://netrecon.yourcompany.com
```

Δημιουργήστε τον αρχικό λογαριασμό διαχειριστή κατά την πρώτη πρόσβαση.

## Εγκατάσταση σε Windows Server

### Βήμα 1: Εγκατάσταση Docker Desktop

1. Κατεβάστε το Docker Desktop από [docker.com](https://www.docker.com/products/docker-desktop/)
2. Εγκαταστήστε με ενεργοποιημένο το WSL2 backend
3. Κάντε επανεκκίνηση του διακομιστή

### Βήμα 2: Ακολουθήστε τα Βήματα Linux

Η ρύθμιση Docker Compose είναι πανομοιότυπη. Ανοίξτε PowerShell και ακολουθήστε τα Βήματα 2-8 παραπάνω, προσαρμόζοντας τις διαδρομές:

```powershell
mkdir C:\netrecon
cd C:\netrecon
# Δημιουργήστε τα .env και docker-compose.yml όπως παραπάνω
docker compose up -d
```

## Μετά την Εγκατάσταση

### Μεταναστεύσεις Βάσης Δεδομένων

Οι μεταναστεύσεις εκτελούνται αυτόματα κατά την πρώτη εκκίνηση. Για χειροκίνητη εκτέλεση:

```bash
docker compose exec api-gateway python manage.py migrate
```

### Παραμετροποίηση Αντιγράφων Ασφαλείας

Ρυθμίστε καθημερινά αντίγραφα ασφαλείας PostgreSQL:

```bash
# Προσθήκη στο crontab
echo "0 2 * * * docker compose -f /opt/netrecon/docker-compose.yml exec -T postgres pg_dump -U netrecon netrecon | gzip > /opt/netrecon/backups/db-\$(date +\%Y\%m\%d).sql.gz" | sudo crontab -
```

### Παρακολούθηση

Έλεγχος υγείας υπηρεσιών:

```bash
# Κατάσταση όλων των υπηρεσιών
docker compose ps

# Αρχεία καταγραφής υπηρεσιών
docker compose logs -f api-gateway

# Χρήση πόρων
docker stats
```

## Ενημέρωση

```bash
cd /opt/netrecon

# Λήψη τελευταίων images
docker compose pull

# Επανεκκίνηση με νέα images
docker compose up -d

# Επιβεβαίωση
docker compose ps
```

## Αντιμετώπιση Προβλημάτων

### Αποτυχία εκκίνησης υπηρεσιών
```bash
# Έλεγχος αρχείων καταγραφής για την αποτυχημένη υπηρεσία
docker compose logs <service-name>

# Συνηθισμένο πρόβλημα: Η PostgreSQL δεν είναι ακόμα έτοιμη
# Λύση: περιμένετε και δοκιμάστε ξανά, ή αυξήστε τις επαναλήψεις healthcheck
```

### Αδυναμία πρόσβασης στον πίνακα ελέγχου
- Βεβαιωθείτε ότι η θύρα 443 είναι ανοιχτή στο firewall σας
- Ελέγξτε ότι τα πιστοποιητικά υπάρχουν στον κατάλογο certs
- Επιβεβαιώστε ότι το DNS του domain δείχνει στον διακομιστή σας

### Σφάλματα σύνδεσης βάσης δεδομένων
- Επιβεβαιώστε ότι η PostgreSQL είναι υγιής: `docker compose exec postgres pg_isready`
- Ελέγξτε ότι τα διαπιστευτήρια στο `.env` ταιριάζουν σε όλες τις υπηρεσίες

## Συχνές Ερωτήσεις

**Ε: Μπορώ να χρησιμοποιήσω εξωτερική βάση δεδομένων PostgreSQL;**
A: Ναι. Αφαιρέστε την υπηρεσία `postgres` από το docker-compose.yml και ενημερώστε τη μεταβλητή περιβάλλοντος `DATABASE_URL` για να δείχνει στην εξωτερική βάση δεδομένων σας.

**Ε: Πώς κλιμακώνω για υψηλή διαθεσιμότητα;**
A: Για αναπτύξεις HA, χρησιμοποιήστε Kubernetes με τα παρεχόμενα Helm charts. Το Docker Compose είναι κατάλληλο για αναπτύξεις μονού διακομιστή.

**Ε: Μπορώ να χρησιμοποιήσω διαφορετικό reverse proxy (π.χ. Traefik, Caddy);**
A: Ναι. Αντικαταστήστε την υπηρεσία Nginx με τον reverse proxy της προτίμησής σας. Βεβαιωθείτε ότι προωθεί στο API Gateway στη θύρα 8000 και υποστηρίζει αναβαθμίσεις WebSocket.

Για επιπλέον βοήθεια, επικοινωνήστε με [support@netreconapp.com](mailto:support@netreconapp.com).
