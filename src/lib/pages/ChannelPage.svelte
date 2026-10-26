<script lang="ts">
  /*
    ChannelPage — TODO(next step) per Channel.png:
      - banner <img src={channel.banner}> from /assets/banners/*.png
      - tabs (Home / Videos / Shorts / Live / Posts) with active underline
      - subscribe button + bell, verified tick via /assets/icons
  */
  import VideoCard from '../components/VideoCard.svelte';
  import { app } from '../stores';
  import { getChannel, getChannelVideos } from '../data/catalog';

  const channel = $derived(app.activeChannel ?? getChannel('juxtoppassed')!);
  const videos = $derived(getChannelVideos(channel.slug));
</script>

<div class="channel-page">
  <div class="banner"></div>

  <header class="identity">
    <span class="avatar" class:verified={channel.verified}></span>
    <div class="who">
      <h1>
        {channel.name}
        {#if channel.verified}<span class="check" aria-label="Verified">✓</span>{/if}
      </h1>
      <p class="stats">{channel.subs} subscribers · {videos.length} videos</p>
      <p class="blurb">TODO: channel description</p>
    </div>
    <button class="subscribe">Subscribe</button>
  </header>

  <nav class="tabs" aria-label="Channel sections">
    <span class="tab active">Home</span>
    <span class="tab">Videos</span>
    <span class="tab">Shorts</span>
    <span class="tab">Live</span>
    <span class="tab">Posts</span>
  </nav>

  <section class="grid">
    {#each videos as video (video.slug)}
      <VideoCard {video} />
    {:else}
      <p class="empty">This channel has no videos yet</p>
    {/each}
  </section>
</div>

<style>
  .banner {
    height: 180px;
    border-radius: var(--yt-radius-xl);
    background: var(--yt-card);
    margin-bottom: var(--yt-space-5);
  }
  .identity {
    display: flex;
    align-items: center;
    gap: var(--yt-space-5);
    margin-bottom: var(--yt-space-5);
  }
  .avatar {
    width: 120px;
    height: 120px;
    flex: 0 0 auto;
    border-radius: var(--yt-radius-pill);
    background: var(--yt-elevated);
    border: 3px solid var(--yt-border-strong);
  }
  .avatar.verified {
    border-color: var(--yt-accent);
  }
  .who {
    flex: 1;
  }
  h1 {
    margin: 0;
    font-size: var(--yt-fs-4xl);
    font-weight: var(--yt-weight-black);
    line-height: var(--yt-line-tight);
  }
  .check {
    color: var(--yt-accent);
    font-size: var(--yt-fs-2xl);
  }
  .stats {
    margin: var(--yt-space-1) 0 0;
    color: var(--yt-text-soft);
    font-size: var(--yt-fs-md);
  }
  .blurb {
    margin: var(--yt-space-2) 0 0;
    color: var(--yt-text-dim);
    font-size: var(--yt-fs-sm);
  }
  .subscribe {
    height: 40px;
    padding-inline: var(--yt-space-6);
    border-radius: var(--yt-radius-pill);
    background: var(--yt-accent);
    color: var(--yt-on-accent);
    font-weight: var(--yt-weight-bold);
  }
  .subscribe:hover {
    background: var(--yt-accent-bright);
  }
  .tabs {
    display: flex;
    gap: var(--yt-space-6);
    border-bottom: 1px solid var(--yt-border);
    margin-bottom: var(--yt-space-6);
  }
  .tab {
    padding-bottom: var(--yt-space-3);
    color: var(--yt-text-soft);
    font-weight: var(--yt-weight-semibold);
    font-size: var(--yt-fs-md);
  }
  .tab.active {
    color: var(--yt-text);
    border-bottom: 2px solid var(--yt-accent);
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: var(--yt-space-6);
  }
  .empty {
    color: var(--yt-text-dim);
  }
</style>
