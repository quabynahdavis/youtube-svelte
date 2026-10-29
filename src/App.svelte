<script lang="ts">
  /*
    App shell — uses svelte-routing for proper URL-based navigation.
    TopBar + Sidebar + Router-driven pages. Overlays mount from store flags.
    On narrow viewports (mobile) the desktop shell is replaced by the
    mobile-optimized pages (MobileVideoPlayer, MobileLibrary) which each
    include their own bottom navigation bar.
  */
  import { onMount } from 'svelte';
  import TopBar from './lib/components/TopBar.svelte';
  import Sidebar from './lib/components/Sidebar.svelte';
  import NotifsPanel from './lib/components/NotifsPanel.svelte';
  import LiveChat from './lib/components/LiveChat.svelte';
  import ShareModal from './lib/components/ShareModal.svelte';
  import PersonalizeModal from './lib/components/PersonalizeModal.svelte';
  import Dialog from './lib/components/Dialog.svelte';
  import SettingsPanel from './lib/components/SettingsPanel.svelte';
  import VideoOptions from './lib/components/VideoOptions.svelte';
  import QualityOptions from './lib/components/QualityOptions.svelte';
  import Backdrop from './lib/components/Backdrop.svelte';
  import IconGrid from './lib/components/IconGrid.svelte';
  import Home from './lib/pages/Home.svelte';
  import Shorts from './lib/pages/Shorts.svelte';
  import Subscriptions from './lib/pages/Subscriptions.svelte';
  import Collections from './lib/pages/Collections.svelte';
  import ChannelPage from './lib/pages/ChannelPage.svelte';
  import Rewind from './lib/pages/Rewind.svelte';
  import MobileVideoPlayer from './lib/components/MobileVideoPlayer.svelte';
  import MobileLibrary from './lib/pages/MobileLibrary.svelte';
  import { Router, Route } from './lib/router';
  import { app } from './lib/stores';

  let isMobile = $state(false);

  /** Demo swatch palette for the IconGrid picker (Figma Frame 37778 colors + extras). */
  const ICON_PICKER_ITEMS = [
    { id: 'slate-blue', color: '#484799', label: 'Slate Blue' },
    { id: 'red', color: '#A51D29', label: 'Red' },
    { id: 'green', color: '#34A930', label: 'Green' },
    { id: 'purple', color: '#6B46C1', label: 'Purple' },
    { id: 'pink', color: '#E91E63', label: 'Pink' },
    { id: 'orange', color: '#F97316', label: 'Orange' },
    { id: 'teal', color: '#0F766E', label: 'Teal' },
    { id: 'amber', color: '#F59E0B', label: 'Amber' },
    { id: 'indigo', color: '#4338CA', label: 'Indigo' },
    { id: 'emerald', color: '#10B981', label: 'Emerald' },
    { id: 'rose', color: '#F43F5E', label: 'Rose' },
    { id: 'slate', color: '#64748B', label: 'Slate' },
  ] as const;

  $effect(() => {
    const check = (): void => {
      isMobile = window.innerWidth <= 768;
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  });
</script>

{#if isMobile}
  <Router>
    <Route path="/" component={Home as any} />
    <Route path="/shorts" component={Shorts as any} />
    <Route path="/subscriptions" component={Subscriptions as any} />
    <Route path="/subscriptions/*" component={Subscriptions as any} />
    <Route path="/collections" component={Collections as any} />
    <Route path="/rewind" component={Rewind as any} />
    <Route path="/channel/:slug" component={ChannelPage as any} />
    <Route path="/mobile/video/:slug" component={MobileVideoPlayer as any} />
    <Route path="/mobile/library" component={MobileLibrary as any} />
  </Router>
{:else}
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
          <Route path="/rewind" component={Rewind as any} />
          <Route path="/channel/:slug" component={ChannelPage as any} />
          <Route path="/mobile/video/:slug" component={MobileVideoPlayer as any} />
          <Route path="/mobile/library" component={MobileLibrary as any} />
        </Router>
      </main>
    </div>
  </div>
{/if}

{#if app.notifsOpen}<NotifsPanel />{/if}
{#if app.chatOpen}<LiveChat onClose={() => app.chatOpen = false} />{/if}
{#if app.shareOpen}<ShareModal />{/if}
{#if app.personalizeOpen}<PersonalizeModal />{/if}
{#if app.dialogOpen}
  <Dialog
    open={app.dialogOpen}
    title={app.dialogTitle}
    badge={app.dialogBadge}
    actions={app.dialogActions}
    onClose={() => app.closeDialog()}
  />
{/if}
{#if app.settingsOpen}<SettingsPanel open={true} onClose={() => app.closeSettings()} />{/if}
{#if app.videoOptionsOpen && app.videoOptionsPos}
  <VideoOptions
    x={app.videoOptionsPos.x}
    y={app.videoOptionsPos.y}
    onPick={() => app.closeVideoOptions()}
    onDismiss={() => app.closeVideoOptions()}
  />
{/if}
{#if app.qualityOptionsOpen && app.qualityOptionsPos}
  <QualityOptions
    x={app.qualityOptionsPos.x}
    y={app.qualityOptionsPos.y}
    currentQuality={app.qualityOptionsPos.currentQuality as any}
    onPick={(q) => {
      app.qualityOptionsPos = { ...app.qualityOptionsPos!, currentQuality: q };
      app.closeQualityOptions();
    }}
    onDismiss={() => app.closeQualityOptions()}
  />
{/if}

{#if app.backdropOpen}
  <Backdrop
    open={app.backdropOpen}
    onClose={() => {
      app.closeBackdrop();
      app.closeIconGrid();
    }}
    opacity={0.5}
  />
{/if}
{#if app.iconGridOpen}
  <IconGrid
    items={ICON_PICKER_ITEMS}
    onSelect={(id) => app.selectIcon(id)}
    selectedId={app.selectedIconId}
  />
{/if}

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