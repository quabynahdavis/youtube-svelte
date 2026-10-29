<script lang="ts">
  /*
    MobileLibrary — mobile library page (Phone-2.png artboard).
    Sections: History, Watch Later, Liked videos, Shorts — each with a
    horizontal video list and a "View all" button. Bottom navigation bar.
    Route: /mobile/library
  */
  import Avatar from '../components/Avatar.svelte';
  import Icon from '../components/Icon.svelte';
  import { link } from '../router';
  import { app } from '../stores';
  import {
    VIDEOS, getChannel, formatCount, type Video,
  } from '../data/catalog';

  const NAV: Array<{ label: string; icon: string; href: string }> = [
    { label: 'Home', icon: 'home', href: '/' },
    { label: 'Shorts', icon: 'shorts', href: '/shorts' },
    { label: 'Search', icon: 'search', href: '/search' },
    { label: 'Subs', icon: 'subs', href: '/subscriptions' },
    { label: 'Library', icon: 'playlists', href: '/library' },
  ];

  const isNavActive = (href: string): boolean =>
    href === '/' ? app.activePage === 'home' : app.activePage === href.slice(1);

  const channelName = (slug: string): string => getChannel(slug)?.name ?? slug;

  interface LibrarySection {
    id: string;
    label: string;
    icon: string;
    slugs: string[];
  }

  const SECTIONS: LibrarySection[] = [
    { id: 'history', label: 'History', icon: 'history',
      slugs: ['everything-about-color', 'how-a-cat-works', 'christmas-lofi-radio'] },
    { id: 'watch-later', label: 'Watch Later', icon: 'clock',
      slugs: ['christmas-lofi-radio', 'everything-about-color'] },
    { id: 'liked', label: 'Liked videos', icon: 'thumb-up',
      slugs: ['how-a-cat-works', 'redesigned-youtube-ui-from-scratch'] },
    { id: 'shorts', label: 'Shorts', icon: 'shorts',
      slugs: ['put-this-cat-in-jail', 'pizza-crust-really-wants-me'] },
  ];

  const sectionVideos = (slugs: string[]): Video[] =>
    slugs.map((s) => VIDEOS.find((v) => v.slug === s)).filter((v): v is Video => !!v);
</script>

<div class="mobile-library">
  <header class="library-header">
    <h1>Library</h1>
  </header>

  {#each SECTIONS as section}
    <section class="section">
      <div class="section-head">
        <h2 class="section-title">{section.label}</h2>
        <button class="view-all" aria-label={`View all ${section.label}`}>View all</button>
      </div>
      <div class="video-list">
        {#each sectionVideos(section.slugs) as video (video.slug)}
          <button class="video-item" type="button" onclick={() => app.openChannel(video.channel)}
                  aria-label={video.title}>
            <div class="thumbwrap">
              <img class="thumb" src={video.thumb} alt={video.title} loading="lazy" />
              <span class="badge">{video.duration}</span>
            </div>
            <div class="info">
              <div class="title">{video.title}</div>
              <div class="meta">
                <span>{channelName(video.channel)}</span>
                <span class="dot">·</span>
                <span>{formatCount(video.views)} views</span>
                <span class="dot">·</span>
                <span>{video.age}</span>
              </div>
            </div>
          </button>
        {:else}
          <div class="empty">No videos yet</div>
        {/each}
      </div>
    </section>
  {/each}

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
  /* Mobile only — hidden on desktop */
  @media (min-width: 769px) {
    .mobile-library { display: none; }
  }

  .mobile-library {
    display: flex;
    flex-direction: column;
    height: 100dvh;
    background: var(--yt-page);
    overflow: hidden;
  }

  .library-header {
    height: var(--yt-topbar-h);
    display: flex;
    align-items: center;
    padding-inline: var(--yt-space-4);
    background: var(--yt-page);
    z-index: var(--yt-z-topbar);
  }

  .library-header h1 {
    margin: 0;
    font-size: var(--yt-fs-3xl);
    font-weight: var(--yt-weight-black);
    color: var(--yt-text);
  }

  .section {
    margin-bottom: var(--yt-space-6);
  }

  .section-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-inline: var(--yt-space-4);
    margin-bottom: var(--yt-space-3);
  }

  .section-title {
    margin: 0;
    font-size: var(--yt-fs-xl);
    font-weight: var(--yt-weight-bold);
    color: var(--yt-text);
  }

  .view-all {
    padding: 4px var(--yt-space-3);
    border-radius: var(--yt-radius-pill);
    background: var(--yt-elevated);
    color: var(--yt-text);
    font-size: var(--yt-fs-xs);
    font-weight: var(--yt-weight-medium);
  }
  .view-all:hover { background: var(--yt-hover); }

  .video-list {
    display: flex;
    gap: var(--yt-space-3);
    overflow-x: auto;
    scrollbar-width: none;
    padding-inline: var(--yt-space-4);
    padding-bottom: var(--yt-space-2);
  }
  .video-list::-webkit-scrollbar { display: none; }

  .video-item {
    flex: none;
    width: 170px;
    display: flex;
    flex-direction: column;
    gap: var(--yt-space-2);
  }

  .thumbwrap {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
    border-radius: var(--yt-radius-xl);
    background: var(--yt-raised);
    overflow: hidden;
  }

  .thumb {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .badge {
    position: absolute;
    right: var(--yt-space-2);
    bottom: var(--yt-space-2);
    padding: 1px 5px;
    border-radius: var(--yt-radius-xs);
    background: var(--yt-badge-bg);
    color: var(--yt-badge-fg);
    font-size: var(--yt-fs-xs);
    font-weight: var(--yt-weight-semibold);
    line-height: 1.5;
    pointer-events: none;
  }

  .info {
    min-width: 0;
  }

  .title {
    margin: 0 0 var(--yt-space-1);
    font-size: var(--yt-fs-md);
    font-weight: var(--yt-weight-semibold);
    line-height: var(--yt-line-snug);
    color: var(--yt-text);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .meta {
    display: flex;
    align-items: center;
    gap: var(--yt-space-1);
    color: var(--yt-text-soft);
    font-size: var(--yt-fs-xs);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .dot {
    font-size: var(--yt-fs-xs);
    opacity: 0.6;
  }

  .empty {
    padding-inline: var(--yt-space-4);
    color: var(--yt-text-dim);
    font-size: var(--yt-fs-md);
  }

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