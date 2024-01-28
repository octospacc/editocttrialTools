// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Docusaurus-Static',
  tagline: 'Dinosaurs are cooler without a web server!',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://your-docusaurus-site.example.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  //organizationName: 'facebook', // Usually your GitHub org/user name.
  //projectName: 'docusaurus', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
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
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            //'https://github.com/octospacc/editocttrialTools/tree/main/docusaurus-static/',
            'https://gitlab.com/octospacc/editocttrialTools/-/blob/main/docusaurus-static/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            //'https://github.com/octospacc/editocttrialTools/tree/main/docusaurus-static/',
            'https://gitlab.com/octospacc/editocttrialTools/-/blob/main/docusaurus-static/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'Docusaurus-Static',
        logo: {
          alt: 'Docusaurus-Static Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Guide',
          },
          { to: '/blog', label: 'Blog', position: 'left' },
          {
            href: 'https://gitlab.com/octospacc/editocttrialTools/-/tree/main/docusaurus-static',
            label: 'Git',
            position: 'right',
          },
          //{ type: 'docsVersionDropdown', position: 'right' },
          { type: 'localeDropdown', position: 'right' },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'About This',
            items: [
              { label: 'Guide', to: '/docs' },
              { label: 'Blog', to: '/blog' },
              { label: 'GitLab', href: 'https://gitlab.com/octospacc/editocttrialTools/-/tree/main/docusaurus-static' },
              { label: 'GitHub', href: 'https://github.com/octospacc/editocttrialTools/tree/main/docusaurus-static' },
            ],
          },
          {
            title: 'Docusaurus in General',
            items: [
              { label: 'GitHub', href: 'https://github.com/facebook/docusaurus' },
              { label: 'Stack Overflow', href: 'https://stackoverflow.com/questions/tagged/docusaurus' },
              { label: 'Discord', href: 'https://discordapp.com/invite/docusaurus' },
              { label: 'Twitter', href: 'https://twitter.com/docusaurus' },
            ],
          },
        ],
        copyright: `
          Copyright © ${new Date().getFullYear()}
          <a href="https://hub.octt.eu.org">OctoSpacc</a>.
          Built with Docusaurus-Static.
        `,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
