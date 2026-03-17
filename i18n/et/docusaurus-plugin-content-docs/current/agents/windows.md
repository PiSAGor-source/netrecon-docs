---
sidebar_position: 2
title: Windows agent
description: Installige ja juurutage NetReconi agent Windowsis
---

# Windows agent

Installige NetReconi agent Windowsi lõppseadmetele pidevaks jälgimiseks ja inventuuri raporteerimiseks.

## Eeltingimused

- Windows 10 või uuem / Windows Server 2016 või uuem
- Kohalik administraatori õigus (paigaldamiseks)
- Võrguühendus sondiga (otse või Cloudflare Tunneli kaudu)
- Registreerimistõend sondi juhtpaneelilt

## Käsitsi paigaldamine

### 1. samm: laadige alla MSI

Laadige `netrecon-agent-windows-x64.msi` sondi juhtpaneelilt alla:
1. Logige sondi juhtpaneelile sisse
2. Navigeerige **Agendid > Allalaadimised**
3. Klõpsake **Windows (MSI)**

### 2. samm: käivitage installer

1. Topeltklõpsake allalaaditud MSI-failil
2. Klõpsake tervitusekraanil **Edasi**
3. Sisestage konfiguratsiooni üksikasjad:
   - **Serveri URL**: teie sondi URL (nt `https://probe.netreconapp.com`)
   - **Registreerimistõend**: kleepige tõend sondi juhtpaneelilt
4. Klõpsake **Installi**
5. Klõpsake **Lõpeta**, kui paigaldamine on lõpule viidud

Agent installitakse kausta `C:\Program Files\NetRecon\Agent\` ja registreeritakse Windowsi teenusena nimega `NetReconAgent`.

### 3. samm: kontrollige paigaldust

Avage käsurida administraatorina:

```powershell
sc query NetReconAgent
```

Teenuse olek peaks näitama `STATE: RUNNING`.

Kontrollige registreerimise olekut sondi juhtpaneelil **Agendid** all — uus lõppseade peaks ilmuma 30 sekundi jooksul.

## Vaikne paigaldamine

Skriptitud või järelevalveta paigaldamiseks:

```powershell
msiexec /i netrecon-agent-windows-x64.msi /quiet /norestart SERVER_URL="https://probe.netreconapp.com" ENROLLMENT_TOKEN="your-token-here"
```

## SCCM juurutamine

Juurutage agent tuhandetele Windowsi lõppseadmetele Microsoft SCCM-i (System Center Configuration Manager) abil.

### 1. samm: looge pakett

1. Avage SCCM konsool
2. Navigeerige **Software Library > Application Management > Applications**
3. Klõpsake **Create Application**
4. Valige **Windows Installer (MSI file)** ja sirvige MSI-ni
5. Viige viisard lõpule järgmise installimiskäsuga:

```
msiexec /i netrecon-agent-windows-x64.msi /quiet /norestart SERVER_URL="https://probe.netreconapp.com" ENROLLMENT_TOKEN="your-fleet-token"
```

### 2. samm: konfigureerige tuvastamine

Seadistage tuvastamisreegel:
- **Tüüp**: Failisüsteem
- **Tee**: `C:\Program Files\NetRecon\Agent\`
- **Fail**: `netrecon-agent.exe`
- **Omadus**: Fail on olemas

### 3. samm: juurutage

1. Paremklõpsake rakendusel ja valige **Deploy**
2. Valige sihtmärgi seadmete kogum
3. Seadistage juurutuse eesmärk **Required** peale
4. Konfigureerige ajaplaan
5. Klõpsake viisardis **Edasi** ja juurutage

## Intune juurutamine

Juurutage Microsoft Intune'i kaudu pilvega hallatavate lõppseadmete jaoks.

### 1. samm: valmistage pakett ette

1. Teisendage MSI `.intunewin` paketiks, kasutades [Intune Win32 Content Prep Tool](https://github.com/Microsoft/Microsoft-Win32-Content-Prep-Tool):

```powershell
IntuneWinAppUtil.exe -c .\source -s netrecon-agent-windows-x64.msi -o .\output
```

### 2. samm: looge rakendus Intune'is

1. Minge **Microsoft Intune Admin Center > Apps > Windows**
2. Klõpsake **Add > Windows app (Win32)**
3. Laadige üles `.intunewin` fail
4. Konfigureerige:
   - **Installimiskäsk**: `msiexec /i netrecon-agent-windows-x64.msi /quiet /norestart SERVER_URL="https://probe.netreconapp.com" ENROLLMENT_TOKEN="your-fleet-token"`
   - **Eemaldamiskäsk**: `msiexec /x {product-code} /quiet`
   - **Tuvastamisreegel**: Fail on olemas `C:\Program Files\NetRecon\Agent\netrecon-agent.exe`

### 3. samm: määrake

1. Määrake seadmegrupile või kõigile seadmetele
2. Seadistage **Required** automaatseks juurutamiseks
3. Jälgige juurutuse olekut Intune portaalis

## GPO juurutamine

Juurutage Group Policy abil Active Directory keskkondades.

### 1. samm: valmistage jagatud kaust ette

1. Kopeerige MSI võrgujagamisele, mis on kättesaadav kõigile sihtmasinatele:
   ```
   \\fileserver\software\netrecon\netrecon-agent-windows-x64.msi
   ```
2. Tagage, et jagamisel on lugemisõigused **Domain Computers** jaoks

### 2. samm: looge GPO

1. Avage **Group Policy Management Console**
2. Looge uus GPO, mis on lingitud sihtmärgi OU-ga
3. Navigeerige **Computer Configuration > Policies > Software Settings > Software Installation**
4. Paremklõpsake ja valige **New > Package**
5. Sirvige võrgujagamisel olevale MSI-le
6. Valige **Assigned** juurutusmeetod

### 3. samm: konfigureerige parameetrid

Kuna GPO tarkvara installimine ei toeta MSI omadusi otse, looge teisendusfail (MST) või kasutage käivitusskripti:

Looge käivitusskript `\\fileserver\scripts\install-netrecon-agent.bat`:

```batch
@echo off
if not exist "C:\Program Files\NetRecon\Agent\netrecon-agent.exe" (
    msiexec /i "\\fileserver\software\netrecon\netrecon-agent-windows-x64.msi" /quiet /norestart SERVER_URL="https://probe.netreconapp.com" ENROLLMENT_TOKEN="your-fleet-token"
)
```

Määrake see skript menüüs **Computer Configuration > Policies > Windows Settings > Scripts > Startup**.

## Agendi haldamine

### Konfiguratsioonifail

Agendi konfiguratsioon on salvestatud:
```
C:\Program Files\NetRecon\Agent\config.yaml
```

```yaml
server_url: "https://probe.netreconapp.com"
heartbeat_interval: 30
report_interval: 900
log_level: "info"
log_file: "C:\\Program Files\\NetRecon\\Agent\\logs\\agent.log"
```

### Teenuse käsud

```powershell
# Peatage agent
net stop NetReconAgent

# Käivitage agent
net start NetReconAgent

# Taaskäivitage agent
net stop NetReconAgent && net start NetReconAgent
```

### Eemaldamine

Juhtpaneeli kaudu:
1. Avage **Seaded > Rakendused > Installitud rakendused**
2. Leidke "NetRecon Agent"
3. Klõpsake **Eemalda**

Käsurea kaudu:
```powershell
msiexec /x netrecon-agent-windows-x64.msi /quiet
```

## Veaotsing

### Agent ei ilmu juhtpaneelile
- Kontrollige, et teenus töötab: `sc query NetReconAgent`
- Kontrollige agendi logi: `C:\Program Files\NetRecon\Agent\logs\agent.log`
- Kontrollige, et SERVER_URL on õige ja kättesaadav
- Veenduge, et registreerimistõend on kehtiv ja pole aegunud

### Teenus ei käivitu
- Kontrollige Windows Event Vieweris vigu **Application** logis
- Kontrollige, et config.yaml fail on kehtiv YAML
- Veenduge, et port 443 väljaminev liiklus pole tulemüüri poolt blokeeritud

### Kõrge ressursikasutus
- Kontrollige logi vigade suhtes, mis põhjustavad kiiret korduskatseid
- Kontrollige, et südamelöögi ja raporti intervallid pole seatud liiga madalaks
- Taaskäivitage teenus kogunenud oleku puhastamiseks

## KKK

**K: Kas agent töötab Windows ARM-is (nt Surface Pro X)?**
V: Hetkel toetab agent ainult x64 arhitektuuri. ARM64 tugi on planeeritud.

**K: Kas ma saan agendi installida kõrvuti teiste jälgimisagentidega?**
V: Jah. NetReconi agent on loodud kooseksisteerimiseks teiste jälgimistööriistadega ilma konfliktideta.

**K: Kas agent elab üle Windowsi uuendused ja taaskäivitused?**
V: Jah. Agent töötab Windowsi teenusena, mis on seatud automaatsele käivitamisele, seega taaskäivitub see pärast igat taaskäivitamist.

Lisaabi saamiseks võtke ühendust [support@netreconapp.com](mailto:support@netreconapp.com).
