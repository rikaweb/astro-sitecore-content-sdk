import { useEffect, useState } from 'react';

interface SiteInfo {
  name: string;
  hostname: string;
  language: string;
}

interface SitesResponse {
  sites: SiteInfo[];
  fetchedBy: string;
  error?: string;
}

export default function HeaderST() {
  const [sitesData, setSitesData] = useState<SitesResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/sites')
      .then((res) => res.json())
      .then((data: SitesResponse) => {
        setSitesData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl font-black uppercase tracking-tight text-neutral-900">
            SYNC
          </span>
          <span className="text-xs font-medium text-neutral-400 uppercase tracking-widest">
            Audio · Astro
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <a href="/speakers" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">
            Speakers
          </a>
          <a href="/videos" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">
            Video
          </a>
          <a href="/support" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">
            Support
          </a>
        </nav>

        <button
          className="h-9 px-5 text-xs font-semibold rounded-full bg-lime-400 text-neutral-900 hover:bg-lime-300 border-0 inline-flex items-center justify-center cursor-pointer"
        >
          Sign up
        </button>
      </div>

      {/* GraphQL Site Info — fetched via /api/sites → client.getData(GraphQL) */}
      <div className="bg-slate-50 border-t border-slate-200 px-6 py-2 text-xs text-slate-500">
        <div className="flex items-center justify-center gap-2 mb-1">
          <strong className="text-slate-900">GraphQL Sites</strong>
          <span className="text-slate-400">|</span>
          <code className="bg-slate-200 px-1.5 py-0.5 rounded text-[11px]">
            {sitesData?.fetchedBy || 'Loading...'}
          </code>
        </div>

        {loading ? (
          <p className="text-center m-0">Loading...</p>
        ) : sitesData?.error ? (
          <p className="text-red-600 text-center m-0">{sitesData.error}</p>
        ) : sitesData?.sites && sitesData.sites.length > 0 ? (
          <div className="flex justify-center gap-4 flex-wrap">
            {sitesData.sites.map((site, i) => (
              <span key={i}>
                <strong className="text-slate-900">{site.name}</strong>{' '}
                ({site.language}) {site.hostname ? `— ${site.hostname}` : ''}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-center m-0 text-slate-400">No sites found</p>
        )}
      </div>
    </header>
  );
}
