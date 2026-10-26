/** @type {import("@sveltejs/vite-plugin-svelte").SvelteConfig} */
export default {
  compilerOptions: {
    // Force Svelte 5 runes mode app-wide (stores.svelte.ts already uses
    // $state; keeps legacy/reactive mixing out of later build steps).
    runes: true,
  },
}
