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

export default function ReactSiteList() {
  const [data, setData] = useState<SitesResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/sites')
      .then((r) => r.json())
      .then((d: SitesResponse) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800 h-full">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">⚛️</span>
        <h3 className="font-bold text-lg">React</h3>
        <code className="text-[10px] text-cyan-400/70 bg-neutral-950 px-2 py-1 rounded ml-auto">
          useEffect + useState
        </code>
      </div>
      {loading ? (
        <p className="text-neutral-500 text-sm">Loading…</p>
      ) : data?.error ? (
        <p className="text-red-400 text-sm">{data.error}</p>
      ) : (
        <ul className="space-y-2">
          {data?.sites.map((s) => (
            <li key={s.name} className="text-sm flex justify-between text-neutral-300">
              <span className="font-semibold text-white">{s.name}</span>
              <span className="text-neutral-500">{s.language}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
