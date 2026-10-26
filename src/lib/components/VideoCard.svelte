<script lang="ts">
  /*
    VideoCard — stub. TODO(next step) per Home.png / Subs.png:
      - avatar <img src={video...avatar}> once /assets/avatars/*.png land
      - context menu trigger (⋮) → ContextMenu per "Video Options.png"
      - verified checkmark should use /assets/icons/verified.png
      - open channel (avatar/name click → app.openChannel(video.channel))
  */
  import type { Video } from '../data/catalog';
  import { getChannel } from '../data/catalog';

  let { video }: { video: Video } = $props();

  const channel = $derived(getChannel(video.channel));
</script>

<article class="video-card">
  <div class="thumb">
    <span class="duration">{video.duration}</span>
  </div>
  <div class="meta">
    <span class="avatar" class:verified={channel?.verified}></span>
    <div class="lines">
      <h3 class="title">{video.title}</h3>
      <div class="channel-row">
        <span class="name">{channel?.name ?? video.channel}</span>
        {#if channel?.verified}<span class="check" aria-label="Verified">✓</span>{/if}
      </div>
      <div class="stats">{video.views} views · {video.age}</div>
    </div>
  </div>
</article>

<style>
  .video-card {
    display: grid;
    gap: var(--yt-space-3);
    cursor: pointer;
  }
  .thumb {
    aspect-ratio: 16/9;
    border-radius: var(--yt-radius-lg);
    background: var(--yt-card);
    position: relative;
  }
  .duration {
    position: absolute;
    right: var(--yt-space-2);
    bottom: var(--yt-space-2);
    padding: 2px 6px;
    border-radius: var(--yt-radius-xs);
    background: rgba(0, 0, 0, 0.8);
    font-size: var(--yt-fs-xs);
    font-weight: var(--yt-weight-semibold);
  }
  .meta {
    display: flex;
    gap: var(--yt-space-3);
    align-items: flex-start;
  }
  .avatar {
    flex: 0 0 auto;
    width: 36px;
    height: 36px;
    border-radius: var(--yt-radius-pill);
    background: var(--yt-elevated);
    border: 2px solid var(--yt-border-strong);
  }
  .avatar.verified {
    border-color: var(--yt-accent);
  }
  .title {
    margin: 0;
    font-size: var(--yt-fs-lg);
    font-weight: var(--yt-weight-bold);
    line-height: var(--yt-line-snug);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .channel-row,
  .stats {
    margin-top: 2px;
    font-size: var(--yt-fs-sm);
    color: var(--yt-text-soft);
  }
  .name {
    font-weight: var(--yt-weight-medium);
  }
  .check {
    margin-left: 4px;
    color: var(--yt-text-dim);
    font-weight: var(--yt-weight-bold);
  }
</style>
