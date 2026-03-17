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
    locales: [
      'en', 'ar', 'cs', 'da', 'de', 'el', 'es', 'fi', 'fr', 'hi',
      'hu', 'it', 'ja', 'ko', 'nl', 'no', 'pl', 'pt', 'ro', 'ru',
      'sv', 'th', 'tr', 'uk', 'vi', 'zh',
    ],
    localeConfigs: {
      en: { label: 'English', direction: 'ltr' },
      ar: { label: 'العربية', direction: 'rtl' },
      cs: { label: 'Čeština', direction: 'ltr' },
      da: { label: 'Dansk', direction: 'ltr' },
      de: { label: 'Deutsch', direction: 'ltr' },
      el: { label: 'Ελληνικά', direction: 'ltr' },
      es: { label: 'Español', direction: 'ltr' },
      fi: { label: 'Suomi', direction: 'ltr' },
      fr: { label: 'Français', direction: 'ltr' },
      hi: { label: 'हिन्दी', direction: 'ltr' },
      hu: { label: 'Magyar', direction: 'ltr' },
      it: { label: 'Italiano', direction: 'ltr' },
      ja: { label: '日本語', direction: 'ltr' },
      ko: { label: '한국어', direction: 'ltr' },
      nl: { label: 'Nederlands', direction: 'ltr' },
      no: { label: 'Norsk', direction: 'ltr' },
      pl: { label: 'Polski', direction: 'ltr' },
      pt: { label: 'Português', direction: 'ltr' },
      ro: { label: 'Română', direction: 'ltr' },
      ru: { label: 'Русский', direction: 'ltr' },
      sv: { label: 'Svenska', direction: 'ltr' },
      th: { label: 'ไทย', direction: 'ltr' },
      tr: { label: 'Türkçe', direction: 'ltr' },
      uk: { label: 'Українська', direction: 'ltr' },
      vi: { label: 'Tiếng Việt', direction: 'ltr' },
      zh: { label: '中文', direction: 'ltr' },
    },
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
