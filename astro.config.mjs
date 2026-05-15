// @ts-check
import { defineConfig } from 'astro/config';

import vercel from '@astrojs/vercel';
import react from '@astrojs/react';
import vue from '@astrojs/vue';
import svelte from '@astrojs/svelte';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercel(),
  integrations: [react(), vue(), svelte()],
  security: {
    allowedDomains: [
      { hostname: 'pages.sitecorecloud.io', protocol: 'https' },
      { hostname: 'xmapps.sitecorecloud.io', protocol: 'https' },
      { hostname: 'designlibrary.sitecorecloud.io', protocol: 'https' },
      { hostname: '**.sitecorecloud.io', protocol: 'https' },
    ],
  },
  vite: {
    plugins: [tailwindcss()],
    server: {
      cors: {
        origin: [
          'https://pages.sitecorecloud.io',
          'https://xmapps.sitecorecloud.io',
          'https://designlibrary.sitecorecloud.io',
        ],
        credentials: true,
      },
    },
    ssr: {
      noExternal: [/^@sitecore-content-sdk\//, /^@sitecore-cloudsdk\//, /^@sitecore-feaas\//],
    },
  },
});