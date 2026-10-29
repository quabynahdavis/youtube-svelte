<script lang="ts">
  /*
    MobileVideoPlayer — mobile-optimized video page (Phone.png artboard).
    Full-screen replacement for the desktop shell on narrow viewports.
    Route: /mobile/video/:slug — slug looked up in the catalog.
    Includes bottom navigation bar (Home / Shorts / Search / Subs / Library).
  */
  import Avatar from './Avatar.svelte';
  import Icon from './Icon.svelte';
  import { link } from '../router';
  import { app } from '../stores';
  import { getChannel, formatCount, type Video } from '../data/catalog';

  interface Props {
    video: Video;
  }

  let { video }: Props = $props();

  const channel = $derived(getChannel(video.channel));
  const channelName = $derived(channel?.name ?? video.channel);
  const subsText = $derived(channel ? `${formatCount(channel.subs)} subscribers` : '');
  const isVerified = $derived(channel?.verified ?? false);

  let liked = $state(false);
  let disliked = $state(false);
  let saved = $state(false);

  const NAV: Array<{ label: string; icon: string; href: string }> = [
    { label: 'Home', icon: 'home', href: '/' },
    { label: 'Shorts', icon: 'shorts', href: '/shorts' },
    { label: 'Search', icon: 'search', href: '/search' },
    { label: 'Subs', icon: 'subs', href: '/subscriptions' },
    { label: 'Library', icon: 'playlists', href: '/library' },
  ];

  const isNavActive = (href: string): boolean =>
    href === '/' ? app.activePage === 'home' : app.activePage === href.slice(1);

  const toggleLike = (): void => { liked = !liked; disliked = false; };
  const toggleDislike = (): void => { disliked = !disliked; liked = false; };
  const toggleSave = (): void => { saved = !saved; };
</script>

<div class="mobile-video">
  <header class="topbar">
    <button class="back" aria-label="Back" onclick={() => history.back()}>
      <Icon name="chevron-left" size={24} />
    </button>
    <div class="title">{video.title}</div>
    <button class="more" aria-label="More options">
      <Icon name="more-vert" size={24} />
    </button>
  </header>

  <div class="channel-row">
    <Avatar src={channel?.avatar} name={channelName} size={32} />
    <div class="channel-info">
      <div class="channel-name">{channelName}</div>
      <div class="channel-meta">
        {#if isVerified}<span class="verified">✓</span>{/if}
        <span>· {subsText}</span>
      </div>
    </div>
    <button class="subscribe-btn">Subscribe</button>
  </div>

  <div class="chip-row">
    {#each ['Juxtopposed', 'AutoFo', 'Forte', 'baniel', 'Marque'] as name (name)}
      <button class="chip">{name}</button>
    {/each}
  </div>

  <nav class="tabs" aria-label="Video sections">
    <button class="tab" class:active={true}>All</button>
    <button class="tab">Subscriptions</button>
    <button class="tab">Posts</button>
    <button class="tab">New</button>
  </nav>

  <div class="video-info">
    <h1 class="video-title">{video.title}</h1>
    <div class="video-meta">
      <span>{channelName}</span>
      <span class="dot">·</span>
      <span>{formatCount(video.views)} views</span>
      <span class="dot">·</span>
      <span>{video.age}</span>
    </div>
  </div>

  <div class="actions">
    <button class="action" class:active={liked} onclick={toggleLike}
            aria-pressed={liked} aria-label="Like">
      <Icon name={liked ? 'thumb-up' : 'thumb-up'} size={20} />
      <span>Like</span>
    </button>
    <button class="action" class:active={disliked} onclick={toggleDislike}
            aria-pressed={disliked} aria-label="Dislike">
      <Icon name="thumb-down" size={20} />
      <span>Dislike</span>
    </button>
    <button class="action" onclick={() => (app.shareOpen = true)} aria-label="Share">
      <Icon name="share" size={20} />
      <span>Share</span>
    </button>
    <button class="action" aria-label="Download">
      <Icon name="download" size={20} />
      <span>Download</span>
    </button>
    <button class="action" aria-label="Clip">
      <Icon name="clipboard" size={20} />
      <span>Clip</span>
    </button>
    <button class="action" class:active={saved} onclick={toggleSave}
            aria-pressed={saved} aria-label="Save">
      <Icon name={saved ? 'bookmark' : 'bookmark'} size={20} />
      <span>Save</span>
    </button>
  </div>

  <nav class="bottom-nav" aria-label="Bottom navigation">
    {#each NAV as item (item.label)}
      <a use:link href={item.href}
         class="nav-item"
         class:active={isNavActive(item.href)}
         aria-label={item.label}>
        <Icon name={item.icon} size={26} />
        <span class="nav-label">{item.label}</span>
      </a>
    {/each}
  </nav>
</div>

<style>
  @media (min-width: 769px) {
    .mobile-video { display: none; }
  }

  .mobile-video {
    display: flex;
    flex-direction: column;
    height: 100dvh;
    background: var(--yt-page);
    overflow: hidden;
  }

  .topbar {
    height: var(--yt-topbar-h);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-inline: var(--yt-space-4);
    background: var(--yt-page);
    z-index: var(--yt-z-topbar);
  }

  .back,
  .more {
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border-radius: var(--yt-radius-pill);
    background: none;
    color: var(--yt-text);
  }
  .back:hover, .more:hover { background: var(--yt-card); }

  .title {
    flex: 1;
    min-width: 0;
    font-size: var(--yt-fs-lg);
    font-weight: var(--yt-weight-semibold);
    color: var(--yt-text);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .channel-row {
    display: flex;
    align-items: center;
    gap: var(--yt-space-3);
    padding: var(--yt-space-3);
    background: var(--yt-page);
  }

  .channel-info {
    flex: 1;
    min-width: 0;
  }

  .channel-name {
    font-size: var(--yt-fs-md);
    font-weight: var(--yt-weight-bold);
    color: var(--yt-text);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .channel-meta {
    display: flex;
    align-items: center;
    gap: var(--yt-space-1);
    color: var(--yt-text-soft);
    font-size: var(--yt-fs-xs);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .verified {
    color: var(--yt-accent);
    font-size: var(--yt-fs-xs);
  }

  .subscribe-btn {
    flex: none;
    height: 32px;
    padding: 0 var(--yt-space-4);
    border-radius: var(--yt-radius-pill);
    background: var(--yt-elevated);
    color: var(--yt-text);
    font-size: var(--yt-fs-xs);
    font-weight: var(--yt-weight-semibold);
  }
  .subscribe-btn:hover { background: var(--yt-hover); }

  .chip-row {
    display: flex;
    gap: var(--yt-space-2);
    overflow-x: auto;
    padding: 0 var(--yt-space-3) var(--yt-space-3);
    scrollbar-width: none;
  }
  .chip-row::-webkit-scrollbar { display: none; }

  .chip {
    flex: none;
    height: 32px;
    padding-inline: var(--yt-space-3);
    border-radius: var(--yt-radius-pill);
    background: var(--yt-elevated);
    color: var(--yt-text);
    font-size: var(--yt-fs-xs);
    font-weight: var(--yt-weight-medium);
    white-space: nowrap;
  }
  .chip:hover { background: var(--yt-hover); }

  .tabs {
    display: flex;
    border-bottom: 1px solid var(--yt-border);
    padding-bottom: 1px;
    overflow-x: auto;
    scrollbar-width: none;
  }
  .tabs::-webkit-scrollbar { display: none; }

  .tab {
    flex-shrink: 0;
    padding: 10px 0;
    margin-inline-end: var(--yt-space-6);
    color: var(--yt-text-soft);
    font-size: var(--yt-fs-md);
    font-weight: var(--yt-weight-semibold);
    border-bottom: 2px solid transparent;
    background: none;
  }
  .tab:hover { color: var(--yt-text); }
  .tab.active {
    color: var(--yt-text);
    border-color: var(--yt-accent);
  }

  .video-info {
    padding: var(--yt-space-3);
  }

  .video-title {
    margin: 0 0 var(--yt-space-2);
    font-size: var(--yt-fs-lg);
    font-weight: var(--yt-weight-semibold);
    line-height: var(--yt-line-snug);
    color: var(--yt-text);
  }

  .video-meta {
    display: flex;
    align-items: center;
    gap: var(--yt-space-1);
    color: var(--yt-text-soft);
    font-size: var(--yt-fs-sm);
  }

  .dot {
    font-size: var(--yt-fs-xs);
    opacity: 0.6;
  }

  .actions {
    display: flex;
    gap: var(--yt-space-3);
    padding: var(--yt-space-3);
    border-top: 1px solid var(--yt-border);
  }

  .action {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--yt-space-1);
    padding: var(--yt-space-2);
    border-radius: var(--yt-radius-sm);
    background: none;
    color: var(--yt-text-soft);
    font-size: var(--yt-fs-xs);
    font-weight: var(--yt-weight-medium);
  }
  .action:hover { background: var(--yt-elevated); color: var(--yt-text); }
  .action.active { color: var(--yt-accent); }

  .bottom-nav {
    position: fixed;
    inset-inline: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    padding-block: var(--yt-space-2) var(--yt-space-4);
    background: var(--yt-surface);
    border-top: 1px solid var(--yt-border);
    z-index: var(--yt-z-modal);
    border-radius: var(--yt-radius-xl) var(--yt-radius-xl) 0 0;
  }

  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--yt-space-1);
    padding: var(--yt-space-1);
    color: var(--yt-text-soft);
    text-decoration: none;
    min-width: 56px;
  }
  .nav-item:hover { background: var(--yt-elevated); border-radius: var(--yt-radius-pill); }
  .nav-item.active { color: var(--yt-accent); }

  .nav-label {
    font-size: var(--yt-fs-xs);
    white-space: nowrap;
  }
</style>