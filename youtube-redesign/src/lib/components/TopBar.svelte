<script lang="ts">
  /*
    TopBar — stub (scaffold shell). TODO(next step) per Home.png:
      - swap the CSS mock logo for <img src={BRAND_LOGO} alt="YouTube" />
        once /assets/logo.png exists (asset agent)
      - search field semantics + keyboard focus, download icon at right end
      - right cluster: create button, notifications dot, settings, avatar
        (wired: burger→sidebarExpanded, bell→notifsOpen, gear→personalizeOpen,
        avatar→shareOpen as a share-menu stand-in)
  */
  import { app } from '../stores';
</script>

<header class="topbar">
  <div class="cluster">
    <button class="icon-btn" aria-label="Toggle sidebar" onclick={() => app.toggleSidebar()}>
      <span class="burger-lines"><span></span><span></span><span></span></span>
    </button>

    <button class="logo" aria-label="YouTube — go home" onclick={() => app.navigateTo('home')}>
      <span class="logo-badge"><span class="logo-play"></span></span>
      <span class="logo-word">YouTube</span>
    </button>
  </div>

  <div class="search" role="search" aria-label="Search">
    <svg class="mag" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="2" />
      <path d="m16 16 5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
    </svg>
    <span class="search-hint">Search</span>
  </div>

  <div class="cluster">
    <button
      class="icon-btn"
      class:active={app.notifsOpen}
      aria-label="Notifications"
      onclick={() => (app.notifsOpen = !app.notifsOpen)}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 3a6 6 0 0 0-6 6v3.6L4.5 16.5h15L18 12.6V9a6 6 0 0 0-6-6Zm-2 15a2 2 0 0 0 4 0h-4Z"
          fill="currentColor"
        />
      </svg>
    </button>
    <button
      class="icon-btn"
      class:active={app.personalizeOpen}
      aria-label="Personalize feed"
      onclick={() => (app.personalizeOpen = !app.personalizeOpen)}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="3" fill="currentColor" />
        <circle cx="12" cy="12" r="7.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-dasharray="3.4 2.6" />
      </svg>
    </button>
    <button class="avatar" aria-label="Account" onclick={() => (app.shareOpen = true)}>D</button>
  </div>
</header>

<style>
  .topbar {
    position: sticky;
    top: 0;
    z-index: var(--yt-z-topbar);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--yt-space-4);
    height: 56px;
    padding-inline: var(--yt-space-4);
    background: var(--yt-page);
  }
  .cluster {
    display: flex;
    align-items: center;
    gap: var(--yt-space-2);
  }
  .icon-btn,
  .avatar {
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border-radius: var(--yt-radius-pill);
    color: var(--yt-text);
    background: none;
  }
  .icon-btn:hover {
    background: var(--yt-elevated);
  }
  .icon-btn.active {
    color: var(--yt-accent-bright);
  }
  .icon-btn svg {
    width: 21px;
    height: 21px;
  }
  .burger-lines {
    display: grid;
    gap: 4px;
    width: 18px;
  }
  .burger-lines span {
    height: 2px;
    border-radius: var(--yt-radius-xs);
    background: var(--yt-text);
  }

  .logo {
    display: flex;
    align-items: center;
    gap: var(--yt-space-2);
    background: none;
    padding: var(--yt-space-2) var(--yt-space-1);
  }
  .logo-badge {
    display: grid;
    place-items: center;
    width: 28px;
    height: 20px;
    border-radius: 6px;
    background: var(--yt-accent-bright);
  }
  .logo-play {
    width: 0;
    height: 0;
    margin-left: 1px;
    border-left: 8px solid #fff;
    border-block: 4px solid transparent;
  }
  .logo-word {
    font-size: 18px;
    font-weight: var(--yt-weight-bold);
    letter-spacing: -0.5px;
    color: var(--yt-text);
  }

  .search {
    display: flex;
    align-items: center;
    gap: var(--yt-space-2);
    width: min(560px, 55vw);
    height: 40px;
    padding-inline: var(--yt-space-4);
    border-radius: var(--yt-radius-md);
    background: var(--yt-card);
    color: var(--yt-text-dim);
    border: 1px solid var(--yt-border);
  }
  .search .mag {
    width: 17px;
    height: 17px;
  }
  .search-hint {
    font-size: var(--yt-fs-md);
    font-weight: var(--yt-weight-medium);
  }

  .avatar {
    border-radius: var(--yt-radius-pill);
    background: var(--yt-elevated);
    color: var(--yt-text-soft);
    font-size: var(--yt-fs-md);
    font-weight: var(--yt-weight-semibold);
  }
</style>
