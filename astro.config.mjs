import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://greatcoltiniindustries.com',
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap()],
  // The portfolio is one scrolling page; earlier section URLs land on their home sections.
  redirects: {
    '/games/': '/#games',
    '/apps/': '/#apps',
    '/mods/': '/#mods',
    '/about/': '/#about',
  },
});
