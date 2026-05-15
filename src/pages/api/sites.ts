import type { APIRoute } from 'astro';
import client from '../../lib/sitecore-client';

const SITE_QUERY = `
  query {
    site {
      siteInfoCollection {
        name
        hostname
        language
      }
    }
  }
`;

interface SiteQueryResult {
  site: {
    siteInfoCollection: Array<{ name: string; hostname: string; language: string }>;
  };
}

export const GET: APIRoute = async () => {
  try {
    const result = await client.getData<SiteQueryResult>(SITE_QUERY);
    return new Response(
      JSON.stringify({
        sites: result?.site?.siteInfoCollection ?? [],
        fetchedBy: 'Astro: export const GET → client.getData(GraphQL)',
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({
        sites: [],
        error: e instanceof Error ? e.message : 'GraphQL query failed',
        fetchedBy: 'Astro: export const GET → client.getData(GraphQL)',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
