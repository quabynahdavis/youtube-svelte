<script lang="ts">
  import { NOTIFICATIONS } from '../data/notifications';
  import Avatar from './Avatar.svelte';
  import Icon from './Icon.svelte';
  import { app } from '../stores';
  import { CHANNELS } from '../data/catalog';

  let seen = $state<Set<string>>(new Set());
  function toggleSeen(id: string) {
    seen.has(id) ? seen.delete(id) : seen.add(id);
  }
  function avatarFor(slug: string) {
    const ch = CHANNELS.find(c => c.slug === slug);
    return ch?.avatar ?? '/assets/avatars/default.png';
  }
  function markAllRead() {
    NOTIFICATIONS.forEach(n => seen.add(n.id));
  }
</script>

<aside class="notifs-panel" aria-label="Notifications">
  <header class="panel-head">
    <h2>Notifications</h2>
    <div class="head-actions">
      <button class="mark-read" onclick={markAllRead}>Mark all read</button>
      <button class="close" aria-label="Close notifications" onclick={() => (app.notifsOpen = false)}>✕</button>
    </div>
  </header>

  <ul class="rows">
    {#each NOTIFICATIONS as n (n.id)}
      {#if n.type === 'shared'}
        {#if !seen.has(n.id)}
          <button type="button" class="shared-row" onclick={() => toggleSeen(n.id)}>
            <Avatar src={avatarFor(n.channelSlug)} size={64} />
            <div class="lines">
              <p class="text">↗ {n.channelSlug} shared with you:</p>
              <div class="inner-card">
                <div class="inner-left">
                  <p class="title">{n.title ?? 'New video'}</p>
                  <p class="channel">{n.channelSlug}</p>
                  <div class="pills">
                    <span class="pill">Watch later</span>
                    <span class="pill">Share</span>
                  </div>
                </div>
                <div class="inner-right">
                  <img src={n.videoThumb ?? '/assets/thumbs/default.png'} alt="" class="thumb" />
                </div>
              </div>
            </div>
            <span class="kebab" role="button" tabindex="0" aria-label="More options" onclick={(e) => e.stopPropagation()} onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && e.stopPropagation()}><Icon name="more-vert" size={15} /></span>
          </button>
        {:else}
          <button type="button" class="shared-row seen" onclick={() => toggleSeen(n.id)}>
            <Avatar src={avatarFor(n.channelSlug)} size={40} />
            <div class="lines">
              <p class="text dim">{n.channelSlug} shared with you:</p>
              <p class="text dim age">{n.age}</p>
            </div>
            <span class="kebab" role="button" tabindex="0" aria-label="More options" onclick={(e) => e.stopPropagation()} onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && e.stopPropagation()}><Icon name="more-vert" size={15} /></span>
          </button>
        {/if}
      {:else}
        <button type="button" class="row" onclick={() => toggleSeen(n.id)}>
          <Avatar src={avatarFor(n.channelSlug)} size={40} />
          <div class="lines">
            <p class="text">{n.channelSlug} uploaded: <strong>{n.title ?? n.channelSlug}</strong></p>
            <span class="age">{n.age}</span>
          </div>
          <span class="kebab" role="button" tabindex="0" aria-label="More options" onclick={(e) => e.stopPropagation()} onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && e.stopPropagation()}><Icon name="more-vert" size={15} /></span>
        </button>
      {/if}
    {/each}
  </ul>

  <footer class="panel-foot">
    <button class="apply" onclick={markAllRead}>Mark all read</button>
  </footer>
</aside>

<style>
.notifs-panel { position:fixed; top:60px; right:var(--yt-space-4); z-index:var(--yt-z-panel); width:360px; max-height:70vh; overflow-y:auto; border:1px solid var(--yt-border); border-radius:var(--yt-radius-xl); background:var(--yt-surface); box-shadow:var(--yt-shadow-modal); }
.panel-head { display:flex; align-items:center; justify-content:space-between; padding:var(--yt-space-4); gap:var(--yt-space-2); }
.head-actions { display:flex; align-items:center; gap:var(--yt-space-2); }
.mark-read { font-size:var(--yt-fs-xs); color:var(--yt-text-soft); background:none; padding:var(--yt-space-1) var(--yt-space-2); border-radius:var(--yt-radius-sm); }
.mark-read:hover { color:var(--yt-text); background:var(--yt-elevated); }
h2 { margin:0; font-size:var(--yt-fs-2xl); font-weight:var(--yt-weight-black); }
.close { width:32px; height:32px; border-radius:var(--yt-radius-pill); background:none; color:var(--yt-text-soft); }
.close:hover { background:var(--yt-elevated); }
.rows { list-style:none; margin:0; padding:var(--yt-space-4); display:grid; gap:var(--yt-space-4); }
.row, .shared-row { display:flex; align-items:flex-start; gap:var(--yt-space-3); padding:var(--yt-space-2) var(--yt-space-3); border-radius:var(--yt-radius-md); background:var(--yt-card); cursor:pointer; }
.row:hover, .shared-row:hover { background:var(--yt-elevated); }
.kebab { align-self:center; margin-left:auto; margin-right:4px; padding:4px; }
.kebab:hover { background:var(--yt-elevated); border-radius:var(--yt-radius-pill); }
.inner-card { display:flex; justify-content:space-between; gap:var(--yt-space-3); background: var(--yt-raised); border-radius:var(--yt-radius-lg); padding:var(--yt-space-2); margin-top:var(--yt-space-2); }
.inner-left { flex:2; min-width:0; }
.inner-left .title { margin:0; color: var(--yt-text); font-size:var(--yt-fs-md); font-weight:var(--yt-weight-semibold); line-height:var(--yt-line-snug); }
.inner-left .channel { margin:3px 0 0; color: var(--yt-text-soft); font-size:var(--yt-fs-xs); }
.inner-left .pills { display:flex; gap:var(--yt-space-2); margin-top:var(--yt-space-2); }
.inner-left .pill { background:var(--yt-elevated); color:var(--yt-text); font-size:var(--yt-fs-xs); font-weight:var(--yt-weight-medium); padding:var(--yt-space-1) var(--yt-space-3); border-radius:var(--yt-radius-pill); }
.inner-right { flex:1; text-align:right; overflow:hidden; }
.inner-right .thumb { width:96px; height:108px; border-radius:var(--yt-radius-sm); object-fit:cover; }
.dim { color:var(--yt-text-dim); }
.panel-foot { border-top:1px solid var(--yt-border); padding:var(--yt-space-3) var(--yt-space-4); }
.apply { width:100%; background:none; border:1px solid var(--yt-border); color:var(--yt-text); padding:var(--yt-space-1) var(--yt-space-4); border-radius:var(--yt-radius-sm); font-size:var(--yt-fs-sm); font-weight:var(--yt-weight-medium); }
.apply:hover { background:var(--yt-elevated); }
</style>
