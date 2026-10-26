<script lang="ts">
  /*
    Home — "In Case You Missed" horizontal-shelf (4.5 cards, snap) +
    filter pipeline grid: active chip ∩ tags, live search (title/channel),
    personalize kept-tags ∩ + exclusions (once touched), hidden items.
  */
  import ChipRow from '../components/ChipRow.svelte';
  import Icon from '../components/Icon.svelte';
  import VideoCard from '../components/VideoCard.svelte';
  import { app } from '../stores';
  import {
    CHIPS,
    VIDEOS,
    getChannel,
    isExcludedBy,
    matchesChip,
    spreadVideos,
    type Video,
  } from '../data/catalog';

  const SHELF_SLUGS = [
    'how-websites-learned-to-fit-everywhere',
    'redesigned-discord-ui-cozier',
    'everything-about-color',
    'blurring-things-in-quirky-ways',
  ];

  const shelf = $derived.by((): Video[] => {
    const pool = VIDEOS.filter((v) => SHELF_SLUGS.includes(v.slug));
    return pool
      .filter((v) => !app.hidden.includes(v.slug) && !app.hiddenChannels.includes(v.channel));
  });

  const filtered = $derived.by((): Video[] => {
    let pool = VIDEOS.filter((v) => v.type === 'video');

    if (app.homeChip !== 'All') pool = pool.filter((v) => matchesChip(v, app.homeChip));

    const query = app.searchQuery.trim().toLowerCase();
    if (query) {
      pool = pool.filter((v) => {
        const channelName = getChannel(v.channel)?.name.toLowerCase() ?? '';
        return (
          v.title.toLowerCase().includes(query) ||
          v.channel.toLowerCase().includes(query) ||
          channelName.includes(query)
        );
      });
    }

    const p = app.personalize;
    if (p.touched && p.active.length > 0) {
      pool = pool.filter((v) => v.tags.some((t) => p.active.includes(t)) || p.active.includes(v.channel));
    }
    if (p.excluded.length > 0) {
      pool = pool.filter((v) => !isExcludedBy(v, p.excluded));
    }
    pool = pool.filter((v) => !app.hidden.includes(v.slug) && !app.hiddenChannels.includes(v.channel));

    return pool;
  });

  const grid = $derived(spreadVideos(filtered, 24));

  let scroller = $state<HTMLElement>();
  const scrollShelf = (): void => {
    scroller?.scrollBy({ left: 464, behavior: 'smooth' });
  };

  const resetFilters = (): void => {
    app.homeChip = 'All';
    app.searchQuery = '';
  };
</script>

<div class="home">
  <ChipRow chips={CHIPS} bind:active={app.homeChip} />

  {#if !app.icmyDismissed && shelf.length > 0}
    <section class="shelf-zone" aria-label="In Case You Missed">
      <header>
        <h2>In Case You Missed</h2>
        <span class="spacer"></span>
        <button
          class="close"
          aria-label="Dismiss shelf"
          title="Dismiss"
          onclick={() => (app.icmyDismissed = true)}
        >
          <Icon name="close" size={16} />
        </button>
      </header>
      <div class="shelf">
        <div class="scroller" bind:this={scroller}>
          {#each shelf as video (video.slug)}
            <div class="shelf-card"><VideoCard {video} /></div>
          {/each}
        </div>
        <button class="next" aria-label="Scroll shelf" title="More" onclick={scrollShelf}>
          <Icon name="chevron-right" size={20} />
        </button>
      </div>
    </section>
  {/if}

  {#if grid.length > 0}
    <section class="grid">
      {#each grid as entry (entry.key)}
        <VideoCard video={entry.video} />
      {/each}
    </section>
  {:else}
    <div class="empty">
      <p>Nothing here — try another filter</p>
      <button class="reset" onclick={resetFilters}>Reset filters</button>
    </div>
  {/if}
</div>

<style>
  .home {
    display: grid;
    gap: var(--yt-space-4);
  }

  .shelf-zone header {
    display: flex;
    align-items: center;
    margin-bottom: var(--yt-space-2);
  }
  .shelf-zone h2 {
    font-size: var(--yt-fs-3xl);
    font-weight: var(--yt-weight-extrabold);
    letter-spacing: -0.2px;
  }
  .spacer {
    flex: 1;
  }
  .close {
    display: grid;
    place-items: center;
    width: 32px;
    height: 32px;
    border-radius: var(--yt-radius-pill);
    background: none;
    color: var(--yt-text-soft);
  }
  .close:hover {
    background: var(--yt-elevated);
  }

  .shelf {
    position: relative;
  }
  .scroller {
    display: flex;
    gap: var(--yt-space-4);
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;
    padding-bottom: 4px;
  }
  .scroller::-webkit-scrollbar {
    display: none;
  }
  .shelf-card {
    flex: 0 0 448px;
    scroll-snap-align: start;
    min-width: 0;
  }
  .next {
    position: absolute;
    top: 50%;
    right: var(--yt-space-2);
    transform: translateY(-50%);
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border-radius: var(--yt-radius-pill);
    background: var(--yt-card);
    color: var(--yt-text);
    opacity: 0;
    transition: opacity 0.15s ease;
    box-shadow: var(--yt-shadow-panel);
  }
  .shelf:hover .next,
  .next:focus-visible {
    opacity: 1;
  }
  .next:hover {
    background: var(--yt-elevated);
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: var(--yt-space-4);
    align-items: start;
  }

  .empty {
    padding: 96px 0;
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
