<script lang="ts">
  /*
    Shorts — TODO(next step) per Shorts.png / Shorts-1.png:
      - full-bleed vertical player rail with navigation dots/keys
      - per-short action column (likes, comments, share → ShareModal)
  */
  import ShortsCard from '../components/ShortsCard.svelte';
  import { getShorts } from '../data/catalog';

  const shorts = $derived(getShorts());
</script>

<div class="shorts">
  <h1>Shorts</h1>
  <div class="rail">
    {#each shorts as video (video.slug)}
      <ShortsCard {video} />
    {/each}
  </div>
</div>

<style>
  .shorts h1 {
    margin: 0 0 var(--yt-space-5);
    font-size: var(--yt-fs-3xl);
    font-weight: var(--yt-weight-black);
  }
  .rail {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    justify-items: center;
    gap: var(--yt-space-6);
  }
</style>
