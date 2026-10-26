<script lang="ts">
  /*
    Collections — per Collections.png mockup:
    - Hero cards for each collection (gradient covers, video count, channel count)
    - "Plays In" rows (already from getCollectionVideos)
  */
  import Avatar from '../components/Avatar.svelte';
  import Icon from '../components/Icon.svelte';
  import VideoCard from '../components/VideoCard.svelte';
  import { COLLECTIONS, COLLECTION_GROUPS, getChannel, getCollectionVideos, formatCount, type Channel } from '../data/catalog';

  const groupChannels = $derived.by(() =>
    COLLECTION_GROUPS.map((g) => ({
      name: g.name,
      channels: g.channels.map(getChannel).filter((c): c is Channel => !!c),
    }))
  );
</script>

<div class="collections-page">
  {#each COLLECTIONS as collection}
    <section class="collection">
      <header class="hero">
        <div class="cover" style="background: var(--yt-collection-{collection.toLowerCase().replace(/[^a-z]/g, '')})"></div>
        <div class="hero-body">
          <h1>{collection}</h1>
          <p class="meta">
            {getCollectionVideos(collection).length} videos · {COLLECTION_GROUPS.find(g => g.name === collection)?.channels.length ?? 0} channels
          </p>
        </div>
      </header>

      <div class="row">
        {#each getCollectionVideos(collection) as video (video.slug)}
          <VideoCard {video} />
        {:else}
          <p class="empty">Nothing here yet</p>
        {/each}
      </div>
    </section>
  {/each}

  <!-- "Plays In" rows per collection group -->
  {#each groupChannels as group}
    <section class="plays-in">
      <h2>{group.name}</h2>
      <div class="cards">
        {#each group.channels as channel}
          <div class="card">
            <Avatar src={channel.avatar} name={channel.name} size={56} />
            <span class="name">{channel.name}{#if channel.verified} <Icon name="check-circle" size={12} />{/if}</span>
            <span class="subs">{formatCount(channel.subs)} subscribers</span>
          </div>
        {/each}
      </div>
    </section>
  {/each}
</div>

<style>
  .collections-page {
    display: grid;
    gap: var(--yt-space-10);
  }

  .collection {
    display: grid;
    gap: var(--yt-space-5);
  }

  .hero {
    position: relative;
    aspect-ratio: 16 / 9;
    border-radius: var(--yt-radius-xl);
    overflow: hidden;
  }

  .cover {
    inset: 0;
    position: absolute;
    background-size: cover;
    background-position: center;
    filter: brightness(0.6);
  }

  .hero-body {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: var(--yt-space-6);
    color: #fff;
  }

  .hero h1 {
    margin: 0;
    font-size: var(--yt-fs-4xl);
    font-weight: var(--yt-weight-black);
    line-height: var(--yt-line-tight);
  }

  .meta {
    margin-top: var(--yt-space-1);
    color: rgba(255, 255, 255, 0.8);
    font-size: var(--yt-fs-md);
  }

  .row {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: var(--yt-space-5);
  }

  .empty {
    grid-column: 1 / -1;
    color: var(--yt-text-dim);
    font-size: var(--yt-fs-md);
    padding: var(--yt-space-8);
  }

  /* Plays In rows */
  .plays-in {
    margin-top: var(--yt-space-4);
  }

  .plays-in h2 {
    margin: 0 0 var(--yt-space-4);
    font-size: var(--yt-fs-xl);
    font-weight: var(--yt-weight-black);
  }

  .plays-in .cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: var(--yt-space-5) var(--yt-space-4);
  }

  .plays-in .card {
    display: grid;
    justify-items: center;
    text-align: center;
    gap: var(--yt-space-1);
  }

  .plays-in .name {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--yt-text);
    font-size: var(--yt-fs-sm);
    font-weight: var(--yt-weight-semibold);
  }

  .plays-in .subs {
    color: var(--yt-text-soft);
    font-size: var(--yt-fs-xs);
  }
</style>