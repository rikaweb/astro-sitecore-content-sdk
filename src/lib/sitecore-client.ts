import { SitecoreClient } from '@sitecore-content-sdk/core/client';
import { defineConfig } from '@sitecore-content-sdk/core';

const config = defineConfig({
  api: {
    edge: {
      contextId: import.meta.env.SITECORE_EDGE_CONTEXT_ID,
      clientContextId: import.meta.env.SITECORE_EDGE_CLIENT_CONTEXT_ID,
      edgeUrl: import.meta.env.SITECORE_EDGE_URL,
    },
  },
  defaultSite: import.meta.env.SITECORE_DEFAULT_SITE,
  defaultLanguage: import.meta.env.SITECORE_DEFAULT_LANGUAGE,
  multisite: { enabled: false },
  personalize: { enabled: false },
});

const client = new SitecoreClient(config);

export default client;
