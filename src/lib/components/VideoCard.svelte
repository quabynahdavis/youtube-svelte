<script lang="ts">
  /*
    VideoCard — 16:9 thumbnail card, mock-flush on the page bg:
    timestamp badge (12:07), hover ⋮ → shared ContextMenu portal;
    avatar + 2-line title + channel (✓) + "150K views · 4 months ago".
    Thumb/assignment images fade to --yt-raised until assets land.
  */
  import Avatar from './Avatar.svelte';
  import Icon from './Icon.svelte';
  import { app } from '../stores';
  import { formatCount, getChannel, type Video } from '../data/catalog';

  interface Props {
    video: Video;
    /** unique key when pages repeat the pool (spread videos) */
    repeatIndex?: number;
  }

  let { video, repeatIndex = 0 }: Props = $props();

  const channel = $derived(getChannel(video.channel));
  let thumbError = $state(false);

  const openMenu = (e: Event): void => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    app.openContextMenu(video, rect.right + 4, rect.bottom + 4);
  };
</script>

<article class="card">
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
      <span class="badge">{video.duration}</span>
    </button>
    <button
      class="kebab"
      data-context-scope
      onclick={openMenu}
      aria-label="Action menu for {video.title}"
    >
      <Icon name="more-vert" size={15} />
    </button>
  </div>

  <div class="meta">
    <Avatar src={channel?.avatar} name={channel?.name} size={36} />
    <div class="lines">
      <h3 class="title"><button
          class="title-btn"
          onclick={() => app.openChannel(video.channel)}>{video.title}</button></h3>
      <div class="who">
        <span>{channel?.name ?? video.channel}</span>
        {#if channel?.verified}<Icon name="check-circle" size={12} />{/if}
      </div>
      <div class="stats">{formatCount(video.views)} views · {video.age}</div>
    </div>
  </div>
</article>

<style>
  .card {
    cursor: pointer;
  }
  .thumbwrap {
    position: relative;
  }
  .thumb {
    display: block;
    width: 100%;
    aspect-ratio: 16 / 9;
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
    opacity: 0;
    transition: opacity 0.12s ease;
  }
  .thumbwrap:hover .kebab,
  .kebab:focus-visible {
    opacity: 1;
  }
  .kebab:hover {
    background: rgba(0, 0, 0, 0.78);
  }

  .meta {
    display: flex;
    gap: var(--yt-space-3);
    align-items: flex-start;
    padding: var(--yt-space-3) var(--yt-space-1) 0;
  }
  .lines {
    min-width: 0;
    flex: 1;
  }
  .title {
    margin: 0;
  }
  .title-btn {
    max-width: 100%;
    padding: 0;
    background: none;
    border: none;
    text-align: left;
    color: var(--yt-text);
    font-size: var(--yt-fs-lg);
    font-weight: var(--yt-weight-semibold);
    line-height: var(--yt-line-snug);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .who {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-top: 3px;
    color: var(--yt-text-soft);
    font-size: var(--yt-fs-sm);
  }
  .stats {
    margin-top: 1px;
    color: var(--yt-text-soft);
    font-size: var(--yt-fs-sm);
  }
</style>
