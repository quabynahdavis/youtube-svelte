/*
  youtube-redesign — app store (Svelte 5 runes)
  =============================================
  Runes ($state) only compile inside `.svelte(ts)` modules, so the
  implementation lives here; `src/lib/stores.ts` re-exports it as the
  stable import path (`import { app } from '../stores'`).

  State kept deliberately minimal for the scaffold: TopBar/Sidebar/ChipRow
  are already wired to this store, so later steps only need to consume
  (and extend) it.
*/

import { getChannel, type Channel } from './data/catalog';

/** Router-less page ids — `channel` pages use `activeChannel` + slug. */
export type Page = 'home' | 'shorts' | 'subscriptions' | 'collections' | 'channel';

export class AppStore {
  /* Which page is rendered by the switch in App.svelte. */
  activePage = $state<Page>('home');

  /* Sidebar expanded (rail ↔ drawer), toggled from the TopBar burger. */
  sidebarExpanded = $state(true);

  /* The white-pill chip on Home (default "All"). */
  activeChip = $state<string>('All');

  /* Overlays & panels. */
  notifsOpen = $state(false);
  shareOpen = $state(false);
  personalizeOpen = $state(false);

  /* Channel page target; falls back to Juxtoppassed in the page stub. */
  activeChannel = $state<Channel | null>(null);

  navigateTo(page: Page): void {
    this.activePage = page;
    if (page !== 'channel') this.activeChannel = null;
  }

  openChannel(slug: string): void {
    this.activeChannel = getChannel(slug) ?? null;
    this.activePage = 'channel';
  }

  toggleSidebar(): void {
    this.sidebarExpanded = !this.sidebarExpanded;
  }
}

/** App singleton — import from `../stores` anywhere. */
export const app = new AppStore();
