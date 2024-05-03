import MonacoWebpackPlugin from "monaco-editor-webpack-plugin";
import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import path from "path";

const logo =
  'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text x="50" y="50" text-anchor="middle" font-size="100" dominant-baseline="central">🚥</text></svg>';

const config: Config = {
  title: "Sinho",
  tagline:
    "A lightweight signal-based library for building web components with a React-like API.",
  favicon: logo,

  // Set the production url of your site here
  url: "https://yishn.github.io",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: process.env.NODE_ENV === "production" ? "/sinho/" : "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "yishn", // Usually your GitHub org/user name.
  projectName: "sinho", // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  headTags: [
    {
      tagName: "link",
      attributes: {
        rel: "preconnect",
        href: "https://rsms.me/",
      },
    },
    {
      tagName: "link",
      attributes: {
        rel: "stylesheet",
        href: "https://rsms.me/inter/inter.css",
      },
    },
  ],

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: "https://github.com/yishn/sinho/tree/docs/",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: logo,
    colorMode: {
      defaultMode: "dark",
    },
    navbar: {
      title: "Sinho",
      logo: {
        alt: "Sinho",
        src: logo,
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "tutorialSidebar",
          position: "left",
          label: "Documentation",
        },
        {
          to: "api",
          label: "API",
          position: "left",
        },
        {
          to: "playground",
          label: "Playground",
          position: "left",
        },
        {
          href: "https://github.com/yishn/sinho",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      logo: {
        alt: "Sinho",
        src: logo,
        width: 32,
        height: 32,
      },
      style: "dark",
      copyright: `Copyright © ${new Date().getFullYear()} Yichuan Shen`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,

  plugins: [
    [
      "docusaurus-plugin-typedoc-api",
      {
        projectRoot: path.join(__dirname, ".."),
        packages: [
          {
            path: "./",
            entry: "./src/mod.ts",
          },
        ],
        minimal: true,
      },
    ],
    () => ({
      name: "monaco",
      configureWebpack: () => ({
        plugins: [
          new MonacoWebpackPlugin({
            languages: ["typescript"],
          }),
        ],
      }),
    }),
  ],
};

export default config;
