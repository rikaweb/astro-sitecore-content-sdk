<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface SiteInfo {
  name: string;
  hostname: string;
  language: string;
}

const sites = ref<SiteInfo[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    const res = await fetch('/api/sites');
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    sites.value = data.sites;
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'fetch failed';
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="bg-neutral-900 rounded-2xl p-6 border border-neutral-800 h-full">
    <div class="flex items-center gap-2 mb-4">
      <span class="text-2xl">🟢</span>
      <h3 class="font-bold text-lg">Vue</h3>
      <code class="text-[10px] text-emerald-400/70 bg-neutral-950 px-2 py-1 rounded ml-auto">
        ref + onMounted
      </code>
    </div>
    <p v-if="loading" class="text-neutral-500 text-sm">Loading…</p>
    <p v-else-if="error" class="text-red-400 text-sm">{{ error }}</p>
    <ul v-else class="space-y-2">
      <li
        v-for="s in sites"
        :key="s.name"
        class="text-sm flex justify-between text-neutral-300"
      >
        <span class="font-semibold text-white">{{ s.name }}</span>
        <span class="text-neutral-500">{{ s.language }}</span>
      </li>
    </ul>
  </div>
</template>
