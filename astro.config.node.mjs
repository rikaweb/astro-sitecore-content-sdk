// @ts-check
// Parallel config for local prod-build measurements only.
// Uses @astrojs/node instead of @astrojs/vercel so we can `npm run preview`.
import { defineConfig } from 'astro/config';

import node from '@astrojs/node';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      noExternal: [/^@sitecore-content-sdk\//, /^@sitecore-cloudsdk\//, /^@sitecore-feaas\//],
    },
  },
});
