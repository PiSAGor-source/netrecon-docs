---
sidebar_position: 3
title: PowerShell Örnekleri
---

# PowerShell API Örnekleri

## Kurulum

```powershell
$NR_BASE = "https://api.netreconapp.com/api/v1"
$NR_KEY = "nr_live_xxxxxxxxxxxx"
$Headers = @{ "X-API-Key" = $NR_KEY }
```

## Kimlik Doğrulama

### JWT ile Giriş

```powershell
$Body = @{
    email    = "user@company.com"
    password = "your-password"
} | ConvertTo-Json

$Auth = Invoke-RestMethod -Uri "$NR_BASE/auth/login" `
    -Method Post -Body $Body -ContentType "application/json"

$Headers = @{ "Authorization" = "Bearer $($Auth.access_token)" }
```

## Tarama

### Tarama Başlatma

```powershell
$ScanParams = @{
    target  = "192.168.1.0/24"
    profile = "normal"
} | ConvertTo-Json

$Scan = Invoke-RestMethod -Uri "$NR_BASE/scans/start" `
    -Method Post -Headers $Headers -Body $ScanParams `
    -ContentType "application/json"

Write-Host "Scan started: $($Scan.id)"
```

### Tarama Tamamlanmasını Bekleme

```powershell
do {
    Start-Sleep -Seconds 10
    $Status = Invoke-RestMethod -Uri "$NR_BASE/scans/$($Scan.id)" `
        -Headers $Headers
    Write-Host "Progress: $($Status.progress_percent)%"
} while ($Status.status -notin @("completed", "failed"))

Write-Host "Scan $($Status.status). Devices found: $($Status.hosts_found)"
```

### Tarama Sonuçlarını Alma

```powershell
$Result = Invoke-RestMethod -Uri "$NR_BASE/scans/$($Scan.id)/result" `
    -Headers $Headers

$Result.devices | Format-Table ip, hostname, vendor, os_guess
```

## Cihazlar

### Tüm Cihazları Listeleme

```powershell
$Devices = Invoke-RestMethod -Uri "$NR_BASE/devices" -Headers $Headers
$Devices.data | Format-Table ip, hostname, vendor, is_online
```

### Çevrimiçi Cihazları Filtreleme

```powershell
$Online = Invoke-RestMethod -Uri "$NR_BASE/devices?is_online=true" `
    -Headers $Headers
Write-Host "$($Online.meta.total) devices online"
```

### CSV'ye Dışa Aktarma

```powershell
$Devices = Invoke-RestMethod -Uri "$NR_BASE/devices?per_page=1000" `
    -Headers $Headers

$Devices.data | Select-Object ip, hostname, mac, vendor, os_guess, is_online |
    Export-Csv -Path "devices.csv" -NoTypeInformation

Write-Host "Exported $($Devices.data.Count) devices to devices.csv"
```

## Uyarılar

### Açık Uyarıları Alma

```powershell
$Alerts = Invoke-RestMethod -Uri "$NR_BASE/alerts?status=open" `
    -Headers $Headers

$Alerts.data | Sort-Object severity |
    Format-Table @{L="Severity";E={$_.severity.ToUpper()}}, title, device_ip, created_at
```

### Tüm Düşük Öncelikli Uyarıları Onaylama

```powershell
$LowAlerts = Invoke-RestMethod -Uri "$NR_BASE/alerts?status=open&severity=low" `
    -Headers $Headers

foreach ($alert in $LowAlerts.data) {
    Invoke-RestMethod -Uri "$NR_BASE/alerts/$($alert.id)/acknowledge" `
        -Method Post -Headers $Headers
    Write-Host "Acknowledged: $($alert.title)"
}
```

## CVE İstihbaratı

### Kritik CVE Eşleşmelerini Alma

```powershell
$CVEs = Invoke-RestMethod -Uri "$NR_BASE/cve/affected?severity=critical" `
    -Headers $Headers

$CVEs.data | ForEach-Object {
    Write-Host "$($_.cve_id) (CVSS $($_.cvss_score)) -> $($_.affected_devices.Count) devices" `
        -ForegroundColor Red
}
```

## API Anahtarı Yönetimi

### API Anahtarı Oluşturma

```powershell
$KeyData = @{
    name            = "PowerShell Automation"
    permissions     = @("scans_read", "devices_read", "alerts_read")
    expires_in_days = 90
} | ConvertTo-Json

$NewKey = Invoke-RestMethod -Uri "$NR_BASE/api-keys" `
    -Method Post -Headers $Headers -Body $KeyData `
    -ContentType "application/json"

Write-Host "API Key (save now!): $($NewKey.key)" -ForegroundColor Yellow
```

### API Anahtarlarını Listeleme

```powershell
$Keys = Invoke-RestMethod -Uri "$NR_BASE/api-keys" -Headers $Headers
$Keys | Format-Table name, key_prefix, @{L="Permissions";E={$_.permissions.Count}}, created_at, expires_at
```

### API Anahtarını İptal Etme

```powershell
Invoke-RestMethod -Uri "$NR_BASE/api-keys/KEY_UUID" `
    -Method Delete -Headers $Headers
```

## İzleme Betiği

### Günlük Güvenlik Raporu

```powershell
# Run as scheduled task for daily reporting

$Report = [PSCustomObject]@{
    Date          = Get-Date -Format "yyyy-MM-dd"
    OpenAlerts    = (Invoke-RestMethod -Uri "$NR_BASE/alerts?status=open&per_page=1" -Headers $Headers).meta.total
    CriticalCVEs  = (Invoke-RestMethod -Uri "$NR_BASE/cve/affected?severity=critical&per_page=1" -Headers $Headers).meta.total
    OnlineDevices = (Invoke-RestMethod -Uri "$NR_BASE/devices?is_online=true&per_page=1" -Headers $Headers).meta.total
    TotalDevices  = (Invoke-RestMethod -Uri "$NR_BASE/devices?per_page=1" -Headers $Headers).meta.total
}

$Report | Format-List

# Optionally send via email
# Send-MailMessage -To "security@company.com" -Subject "NetRecon Daily Report" -Body ($Report | Out-String)
```

## Hata Yönetimi

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
            Write-Warning "Rate limited. Waiting $RetryAfter seconds..."
            Start-Sleep -Seconds ([int]$RetryAfter)
            Invoke-RestMethod @Params
        }
        else {
            Write-Error "API Error ($StatusCode): $($_.ErrorDetails.Message)"
        }
    }
}

# Usage
$Devices = Invoke-NetReconAPI -Path "/devices"
```
