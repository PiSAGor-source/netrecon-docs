# NetRecon Cloudflare Setup Guide

Complete guide for configuring Cloudflare services to protect the NetRecon platform, including Cloudflare Tunnel, WAF rules, and Cloudflare Access (Zero Trust).

---

## Prerequisites

- A Cloudflare account (Pro plan or higher recommended for advanced WAF features)
- Domain `netreconapp.com` added and active on Cloudflare
- A Linux server (or probe device) with internet access for running `cloudflared`
- `cloudflared` CLI installed on the origin server
- Cloudflare API token with Zone:Edit and Account:Cloudflare Tunnel:Edit permissions (for API-based deployments)

---

## 1. Cloudflare Tunnel Setup

Cloudflare Tunnel replaces traditional port-forwarding by creating an encrypted outbound-only connection from the origin server to the Cloudflare edge.

### 1.1 Install cloudflared

```bash
# Debian / Ubuntu (arm64 or amd64)
curl -fsSL https://pkg.cloudflare.com/cloudflare-main.gpg \
  | sudo tee /usr/share/keyrings/cloudflare-main.gpg >/dev/null

echo "deb [signed-by=/usr/share/keyrings/cloudflare-main.gpg] \
  https://pkg.cloudflare.com/cloudflared $(lsb_release -cs) main" \
  | sudo tee /etc/apt/sources.list.d/cloudflared.list

sudo apt update && sudo apt install -y cloudflared
```

### 1.2 Authenticate

```bash
cloudflared tunnel login
```

This opens a browser window. Select the `netreconapp.com` zone and authorize.

### 1.3 Create the Tunnel

```bash
cloudflared tunnel create netrecon-probe
```

Note the tunnel UUID printed on success (e.g., `a1b2c3d4-...`).

### 1.4 Configure the Tunnel

Create `/etc/cloudflared/config.yml`:

```yaml
tunnel: <TUNNEL_UUID>
credentials-file: /root/.cloudflared/<TUNNEL_UUID>.json

ingress:
  # Probe dashboard (Flutter Web)
  - hostname: probe.netreconapp.com
    service: https://localhost:8443
    originRequest:
      noTLSVerify: true

  # API Gateway
  - hostname: api.netreconapp.com
    service: http://localhost:8000

  # VPN management (Headscale)
  - hostname: vpn.netreconapp.com
    service: http://localhost:8080

  # Dashboard (admin panel)
  - hostname: dashboard.netreconapp.com
    service: http://localhost:3000

  # Catch-all (required)
  - service: http_status:404
```

### 1.5 Create DNS Records

```bash
cloudflared tunnel route dns netrecon-probe probe.netreconapp.com
cloudflared tunnel route dns netrecon-probe api.netreconapp.com
cloudflared tunnel route dns netrecon-probe vpn.netreconapp.com
cloudflared tunnel route dns netrecon-probe dashboard.netreconapp.com
```

### 1.6 Run as a System Service

```bash
sudo cloudflared service install
sudo systemctl enable --now cloudflared
```

Verify:

```bash
sudo systemctl status cloudflared
cloudflared tunnel info netrecon-probe
```

---

## 2. WAF Rules Deployment

WAF rules protect the platform from SQL injection, brute-force attacks, scanner tools, and other threats. The rule definitions are in `docs/cloudflare/waf-rules.json`.

### 2.1 Dashboard Method

1. Navigate to **Security > WAF > Custom rules** in the Cloudflare dashboard.
2. Create each rule from `waf-rules.json` manually:
   - **Block SQL Injection Attempts** (priority 1)
   - **API Rate Limit - Global** — 1000 req/min per IP (priority 2)
   - **Login Rate Limit - Brute Force Protection** — 10 req/min per IP (priority 3)
   - **Challenge Tor Exit Nodes** (priority 4)
   - **Enforce HTTPS Redirect** (priority 5)
   - **Block Suspicious User Agents** (priority 6)
3. Copy the expression field directly from the JSON file.
4. Enable logging on each rule.

### 2.2 API Method

```bash
# Set variables
ZONE_ID="<your-zone-id>"
CF_API_TOKEN="<your-api-token>"

# Get the zone-level custom ruleset ID
RULESET_ID=$(curl -s \
  -H "Authorization: Bearer $CF_API_TOKEN" \
  "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/rulesets" \
  | jq -r '.result[] | select(.phase == "http_request_firewall_custom") | .id')

# If no custom ruleset exists yet, create one
if [ -z "$RULESET_ID" ]; then
  RULESET_ID=$(curl -s -X POST \
    -H "Authorization: Bearer $CF_API_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "name": "NetRecon Custom WAF",
      "kind": "zone",
      "phase": "http_request_firewall_custom",
      "rules": []
    }' \
    "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/rulesets" \
    | jq -r '.result.id')
fi

# Deploy rules from the JSON file
# (Iterate over each rule and POST to the ruleset)
jq -c '.rules[]' docs/cloudflare/waf-rules.json | while read -r rule; do
  curl -s -X POST \
    -H "Authorization: Bearer $CF_API_TOKEN" \
    -H "Content-Type: application/json" \
    -d "$rule" \
    "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/rulesets/$RULESET_ID/rules"
done
```

### 2.3 Managed Rulesets

In addition to custom rules, enable these managed rulesets in **Security > WAF > Managed rules**:

- **Cloudflare Managed Ruleset** — Enable all rules
- **Cloudflare OWASP Core Ruleset** — Set sensitivity to Medium, action to Block
- **Cloudflare Exposed Credentials Check** — Enable for login endpoints

---

## 3. Cloudflare Access Configuration (SSO)

Cloudflare Access provides Zero Trust authentication in front of the NetRecon dashboard and API.

### 3.1 Enable Zero Trust

1. Go to the [Cloudflare Zero Trust dashboard](https://one.dash.cloudflare.com/).
2. Set up your team domain (e.g., `netrecon.cloudflareaccess.com`).

### 3.2 Configure Identity Providers

1. Navigate to **Settings > Authentication > Login methods**.
2. Add at least one provider:
   - **One-time PIN (OTP)** — Always enable as a fallback.
   - **Google Workspace** — For organizations using Google.
   - **Azure AD / Entra ID** — For Microsoft environments.
   - **GitHub** — For development teams.
3. Configure each provider with the appropriate OAuth client ID and secret.

### 3.3 Create Access Applications

#### Dashboard Application

1. Go to **Access > Applications > Add an application**.
2. Select **Self-hosted**.
3. Configure:
   - **Name:** NetRecon Dashboard
   - **Subdomain:** `dashboard` / **Domain:** `netreconapp.com`
   - **Session duration:** 8 hours
4. Add an Access policy:
   - **Name:** Authorized Users
   - **Action:** Allow
   - **Include:** Emails ending in `@yourcompany.com` (or specific emails)
5. Save.

#### API Application

1. Add another self-hosted application:
   - **Name:** NetRecon API
   - **Subdomain:** `api` / **Domain:** `netreconapp.com`
   - **Session duration:** 24 hours
2. Add a policy:
   - **Name:** Service Auth
   - **Action:** Allow
   - **Include:** Service tokens or specific email groups
3. Enable **CORS** settings if the dashboard is on a different subdomain.

#### Probe Application

1. Add another self-hosted application:
   - **Name:** NetRecon Probe
   - **Subdomain:** `probe` / **Domain:** `netreconapp.com`
   - **Session duration:** 4 hours
2. Add a policy:
   - **Name:** Probe Operators
   - **Action:** Allow
   - **Include:** Authorized email group

### 3.4 Application Audience (AUD) Tags

After creating each application, note the **Application Audience (AUD)** tag from the application's overview page. These are needed for JWT verification in the API gateway middleware (`cloudflare_access.py`).

---

## 4. Recommended Security Levels

Configure the security level per subdomain under **Security > Settings**:

| Subdomain                  | Security Level | SSL Mode   | Min TLS | Notes                         |
|----------------------------|----------------|------------|---------|-------------------------------|
| `dashboard.netreconapp.com`| High           | Full (Strict) | 1.2  | Admin panel, always protected |
| `api.netreconapp.com`      | High           | Full (Strict) | 1.2  | All API traffic               |
| `probe.netreconapp.com`    | High           | Full (Strict) | 1.2  | Probe dashboard               |
| `vpn.netreconapp.com`      | Off            | Full (Strict) | 1.2  | VPN traffic, no WAF needed    |

### Additional SSL/TLS Settings

- **Always Use HTTPS:** Enabled
- **Automatic HTTPS Rewrites:** Enabled
- **HTTP Strict Transport Security (HSTS):**
  - `max-age`: 31536000 (1 year)
  - `includeSubDomains`: Yes
  - `preload`: Yes
- **Minimum TLS Version:** 1.2
- **Opportunistic Encryption:** Enabled
- **TLS 1.3:** Enabled

---

## 5. Testing and Verification

### 5.1 Tunnel Connectivity

```bash
# Check tunnel status
cloudflared tunnel info netrecon-probe

# Verify DNS resolution
dig probe.netreconapp.com +short
# Should return Cloudflare IPs (104.x.x.x or 172.x.x.x)

# Test end-to-end connectivity
curl -I https://probe.netreconapp.com/api/health
```

### 5.2 WAF Rules

```bash
# Test SQL injection block (should return 403)
curl -o /dev/null -s -w "%{http_code}" \
  "https://api.netreconapp.com/api/devices?id=1%20UNION%20SELECT%20*"

# Test rate limiting (send 15 rapid login requests, last ones should be blocked)
for i in $(seq 1 15); do
  curl -s -o /dev/null -w "$i: %{http_code}\n" \
    -X POST https://api.netreconapp.com/api/auth/login \
    -d '{"email":"test@test.com","password":"test"}'
done

# Test suspicious user agent block (should return 403)
curl -o /dev/null -s -w "%{http_code}" \
  -A "sqlmap/1.5" \
  "https://api.netreconapp.com/api/devices"
```

### 5.3 Cloudflare Access

```bash
# Without auth — should redirect to Cloudflare login
curl -s -o /dev/null -w "%{http_code}" \
  https://dashboard.netreconapp.com
# Expected: 302 (redirect to login)

# Verify JWT header is set after authentication
# (Log in via browser, then check cookies for CF_Authorization)
```

### 5.4 Monitoring

- **Cloudflare Dashboard > Analytics > Security:** Review blocked requests and rate-limit events.
- **Cloudflare Dashboard > Zero Trust > Logs:** Review Access authentication events.
- **Firewall Events Log:** Check for false positives during the first 48 hours and adjust rules as needed.

---

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| 502 Bad Gateway | Origin server unreachable via tunnel | Check `cloudflared` service is running and `config.yml` service URLs are correct |
| 403 on legitimate requests | WAF false positive | Review Firewall Events, add an exception rule for the affected path |
| Access login loop | Session cookie domain mismatch | Verify application subdomain matches exactly in Access settings |
| Tunnel disconnects | Network instability | `cloudflared` auto-reconnects; check logs with `journalctl -u cloudflared` |
| Rate limit too aggressive | Threshold too low | Adjust `requests_per_period` in the WAF rule |
