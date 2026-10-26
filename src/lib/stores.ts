/*
  Re-export surface for the runes store.

  Svelte 5 requires `$state` runes to live in a `.svelte.ts` module
  (see `stores.svelte.ts`); import from THIS file so callers don't
  care where the runes compile:

      import { app, type Page } from '../stores';
*/

export * from './stores.svelte';
