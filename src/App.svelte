<script lang="ts">
  /*
    App shell — uses svelte-routing for proper URL-based navigation.
    TopBar + Sidebar + Router-driven pages. Overlays mount from store flags.
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
  import { Router, Route } from './lib/router';
  import { app } from './lib/stores';
</script>

<div class="shell">
  <TopBar />
  <div class="shell-body">
    <Sidebar />
    <main class="content">
      <Router>
        <Route path="/" component={Home as any} />
        <Route path="/shorts" component={Shorts as any} />
        <Route path="/subscriptions" component={Subscriptions as any} />
        <Route path="/subscriptions/*" component={Subscriptions as any} />
        <Route path="/collections" component={Collections as any} />
        <Route path="/channel/:slug" component={ChannelPage as any} />
      </Router>
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
    max-width: var(--yt-content-max);
    margin-inline: auto;
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    padding: var(--yt-space-2) var(--yt-space-6) var(--yt-space-10);
  }
</style>