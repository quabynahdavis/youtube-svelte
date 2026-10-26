<script lang="ts">
  /*
    Avatar — circular channel/user image with letter fallback.

    Until the asset agent lands /assets/avatars/*.png, a failed load
    renders the first letter of `name`, so nothing looks broken.
    `ring` draws a page-colored ring (channel-page avatar overlap).
  */
  interface Props {
    src?: string;
    name?: string;
    size?: number;
    ring?: boolean;
    initial?: string;
  }

  let { src, name = '', size = 36, ring = false, initial }: Props = $props();

  let imgOk = $state(true);
  const letter = $derived((initial ?? name).trim().charAt(0).toUpperCase() || '?');

  $effect(() => {
    // reset the fallback whenever the source changes (searchVoid safety)
    void src;
    imgOk = true;
  });
</script>

<span
  class="avatar"
  class:ring
  style:width="{size}px"
  style:height="{size}px"
  style:font-size="{Math.round(size * 0.42)}px"
  title={name || undefined}
>
  {#if imgOk && src}
    <img src={src} alt={name || 'avatar'} loading="lazy" onerror={() => (imgOk = false)} />
  {:else}
    <span class="letter" aria-hidden="true">{letter}</span>
  {/if}
</span>

<style>
  .avatar {
    flex: none;
    display: grid;
    place-items: center;
    overflow: hidden;
    border-radius: var(--yt-radius-pill);
    background: var(--yt-elevated);
  }
  .avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .letter {
    color: var(--yt-text-soft);
    font-weight: var(--yt-weight-bold);
  }
  .ring {
    box-shadow: 0 0 0 4px var(--yt-page);
  }
</style>
