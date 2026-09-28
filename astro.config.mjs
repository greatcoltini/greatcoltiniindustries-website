import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://greatcoltiniindustries.com',
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap()],
});
