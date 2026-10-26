<script lang="ts">
  /*
    Subscriptions — one page hosting both header tabs per the mockups:

    ▸ "Subscriptions 126": toolbar (View as menu · All/Videos/Posts/Live/
      Shorts segmented · Newest ▾ · Date Range pill · grid|list toggles ·
      search pill), Timeline view with day rail (Today/Yesterday) in 4-col
      rows, List view with 168px horizontal cards, Shorts segment as a
      shorts grid.
    ▸ "Collections 3": Sort-by menu, grid|list, New Collection pill,
      search pill; groups Gaming / Design & Code / Tech with per-channel
      cards and Subscribed ⇄ Subscribe pill toggle.

    The sidebar "Collections" row lands on app.subsTab='collections'.
  */
  import Avatar from '../components/Avatar.svelte';
  import ContextMenu, { type MenuItem } from '../components/ContextMenu.svelte';
  import Icon from '../components/Icon.svelte';
  import ShortsCard from '../components/ShortsCard.svelte';
  import VideoCard from '../components/VideoCard.svelte';
  import { app, type CollSort, type CollView, type SubsKind, type SubsSort, type SubsView } from '../stores';
  import {
    COLLECTION_GROUPS,
    SUBSCRIBED_CHANNEL_SLUGS,
    VIDEOS,
    formatCount,
    getChannel,
    type Channel,
    type Video,
  } from '../data/catalog';

  /* ------- toolbar portals ------- */
  let viewMenu = $state<{ x: number; y: number } | null>(null);
  let newestMenu = $state<{ x: number; y: number } | null>(null);
  let sortMenu = $state<{ x: number; y: number } | null>(null);

  let subsSearch = $state('');
  let collSearch = $state('');

  let collapsedGroups = $state<Record<string, boolean>>({});

  const anchor = (e: Event): { x: number; y: number } => {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    return { x: r.left, y: r.bottom + 6 };
  };

  /* ------- subscriptions tab ------- */
  const subscribedChannels = $derived(
    SUBSCRIBED_CHANNEL_SLUGS.map(getChannel).filter((c): c is Channel => !!c),
  );

  const KINDS: Array<{ id: SubsKind; label: string }> = [
    { id: 'all', label: 'All' },
    { id: 'videos', label: 'Videos' },
    { id: 'posts', label: 'Posts' },
    { id: 'live', label: 'Live' },
    { id: 'shorts', label: 'Shorts' },
  ];

  const timelinePool = $derived.by((): Video[] => {
    let pool = VIDEOS.filter((v) => SUBSCRIBED_CHANNEL_SLUGS.includes(v.channel));

    if (app.subsKind === 'videos') pool = pool.filter((v) => v.type === 'video');
    else if (app.subsKind === 'shorts') pool = pool.filter((v) => v.type === 'short');
    else if (app.subsKind === 'posts') pool = pool.filter((v) => v.tags.includes('Posts'));
    else if (app.subsKind === 'live') pool = pool.filter((v) => v.tags.includes('Live'));

    const query = subsSearch.trim().toLowerCase();
    if (query) {
      pool = pool.filter((v) => {
        const name = getChannel(v.channel)?.name.toLowerCase() ?? '';
        return v.channel.toLowerCase().includes(query) || name.includes(query);
      });
    }

    if (app.subsSort === 'oldest') pool = [...pool].reverse();
    return pool;
  });

  const isShortsKind = $derived(app.subsKind === 'shorts');
  const todayRow = $derived(timelinePool.slice(0, 8));
  const yesterdayRow = $derived(timelinePool.slice(8, 16));

  /* ------- collections tab ------- */
  const groupData = $derived.by(() => {
    const query = collSearch.trim().toLowerCase();
    return COLLECTION_GROUPS.map((g) => {
      let channels = g.channels
        .map(getChannel)
        .filter((c): c is Channel => !!c)
        .filter((c) => !query || c.name.toLowerCase().includes(query) || c.slug.toLowerCase().includes(query));
      if (app.collSort === 'newest') channels = [...channels].sort((a, b) => b.subs - a.subs);
      else if (app.collSort === 'az') channels = [...channels].sort((a, b) => a.name.localeCompare(b.name));
      return { name: g.name as string, channels };
    }).filter((g) => g.channels.length > 0);
  });

  const VIEW_ITEMS: MenuItem[] = [
    { id: 'timeline', label: 'Timeline', icon: 'calendar' },
    { id: 'list', label: 'List', icon: 'rows' },
  ];
  const NEWEST_ITEMS: MenuItem[] = [
    { id: 'newest', label: 'Newest', icon: 'sort' },
    { id: 'oldest', label: 'Oldest', icon: 'sort' },
  ];
  const SORT_ITEMS: MenuItem[] = [
    { id: 'relevance', label: 'Relevance', icon: 'sort' },
    { id: 'newest', label: 'Newest', icon: 'clock' },
    { id: 'az', label: 'A-Z', icon: 'rows' },
  ];
</script>

<div class="subs-page">
  {#snippet tab(label: string, count: number, tab: 'subs' | 'collections')}
    <button class="tab" class:active={app.subsTab === tab} onclick={() => (app.subsTab = tab)}>
      {label}<sup class="count">{count}</sup>
    </button>
  {/snippet}

  {#snippet toolPill(inner: import('svelte').Snippet, onclick: () => void, label: string)}
    <button class="tool" {onclick} aria-haspopup="menu" aria-label={label}>{@render inner()}</button>
  {/snippet}

  <header class="tabs">
    {@render tab('Subscriptions', 126, 'subs')}
    {@render tab('Collections', 3, 'collections')}
  </header>

  {#if app.subsTab === 'subs'}
    {#snippet segmented()}
      <div class="segments" role="group" aria-label="Subscriptions type">
        {#each KINDS as kind (kind.id)}
          <button class="seg" class:active={app.subsKind === kind.id} onclick={() => (app.subsKind = kind.id)}>
            {kind.label}
          </button>
        {/each}
      </div>
    {/snippet}

    <div class="toolbar">
      <button
        class="tool"
        data-context-scope
        onclick={(e) => { viewMenu = anchor(e); }}
        aria-haspopup="menu"
      >
        View as: <strong class="val">{app.subsView === 'timeline' ? 'Timeline' : 'List'}</strong>
        <Icon name="chevron-down" size={14} />
      </button>

      {@render segmented()}

      <button class="tool" onclick={() => (app.subsSort = app.subsSort === 'newest' ? 'oldest' : 'newest')}>
        <strong class="val">{app.subsSort === 'newest' ? 'Newest' : 'Oldest'}</strong>
        <Icon name="chevron-down" size={14} />
      </button>

      <button class="tool" onclick={() => (app.subsSort = app.subsSort === 'newest' ? 'oldest' : 'newest')}>
        <Icon name="calendar" size={16} />
        Date Range · <strong class="val">All</strong>
      </button>
      <button
        class="tool"
        data-context-scope
        onclick={(e) => { newestMenu = anchor(e); }}
        aria-haspopup="menu"
      >
        <Icon name="sort" size={16} />
        <Icon name="chevron-down" size={14} />
      </button>

      <span class="spacer"></span>

      <div class="icon-toggle" role="group" aria-label="Timeline view">
        <button class="it" class:active={app.subsView === 'timeline'} onclick={() => (app.subsView = 'timeline')} aria-label="Grid view">
          <Icon name="grid" size={16} />
        </button>
        <button class="it" class:active={app.subsView === 'list'} onclick={() => (app.subsView = 'list')} aria-label="List view">
          <Icon name="list" size={16} />
        </button>
      </div>

      <div class="search-pill">
        <Icon name="search" size={15} />
        <input placeholder="Search subscriptions" bind:value={subsSearch} aria-label="Search subscriptions" />
      </div>
    </div>

    {#if viewMenu}
      <ContextMenu
        x={viewMenu.x}
        y={viewMenu.y}
        items={VIEW_ITEMS}
        onPick={(id) => { app.subsView = id as SubsView; viewMenu = null; }}
        onDismiss={() => (viewMenu = null)}
      />
    {/if}
    {#if newestMenu}
      <ContextMenu
        x={newestMenu.x}
        y={newestMenu.y}
        items={NEWEST_ITEMS}
        onPick={(id) => { app.subsSort = id as SubsSort; newestMenu = null; }}
        onDismiss={() => (newestMenu = null)}
      />
    {/if}

    {#if timelinePool.length === 0}
      <div class="empty">
        <p>No subscriptions match your filters</p>
        <button class="reset" onclick={() => { subsSearch = ''; app.subsKind = 'all'; }}>Reset filters</button>
      </div>
    {:else if isShortsKind || app.subsView === 'timeline' && isShortsKind}
      <section class="shorts-grid">
        {#each timelinePool as video (video.slug)}
          <ShortsCard {video} />
        {/each}
      </section>
    {:else if app.subsView === 'timeline'}
      <section class="timeline">
        {#if todayRow.length > 0}
          <div class="day">
            <h3 class="day-head"><span class="dot"></span>Today · 15 Dec 2024</h3>
            <div class="cards">
              {#each todayRow as video (video.slug)}
                <VideoCard {video} />
              {/each}
            </div>
          </div>
        {/if}
        {#if yesterdayRow.length > 0}
          <div class="day">
            <h3 class="day-head"><span class="dot"></span>Yesterday · 14 Dec 2024</h3>
            <div class="cards">
              {#each yesterdayRow as video (video.slug)}
                <VideoCard {video} />
              {/each}
            </div>
          </div>
        {/if}
      </section>
    {:else}
      <section class="timeline list-view">
        {#if todayRow.length > 0}
          <h3 class="day-head"><span class="dot"></span>Today · 15 Dec 2024</h3>
          <div class="rows">
            {#each todayRow as video (video.slug)}
              {@render listRow(video)}
            {/each}
          </div>
        {/if}
        {#if yesterdayRow.length > 0}
          <h3 class="day-head"><span class="dot"></span>Yesterday · 14 Dec 2024</h3>
          <div class="rows">
            {#each yesterdayRow as video (video.slug)}
              {@render listRow(video)}
            {/each}
          </div>
        {/if}
      </section>
    {/if}
  {:else}
    <!-- ============================ Collections tab ==================== -->
    <div class="toolbar">
      <button class="tool" data-context-scope onclick={(e) => { sortMenu = anchor(e); }} aria-haspopup="menu">
        Sort by: <strong class="val">{app.collSort === 'relevance' ? 'Relevance' : app.collSort === 'newest' ? 'Newest' : 'A-Z'}</strong>
        <Icon name="chevron-down" size={14} />
      </button>

      <div class="icon-toggle" role="group" aria-label="Collections layout">
        <button class="it" class:active={app.collView === 'grid'} onclick={() => (app.collView = 'grid')} aria-label="Grid">
          <Icon name="grid" size={16} />
        </button>
        <button class="it" class:active={app.collView === 'list'} onclick={() => (app.collView = 'list')} aria-label="List">
          <Icon name="list" size={16} />
        </button>
      </div>

      <span class="spacer"></span>

      <button class="tool" onclick={() => (app.personalizeOpen = true)}>
        <Icon name="collections" size={15} />
        New Collection
      </button>

      <div class="search-pill">
        <Icon name="search" size={15} />
        <input placeholder="Search subscriptions" bind:value={collSearch} aria-label="Search subscriptions" />
      </div>
    </div>

    {#if sortMenu}
      <ContextMenu
        x={sortMenu.x}
        y={sortMenu.y}
        items={SORT_ITEMS}
        onPick={(id) => { app.collSort = id as CollSort; sortMenu = null; }}
        onDismiss={() => (sortMenu = null)}
      />
    {/if}

    {#if groupData.length === 0}
      <div class="empty"><p>No channels match “{collSearch}”</p></div>
    {:else}
      {#each groupData as group (group.name)}
        <section class="group">
          <header>
            <h2>{group.name}</h2>
            <button class="pencil" aria-label="Rename collection" title="Rename" tabindex={-1}>
              <Icon name="pencil" size={15} />
            </button>
            <span class="spacer"></span>
            <button class="tool small" tabindex={-1}><Icon name="plus" size={14} /> Add channel</button>
            <button class="tool small" tabindex={-1}>View Collection</button>
            <button
              class="chev"
              aria-label="Collapse {group.name}"
              aria-expanded={!collapsedGroups[group.name]}
              onclick={() => (collapsedGroups[group.name] = !collapsedGroups[group.name])}
            >
              <span class:up={collapsedGroups[group.name]}>
                <Icon name="chevron-down" size={16} />
              </span>
            </button>
          </header>

          {#if !collapsedGroups[group.name]}
            {#if app.collView === 'grid'}
              <div class="ch-grid">
                {#each group.channels as channel (channel.slug)}
                  {@render channelCard(channel)}
                {/each}
              </div>
            {:else}
              <div class="ch-list">
                {#each group.channels as channel (channel.slug)}
                  {@render channelCard(channel)}
                {/each}
              </div>
            {/if}
          {/if}
        </section>
      {/each}
    {/if}
  {/if}
</div>

{#snippet listRow(video: Video)}
  <div class="list-row">
    <div class="lthumbwrap">
      <button class="lthumb" aria-label="Open channel {getChannel(video.channel)?.name}" onclick={() => app.openChannel(video.channel)}>
        <img src={video.thumb} alt={video.title} loading="lazy" onerror={onImgError} />
      </button>
    </div>
    <div class="lmeta">
      <h4>{video.title}</h4>
      <div class="lwho">
        {getChannel(video.channel)?.name ?? video.channel}
        {#if getChannel(video.channel)?.verified}<Icon name="check-circle" size={11} />{/if}
      </div>
      <div class="lstats">{formatCount(video.views)} views · {video.age}</div>
    </div>
  </div>
{/snippet}

{#snippet channelCard(channel: Channel)}
  <div class="ch-card" class:row={app.collView === 'list'}>
    <Avatar src={channel.avatar} name={channel.name} size={56} />
    <div class="ch-meta">
      <span class="ch-name" title={channel.name}>
        {channel.name}
        {#if channel.verified}<Icon name="check-circle" size={11} />{/if}
      </span>
      <span class="ch-subs">{formatCount(channel.subs)} subscribers</span>
      <button
        class="sub-pill"
        class:off={!app.isSubscribed(channel.slug)}
        onclick={() => app.toggleSubscribed(channel.slug)}
        aria-pressed={app.isSubscribed(channel.slug)}
      >
        {#if app.isSubscribed(channel.slug)}
          <Icon name="bell" size={14} /> Subscribed
        {:else}
          Subscribe
        {/if}
      </button>
    </div>
  </div>
{/snippet}

<script lang="ts" module>
  // shared image-fallback helper for the list rows (assets may not be on disk yet)
  const onImgError = (e: Event): void => {
    (e.currentTarget as HTMLElement).style.display = 'none';
  };
</script>

<style>
  .subs-page {
    display: grid;
    gap: var(--yt-space-5);
  }

  .tabs {
    display: flex;
    gap: var(--yt-space-6);
    border-bottom: 1px solid var(--yt-border);
    margin-bottom: -21px;
  }
  .tab {
    padding: 4px 2px 10px;
    color: var(--yt-text-soft);
    font-size: var(--yt-fs-lg);
    font-weight: var(--yt-weight-semibold);
    border-bottom: 2px solid transparent;
  }
  .tab.active {
    color: var(--yt-text);
    border-color: var(--yt-accent);
  }
  .count {
    margin-left: 4px;
    color: var(--yt-text-dim);
    font-size: 11px;
    font-weight: var(--yt-weight-medium);
    vertical-align: super;
  }

  .toolbar {
    display: flex;
    align-items: center;
    gap: var(--yt-space-2);
    height: 48px;
  }
  .spacer {
    flex: 1;
  }
  .tool {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 36px;
    padding: 0 var(--yt-space-4);
    border-radius: var(--yt-radius-pill);
    background: var(--yt-elevated);
    color: var(--yt-text);
    font-size: var(--yt-fs-sm);
    font-weight: var(--yt-weight-medium);
    white-space: nowrap;
  }
  .tool:hover {
    background: var(--yt-hover);
  }
  .tool .val {
    font-weight: var(--yt-weight-semibold);
  }
  .tool.small {
    height: 32px;
    padding-block: 0;
  }

  .segments {
    display: flex;
    gap: 2px;
    padding: 3px;
    border-radius: var(--yt-radius-pill);
    background: var(--yt-surface);
  }
  .seg {
    height: 30px;
    padding: 0 var(--yt-space-4);
    border-radius: var(--yt-radius-pill);
    background: none;
    color: var(--yt-text-soft);
    font-size: var(--yt-fs-sm);
    font-weight: var(--yt-weight-medium);
  }
  .seg.active {
    background: var(--yt-chip-active-bg);
    color: var(--yt-chip-active-fg);
    font-weight: var(--yt-weight-semibold);
  }

  .icon-toggle {
    display: flex;
    gap: 2px;
    padding: 3px;
    border-radius: var(--yt-radius-pill);
    background: var(--yt-surface);
  }
  .it {
    display: grid;
    place-items: center;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: none;
    color: var(--yt-text-soft);
  }
  .it.active {
    background: var(--yt-chip-active-bg);
    color: var(--yt-chip-active-fg);
  }

  .search-pill {
    display: flex;
    align-items: center;
    gap: var(--yt-space-2);
    width: 220px;
    height: 36px;
    padding-inline: var(--yt-space-4);
    border: 1px solid var(--yt-border);
    border-radius: var(--yt-radius-pill);
    background: var(--yt-search);
    color: var(--yt-text-dim);
  }
  .search-pill input {
    width: 100%;
    border: none;
    background: none;
    outline: none;
    color: var(--yt-text);
    font: inherit;
    font-size: var(--yt-fs-sm);
  }
  .search-pill input::placeholder {
    color: var(--yt-text-dim);
  }

  /* ------- timeline ------- */
  .timeline {
    position: relative;
    padding-left: 32px;
    display: grid;
    gap: var(--yt-space-6);
  }
  .timeline::before {
    content: '';
    position: absolute;
    left: 5px;
    top: 8px;
    bottom: 8px;
    width: 2px;
    border-radius: 1px;
    background: #383838;
  }
  .day-head {
    position: relative;
    display: flex;
    align-items: center;
    gap: var(--yt-space-2);
    margin: 0 0 var(--yt-space-4);
    font-size: var(--yt-fs-md);
    font-weight: var(--yt-weight-semibold);
    color: var(--yt-text);
  }
  .dot {
    position: absolute;
    left: -27px;
    width: 6px;
    height: 6px;
    border-radius: var(--yt-radius-pill);
    background: var(--yt-accent);
  }
  .cards {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: var(--yt-space-4);
    align-items: start;
  }

  /* ------- list view ------- */
  .list-view {
    gap: var(--yt-space-5);
  }
  .rows {
    display: grid;
    gap: var(--yt-space-3);
  }
  .list-row {
    display: grid;
    grid-template-columns: 168px 1fr;
    gap: var(--yt-space-4);
    padding: var(--yt-space-3);
    border-radius: var(--yt-radius-lg);
    background: var(--yt-card);
  }
  .lthumb {
    display: block;
    width: 168px;
    aspect-ratio: 16 / 9;
    border-radius: var(--yt-radius-sm);
    background: var(--yt-raised);
    overflow: hidden;
    padding: 0;
  }
  .lthumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .lmeta {
    min-width: 0;
    align-self: center;
  }
  .lmeta h4 {
    margin: 0;
    font-size: var(--yt-fs-md);
    font-weight: var(--yt-weight-semibold);
    color: var(--yt-text);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .lwho {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-top: 4px;
    color: var(--yt-text-soft);
    font-size: var(--yt-fs-xs);
  }
  .lstats {
    margin-top: 2px;
    color: var(--yt-text-soft);
    font-size: var(--yt-fs-xs);
  }

  .shorts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
    gap: var(--yt-space-4);
    align-items: start;
  }

  /* ------- collections ------- */
  .group {
    display: grid;
    gap: var(--yt-space-4);
  }
  .group header {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .group h2 {
    margin: 0;
    font-size: var(--yt-fs-xl);
    font-weight: var(--yt-weight-bold);
  }
  .pencil {
    color: var(--yt-text-soft);
  }
  .pencil:hover {
    color: var(--yt-text);
  }
  .chev {
    display: grid;
    place-items: center;
    width: 32px;
    height: 32px;
    border-radius: var(--yt-radius-pill);
    background: none;
    color: var(--yt-text-soft);
  }
  .chev:hover {
    background: var(--yt-elevated);
  }
  .chev .up {
    display: grid;
    transform: rotate(180deg);
  }

  .ch-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: var(--yt-space-5) var(--yt-space-4);
  }
  .ch-card {
    display: grid;
    justify-items: center;
    text-align: center;
    gap: 2px;
    width: 100%;
  }
  .ch-card.row {
    grid-template-columns: 56px 1fr;
    justify-items: start;
    text-align: left;
    align-items: center;
    background: var(--yt-card);
    border-radius: var(--yt-radius-lg);
    padding: var(--yt-space-3);
  }
  .ch-name {
    margin-top: 6px;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--yt-text);
    font-size: var(--yt-fs-md);
    font-weight: var(--yt-weight-semibold);
  }
  .ch-subs {
    color: var(--yt-text-soft);
    font-size: var(--yt-fs-xs);
  }
  .sub-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-top: 8px;
    height: 30px;
    padding: 0 var(--yt-space-4);
    border-radius: var(--yt-radius-pill);
    background: var(--yt-elevated);
    color: var(--yt-text);
    font-size: var(--yt-fs-xs);
    font-weight: var(--yt-weight-semibold);
  }
  .sub-pill:hover {
    background: var(--yt-hover);
  }
  .sub-pill.off {
    background: transparent;
    border: 1px solid var(--yt-hover);
  }
  .sub-pill.off:hover {
    background: var(--yt-card);
  }

  .empty {
    padding: 64px 0;
    display: grid;
    justify-items: center;
    gap: var(--yt-space-4);
    color: var(--yt-text-soft);
    font-size: var(--yt-fs-md);
  }
  .reset {
    padding: 8px var(--yt-space-5);
    border-radius: var(--yt-radius-pill);
    background: var(--yt-elevated);
    color: var(--yt-text);
    font-weight: var(--yt-weight-semibold);
  }
  .reset:hover {
    background: var(--yt-hover);
  }
</style>
