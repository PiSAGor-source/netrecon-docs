---
sidebar_position: 3
title: PowerShell-Beispiele
---

# PowerShell API-Beispiele

## Einrichtung

```powershell
$NR_BASE = "https://api.netreconapp.com/api/v1"
$NR_KEY = "nr_live_xxxxxxxxxxxx"
$Headers = @{ "X-API-Key" = $NR_KEY }
```

## Authentifizierung

### Anmeldung mit JWT

```powershell
$Body = @{
    email    = "user@company.com"
    password = "your-password"
} | ConvertTo-Json

$Auth = Invoke-RestMethod -Uri "$NR_BASE/auth/login" `
    -Method Post -Body $Body -ContentType "application/json"

$Headers = @{ "Authorization" = "Bearer $($Auth.access_token)" }
```

## Scanning

### Scan starten

```powershell
$ScanParams = @{
    target  = "192.168.1.0/24"
    profile = "normal"
} | ConvertTo-Json

$Scan = Invoke-RestMethod -Uri "$NR_BASE/scans/start" `
    -Method Post -Headers $Headers -Body $ScanParams `
    -ContentType "application/json"

Write-Host "Scan gestartet: $($Scan.id)"
```

### Auf Scan-Abschluss warten

```powershell
do {
    Start-Sleep -Seconds 10
    $Status = Invoke-RestMethod -Uri "$NR_BASE/scans/$($Scan.id)" `
        -Headers $Headers
    Write-Host "Fortschritt: $($Status.progress_percent)%"
} while ($Status.status -notin @("completed", "failed"))

Write-Host "Scan $($Status.status). Gefundene Geräte: $($Status.hosts_found)"
```

### Scanergebnisse abrufen

```powershell
$Result = Invoke-RestMethod -Uri "$NR_BASE/scans/$($Scan.id)/result" `
    -Headers $Headers

$Result.devices | Format-Table ip, hostname, vendor, os_guess
```

## Geräte

### Alle Geräte auflisten

```powershell
$Devices = Invoke-RestMethod -Uri "$NR_BASE/devices" -Headers $Headers
$Devices.data | Format-Table ip, hostname, vendor, is_online
```

### Online-Geräte filtern

```powershell
$Online = Invoke-RestMethod -Uri "$NR_BASE/devices?is_online=true" `
    -Headers $Headers
Write-Host "$($Online.meta.total) Geräte online"
```

### Als CSV exportieren

```powershell
$Devices = Invoke-RestMethod -Uri "$NR_BASE/devices?per_page=1000" `
    -Headers $Headers

$Devices.data | Select-Object ip, hostname, mac, vendor, os_guess, is_online |
    Export-Csv -Path "devices.csv" -NoTypeInformation

Write-Host "$($Devices.data.Count) Geräte nach devices.csv exportiert"
```

## Warnungen

### Offene Warnungen abrufen

```powershell
$Alerts = Invoke-RestMethod -Uri "$NR_BASE/alerts?status=open" `
    -Headers $Headers

$Alerts.data | Sort-Object severity |
    Format-Table @{L="Schweregrad";E={$_.severity.ToUpper()}}, title, device_ip, created_at
```

### Alle niedrigen Warnungen bestätigen

```powershell
$LowAlerts = Invoke-RestMethod -Uri "$NR_BASE/alerts?status=open&severity=low" `
    -Headers $Headers

foreach ($alert in $LowAlerts.data) {
    Invoke-RestMethod -Uri "$NR_BASE/alerts/$($alert.id)/acknowledge" `
        -Method Post -Headers $Headers
    Write-Host "Bestätigt: $($alert.title)"
}
```

## CVE Intelligence

### Kritische CVE-Übereinstimmungen abrufen

```powershell
$CVEs = Invoke-RestMethod -Uri "$NR_BASE/cve/affected?severity=critical" `
    -Headers $Headers

$CVEs.data | ForEach-Object {
    Write-Host "$($_.cve_id) (CVSS $($_.cvss_score)) -> $($_.affected_devices.Count) Geräte" `
        -ForegroundColor Red
}
```

## API-Schlüssel-Verwaltung

### API-Schlüssel erstellen

```powershell
$KeyData = @{
    name            = "PowerShell Automation"
    permissions     = @("scans_read", "devices_read", "alerts_read")
    expires_in_days = 90
} | ConvertTo-Json

$NewKey = Invoke-RestMethod -Uri "$NR_BASE/api-keys" `
    -Method Post -Headers $Headers -Body $KeyData `
    -ContentType "application/json"

Write-Host "API-Schlüssel (jetzt speichern!): $($NewKey.key)" -ForegroundColor Yellow
```

### API-Schlüssel auflisten

```powershell
$Keys = Invoke-RestMethod -Uri "$NR_BASE/api-keys" -Headers $Headers
$Keys | Format-Table name, key_prefix, @{L="Berechtigungen";E={$_.permissions.Count}}, created_at, expires_at
```

### API-Schlüssel widerrufen

```powershell
Invoke-RestMethod -Uri "$NR_BASE/api-keys/KEY_UUID" `
    -Method Delete -Headers $Headers
```

## Überwachungsskript

### Täglicher Sicherheitsbericht

```powershell
# Als geplante Aufgabe für tägliche Berichterstattung ausführen

$Report = [PSCustomObject]@{
    Date          = Get-Date -Format "yyyy-MM-dd"
    OpenAlerts    = (Invoke-RestMethod -Uri "$NR_BASE/alerts?status=open&per_page=1" -Headers $Headers).meta.total
    CriticalCVEs  = (Invoke-RestMethod -Uri "$NR_BASE/cve/affected?severity=critical&per_page=1" -Headers $Headers).meta.total
    OnlineDevices = (Invoke-RestMethod -Uri "$NR_BASE/devices?is_online=true&per_page=1" -Headers $Headers).meta.total
    TotalDevices  = (Invoke-RestMethod -Uri "$NR_BASE/devices?per_page=1" -Headers $Headers).meta.total
}

$Report | Format-List

# Optional per E-Mail senden
# Send-MailMessage -To "security@company.com" -Subject "NetRecon Täglicher Bericht" -Body ($Report | Out-String)
```

## Fehlerbehandlung

```powershell
function Invoke-NetReconAPI {
    param(
        [string]$Path,
        [string]$Method = "Get",
        [object]$Body
    )

    $Params = @{
        Uri     = "$NR_BASE$Path"
        Method  = $Method
        Headers = $Headers
    }

    if ($Body) {
        $Params.Body = ($Body | ConvertTo-Json)
        $Params.ContentType = "application/json"
    }

    try {
        Invoke-RestMethod @Params
    }
    catch {
        $StatusCode = $_.Exception.Response.StatusCode.value__
        if ($StatusCode -eq 429) {
            $RetryAfter = $_.Exception.Response.Headers["Retry-After"]
            Write-Warning "Rate-Limit erreicht. Warte $RetryAfter Sekunden..."
            Start-Sleep -Seconds ([int]$RetryAfter)
            Invoke-RestMethod @Params
        }
        else {
            Write-Error "API-Fehler ($StatusCode): $($_.ErrorDetails.Message)"
        }
    }
}

# Verwendung
$Devices = Invoke-NetReconAPI -Path "/devices"
```
