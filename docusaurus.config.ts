import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'NetRecon Documentation',
  tagline: 'Network intelligence for modern teams',
  favicon: 'img/favicon.png',

  url: 'https://docs.netreconapp.com',
  baseUrl: '/',

  organizationName: 'netrecon',
  projectName: 'netrecon-docs',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'tr', 'de', 'nl', 'fr', 'es', 'pt'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/netrecon/netrecon-docs/tree/main/docs/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    navbar: {
      title: '',
      logo: {
        alt: 'NetRecon',
        src: 'img/logo-light.png',
        srcDark: 'img/logo-dark.png',
        style: { height: '36px' },
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          to: '/docs/api/overview',
          label: 'API Reference',
          position: 'left',
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
        {
          href: 'https://github.com/netrecon',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/',
            },
            {
              label: 'Scanner',
              to: '/docs/scanner/overview',
            },
            {
              label: 'Admin Connect',
              to: '/docs/admin-connect/overview',
            },
          ],
        },
        {
          title: 'Products',
          items: [
            {
              label: 'NetRecon Scanner',
              to: '/docs/scanner/overview',
            },
            {
              label: 'NetRecon Probe',
              to: '/docs/getting-started/installation',
            },
            {
              label: 'Agent Deployment',
              to: '/docs/agents/overview',
            },
          ],
        },
        {
          title: 'Support',
          items: [
            {
              label: 'Contact Support',
              href: 'mailto:support@netreconapp.com',
            },
            {
              label: 'API Reference',
              to: '/docs/api/overview',
            },
            {
              label: 'Self-Hosting',
              to: '/docs/self-hosting/overview',
            },
          ],
        },
      ],
      copyright: `Copyright &copy; ${new Date().getFullYear()} NetRecon. All rights reserved. For support, contact support@netreconapp.com`,
    },
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'yaml', 'go', 'dart', 'toml'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
