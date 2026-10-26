<script lang="ts">
  /*
    Shorts — chips (Shorts.png variant) + 2-col+ shorts grid; the two cat
    shorts repeat alternately across 10 slots for mock density. Filtering:
    chip ∩ tags, live search, exclusions (title/channel — the literal
    "Shorts" excluded entry is ignored here or the tab would always be
    empty), hidden items.
  */
  import ChipRow from '../components/ChipRow.svelte';
  import ShortsCard from '../components/ShortsCard.svelte';
  import { app } from '../stores';
  import {
    SHORTS_CHIPS,
    VIDEOS,
    getChannel,
    isExcludedBy,
    matchesChip,
    spreadVideos,
  } from '../data/catalog';

  const getChannelName = (slug: string): string =>
    getChannel(slug)?.name.toLowerCase() ?? '';

  const filtered = $derived.by(() => {
    let pool = VIDEOS.filter((v) => v.type === 'short');

    if (app.shortsChip !== 'All') pool = pool.filter((v) => matchesChip(v, app.shortsChip));

    const query = app.searchQuery.trim().toLowerCase();
    if (query) {
      pool = pool.filter((v) => {
        const channelName = getChannelName(v.channel);
        return v.title.toLowerCase().includes(query) || channelName.includes(query);
      });
    }

    pool = pool.filter((v) => !isExcludedBy(v, app.personalize.excluded));
    pool = pool.filter((v) => !app.hidden.includes(v.slug) && !app.hiddenChannels.includes(v.channel));

    return pool;
  });

  const grid = $derived(spreadVideos(filtered, 10));
</script>

<div class="shorts-page">
  <ChipRow chips={SHORTS_CHIPS} bind:active={app.shortsChip} />

  {#if grid.length > 0}
    <section class="grid">
      {#each grid as entry (entry.key)}
        <ShortsCard video={entry.video} />
      {/each}
    </section>
  {:else}
    <div class="empty">
      <p>No shorts match your filters</p>
      <button class="reset" onclick={() => (app.shortsChip = 'All')}>Reset filters</button>
    </div>
  {/if}
</div>

<style>
  .shorts-page {
    display: grid;
    gap: var(--yt-space-4);
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
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
