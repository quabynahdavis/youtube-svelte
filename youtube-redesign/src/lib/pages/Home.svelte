<script lang="ts">
  /*
    Home — TODO(next step) per Home.png:
      - "In Case You Missed" shelf with card row + close button + arrows
      - shorts shelf row (ShortsCard) between the video grid sections
      - grid selection/filter wiring already works via app.activeChip
  */
  import ChipRow from '../components/ChipRow.svelte';
  import VideoCard from '../components/VideoCard.svelte';
  import { app } from '../stores';
  import { getVideosByChip } from '../data/catalog';

  const videos = $derived(getVideosByChip(app.activeChip).slice(0, 8));
  const missed = $derived(videos.slice(0, 4));
</script>

<div class="home">
  <ChipRow />

  <section class="missed">
    <header>
      <h2>In Case You Missed</h2>
      <span class="spacer"></span>
      <button class="close" aria-label="Dismiss shelf">✕</button>
    </header>
    <div class="missed-row">
      {#each missed as video (video.slug)}
        <div class="missed-card"><VideoCard {video} /></div>
      {/each}
    </div>
  </section>

  <section class="grid">
    {#each videos as video (video.slug)}
      <VideoCard {video} />
    {/each}
  </section>
</div>

<style>
  .home {
    display: grid;
    gap: var(--yt-space-6);
  }
  .missed {
    padding: var(--yt-space-5);
    border: 1px solid var(--yt-border);
    border-radius: var(--yt-radius-xl);
    background: var(--yt-surface);
  }
  .missed header {
    display: flex;
    align-items: center;
    gap: var(--yt-space-4);
    margin-bottom: var(--yt-space-4);
  }
  .missed h2 {
    margin: 0;
    font-size: var(--yt-fs-xl);
    font-weight: var(--yt-weight-black);
  }
  .spacer {
    flex: 1;
  }
  .close {
    width: 32px;
    height: 32px;
    border-radius: var(--yt-radius-pill);
    background: none;
    color: var(--yt-text-soft);
  }
  .close:hover {
    background: var(--yt-elevated);
  }
  .missed-row {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: var(--yt-space-5);
  }
  .missed-card {
    min-width: 0;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: var(--yt-space-6);
  }
</style>
