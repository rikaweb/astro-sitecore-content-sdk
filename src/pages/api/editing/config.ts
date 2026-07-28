import type { APIRoute } from 'astro';

const ALLOWED_ORIGINS = [
  'https://pages.sitecorecloud.io',
  'https://xmapps.sitecorecloud.io',
  'https://designlibrary.sitecorecloud.io',
];

function corsHeadersFor(origin: string | null): Record<string, string> | null {
  if (!origin || origin === 'null') return {};
  if (!ALLOWED_ORIGINS.includes(origin)) return null;
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

const COMPONENTS = ['HeroST', 'HeaderST', 'SignupBanner'];
const CLIENT_COMPONENTS = ['HeaderST'];

export const OPTIONS: APIRoute = ({ request }) => {
  const cors = corsHeadersFor(request.headers.get('origin'));
  if (!cors) {
    return new Response(JSON.stringify({ message: 'Invalid origin' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  return new Response(null, { status: 204, headers: cors });
};

export const GET: APIRoute = ({ request, url }) => {
  const cors = corsHeadersFor(request.headers.get('origin'));
  if (!cors) {
    return new Response(JSON.stringify({ message: 'Invalid origin' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const expected = import.meta.env.SITECORE_EDITING_SECRET;
  const provided = url.searchParams.get('secret');
  if (!expected || provided !== expected) {
    return new Response(JSON.stringify({ message: 'Missing or invalid editing secret' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json', ...cors },
    });
  }

  return new Response(
    JSON.stringify({
      framework: 'astro',
      components: COMPONENTS,
      clientComponents: CLIENT_COMPONENTS,
      packages: {
        'astro': '6.x',
        '@astrojs/react': '5.x',
        '@astrojs/vercel': '10.x',
        '@sitecore-content-sdk/core': '1.4.x',
      },
      editMode: 'metadata',
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...cors },
    }
  );
};
