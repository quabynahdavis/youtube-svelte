<script lang="ts">
  /*
    ShortsCard — vertical short for the Shorts shelves, per Shorts.png /
    Shorts-1.png. TODO(next step):
      - 9:16 <img src={video.thumb}> from /assets/shorts/*.png
      - overlay gradient + playback affordances, likes/comments columns
      - share action → app.shareOpen = true
  */
  import type { Video } from '../data/catalog';
  import { getChannel } from '../data/catalog';

  let { video }: { video: Video } = $props();

  const channel = $derived(getChannel(video.channel));
</script>

<article class="shorts-card">
  <div class="thumb"></div>
  <h3 class="title">{video.title}</h3>
  <div class="stats">{channel?.name ?? video.channel} · {video.views} views</div>
</article>

<style>
  .shorts-card {
    width: 200px;
    cursor: pointer;
  }
  .thumb {
    aspect-ratio: 9/16;
    border-radius: var(--yt-radius-lg);
    background: var(--yt-card);
  }
  .title {
    margin: var(--yt-space-2) 0 0;
    font-size: var(--yt-fs-md);
    font-weight: var(--yt-weight-bold);
    line-height: var(--yt-line-snug);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .stats {
    margin-top: 2px;
    font-size: var(--yt-fs-xs);
    color: var(--yt-text-soft);
  }
</style>
