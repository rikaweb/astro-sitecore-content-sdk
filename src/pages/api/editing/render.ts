import type { APIRoute } from 'astro';

const ALLOWED_ORIGINS = [
  'https://pages.sitecorecloud.io',
  'https://xmapps.sitecorecloud.io',
  'https://designlibrary.sitecorecloud.io',
];

const CSP_HEADER = `frame-ancestors 'self' ${ALLOWED_ORIGINS.join(' ')}`;

function corsHeadersFor(origin: string | null): Record<string, string> | null {
  // Match Sitecore SDK: missing origin (e.g. iframe navigation, server-side) is allowed,
  // returns empty object so the request proceeds without CORS headers.
  if (!origin || origin === 'null') return {};
  if (!ALLOWED_ORIGINS.includes(origin)) return null;
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Cookie',
  };
}

export const OPTIONS: APIRoute = ({ request }) => {
  const cors = corsHeadersFor(request.headers.get('origin'));
  if (!cors) {
    return new Response('Invalid origin', { status: 401 });
  }
  return new Response(null, { status: 204, headers: cors });
};

export const GET: APIRoute = async ({ request, url, site }) => {
  const cors = corsHeadersFor(request.headers.get('origin'));
  if (!cors) {
    return new Response(`<html><body>Requests from origin ${request.headers.get('origin')} not allowed</body></html>`, {
      status: 401,
    });
  }

  const expected = import.meta.env.SITECORE_EDITING_SECRET;
  const provided = url.searchParams.get('secret');
  if (!expected || provided !== expected) {
    return new Response(JSON.stringify({ html: '<html><body>Missing or invalid editing secret</body></html>' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json', ...cors },
    });
  }

  const route = url.searchParams.get('route');
  if (!route) {
    return new Response(JSON.stringify({ html: '<html><body>Missing required query parameter: route</body></html>' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...cors },
    });
  }

  const scSite = url.searchParams.get('sc_site') ?? import.meta.env.SITECORE_DEFAULT_SITE ?? 'sync';
  const scLang = url.searchParams.get('sc_lang') ?? import.meta.env.SITECORE_DEFAULT_LANGUAGE ?? 'en';
  const mode = url.searchParams.get('mode') ?? 'edit';

  const base = site?.toString() ?? `${url.protocol}//${url.host}`;
  const target = new URL(route, base);
  target.searchParams.set('sc_mode', mode);
  target.searchParams.set('sc_site', scSite);
  target.searchParams.set('sc_lang', scLang);

  for (const key of ['sc_itemid', 'itemId', 'sc_version', 'version', 'sc_layoutKind', 'layoutKind', 'sc_variant', 'variantIds']) {
    const v = url.searchParams.get(key);
    if (v) target.searchParams.set(key, v);
  }

  try {
    const upstream = await fetch(target.toString(), {
      headers: {
        cookie: request.headers.get('cookie') ?? '',
      },
    });
    const html = await upstream.text();

    return new Response(html, {
      status: upstream.status,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Security-Policy': CSP_HEADER,
        ...cors,
      },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ html: `<html><body>Render failed: ${e instanceof Error ? e.message : String(e)}</body></html>` }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...cors } }
    );
  }
};
