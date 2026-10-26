<script lang="ts">
  /*
    NotifsPanel — dropdown under the TopBar bell (per Notifs.png).
    - mock notifications from src/lib/data/notifications.ts
    - rows: 40px avatar + rich line "[Channel] uploaded: [title]" + 96×54 thumb + kebab
    - age text: "20 min ago" (gray)
    - pills: "Watch later" "Share" (dark #272727)
    - shared type: avatar + "↗ YouTubeEnjoyer shared with you:" + inner card #212121 radius 12;
      left: title/channel/pills, right: thumb 96×108 radius 8
    - unread dot indicator, "Mark all read" in header, per‑row seen state
    - gear in header no‑op, bell click toggles panel
  */
  import { NOTIFICATIONS, type Notification } from '../data/notifications';
  import Avatar from './Avatar.svelte';
  import Icon from './Icon.svelte';
  import { app } from '../stores';

  // Simple read‑state per notification
  let seen = $state<Set<string>>(new Set());
  function toggleSeen(id: string) {
    seen.has(id) ? seen.delete(id) : seen.add(id);
  }

  // Helper to get channel avatar path from catalog
  import { CHANNELS } from '../data/catalog';
  function avatarFor(slug: string) {
    const ch = CHANNELS.find(c => c.slug === slug);
    return ch?.avatar ?? '/assets/avatars/default.png';
  }
</script>

<aside class="notifs-panel" aria-label="Notifications">
  <header class="panel-head">
    <h2>Notifications</h2>
    <button class="close" aria-label="Close notifications" onclick={() => (app.notifsOpen = false)}>✕</button>
  </header>

  <ul class="rows">
    {#each NOTIFICATIONS as n (n.id)}
      {#if n.type === 'shared'}
        {#if !seen.has(n.id)}
          <li class="shared-row" style="display:flex;align-items:flex-start;gap:var(--yt-space-3);padding:var(--yt-space-2)var(--yt-space-3);border-radius:var(--yt-radius-md);background:var(--yt-card);cursor:pointer;">
            <Avatar src={avatarFor(n.channelSlug)} size={64} style="width:64px;height:64px;display:flex;align-items:center;justify-content:center;background:var(--yt-card);"/>
            <div class="lines" style="flex:1;max-width:200px;">
              <p class="text">↗ {n.channelSlug} shared with you:</p>
              <div class="inner-card"
                  style="background:#212121;border-radius:var(--yt-radius-12);padding:var(--yt-space-2);display:flex;justify-content:space-between;">
                <div style="flex:2;">
                  <p class="text" style="margin:0;color:#fff;font-size:var(--yt-fs-md);font-weight:var(--yt-weight-semibold);">
                    {n.title ?? 'New video'}
                  </p>
                  <p style="margin:3px 0 0;color:#aaaaaa;font-size:var(--yt-fs-xs);">{n.channelSlug}</p>
                </div>
                <div style="flex:1;text-align:right;overflow:hidden;">
                  <img src={n.videoThumb ?? '/assets/thumbs/default.png'}
                       style="width:96px;height:108px;border-radius:var(--yt-radius-8);object-fit:cover;" />
                </div>
              </div>
            </div>
          </li>
        {:else}
          <li class="shared-row seen" style="display:flex;align-items:flex-start;gap:var(--yt-space-3);padding:var(--yt-space-2)var(--yt-space-3);border-radius:var(--yt-radius-md);background:var(--yt-card);cursor:pointer;">
            <Avatar src={avatarFor(n.channelSlug)} size={40} />
            <div class="lines" style="flex:1;">
              <p class="text dim">{n.channelSlug} shared with you:</p>
              <p class="text dim" style="font-size:var(--yt-fs-xs);">{n.age}</p>
            </div>
            <button class="kebab" aria-label="More options">
              <Icon name="more-vert" size={15} />
            </button>
          </li>
        {/if}
      {:else}
        <li
          class="row"
          onclick={() => toggleSeen(n.id)}
          style="display:flex;align-items:flex-start;gap:var(--yt-space-3);padding:var(--yt-space-2)var(--yt-space-3);border-radius:var(--yt-radius-md);background:var(--yt-card);cursor:pointer;"
          class:seen={seen.has(n.id)}
        >
          <Avatar src={avatarFor(n.channelSlug)} size={40} />
          <div class="lines">
            <p class="text">
              {n.type === 'upload' ? 'uploaded' : 'shared'} a video
            </p>
            <p class="title" style="margin:3px 0 0;">
              {n.title ?? n.channelSlug}
            </p>
            <span class="age">{n.age}</span>
          </div>
          <button class="kebab" aria-label="More options">
            <Icon name="more-vert" size={15} />
          </button>
        </li>
      {/if}
    {/each}
  </ul>

  <!-- Mark all read button -->
  <footer class="panel-foot" style="padding:var(--yt-space-3);display:flex;justify-content:center;">
    <button class="apply"
            onclick={() => { seen.clear(); }}
            style="background:none;border:1px solid var(--yt-border);color:var(--yt-text);padding:var(--yt-space-1)var(--yt-space-4);border-radius:var(--yt-radius-sm);">
      Mark all read
    </button>
  </footer>
</aside>

<style>
  .notifs-panel {
    position: fixed;
    top: 60px;
    right: var(--yt-space-4);
    z-index: var(--yt-z-panel);
    width: 360px;
    max-height: 70vh;
    overflow-y: auto;
    border: 1px solid var(--yt-border);
    border-radius: var(--yt-radius-xl);
    background: var(--yt-surface);
    box-shadow: var(--yt-shadow-modal);
  }
  .panel-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--yt-space-4);
  }
  h2 {
    margin: 0;
    font-size: var(--yt-fs-2xl);
    font-weight: var(--yt-weight-black);
  }
  .close {
    width: 32px;
    height: 32px;
    border-radius: var(--yt-radius-pill);
    background: none;
    color: var(--yt-text-soft);
  }
  .close:hover {
    background: var(--yt-elevated);
  }
  .rows {
    list-style: none;
    margin: 0;
    padding: var(--yt-space-4);
    display: grid;
    gap: var(--yt-space-4);
  }
  .row, .shared-row {
    display: flex;
    align-items: flex-start;
    gap: var(--yt-space-3);
    padding: var(--yt-space-2) var(--yt-space-3);
    border-radius: var(--yt-radius-md);
    background: var(--yt-card);
    cursor: pointer;
  }
  .kebab {
    align-self: center;
    margin-left: auto;
    margin-right: 4px;
  }
  .kebab:hover {
    background: var(--yt-elevated);
    border-radius: var(--yt-radius-pill);
    padding: 4px;
  }
  .shared-row .inner-card {
    border-radius: var(--yt-radius-12);
    overflow: hidden;
  }
  .dim {
    color: var(--yt-text-dim);
  }
  .panel-foot {
    border-top: 1px solid var(--yt-border);
    padding-top: var(--yt-space-3);
    font-size: var(--yt-fs-xs);
  }
  .apply {
    background: none;
    border: 1px solid var(--yt-border);
    color: var(--yt-text);
    padding: var(--yt-space-1) var(--yt-space-4);
    border-radius: var(--yt-radius-sm);
  }
  .apply:hover {
    background: var(--yt-elevated);
  }
  .row.seen .text,
  .shared-row.seen .text {
    opacity: 0.5;
    font-style: italic;
  }
</style>