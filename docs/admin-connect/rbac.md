---
sidebar_position: 3
title: Role-Based Access Control
description: Configure user roles and permissions in Admin Connect
---

# Role-Based Access Control (RBAC)

NetRecon uses role-based access control to manage what each user can see and do. Roles are defined on the probe and enforced across both the web dashboard and Admin Connect app.

## Prerequisites

- Admin-level access to the probe dashboard
- At least one probe enrolled in Admin Connect

## How RBAC Works

Each user account is assigned a role. Roles contain a set of permissions that control access to features. When a user logs in through Admin Connect or the web dashboard, the system checks their role before allowing any action.

```
User → Role → Permissions → Access Granted / Denied
```

Permissions are enforced at both the UI level (hiding unavailable features) and the API level (rejecting unauthorized requests).

## Predefined Roles

NetRecon includes five predefined roles:

| Role | Description | Typical User |
|---|---|---|
| **Super Admin** | Full access to all features and settings | Platform owner |
| **Admin** | Full access except role management and system settings | IT manager |
| **Analyst** | View scan results, alerts, reports; cannot modify settings | Security analyst |
| **Operator** | Start/stop scans and services; view results | NOC technician |
| **Viewer** | Read-only access to dashboards and reports | Executive, auditor |

## Permission Matrix

| Permission | Super Admin | Admin | Analyst | Operator | Viewer |
|---|---|---|---|---|---|
| View dashboard | Yes | Yes | Yes | Yes | Yes |
| View scan results | Yes | Yes | Yes | Yes | Yes |
| Start/stop scans | Yes | Yes | No | Yes | No |
| View IDS alerts | Yes | Yes | Yes | Yes | Yes |
| Manage IDS rules | Yes | Yes | No | No | No |
| Start/stop PCAP | Yes | Yes | No | Yes | No |
| Download PCAP files | Yes | Yes | Yes | No | No |
| Run vulnerability scans | Yes | Yes | No | Yes | No |
| View vulnerability results | Yes | Yes | Yes | Yes | Yes |
| Manage honeypot | Yes | Yes | No | No | No |
| Manage VPN | Yes | Yes | No | No | No |
| Configure DNS sinkhole | Yes | Yes | No | No | No |
| Generate reports | Yes | Yes | Yes | Yes | No |
| Manage users | Yes | Yes | No | No | No |
| Manage roles | Yes | No | No | No | No |
| System settings | Yes | No | No | No | No |
| Backup/restore | Yes | Yes | No | No | No |
| View audit log | Yes | Yes | Yes | No | No |
| Ticketing | Yes | Yes | Yes | Yes | No |
| Fleet management | Yes | Yes | No | No | No |

## Managing Users

### Creating a User

1. Log into the probe dashboard as Super Admin or Admin
2. Navigate to **Settings > Users**
3. Click **Add User**
4. Fill in the user details:
   - Username
   - Email address
   - Password (or send invitation link)
   - Role (select from predefined roles)
5. Click **Create**

### Editing a User's Role

1. Navigate to **Settings > Users**
2. Click the user you want to modify
3. Change the **Role** dropdown
4. Click **Save**

### Deactivating a User

1. Navigate to **Settings > Users**
2. Click the user
3. Toggle **Active** to off
4. Click **Save**

Deactivated users cannot log in but their audit history is preserved.

## Custom Roles

Super Admins can create custom roles with granular permissions:

1. Navigate to **Settings > Roles**
2. Click **Create Role**
3. Enter a role name and description
4. Toggle individual permissions on/off
5. Click **Save**

Custom roles appear alongside predefined roles when assigning users.

## Two-Factor Authentication

2FA can be enforced per role:

1. Navigate to **Settings > Roles**
2. Select a role
3. Enable **Require 2FA**
4. Click **Save**

Users with that role will be required to set up TOTP-based 2FA on their next login.

## Session Management

Configure session policies per role:

| Setting | Description | Default |
|---|---|---|
| Session timeout | Auto-logout after inactivity | 30 minutes |
| Max concurrent sessions | Maximum simultaneous logins | 3 |
| IP restriction | Limit login to specific IP ranges | Disabled |

Configure these under **Settings > Roles > [Role Name] > Session Policy**.

## Audit Log

All permission-relevant actions are logged:

- User login/logout events
- Role changes
- Permission modifications
- Failed access attempts
- Configuration changes

View the audit log at **Settings > Audit Log**. Logs are retained for 90 days by default.

## FAQ

**Q: Can I modify the predefined roles?**
A: No. Predefined roles are read-only to ensure a consistent baseline. Create a custom role if you need different permissions.

**Q: What happens if I delete a role that has users assigned?**
A: You must reassign all users to a different role before deleting a custom role. The system will prevent deletion if users are still assigned.

**Q: Are roles synced across multiple probes?**
A: Roles are defined per probe. If you manage multiple probes, you need to configure roles on each one. A future update will support centralized role management.

**Q: Can I restrict a user to specific subnets or devices?**
A: Currently, roles control feature access, not data-level access. Subnet-level restrictions are on the roadmap.

For additional help, contact [support@netreconapp.com](mailto:support@netreconapp.com).
