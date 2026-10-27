<script lang="ts">
  /*
    ChannelPage — per Channel.png mockup:
    - banner <img src={channel.banner}> from /assets/banners/*.png
    - tabs (Home / Videos / Shorts / Live / Posts) with active underline
    - subscribe button + bell, verified tick via inline SVG
    - Home tab: "In Case You Missed" shelf + community post + Popular videos grid
    - Shorts tab: shorts grid
    - Other tabs: placeholder for now
    Reads slug from route params via svelte-routing.
  */
  import Avatar from '../components/Avatar.svelte';
  import Icon from '../components/Icon.svelte';
  import VideoCard from '../components/VideoCard.svelte';
  import ShortsCard from '../components/ShortsCard.svelte';
  import { app, type ChannelTab } from '../stores';
  import { getChannel, getChannelVideos, formatCount, type Video } from '../data/catalog';

  interface Props {
    params: { slug?: string };
  }

  let { params }: Props = $props();

  const slug = $derived(params.slug ?? 'juxtoppassed');
  const channel = $derived(getChannel(slug) ?? getChannel('juxtoppassed')!);
  const videos = $derived(getChannelVideos(slug));
  const shorts = $derived(videos.filter((v) => v.type === 'short'));

  $effect(() => {
    // sync store when params change (for sidebar active state, etc.)
    if (channel) app.activeChannel = channel;
  });

  const CHANNEL_TABS: Array<{ id: ChannelTab; label: string }> = [
    { id: 'home', label: 'Home' },
    { id: 'videos', label: 'Videos' },
    { id: 'shorts', label: 'Shorts' },
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

  {#snippet renderPage()}
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
            onclick={() => (app.channelTab = tab.id)}
          >
            {tab.label}
          </button>
        {/each}
      </nav>

      <main class="content">
        {#if app.channelTab === 'home'}
          <section class="section">
            <header class="section-head">
              <h2>In Case You Missed</h2>
              <div class="scroll-controls">
                <button class="sctrl" aria-label="Scroll left" onclick={() => shelfScroller?.scrollBy({ left: -464, behavior: 'smooth' })}><Icon name="chevron-left" size={18} /></button>
                <button class="sctrl" aria-label="Scroll right" onclick={scrollShelf}><Icon name="chevron-right" size={18} /></button>
              </div>
            </header>
            <div class="shelf" bind:this={shelfScroller}>
              {#each shelf as video (video.slug)}
                <VideoCard {video} />
              {/each}
            </div>
          </section>

          <section class="section community">
            <div class="post">
              <Avatar src={channel.avatar} name={channel.name} size={40} />
              <div class="post-body">
                <h3>{channel.name} posted</h3>
                <p>Just uploaded a new video about CSS container queries! Check it out and let me know what you think.</p>
                <div class="post-meta">
                  <span>2 days ago</span>
                  <button class="tool" onclick={() => app.shareOpen = true}><Icon name="share" size={16} /> Share</button>
                </div>
              </div>
            </div>
          </section>

          <section class="section">
            <header class="section-head">
              <h2>Popular videos</h2>
            </header>
            <div class="grid">
              {#each videos.slice(0, 8) as video (video.slug)}
                <VideoCard {video} />
              {/each}
            </div>
          </section>
        {:else if app.channelTab === 'shorts'}
          <section class="shorts-section">
            <div class="shorts-grid">
              {#each shorts as video (video.slug)}
                <ShortsCard {video} />
              {/each}
            </div>
          </section>
        {:else}
          <div class="placeholder">Coming soon — {app.channelTab} tab</div>
        {/if}
      </main>
    </div>
  {/snippet}

  {@render renderPage()}

<style>
  .channel-page {
    display: grid;
    gap: var(--yt-space-6);
  }
  .banner-wrap {
    position: relative;
    height: 180px;
    overflow: hidden;
    border-radius: 0 0 var(--yt-radius-xl) var(--yt-radius-xl);
  }
  .banner {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .banner-fallback {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  }
  .identity {
    display: flex;
    align-items: flex-end;
    gap: var(--yt-space-5);
    padding: var(--yt-space-6) var(--yt-space-6) 0;
    margin-bottom: var(--yt-space-2);
  }
  .who {
    flex: 1;
    min-width: 0;
  }
  h1 {
    margin: 0;
    font-size: var(--yt-fs-3xl);
    font-weight: var(--yt-weight-black);
    display: flex;
    align-items: center;
    gap: var(--yt-space-2);
  }
  .check {
    color: var(--yt-accent);
    flex-shrink: 0;
  }
  .stats {
    margin: var(--yt-space-1) 0;
    color: var(--yt-text-soft);
    font-size: var(--yt-fs-sm);
  }
  .blurb {
    margin: var(--yt-space-1) 0 0;
    color: var(--yt-text-dim);
    font-size: var(--yt-fs-sm);
    max-width: 600px;
  }
  .more { color: var(--yt-text-soft); }
  .actions {
    display: flex;
    align-items: center;
    gap: var(--yt-space-3);
  }
  .bell-btn {
    width: 44px;
    height: 44px;
    border-radius: var(--yt-radius-pill);
    background: var(--yt-elevated);
    display: grid;
    place-items: center;
    color: var(--yt-text);
  }
  .bell-btn:hover { background: var(--yt-hover); }
  .subscribe {
    display: inline-flex;
    align-items: center;
    gap: var(--yt-space-2);
    height: 44px;
    padding: 0 var(--yt-space-6);
    border-radius: var(--yt-radius-pill);
    background: var(--yt-accent);
    color: var(--yt-on-accent);
    font-weight: var(--yt-weight-bold);
    font-size: var(--yt-fs-md);
  }
  .subscribe:hover { background: var(--yt-accent-bright); }
  .subscribe:focus-visible { outline: 2px solid var(--yt-accent); outline-offset: 2px; }

  .tabs {
    display: flex;
    gap: var(--yt-space-6);
    border-bottom: 1px solid var(--yt-border);
    margin: 0 var(--yt-space-6);
    padding-bottom: 2px;
    overflow-x: auto;
    scrollbar-width: none;
  }
  .tabs::-webkit-scrollbar { display: none; }
  .tab {
    flex-shrink: 0;
    padding: 10px 0;
    color: var(--yt-text-soft);
    font-size: var(--yt-fs-md);
    font-weight: var(--yt-weight-semibold);
    border-bottom: 2px solid transparent;
    background: none;
  }
  .tab:hover { color: var(--yt-text); }
  .tab.active {
    color: var(--yt-text);
    border-color: var(--yt-accent);
  }

  .content {
    padding: 0 var(--yt-space-6) var(--yt-space-10);
  }
  .section { margin-bottom: var(--yt-space-8); }
  .section-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--yt-space-4);
  }
  .section-head h2 { margin: 0; font-size: var(--yt-fs-xl); font-weight: var(--yt-weight-bold); }
  .scroll-controls { display: flex; gap: var(--yt-space-1); }
  .sctrl {
    width: 36px;
    height: 36px;
    border-radius: var(--yt-radius-pill);
    background: var(--yt-elevated);
    display: grid;
    place-items: center;
    color: var(--yt-text);
  }
  .sctrl:hover { background: var(--yt-hover); }
  .shelf {
    display: flex;
    gap: var(--yt-space-4);
    overflow-x: auto;
    scrollbar-width: none;
    padding-bottom: var(--yt-space-2);
  }
  .shelf::-webkit-scrollbar { display: none; }

  .community {
    background: var(--yt-card);
    border-radius: var(--yt-radius-xl);
    padding: var(--yt-space-4);
    margin: 0 calc(-1 * var(--yt-space-6)) var(--yt-space-8);
    padding-inline: var(--yt-space-6);
  }
  .post { display: flex; gap: var(--yt-space-3); }
  .post-body { flex: 1; min-width: 0; }
  .post-body h3 { margin: 0 0 4px; font-size: var(--yt-fs-md); font-weight: var(--yt-weight-semibold); }
  .post-body p { margin: 0 0 8px; color: var(--yt-text-soft); font-size: var(--yt-fs-sm); line-height: var(--yt-line-relaxed); }
  .post-meta { display: flex; align-items: center; gap: var(--yt-space-4); font-size: var(--yt-fs-xs); color: var(--yt-text-dim); }
  .tool {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    border-radius: var(--yt-radius-pill);
    background: var(--yt-elevated);
    color: var(--yt-text);
    font-size: var(--yt-fs-xs);
    font-weight: var(--yt-weight-medium);
  }
  .tool:hover { background: var(--yt-hover); }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: var(--yt-space-5) var(--yt-space-4);
  }

  .shorts-section {
    margin: 0 calc(-1 * var(--yt-space-6));
    padding-inline: var(--yt-space-6);
  }
  .shorts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
    gap: var(--yt-space-4);
  }

  .placeholder {
    padding: 80px 0;
    display: grid;
    place-items: center;
    color: var(--yt-text-soft);
    font-size: var(--yt-fs-lg);
  }
</style>