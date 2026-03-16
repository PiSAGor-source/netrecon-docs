import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Self-Hosted',
      items: [
        'getting-started/requirements',
        'self-hosting/installation',
        'self-hosting/configuration',
        'self-hosting/overview',
        'self-hosting/steel-shield',
      ],
    },
    {
      type: 'category',
      label: 'Cloud (SaaS)',
      items: [
        'cloud/quickstart',
      ],
    },
    {
      type: 'category',
      label: 'Probe',
      items: [
        'getting-started/installation',
        'getting-started/quick-start',
      ],
    },
    {
      type: 'category',
      label: 'Setup Wizard',
      items: [
        'setup-wizard/overview',
        'setup-wizard/network-interfaces',
        'setup-wizard/network-modes',
      ],
    },
    {
      type: 'category',
      label: 'Mobile Apps',
      items: [
        {
          type: 'category',
          label: 'NetRecon Scanner',
          items: [
            'scanner/overview',
            'scanner/scan-profiles',
            'scanner/reports',
          ],
        },
        {
          type: 'category',
          label: 'Admin Connect',
          items: [
            'admin-connect/overview',
            'admin-connect/enrollment',
            'admin-connect/rbac',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'CMod',
      items: [
        'cmod/overview',
        'cmod/ssh-mode',
        'cmod/serial-mode',
      ],
    },
    {
      type: 'category',
      label: 'IPAM',
      items: [
        'ipam/overview',
        'ipam/import-from-scan',
      ],
    },
    {
      type: 'category',
      label: 'Agents',
      items: [
        'agents/overview',
        'agents/windows',
        'agents/macos',
        'agents/linux',
      ],
    },
    {
      type: 'category',
      label: 'API Reference',
      items: [
        'api/overview',
        'api/authentication',
        'api/endpoints',
        'api/scanning',
        'api/devices',
        'api/alerts',
        'api/cve',
        'api/webhooks',
      ],
    },
  ],
};

export default sidebars;
