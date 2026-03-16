---
sidebar_position: 3
title: Reports
description: Generate and customize PDF security audit reports
---

# Reports

NetRecon Scanner generates professional PDF reports from your scan results. Reports are designed for security audits, compliance documentation, and client deliverables.

## Prerequisites

- At least one completed scan with results
- Sufficient device storage for PDF generation (typically 1-5 MB per report)

## Generating a Report

1. Complete a network scan
2. From the scan results screen, tap the **Report** button in the top-right corner
3. Select the report type and customize options
4. Tap **Generate PDF**
5. The report will be saved and can be shared via any Android sharing method

## Report Contents

A standard report includes the following sections:

### Executive Summary
- Scan date and duration
- Network scope (subnet, profile used)
- Total devices discovered
- Key findings summary (open high-risk ports, unidentified devices)

### Device Inventory
- Complete list of discovered devices
- IP address, MAC address, hostname
- Device type and manufacturer
- Operating system (when detected)

### Port and Service Analysis
- Open ports per device
- Running services and versions
- Service risk classification (Low / Medium / High / Critical)

### Security Findings
- Devices with high-risk open ports (e.g., Telnet, FTP, SMB)
- Unencrypted services detected
- Default or known-vulnerable service versions
- CVE references for detected service versions (when CVE database is available)

### Network Topology
- Text-based summary of network layout
- Device distribution by type (servers, workstations, network devices, IoT)

### Appendix
- Full port scan details per host
- Raw service banners
- Scan configuration and profile settings

## Report Customization

Before generating, you can customize the report:

| Option | Description |
|---|---|
| Company name | Appears in the header and title page |
| Report title | Custom title (default: "Network Security Audit Report") |
| Logo | Upload a company logo for the title page |
| Include sections | Toggle individual sections on/off |
| Sensitivity label | Confidential / Internal / Public |
| Language | Generate the report in any of the 11 supported languages |

## Sharing Reports

After generation, share the PDF via:

- **Email** — tap Share and select your email app
- **Cloud storage** — save to Google Drive, OneDrive, etc.
- **QR code** — generate a QR code that links to the locally hosted report (useful for handing off to a colleague on the same network)
- **Direct transfer** — use Android's nearby share feature

## Font and Unicode Support

Reports use the NotoSans font family to ensure proper rendering of:
- Latin characters (EN, DE, FR, ES, NL, etc.)
- Cyrillic characters (RU)
- Turkish special characters (TR)
- Scandinavian characters (SV, NO, DA)
- Polish characters (PL)

All 11 supported languages render correctly in generated PDFs.

## Report Storage

Generated reports are stored locally on the device:

- Default location: app internal storage
- Reports can be exported to external storage or cloud
- Old reports can be managed from **Reports > History**
- Reports do not expire and remain available until manually deleted

## FAQ

**Q: Can I generate a report from probe scan results?**
A: Yes. When connected to a probe, you can generate reports from both local scan results and probe scan data. Probe reports can include additional data such as IDS alerts and vulnerability findings.

**Q: What is the maximum network size for a report?**
A: Reports have been tested with networks up to 1,000 devices. Larger networks may take longer to generate but there is no hard limit.

**Q: Can I schedule automatic reports?**
A: Scheduled reporting is available on the probe dashboard. Configure report schedules under **Settings > Reports > Schedule**.

**Q: The PDF shows garbled text. How do I fix this?**
A: This typically occurs when viewing on a device without NotoSans font support. Open the PDF in Google Chrome, Adobe Acrobat, or any modern PDF reader that supports embedded fonts.

For additional help, contact [support@netreconapp.com](mailto:support@netreconapp.com).
