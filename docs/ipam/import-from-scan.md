---
sidebar_position: 2
title: Import from Scan
description: Auto-import discovered IPs from scan results into IPAM
---

# Import from Scan

IPAM can automatically import discovered devices from scan results, eliminating manual data entry and ensuring your IP inventory stays current.

## Prerequisites

- At least one completed network scan with results
- The target subnet defined in IPAM (or willingness to create one during import)
- Analyst, Operator, Admin, or Super Admin role

## How Import Works

When you import scan results into IPAM:

1. Each discovered IP address is checked against existing IPAM records
2. New IPs are created with status "Assigned"
3. Existing IPs are updated with the latest MAC address, hostname, and "Last Seen" timestamp
4. Conflicts (e.g., MAC address changed for an IP) are flagged for review
5. A summary report shows what was imported and what needs attention

## Step-by-Step Import

### Step 1: Open the Import Dialog

**From IPAM:**
1. Navigate to **IPAM > Subnets**
2. Select the target subnet
3. Click **Import from Scan**

**From Scan Results:**
1. Navigate to **Scan > Results**
2. Select a completed scan
3. Click **Export to IPAM**

### Step 2: Select the Scan

Choose which scan results to import:

| Option | Description |
|---|---|
| Latest scan | Import from the most recent scan |
| Specific scan | Choose a scan by date/time |
| All scans (merge) | Combine results from multiple scans |

### Step 3: Review Import Preview

Before importing, review the preview table:

| Column | Description |
|---|---|
| IP Address | The discovered IP |
| MAC Address | Associated MAC |
| Hostname | Discovered hostname |
| Action | New / Update / Conflict |
| Details | What will change |

- **New** — this IP does not exist in IPAM and will be created
- **Update** — this IP exists and will be updated with new data
- **Conflict** — this IP has conflicting data (see Conflict Resolution below)

### Step 4: Resolve Conflicts

Conflicts occur when:

- **MAC address mismatch** — the IP exists in IPAM with a different MAC address than the scan found
- **Duplicate MAC** — the same MAC address appears on multiple IPs
- **Status conflict** — the IP is marked "Reserved" in IPAM but was found active in the scan

For each conflict, choose a resolution:

| Resolution | Action |
|---|---|
| **Keep IPAM** | Ignore the scan data, keep existing IPAM record |
| **Use Scan** | Overwrite IPAM data with scan results |
| **Flag for Review** | Import the data but mark it as "Needs Review" |

### Step 5: Import

1. After resolving all conflicts, click **Import**
2. A progress bar shows the import status
3. When complete, a summary displays:
   - IPs created
   - IPs updated
   - Conflicts resolved
   - Errors (if any)

## Auto-Import

Configure automatic import after every scan:

1. Navigate to **IPAM > Settings > Auto-Import**
2. Enable **Auto-import scan results**
3. Configure options:

| Option | Default | Description |
|---|---|---|
| Create new IPs | Yes | Automatically create new IP records |
| Update existing | Yes | Update existing records with fresh data |
| Conflict handling | Flag for Review | What to do with conflicts |
| Subnet auto-create | No | Create subnet in IPAM if it does not exist |

4. Click **Save**

With auto-import enabled, IPAM stays synchronized with your scan data without manual intervention.

## Import from CSV

You can also import IP data from external sources:

1. Navigate to **IPAM > Import > CSV**
2. Download the CSV template
3. Fill in your data following the template format:

```csv
ip_address,mac_address,hostname,status,owner,notes
192.168.1.10,AA:BB:CC:DD:EE:01,fileserver,Assigned,IT Dept,Primary NAS
192.168.1.11,AA:BB:CC:DD:EE:02,printer-01,Assigned,Office,2nd floor
192.168.1.20,,reserved-ip,Reserved,IT Dept,Future use
```

4. Upload the CSV and review the preview
5. Resolve any conflicts
6. Click **Import**

## Data Enrichment

During import, IPAM automatically enriches the data:

| Field | Source |
|---|---|
| Manufacturer | OUI database lookup from MAC address |
| Device Type | Scan engine profiling data |
| Open Ports | Port scan results |
| Services | Service detection results |
| Last Seen | Scan timestamp |

## FAQ

**Q: Will importing overwrite my manual notes and owner assignments?**
A: No. Import only updates technical fields (MAC, hostname, Last Seen). Custom fields like Owner, Notes, and Status are preserved unless you explicitly choose "Use Scan" for a conflict.

**Q: Can I undo an import?**
A: Yes. Each import creates a snapshot. Navigate to **IPAM > Import History** and click **Rollback** on the import you want to undo.

**Q: What happens to IPs that were in IPAM but not found in the scan?**
A: They remain unchanged. A device not appearing in a scan does not mean it is gone — it may be powered off or on a different VLAN. Use the "Stale IP" report (**IPAM > Reports > Stale IPs**) to find IPs that have not been seen for a configurable period.

**Q: Can I import from multiple subnets at once?**
A: Yes. If your scan covers multiple subnets, the import will distribute IPs to the correct IPAM subnets based on their addresses. Subnets must already exist in IPAM (or enable "Subnet auto-create" in auto-import settings).

For additional help, contact [support@netreconapp.com](mailto:support@netreconapp.com).
