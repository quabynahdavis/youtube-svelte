<script lang="ts">
  /*
    ChannelPage — per Channel.png mockup:
    - banner <img src={channel.banner}> from /assets/banners/*.png
    - tabs (Home / Videos / Shorts / Live / Posts) with active underline
    - subscribe button + bell, verified tick via inline SVG
    - Home tab: "In Case You Missed" shelf + community post + Popular videos grid
    - Shorts tab: shorts grid
    - Other tabs: placeholder for now
  */
  import Avatar from '../components/Avatar.svelte';
  import Icon from '../components/Icon.svelte';
  import VideoCard from '../components/VideoCard.svelte';
  import ShortsCard from '../components/ShortsCard.svelte';
  import { app } from '../stores';
  import { getChannel, getChannelVideos, formatCount, type Video } from '../data/catalog';

  const channel = $derived(app.activeChannel ?? getChannel('juxtoppassed')!);
  const videos = $derived(getChannelVideos(channel.slug).filter((v) => v.type === 'video'));
  const shorts = $derived(getChannelVideos(channel.slug).filter((v) => v.type === 'short'));

  const CHANNEL_TABS: Array<{ id: string; label: string }> = [
    { id: 'home', label: 'Home' },
    { id: 'videos', label: 'Videos' },
    { id: 'shorts', label: 'Shorts' },
    { id: 'live', label: 'Live' },
    { id: 'posts', label: 'Posts' },
    { id: 'playlists', label: 'Playlists' },
    { id: 'channels', label: 'Channels' },
    { id: 'about', label: 'About' },
  ];

  // ICMY shelf for channel page (uses same slugs as Home)
  const SHELF_SLUGS = [
    'how-websites-learned-to-fit-everywhere',
    'redesigned-discord-ui-cozier',
    'everything-about-color',
    'blurring-things-in-quirky-ways',
  ];

  const shelf = $derived.by((): Video[] => {
    const pool = videos.filter((v) => SHELF_SLUGS.includes(v.slug));
    return pool.filter((v) => !app.hidden.includes(v.slug) && !app.hiddenChannels.includes(v.channel));
  });

  let shelfScroller = $state<HTMLElement>();
  const scrollShelf = (): void => {
    shelfScroller?.scrollBy({ left: 464, behavior: 'smooth' });
  };

  function onBannerError(): void {
    // no-op; fallback shown via {#if}
  }
</script>

<div class="channel-page">
  <div class="banner-wrap">
    {#if channel.banner}
      <img class="banner" src={channel.banner} alt="" loading="eager" onerror={onBannerError} />
    {:else}
      <div class="banner-fallback"></div>
    {/if}
  </div>

  <header class="identity">
    <Avatar src={channel.avatar} name={channel.name} size={120} ring />
    <div class="who">
      <h1>
        {channel.name}
        {#if channel.verified}
          <span class="check" aria-label="Verified"><Icon name="check-circle" size={22} /></span>
        {/if}
      </h1>
      <p class="stats">{formatCount(channel.subs)} subscribers · {videos.length} videos</p>
      <p class="blurb">Design & UI/UX experiments. Subscribe for more cats (and design content, of course). <span class="more">...more</span></p>
    </div>
    <div class="actions">
      <button class="bell-btn" aria-label="Notifications" title="All notifications">
        <Icon name="bell" size={20} />
      </button>
      <button class="subscribe" aria-pressed={app.isSubscribed(channel.slug)} onclick={() => app.toggleSubscribed(channel.slug)}>
        {#if app.isSubscribed(channel.slug)}
          <Icon name="bell" size={16} /> Subscribed
        {:else}
          Subscribe
        {/if}
      </button>
    </div>
  </header>

  <nav class="tabs" aria-label="Channel sections">
    {#each CHANNEL_TABS as tab}
      <button
        class="tab"
        class:active={app.channelTab === tab.id}
        onclick={() => (app.channelTab = tab.id as any)}
      >
        {tab.label}
      </button>
    {/each}
  </nav>

  {#if app.channelTab === 'home'}
    <section class="home-content">
      <!-- ICMY shelf -->
      {#if !app.icmyDismissed && shelf.length > 0}
        <section class="shelf-zone" aria-label="In Case You Missed">
          <header>
            <h2>In Case You Missed</h2>
            <span class="spacer"></span>
            <button class="close" aria-label="Dismiss shelf" onclick={() => (app.icmyDismissed = true)}>
              <Icon name="close" size={16} />
            </button>
          </header>
          <div class="shelf">
            <div class="scroller" bind:this={shelfScroller}>
              {#each shelf as video (video.slug)}
                <div class="shelf-card"><VideoCard {video} /></div>
              {/each}
            </div>
            <button class="next" aria-label="Scroll shelf" onclick={scrollShelf}>
              <Icon name="chevron-right" size={20} />
            </button>
          </div>
        </section>
      {/if}

      <!-- Community post (mock first slot) -->
      <article class="community-post">
        <div class="post-header">
          <Avatar src={channel.avatar} name={channel.name} size={40} />
          <div>
            <span class="post-author">{channel.name}</span>
            <span class="post-age">1 day ago</span>
          </div>
          <button class="kebab" aria-label="Post actions"><Icon name="more-vert" size={15} /></button>
        </div>
        <p class="post-text">It's finally time for youtube. what are your biggest issues with it?</p>
        <div class="post-actions">
          <button class="action"><Icon name="thumb-up" size={17} /> 2.9K</button>
          <button class="action"><Icon name="thumb-down" size={17} /> 1.2K</button>
          <button class="action"><Icon name="comment" size={17} /> 1.1K</button>
          <button class="action"><Icon name="share" size={17} /> Share</button>
        </div>
      </article>

      <!-- Popular videos -->
      <header class="section-head">
        <h2>Popular videos</h2>
      </header>
      <div class="grid">
        {#each videos as video (video.slug)}
          <VideoCard {video} />
        {:else}
          <p class="empty">This channel has no videos yet</p>
        {/each}
      </div>
    </section>
  {:else if app.channelTab === 'shorts'}
    <div class="shorts-grid">
      {#each shorts as short (short.slug)}
        <ShortsCard video={short} />
      {:else}
        <p class="empty">No shorts yet</p>
      {/each}
    </div>
  {:else}
    <div class="placeholder">
      <p>{CHANNEL_TABS.find(t => t.id === app.channelTab)?.label} coming soon</p>
    </div>
  {/if}
</div>

<style>
  .channel-page {
    display: grid;
    gap: var(--yt-space-5);
  }

  .banner-wrap {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
    border-radius: var(--yt-radius-xl);
    overflow: hidden;
    margin-bottom: var(--yt-space-5);
  }

  .banner {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .banner-fallback {
    inset: 0;
    position: absolute;
    background: linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%);
  }

  .identity {
    display: flex;
    align-items: flex-end;
    gap: var(--yt-space-5);
    margin-bottom: var(--yt-space-5);
    padding-inline: var(--yt-space-1);
  }

  .who {
    flex: 1;
    min-width: 0;
  }

  h1 {
    margin: 0;
    font-size: var(--yt-fs-4xl);
    font-weight: var(--yt-weight-black);
    line-height: var(--yt-line-tight);
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .check {
    color: var(--yt-accent);
    flex: 0 0 auto;
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
    max-width: 60ch;
  }

  .actions {
    display: flex;
    align-items: center;
    gap: var(--yt-space-3);
    flex: 0 0 auto;
  }

  .bell-btn {
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border-radius: var(--yt-radius-pill);
    background: none;
    color: var(--yt-text);
  }

  .bell-btn:hover {
    background: var(--yt-elevated);
  }

  .subscribe {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    height: 40px;
    padding-inline: var(--yt-space-6);
    border-radius: var(--yt-radius-pill);
    background: var(--yt-accent);
    color: var(--yt-on-accent);
    font-weight: var(--yt-weight-bold);
    font-size: var(--yt-fs-sm);
  }

  .subscribe:hover {
    background: #ff1a44;
  }

  .tabs {
    display: flex;
    gap: var(--yt-space-6);
    border-bottom: 1px solid var(--yt-border);
    margin-bottom: var(--yt-space-6);
    overflow-x: auto;
    scrollbar-width: none;
  }

  .tabs::-webkit-scrollbar {
    display: none;
  }

  .tab {
    flex: 0 0 auto;
    padding: 4px 2px var(--yt-space-3);
    color: var(--yt-text-soft);
    font-weight: var(--yt-weight-semibold);
    font-size: var(--yt-fs-md);
    border-bottom: 2px solid transparent;
    white-space: nowrap;
  }

  .tab:hover {
    color: var(--yt-text);
  }

  .tab.active {
    color: var(--yt-text);
    border-color: var(--yt-accent);
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: var(--yt-space-6);
  }

  .empty {
    grid-column: 1 / -1;
    color: var(--yt-text-dim);
    padding: var(--yt-space-8);
  }

  .placeholder {
    padding: var(--yt-space-16) 0;
    text-align: center;
    color: var(--yt-text-soft);
    font-size: var(--yt-fs-lg);
  }

  /* Home content */
  .home-content {
    display: grid;
    gap: var(--yt-space-6);
  }

  .shelf-zone header {
    display: flex;
    align-items: center;
    margin-bottom: var(--yt-space-2);
  }

  .shelf-zone h2 {
    font-size: var(--yt-fs-3xl);
    font-weight: var(--yt-weight-extrabold);
    letter-spacing: -0.2px;
  }

  .spacer {
    flex: 1;
  }

  .close {
    display: grid;
    place-items: center;
    width: 32px;
    height: 32px;
    border-radius: var(--yt-radius-pill);
    background: none;
    color: var(--yt-text-soft);
  }

  .close:hover {
    background: var(--yt-elevated);
  }

  .shelf {
    position: relative;
  }

  .scroller {
    display: flex;
    gap: var(--yt-space-4);
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;
    padding-bottom: 4px;
  }

  .scroller::-webkit-scrollbar {
    display: none;
  }

  .shelf-card {
    flex: 0 0 448px;
    scroll-snap-align: start;
    min-width: 0;
  }

  .next {
    position: absolute;
    top: 50%;
    right: var(--yt-space-2);
    transform: translateY(-50%);
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border-radius: var(--yt-radius-pill);
    background: var(--yt-card);
    color: var(--yt-text);
    opacity: 0;
    transition: opacity 0.15s ease;
    box-shadow: var(--yt-shadow-panel);
  }

  .shelf:hover .next,
  .next:focus-visible {
    opacity: 1;
  }

  .next:hover {
    background: var(--yt-elevated);
  }

  /* Community post */
  .community-post {
    background: var(--yt-card);
    border-radius: var(--yt-radius-xl);
    padding: var(--yt-space-4) var(--yt-space-5);
    margin-bottom: var(--yt-space-4);
  }

  .post-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--yt-space-3);
  }

  .post-author {
    font-weight: var(--yt-weight-bold);
  }

  .post-age {
    margin-left: 8px;
    color: var(--yt-text-soft);
    font-size: var(--yt-fs-sm);
  }

  .kebab {
    display: grid;
    place-items: center;
    width: 32px;
    height: 32px;
    border-radius: var(--yt-radius-pill);
    color: var(--yt-text-soft);
  }

  .kebab:hover {
    background: var(--yt-elevated);
    color: var(--yt-text);
  }

  .post-text {
    margin: 0 0 var(--yt-space-4);
    font-size: var(--yt-fs-lg);
    line-height: var(--yt-line-snug);
    color: var(--yt-text);
  }

  .post-actions {
    display: flex;
    gap: var(--yt-space-6);
  }

  .action {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--yt-text-soft);
    font-size: var(--yt-fs-sm);
    font-weight: var(--yt-weight-medium);
  }

  .action:hover {
    color: var(--yt-text);
  }

  /* Shorts grid */
  .shorts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
    gap: var(--yt-space-4);
  }

  /* Section head */
  .section-head {
    margin: var(--yt-space-4) 0 var(--yt-space-2);
  }

  .section-head h2 {
    margin: 0;
    font-size: var(--yt-fs-3xl);
    font-weight: var(--yt-weight-extrabold);
    letter-spacing: -0.2px;
  }
</style>