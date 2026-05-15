<script lang="ts">
  import { onMount } from 'svelte';

  interface SiteInfo {
    name: string;
    hostname: string;
    language: string;
  }

  let sites: SiteInfo[] = [];
  let loading = true;
  let error: string | null = null;

  onMount(async () => {
    try {
      const res = await fetch('/api/sites');
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      sites = data.sites;
    } catch (e) {
      error = e instanceof Error ? e.message : 'fetch failed';
    } finally {
      loading = false;
    }
  });
</script>

<div class="bg-neutral-900 rounded-2xl p-6 border border-neutral-800 h-full">
  <div class="flex items-center gap-2 mb-4">
    <span class="text-2xl">🔥</span>
    <h3 class="font-bold text-lg">Svelte</h3>
    <code class="text-[10px] text-orange-400/70 bg-neutral-950 px-2 py-1 rounded ml-auto">
      onMount + reactivity
    </code>
  </div>
  {#if loading}
    <p class="text-neutral-500 text-sm">Loading…</p>
  {:else if error}
    <p class="text-red-400 text-sm">{error}</p>
  {:else}
    <ul class="space-y-2">
      {#each sites as s (s.name)}
        <li class="text-sm flex justify-between text-neutral-300">
          <span class="font-semibold text-white">{s.name}</span>
          <span class="text-neutral-500">{s.language}</span>
        </li>
      {/each}
    </ul>
  {/if}
</div>
