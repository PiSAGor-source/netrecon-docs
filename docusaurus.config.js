// @ts-check
import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'NetRecon Docs',
  tagline: 'Network Intelligence Platform',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://docs.netreconapp.com',
  baseUrl: '/',

  organizationName: 'PiSAGor-source',
  projectName: 'netrecon-docs',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/docusaurus-social-card.jpg',
      colorMode: {
  defaultMode: 'dark',
  respectPrefersColorScheme: false,
},
      navbar: {
        title: 'NetRecon Docs',
        logo: {
          alt: 'NetRecon Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Documentation',
          },
          {
            href: 'https://netreconapp.com',
            label: 'netreconapp.com',
            position: 'right',
          },
          {
            href: 'https://github.com/PiSAGor-source/netrecon-docs',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Product',
            items: [
              {
                label: 'netreconapp.com',
                href: 'https://netreconapp.com',
              },
              {
                label: 'Changelog',
                href: 'https://netreconapp.com/changelog',
              },
              {
                label: 'Status',
                href: 'https://status.netreconapp.com',
              },
            ],
          },
          {
            title: 'Docs',
            items: [
              {
                label: 'Getting Started',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: 'Company',
            items: [
              {
                label: 'About',
                href: 'https://netreconapp.com/about',
              },
              {
                label: 'Contact',
                href: 'https://netreconapp.com/contact',
              },
              {
                label: 'Security',
                href: 'https://netreconapp.com/security',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Vaultworks Software OÜ. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;