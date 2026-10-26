<script lang="ts">
  /*
    NotifsPanel — dropdown under the TopBar bell, per Notifs.png.
    TODO(next step):
      - notification rows (channel avatar + "uploaded <title>" + age)
      - unread dot + "mark all read", per-row seen state
      - list from a notifications mock module (not added yet)
  */
  import { app } from '../stores';
  import { CHANNELS, VIDEOS } from '../data/catalog';

  // placeholder rows so the scaffold has something legible to style from
  const preview = VIDEOS.slice(0, 3).map((video) => ({
    video,
    channel: CHANNELS.find((c) => c.slug === video.channel)!,
  }));
</script>

<aside class="notifs-panel" aria-label="Notifications">
  <header class="panel-head">
    <h2>Notifications</h2>
    <button class="close" aria-label="Close notifications" onclick={() => (app.notifsOpen = false)}>
      ✕
    </button>
  </header>
  <ul class="rows">
    {#each preview as entry}
      <li class="row">
        <span class="avatar"></span>
        <div class="lines">
          <p class="text">{entry.channel.name} uploaded: <strong>{entry.video.title}</strong></p>
          <span class="age">{entry.video.age}</span>
        </div>
      </li>
    {:else}
      <li class="empty">No notifications</li>
    {/each}
  </ul>
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
    padding: 0 var(--yt-space-4) var(--yt-space-4);
    display: grid;
    gap: var(--yt-space-4);
  }
  .row {
    display: flex;
    gap: var(--yt-space-3);
    align-items: flex-start;
  }
  .avatar {
    width: 36px;
    height: 36px;
    flex: 0 0 auto;
    border-radius: var(--yt-radius-pill);
    background: var(--yt-elevated);
  }
  .text {
    margin: 0;
    font-size: var(--yt-fs-md);
    line-height: var(--yt-line-snug);
  }
  .text strong {
    font-weight: var(--yt-weight-bold);
  }
  .age {
    font-size: var(--yt-fs-xs);
    color: var(--yt-text-dim);
  }
  .empty {
    color: var(--yt-text-dim);
  }
</style>
