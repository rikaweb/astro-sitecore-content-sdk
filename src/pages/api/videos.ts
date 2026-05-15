import type { APIRoute } from 'astro';
import client from '../../lib/sitecore-client';

const VIDEOS_QUERY = `
  query VideoLibrary {
    item(path: "/sitecore/content/sync/sync/Home/Video/Data", language: "en") {
      children {
        results {
          id
          name
          title: field(name: "title") { value }
          caption: field(name: "caption") { value }
          image: field(name: "image") { ... on ImageField { src alt } }
          video: field(name: "video") { value }
        }
      }
    }
  }
`;

interface VideoItem {
  id: string;
  name: string;
  title: { value: string };
  caption: { value: string };
  image: { src: string | null; alt: string };
  video: { value: string };
}

interface VideosQueryResult {
  item: {
    children: {
      results: VideoItem[];
    };
  };
}

function extractUrl(linkXml: string): string | null {
  const m = linkXml.match(/url="([^"]+)"/);
  return m ? m[1] : null;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export async function fetchRelatedVideos() {
  const r = await client.getData<VideosQueryResult>(VIDEOS_QUERY);
  const items = (r?.item?.children?.results ?? [])
    .map((v) => ({
      id: v.id,
      name: v.name,
      title: v.title?.value ?? '',
      caption: v.caption?.value ?? '',
      imageSrc: v.image?.src ?? null,
      imageAlt: v.image?.alt ?? '',
      videoUrl: extractUrl(v.video?.value ?? ''),
    }));
  return shuffle(items);
}

export const GET: APIRoute = async () => {
  try {
    const videos = await fetchRelatedVideos();
    return new Response(
      JSON.stringify({
        videos,
        fetchedBy: 'Astro: export const GET → client.getData(GraphQL)',
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({
        videos: [],
        error: e instanceof Error ? e.message : 'GraphQL query failed',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
