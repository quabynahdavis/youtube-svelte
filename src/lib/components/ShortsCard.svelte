<script lang="ts">
  /*
    ShortsCard — 9:16 short card: thumb, always-visible ⋮ (mock), title
    (max 2 lines), channel, views · age. Menus go through the shared
    ContextMenu portal.
  */
  import Icon from './Icon.svelte';
  import { app } from '../stores';
  import { formatCount, getChannel, type Video } from '../data/catalog';

  interface Props {
    video: Video;
  }

  let { video }: Props = $props();

  const channel = $derived(getChannel(video.channel));
  let thumbError = $state(false);

  const openMenu = (e: Event): void => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    app.openContextMenu(video, rect.right + 4, rect.bottom + 4);
  };
</script>

<article class="short">
  <div class="thumbwrap">
    <button
      class="thumb"
      class:fallback={thumbError}
      aria-label="Open channel {channel?.name ?? video.channel}"
      onclick={() => app.openChannel(video.channel)}
    >
      {#if !thumbError}
        <img
          src={video.thumb}
          alt={video.title}
          loading="lazy"
          onerror={() => (thumbError = true)}
        />
      {/if}
    </button>
    <button class="kebab" data-context-scope onclick={openMenu} aria-label="Action menu for {video.title}">
      <Icon name="more-vert" size={15} />
    </button>
  </div>

  <h3 class="title">{video.title}</h3>
  <div class="who">{channel?.name ?? video.channel}</div>
  <div class="stats">{formatCount(video.views)} views · {video.age}</div>
</article>

<style>
  .short {
    grid-column: 1;
    cursor: pointer;
  }
  .thumbwrap {
    position: relative;
  }
  .thumb {
    display: block;
    width: 100%;
    aspect-ratio: 9 / 16;
    border-radius: var(--yt-radius-xl);
    background: var(--yt-raised);
    overflow: hidden;
    padding: 0;
  }
  .thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .thumb:hover img {
    filter: brightness(1.05);
  }
  /* Visible placeholder when the thumbnail fails to load */
  .thumb.fallback {
    display: grid;
    place-items: center;
    background: linear-gradient(135deg, var(--yt-elevated), var(--yt-border));
    color: var(--yt-text-dim);
    text-align: center;
  }
  .thumb.fallback::before {
    content: "🖼";
    font-size: 34px;
    line-height: 1;
    display: block;
    margin-bottom: var(--yt-space-1);
  }
  .thumb.fallback::after {
    content: "No thumbnail";
    display: block;
    font-size: var(--yt-fs-xs);
    letter-spacing: 0.04em;
  }
  .kebab {
    position: absolute;
    top: var(--yt-space-2);
    right: var(--yt-space-2);
    display: grid;
    place-items: center;
    width: 28px;
    height: 28px;
    border-radius: var(--yt-radius-pill);
    background: rgba(0, 0, 0, 0.55);
    color: #fff;
  }
  .kebab:hover {
    background: rgba(0, 0, 0, 0.78);
  }

  .title {
    margin: var(--yt-space-2) 0 0;
    font-size: var(--yt-fs-lg);
    font-weight: var(--yt-weight-semibold);
    line-height: var(--yt-line-snug);
    color: var(--yt-text);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .who {
    margin-top: 3px;
    color: var(--yt-text-soft);
    font-size: var(--yt-fs-sm);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .stats {
    margin-top: 1px;
    color: var(--yt-text-soft);
    font-size: var(--yt-fs-sm);
  }
</style>
