<script lang="ts">
  /*
    Collections — TODO(next step) per Collections.png:
      - collection hero cards with gradient covers + video counts
      - "Plays In" rows already come from getCollectionVideos(...)
  */
  import VideoCard from '../components/VideoCard.svelte';
  import { COLLECTIONS, getCollectionVideos } from '../data/catalog';
</script>

<div class="collections">
  <h1>Collections</h1>
  {#each COLLECTIONS as collection}
    <section class="collection">
      <h2>{collection}</h2>
      <div class="row">
        {#each getCollectionVideos(collection) as video (video.slug)}
          <div class="cell"><VideoCard {video} /></div>
        {:else}
          <p class="empty">Nothing here yet</p>
        {/each}
      </div>
    </section>
  {/each}
</div>

<style>
  .collections h1 {
    margin: 0 0 var(--yt-space-5);
    font-size: var(--yt-fs-3xl);
    font-weight: var(--yt-weight-black);
  }
  .collection {
    margin-bottom: var(--yt-space-8);
  }
  .collection h2 {
    margin: 0 0 var(--yt-space-4);
    font-size: var(--yt-fs-xl);
    font-weight: var(--yt-weight-black);
  }
  .row {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: var(--yt-space-5);
  }
  .cell {
    min-width: 0;
  }
  .empty {
    color: var(--yt-text-dim);
    font-size: var(--yt-fs-md);
  }
</style>
