<script lang="ts">
  /*
    TopBar — fixed 56px bar: burger, logo, live search, right cluster.
    Search types straight into `app.searchQuery` which Live-filters the
    Home grid / Shorts grid / Subscriptions listings.
  */
  import Avatar from './Avatar.svelte';
  import Icon from './Icon.svelte';
  import { app } from '../stores';
  import { BRAND_LOGO, getChannel } from '../data/catalog';

  let logoError = $state(false);
  const me = $derived(getChannel('juxtoppassed'));
</script>

<header class="topbar">
  <div class="cluster">
    <button
      class="icon-btn"
      aria-label="Toggle sidebar"
      title="Toggle sidebar"
      onclick={() => app.toggleSidebar()}
    >
      <Icon name="hamburger" />
    </button>

    <a
      class="logo"
      href="/"
      aria-label="YouTube — go home"
      onclick={(e) => {
        e.preventDefault();
        app.navigateTo('home');
      }}
    >
      {#if !logoError}
        <img
          class="logo-img"
          src={BRAND_LOGO}
          alt="YouTube"
          height="22"
          loading="eager"
          onerror={() => (logoError = true)}
        />
      {:else}
        <!-- fallback until /assets/logo.png lands -->
        <span class="logo-badge"><span class="logo-play"></span><span class="logo-word">YouTube</span></span>
      {/if}
    </a>
  </div>

  <div class="search" role="search">
    <Icon name="search" size={17} />
    <input
      type="text"
      placeholder="Search"
      aria-label="Search"
      bind:value={app.searchQuery}
    />
    <span class="divider" aria-hidden="true"></span>
    <button class="tower" title="Search by" aria-label="Search options" tabindex={-1}>
      <Icon name="arrow-south" size={16} />
    </button>
  </div>

  <div class="cluster">
    <button
      class="avatar-btn"
      data-notifs-toggle
      onclick={() => {
        app.shareOpen = false;
        app.notifsOpen = !app.notifsOpen;
      }}
      aria-label="Notifications"
      title="Notifications"
      class:open={app.notifsOpen}
    >
      <Icon name="bell" />
    </button>
    <button
      class="icon-btn"
      aria-label="Settings"
      title="Settings"
      onclick={() => {
        app.openBackdrop();
        app.openIconGrid();
      }}
    >
      <Icon name="gear" />
    </button>
    <!-- theme ring: half red / half blue, decorative -->
    <button
      class="theme-ring"
      title="Light theme coming"
      aria-label="Theme (light theme coming)"
      tabindex={-1}
    ></button>
    <button class="me-btn" aria-label="Account" title="Account" onclick={() => (app.shareOpen = true)}>
      <Avatar src={me?.avatar} name={me?.name} size={32} />
    </button>
  </div>
</header>

<style>
  .topbar {
    position: fixed;
    inset-inline: 0;
    top: 0;
    height: var(--yt-topbar-h);
    z-index: var(--yt-z-topbar);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--yt-space-4);
    padding-inline: var(--yt-space-4);
    background: var(--yt-page);
  }
  .cluster {
    display: flex;
    align-items: center;
    gap: var(--yt-space-1);
  }
  .icon-btn,
  .avatar-btn,
  .me-btn,
  .tower {
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border-radius: var(--yt-radius-pill);
    color: var(--yt-text);
    background: none;
    cursor: pointer;
  }
  .icon-btn:hover,
  .avatar-btn:hover,
  .me-btn:hover {
    background: var(--yt-card);
  }
  .avatar-btn.open {
    color: var(--yt-accent);
  }

  .logo {
    display: flex;
    align-items: center;
    margin-left: var(--yt-space-2);
  }
  .logo-img {
    height: 22px;
    width: auto;
  }
  .logo-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .logo-play {
    width: 24px;
    height: 17px;
    border-radius: 6px;
    background: var(--yt-accent);
    position: relative;
  }
  .logo-play::after {
    content: '';
    position: absolute;
    left: 9px;
    top: 4.5px;
    border-left: 7px solid #fff;
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
    width: min(560px, 56vw);
    height: 40px;
    padding-inline: var(--yt-space-4) 4px;
    border: 1px solid #383838;
    border-radius: var(--yt-radius-pill);
    background: var(--yt-surface);
    color: var(--yt-text-dim);
  }
  .search:focus-within {
    border-color: var(--yt-hover);
  }
  .search input {
    flex: 1;
    min-width: 0;
    margin-left: var(--yt-space-3);
    background: none;
    border: none;
    outline: none;
    color: var(--yt-text);
    font: inherit;
    font-size: var(--yt-fs-md);
  }
  .search input::placeholder {
    color: var(--yt-text-dim);
  }
  .divider {
    width: 1px;
    height: 22px;
    background: #383838;
  }
  .tower {
    width: 36px;
    height: 36px;
    border-radius: var(--yt-radius-pill);
  }
  .tower:hover {
    background: var(--yt-elevated);
  }

  .theme-ring {
    width: 22px;
    height: 22px;
    margin-inline: 10px;
    border-radius: var(--yt-radius-pill);
    padding: 4px;
    background: conic-gradient(from -90deg, var(--yt-accent) 0 50%, #4cc2ff 50% 100%);
    cursor: pointer;
  }
  .theme-ring::after {
    content: '';
    display: block;
    height: 14px;
    border-radius: inherit;
    background: var(--yt-page);
  }
</style>
