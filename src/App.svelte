<script lang="ts">
  /*
    App shell — trivial working canvas for the scaffold:
    TopBar + Sidebar + router-less page switch driven by the runes store
    (src/lib/stores.svelte.ts). Overlays mount from the same store flags.

    TODO(later steps): fill the page stubs under src/lib/pages/ and the
    component stubs under src/lib/components/.
  */
  import TopBar from './lib/components/TopBar.svelte';
  import Sidebar from './lib/components/Sidebar.svelte';
  import NotifsPanel from './lib/components/NotifsPanel.svelte';
  import ShareModal from './lib/components/ShareModal.svelte';
  import PersonalizeModal from './lib/components/PersonalizeModal.svelte';
  import Home from './lib/pages/Home.svelte';
  import Shorts from './lib/pages/Shorts.svelte';
  import Subscriptions from './lib/pages/Subscriptions.svelte';
  import Collections from './lib/pages/Collections.svelte';
  import ChannelPage from './lib/pages/ChannelPage.svelte';
  import { app } from './lib/stores';
</script>

<div class="shell">
  <TopBar />
  <div class="shell-body">
    <Sidebar />
    <main class="content">
      {#if app.activePage === 'home'}
        <Home />
      {:else if app.activePage === 'shorts'}
        <Shorts />
      {:else if app.activePage === 'subscriptions'}
        <Subscriptions />
      {:else if app.activePage === 'collections'}
        <Collections />
      {:else if app.activePage === 'channel'}
        <ChannelPage />
      {/if}
    </main>
  </div>
</div>

{#if app.notifsOpen}<NotifsPanel />{/if}
{#if app.shareOpen}<ShareModal />{/if}
{#if app.personalizeOpen}<PersonalizeModal />{/if}

<style>
  .shell {
    display: flex;
    flex-direction: column;
    height: 100dvh;
    /* Never let the app shell grow wider than the viewport; contained
       scrollers (shelf, chip row) are allowed to scroll internally. */
    overflow-x: hidden;
  }
  .shell-body {
    display: flex;
    flex: 1;
    min-height: 0;
    overflow-x: hidden;
  }
  .content {
    flex: 1 1 0;
    min-width: 0;
    /* Cap the feed width so child grids/shelves can never force a
       horizontal scrollbar. Centered on ultra-wide screens. */
    max-width: var(--yt-content-max);
    margin-inline: auto;
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    padding: var(--yt-space-2) var(--yt-space-6) var(--yt-space-10);
  }
</style>
