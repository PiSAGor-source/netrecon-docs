---
sidebar_position: 3
title: Ejemplos PowerShell
---

# Ejemplos de API con PowerShell

## Configuración

```powershell
$NR_BASE = "https://api.netreconapp.com/api/v1"
$NR_KEY = "nr_live_xxxxxxxxxxxx"
$Headers = @{ "X-API-Key" = $NR_KEY }
```

## Autenticación

### Inicio de Sesión con JWT

```powershell
$Body = @{
    email    = "user@company.com"
    password = "su-contraseña"
} | ConvertTo-Json

$Auth = Invoke-RestMethod -Uri "$NR_BASE/auth/login" `
    -Method Post -Body $Body -ContentType "application/json"

$Headers = @{ "Authorization" = "Bearer $($Auth.access_token)" }
```

## Escaneo

### Iniciar un Escaneo

```powershell
$ScanParams = @{
    target  = "192.168.1.0/24"
    profile = "normal"
} | ConvertTo-Json

$Scan = Invoke-RestMethod -Uri "$NR_BASE/scans/start" `
    -Method Post -Headers $Headers -Body $ScanParams `
    -ContentType "application/json"

Write-Host "Escaneo iniciado: $($Scan.id)"
```

### Esperar Finalización del Escaneo

```powershell
do {
    Start-Sleep -Seconds 10
    $Status = Invoke-RestMethod -Uri "$NR_BASE/scans/$($Scan.id)" `
        -Headers $Headers
    Write-Host "Progreso: $($Status.progress_percent)%"
} while ($Status.status -notin @("completed", "failed"))

Write-Host "Escaneo $($Status.status). Dispositivos encontrados: $($Status.hosts_found)"
```

### Obtener Resultados del Escaneo

```powershell
$Result = Invoke-RestMethod -Uri "$NR_BASE/scans/$($Scan.id)/result" `
    -Headers $Headers

$Result.devices | Format-Table ip, hostname, vendor, os_guess
```

## Dispositivos

### Listar Todos los Dispositivos

```powershell
$Devices = Invoke-RestMethod -Uri "$NR_BASE/devices" -Headers $Headers
$Devices.data | Format-Table ip, hostname, vendor, is_online
```

### Filtrar Dispositivos En Línea

```powershell
$Online = Invoke-RestMethod -Uri "$NR_BASE/devices?is_online=true" `
    -Headers $Headers
Write-Host "$($Online.meta.total) dispositivos en línea"
```

### Exportar a CSV

```powershell
$Devices = Invoke-RestMethod -Uri "$NR_BASE/devices?per_page=1000" `
    -Headers $Headers

$Devices.data | Select-Object ip, hostname, mac, vendor, os_guess, is_online |
    Export-Csv -Path "devices.csv" -NoTypeInformation

Write-Host "Exportados $($Devices.data.Count) dispositivos a devices.csv"
```

## Alertas

### Obtener Alertas Abiertas

```powershell
$Alerts = Invoke-RestMethod -Uri "$NR_BASE/alerts?status=open" `
    -Headers $Headers

$Alerts.data | Sort-Object severity |
    Format-Table @{L="Severidad";E={$_.severity.ToUpper()}}, title, device_ip, created_at
```

### Confirmar Todas las Alertas Bajas

```powershell
$LowAlerts = Invoke-RestMethod -Uri "$NR_BASE/alerts?status=open&severity=low" `
    -Headers $Headers

foreach ($alert in $LowAlerts.data) {
    Invoke-RestMethod -Uri "$NR_BASE/alerts/$($alert.id)/acknowledge" `
        -Method Post -Headers $Headers
    Write-Host "Confirmada: $($alert.title)"
}
```

## Inteligencia CVE

### Obtener Coincidencias CVE Críticas

```powershell
$CVEs = Invoke-RestMethod -Uri "$NR_BASE/cve/affected?severity=critical" `
    -Headers $Headers

$CVEs.data | ForEach-Object {
    Write-Host "$($_.cve_id) (CVSS $($_.cvss_score)) -> $($_.affected_devices.Count) dispositivos" `
        -ForegroundColor Red
}
```

## Gestión de Claves de API

### Crear una Clave de API

```powershell
$KeyData = @{
    name            = "Automatización PowerShell"
    permissions     = @("scans_read", "devices_read", "alerts_read")
    expires_in_days = 90
} | ConvertTo-Json

$NewKey = Invoke-RestMethod -Uri "$NR_BASE/api-keys" `
    -Method Post -Headers $Headers -Body $KeyData `
    -ContentType "application/json"

Write-Host "Clave de API (guárdela ahora!): $($NewKey.key)" -ForegroundColor Yellow
```

### Listar Claves de API

```powershell
$Keys = Invoke-RestMethod -Uri "$NR_BASE/api-keys" -Headers $Headers
$Keys | Format-Table name, key_prefix, @{L="Permisos";E={$_.permissions.Count}}, created_at, expires_at
```

### Revocar una Clave de API

```powershell
Invoke-RestMethod -Uri "$NR_BASE/api-keys/KEY_UUID" `
    -Method Delete -Headers $Headers
```

## Script de Monitoreo

### Reporte Diario de Seguridad

```powershell
# Ejecutar como tarea programada para reportes diarios

$Report = [PSCustomObject]@{
    Date          = Get-Date -Format "yyyy-MM-dd"
    OpenAlerts    = (Invoke-RestMethod -Uri "$NR_BASE/alerts?status=open&per_page=1" -Headers $Headers).meta.total
    CriticalCVEs  = (Invoke-RestMethod -Uri "$NR_BASE/cve/affected?severity=critical&per_page=1" -Headers $Headers).meta.total
    OnlineDevices = (Invoke-RestMethod -Uri "$NR_BASE/devices?is_online=true&per_page=1" -Headers $Headers).meta.total
    TotalDevices  = (Invoke-RestMethod -Uri "$NR_BASE/devices?per_page=1" -Headers $Headers).meta.total
}

$Report | Format-List

# Opcionalmente enviar por correo
# Send-MailMessage -To "security@company.com" -Subject "Reporte Diario NetRecon" -Body ($Report | Out-String)
```

## Manejo de Errores

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
            Write-Warning "Límite de tasa alcanzado. Esperando $RetryAfter segundos..."
            Start-Sleep -Seconds ([int]$RetryAfter)
            Invoke-RestMethod @Params
        }
        else {
            Write-Error "Error de API ($StatusCode): $($_.ErrorDetails.Message)"
        }
    }
}

# Uso
$Devices = Invoke-NetReconAPI -Path "/devices"
```
