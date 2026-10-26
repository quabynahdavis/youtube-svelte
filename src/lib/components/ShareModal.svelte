<script lang="ts">
  /*
    ShareModal — dialog per Share.png. TODO(next step):
      - platform row (Email, WhatsApp, …) with /assets/icons/*.png
      - "Add a comment…" input + copy link with the mockup's URL pill
      - share targets below = the four fake enjoyer accounts (from
        CHANNELS), each a repost target with comment bubbles
  */
  import { CHANNELS, BRAND_LOGO, iconUrl } from '../data/catalog';
  import { app } from '../stores';

  const CONTACTS = CHANNELS.filter((c) => c.slug.endsWith('enjoyer'));
</script>

<div class="scrim" role="presentation" onclick={() => (app.shareOpen = false)}>
  <div
    class="share-modal"
    role="dialog"
    aria-modal="true"
    aria-label="Share"
    tabindex="-1"
    onclick={(e) => e.stopPropagation()}
    onkeydown={(e) => e.key === 'Escape' && (app.shareOpen = false)}
  >
    <header class="modal-head">
      <h2>Share</h2>
      <button class="close" aria-label="Close share" onclick={() => (app.shareOpen = false)}>✕</button>
    </header>

    <!-- TODO: real platform icons + copy-link pill -->
    <div class="link-row">
      <span class="pill">youtube-redesign/watch?v=9bZkp7q19f0</span>
      <button class="copy-btn">Copy</button>
    </div>

    <h3 class="section">Repost to</h3>
    <ul class="contacts">
      {#each CONTACTS as contact}
        <li class="contact">
          <span class="avatar"></span>
          <span class="name">{contact.name}</span>
          <span class="subs">{contact.subs} subs</span>
        </li>
      {/each}
    </ul>

    <div class="comment">
      <img class="logo" src={BRAND_LOGO} alt="" />
      <input placeholder="Add a comment…" disabled />
    </div>
  </div>
</div>

<style>
  .scrim {
    position: fixed;
    inset: 0;
    z-index: var(--yt-z-modal);
    display: grid;
    place-items: center;
    background: var(--yt-overlay);
  }
  .share-modal {
    width: min(560px, 92vw);
    padding: var(--yt-space-6);
    border: 1px solid var(--yt-border);
    border-radius: var(--yt-radius-xl);
    background: var(--yt-surface);
    box-shadow: var(--yt-shadow-modal);
  }
  .modal-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--yt-space-4);
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
  .link-row {
    display: flex;
    gap: var(--yt-space-2);
    align-items: center;
  }
  .pill {
    flex: 1;
    padding: 10px var(--yt-space-4);
    border-radius: var(--yt-radius-md);
    background: var(--yt-card);
    color: var(--yt-text-soft);
    font-size: var(--yt-fs-sm);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .copy-btn {
    padding: 10px var(--yt-space-4);
    border-radius: var(--yt-radius-pill);
    background: var(--yt-accent);
    color: var(--yt-on-accent);
    font-weight: var(--yt-weight-bold);
    /* TODO: hover uses iconUrl('copy') */
  }
  .copy-btn:hover {
    background: var(--yt-accent-bright);
  }
  .section {
    margin: var(--yt-space-5) 0 var(--yt-space-3);
    font-size: var(--yt-fs-md);
    font-weight: var(--yt-weight-bold);
    color: var(--yt-text-soft);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
  .contacts {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: var(--yt-space-2);
  }
  .contact {
    display: flex;
    align-items: center;
    gap: var(--yt-space-3);
    padding: var(--yt-space-2) var(--yt-space-3);
    border-radius: var(--yt-radius-md);
  }
  .contact:hover {
    background: var(--yt-card);
  }
  .avatar {
    width: 32px;
    height: 32px;
    border-radius: var(--yt-radius-pill);
    background: var(--yt-elevated);
  }
  .name {
    font-weight: var(--yt-weight-semibold);
  }
  .subs {
    margin-left: auto;
    color: var(--yt-text-dim);
    font-size: var(--yt-fs-xs);
  }
  .comment {
    display: flex;
    gap: var(--yt-space-3);
    align-items: center;
    margin-top: var(--yt-space-5);
  }
  .logo {
    width: 56px;
    height: 24px;
    border-radius: var(--yt-radius-sm);
    background: var(--yt-card);
  }
  input {
    flex: 1;
    height: 40px;
    padding-inline: var(--yt-space-4);
    border-radius: var(--yt-radius-md);
    border: 1px solid var(--yt-border);
    background: var(--yt-card);
    color: var(--yt-text);
    font: inherit;
  }
  input::placeholder {
    color: var(--yt-text-dim);
  }
</style>
