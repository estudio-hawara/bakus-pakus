import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Choo Choo',
  tagline: 'Small library for creating railroad diagrams from Bakus-Naur Form grammars.',
  favicon: 'img/favicon.ico',

  url: 'https://choo-choo.hawara.es',
  baseUrl: '/',

  organizationName: 'estudio-hawara',
  projectName: 'choo-choo',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/'
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'Choo-Choo',
      logo: {
        alt: 'Choo-Choo Diagrams Logo',
        src: 'img/logo.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Tutorial',
        },
        {
          href: 'https://github.com/estudio-hawara/choo-choo',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Tutorial',
              to: '/docs/intro',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'hawara.es',
              href: 'https://hawara.es',
            },
            {
              label: 'x.com/estudiohawara',
              href: 'https://x.com/estudiohawara',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/estudio-hawara/choo-choo',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Carlos Capote Pérez Andreu (Estudio Hawara).`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
