# astro-sitecore-content-sdk

A minimal starter that connects [Sitecore](https://www.sitecore.com/) to [Astro](https://astro.build/) using the Sitecore Content SDK.

It wires up `@sitecore-content-sdk/core` inside an Astro project so layout data from Sitecore XM Cloud renders through Astro pages with plain React island components.

## Stack

- Astro (server output)
- `@sitecore-content-sdk/core`
- React 19 island components
- Tailwind CSS
- Vercel adapter

## Getting started

```sh
npm install
cp .env.example .env   # fill in your Sitecore Edge values
npm run dev
```

Required environment variables:

```
SITECORE_EDGE_CONTEXT_ID=
SITECORE_EDGE_CLIENT_CONTEXT_ID=
SITECORE_EDGE_URL=https://edge-platform.sitecorecloud.io
SITECORE_DEFAULT_SITE=
SITECORE_DEFAULT_LANGUAGE=en
SITECORE_EDITING_SECRET=
```

## Scripts

| Command           | Action                                    |
| :---------------- | :---------------------------------------- |
| `npm run dev`     | Start dev server at `localhost:4321`      |
| `npm run build`   | Build for production                      |
| `npm run preview` | Preview the production build              |
