<script lang="ts">
  /*
    Rewind 2024 — per Rewind.png mockup:
    - page header + description
    - Top Channels section with stat badges (videos / hours / likes received)
    - "12 new channels" section
    - category chips: Tech, Cats, Lofi beats
    Real channel data from catalog.ts (eve-online, howtobasic, man-carrying-thing).
    Asset avatars fall back to letter icons until /assets/avatars land.
  */
  import Avatar from '../components/Avatar.svelte';
  import Icon from '../components/Icon.svelte';
  import {
    CHANNELS,
    getChannel,
    formatCount,
    type Channel,
  } from '../data/catalog';

  interface TopChannel {
    slug: string;
    statValue: string;
    statLabel: string;
  }

  const TOP_CHANNELS: TopChannel[] = [
    { slug: 'eve-online', statValue: '1,260', statLabel: 'videos' },
    { slug: 'howtobasic', statValue: '187', statLabel: 'hours watched' },
    { slug: 'man-carrying-thing', statValue: '19K', statLabel: 'likes received' },
  ];

  const topChannels = $derived(
    TOP_CHANNELS.map((tc) => ({ ...tc, channel: getChannel(tc.slug) })),
  );

  const NEW_CHANNEL_SLUGS: string[] = [
    'brandonshepherd',
    'coding-with-ai',
    'daniel-kraff',
    'bog',
    'ok',
  ];

  const newChannels = $derived(
    NEW_CHANNEL_SLUGS.map((slug) => getChannel(slug)).filter((c): c is Channel => !!c),
  );

  const CATEGORY_CHIPS = ['Tech', 'Cats', 'Lofi beats'] as const;
  type Category = (typeof CATEGORY_CHIPS)[number];
  let activeCategory = $state<Category>(CATEGORY_CHIPS[0]);
</script>

<div class="rewind-page">
  <header class="page-head">
    <div class="head-body">
      <h1>Rewind 2024</h1>
      <p class="head-desc">
        Your year on YouTube, wrapped — the channels, creators and categories
        that defined 2024.
      </p>
    </div>
  </header>

  <section class="section">
    <header class="section-head">
      <h2>Top channels</h2>
    </header>
    <div class="top-grid">
      {#each topChannels as tc (tc.slug)}
        <article class="top-card">
          <Avatar src={tc.channel?.avatar} name={tc.channel?.name ?? tc.slug} size={56} ring />
          <div class="top-body">
            <div class="top-name">
              {tc.channel?.name ?? tc.slug}
              {#if tc.channel?.verified}
                <span class="check" aria-label="Verified"><Icon name="check-circle" size={14} /></span>
              {/if}
            </div>
            <div class="top-stat">
              <span class="stat-value">{tc.statValue}</span>
              <span class="stat-label">{tc.statLabel}</span>
            </div>
          </div>
        </article>
      {/each}
    </div>
  </section>

  <section class="section">
    <header class="section-head">
      <div>
        <h2>New channels</h2>
        <p class="sub">12 new channels</p>
      </div>
    </header>
    <div class="chip-shelf">
      {#each newChannels as channel (channel.slug)}
        <button class="new-chip">
          <Avatar src={channel.avatar} name={channel.name} size={32} />
          <span class="new-name">{channel.name}</span>
        </button>
      {:else}
        <p class="empty">No new channels</p>
      {/each}
    </div>
  </section>

  <section class="section">
    <header class="section-head">
      <h2>Categories</h2>
    </header>
    <div class="cat-chips">
      {#each CATEGORY_CHIPS as chip (chip)}
        <button
          class="cat-chip"
          class:active={activeCategory === chip}
          onclick={() => (activeCategory = chip)}
        >
          {chip}
        </button>
      {/each}
    </div>
  </section>
</div>

<style>
  .rewind-page {
    display: grid;
    gap: var(--yt-space-8);
  }

  .page-head {
    padding-top: var(--yt-space-2);
  }

  .head-body h1 {
    margin: 0 0 var(--yt-space-2);
    font-size: var(--yt-fs-4xl);
    font-weight: var(--yt-weight-extrabold);
    letter-spacing: -0.5px;
  }

  .head-desc {
    margin: 0;
    color: var(--yt-text-soft);
    font-size: var(--yt-fs-md);
    max-width: 720px;
  }

  .section {
    margin-bottom: var(--yt-space-8);
  }

  .section-head {
    display: flex;
    align-items: center;
    gap: var(--yt-space-4);
    margin-bottom: var(--yt-space-5);
  }

  .section-head h2 {
    margin: 0;
    font-size: var(--yt-fs-xl);
    font-weight: var(--yt-weight-extrabold);
  }

  .sub {
    margin: 0;
    color: var(--yt-text-soft);
    font-size: var(--yt-fs-sm);
  }

  /* Top channels grid */
  .top-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: var(--yt-space-5);
  }

  .top-card {
    display: flex;
    align-items: center;
    gap: var(--yt-space-4);
    padding: var(--yt-space-5);
    border-radius: var(--yt-radius-xl);
    background: var(--yt-card);
    border: 1px solid var(--yt-border);
  }

  .top-card:hover {
    border-color: var(--yt-border-strong);
  }

  .top-body {
    flex: 1;
    min-width: 0;
  }

  .top-name {
    display: flex;
    align-items: center;
    gap: var(--yt-space-2);
    margin: 0 0 var(--yt-space-2);
    font-size: var(--yt-fs-lg);
    font-weight: var(--yt-weight-bold);
    color: var(--yt-text);
  }

  .check {
    color: var(--yt-accent);
    flex-shrink: 0;
  }

  .top-stat {
    display: flex;
    align-items: baseline;
    gap: var(--yt-space-2);
    font-size: var(--yt-fs-xl);
    font-weight: var(--yt-weight-extrabold);
    color: var(--yt-text);
  }

  .stat-label {
    font-weight: var(--yt-weight-medium);
    color: var(--yt-text-soft);
    font-size: var(--yt-fs-sm);
  }

  /* New channels shelf */
  .chip-shelf {
    display: flex;
    gap: var(--yt-space-3);
    overflow-x: auto;
    scrollbar-width: none;
    padding-bottom: var(--yt-space-2);
  }

  .chip-shelf::-webkit-scrollbar {
    display: none;
  }

  .new-chip {
    display: inline-flex;
    align-items: center;
    gap: var(--yt-space-3);
    height: 44px;
    padding: 0 var(--yt-space-5);
    border-radius: var(--yt-radius-pill);
    background: var(--yt-elevated);
    color: var(--yt-text);
    font-size: var(--yt-fs-md);
    font-weight: var(--yt-weight-medium);
    white-space: nowrap;
    border: none;
    cursor: default;
  }

  .new-chip:hover {
    background: var(--yt-hover);
  }

  .new-name {
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 140px;
  }

  .empty {
    color: var(--yt-text-soft);
    font-size: var(--yt-fs-md);
  }

  /* Category chips */
  .cat-chips {
    display: flex;
    gap: var(--yt-space-2);
    overflow-x: auto;
    scrollbar-width: none;
    padding-bottom: var(--yt-space-2);
  }

  .cat-chips::-webkit-scrollbar {
    display: none;
  }

  .cat-chip {
    height: 32px;
    padding-inline: var(--yt-space-4);
    border-radius: var(--yt-radius-pill);
    background: var(--yt-chip-bg);
    color: var(--yt-text);
    font-size: var(--yt-fs-sm);
    font-weight: var(--yt-weight-medium);
    border: none;
    cursor: pointer;
  }

  .cat-chip:hover {
    background: var(--yt-chip-hover);
  }

  .cat-chip.active {
    background: var(--yt-chip-active-bg);
    color: var(--yt-chip-active-fg);
    font-weight: var(--yt-weight-semibold);
  }
</style>
