<script lang="ts">
  /*
    Subscriptions — TODO(next step) per Subs.png / Subs type.png:
      - subscribed-channel avatar strip (from CHANNELS) with active ring
      - "New videos" grouping by day + per-row watch progress
  */
  import VideoCard from '../components/VideoCard.svelte';
  import { CHANNELS, getChannelVideos } from '../data/catalog';

  const channels = CHANNELS.filter((c) => c.slug !== 'juxtoppassed').slice(0, 10);
  const videos = getChannelVideos('juxtoppassed');
</script>

<div class="subs">
  <h1>Subscriptions</h1>
  <div class="channels">
    {#each channels as channel (channel.slug)}
      <button class="channel" title={channel.name}>
        <span class="avatar" class:verified={channel.verified}></span>
        <span class="name">{channel.name}</span>
      </button>
    {/each}
  </div>
  <section class="grid">
    {#each videos as video (video.slug)}
      <VideoCard {video} />
    {/each}
  </section>
</div>

<style>
  .subs h1 {
    margin: 0 0 var(--yt-space-5);
    font-size: var(--yt-fs-3xl);
    font-weight: var(--yt-weight-black);
  }
  .channels {
    display: flex;
    gap: var(--yt-space-4);
    overflow-x: auto;
    scrollbar-width: none;
    margin-bottom: var(--yt-space-6);
  }
  .channels::-webkit-scrollbar {
    display: none;
  }
  .channel {
    display: grid;
    gap: var(--yt-space-1);
    justify-items: center;
    background: none;
    width: 80px;
  }
  .avatar {
    width: 56px;
    height: 56px;
    border-radius: var(--yt-radius-pill);
    background: var(--yt-elevated);
    border: 2px solid var(--yt-border-strong);
  }
  .avatar.verified {
    border-color: var(--yt-accent);
  }
  .name {
    font-size: var(--yt-fs-xs);
    color: var(--yt-text-soft);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: var(--yt-space-6);
  }
</style>
