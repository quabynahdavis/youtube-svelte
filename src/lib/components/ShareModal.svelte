<script lang="ts">
  /*
    ShareModal — dialog per Share.png.
    - platform row: 7 brand circles (WhatsApp, Facebook, X, Email, Reddit, Pinterest, Bluesky)
    - copy link pill with URL + "Copy Link" button; on copy shows "Copied ✓" briefly
    - "Send to mutual subscribers" section: 4 fake enjoyer accounts as 64px avatar circles + 2-line centered names;
      clicking one shows transient "✓ Sent" (1.5 s)
    - "Add a comment…" input with BRAND_LOGO left; disabled until user types (optional)
    - scrim/backdrop close, ✕ close, Esc close
  */
  import { CHANNELS, BRAND_LOGO } from '../data/catalog';
  import { app } from '../stores';
  import Icon from './Icon.svelte';

  // ---------- platform row ----------
  const brandColors = [
    { key: 'whatsapp', color: '#25D366' },
    { key: 'facebook', color: '#1877F2' },
    { key: 'x', color: '#000000' },
    { key: 'email', color: '#8A8A8A' },
    { key: 'reddit', color: '#FF4500' },
    { key: 'pinterest', color: '#E60023' },
    { key: 'bluesky', color: '#00A0DF' }
  ];

  let copyState = $state('');
  let logoError = $state(false);
  const SHARE_URL = 'https://youtu.be/dQw4w9WgXcQ';

  const enjoyers = CHANNELS.filter(c => c.slug.endsWith('enjoyer'));
  let sentId = $state<string | null>(null);

  // timeout ids so transient copy/sent states can be cleared on destroy
  let copyTimer: ReturnType<typeof setTimeout> | null = null;
  let sentTimer: ReturnType<typeof setTimeout> | null = null;

  $effect(() => {
    return () => {
      if (copyTimer) clearTimeout(copyTimer);
      if (sentTimer) clearTimeout(sentTimer);
    };
  });

  let comment = $state('');
  let commentInputDisabled = $derived(comment.trim().length === 0);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(SHARE_URL);
      copyState = 'copied';
      if (copyTimer) clearTimeout(copyTimer);
      copyTimer = setTimeout(() => {
        copyState = '';
        copyTimer = null;
      }, 1500);
    } catch (e) {
      console.error(e);
    }
  }

  function sendTo(enjoyerId: string) {
    sentId = enjoyerId;
    if (sentTimer) clearTimeout(sentTimer);
    sentTimer = setTimeout(() => {
      sentId = null;
      sentTimer = null;
    }, 1500);
  }
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

    <div class="link-row">
      <span class="pill">{SHARE_URL}</span>
      <button class="copy-btn" onclick={copyLink}>
        {#if copyState}
          Copied ✓
        {:else}
          Copy Link
        {/if}
      </button>
    </div>

    <div class="platform-row">
      {#each Object.entries(brandColors) as [key, color]}
        <div class="platform-icon" title={key} aria-label={key} style="background-color: {color};">
          <Icon name={key} size={24} />
        </div>
      {/each}
    </div>

    <div class="section">Send to mutual subscribers</div>
    <ul class="contacts">
      {#each enjoyers as enjoyer}
        <button class="contact" onclick={() => sendTo(enjoyer.slug)}>
          <span class="avatar">
            <span style="font-size:12px;color:var(--yt-text-soft);">{enjoyer.name[0]}</span>
          </span>
          <div class="name-container" style="flex:1;text-align:center;">
            <span class="name">{enjoyer.name}</span>
            <span class="subs">{enjoyer.subs} subs</span>
          </div>
          {#if sentId === enjoyer.slug}
            <span class="sent">✓ Sent</span>
          {/if}
        </button>
      {/each}
    </ul>

    <div class="comment">
      {#if !logoError}
        <img class="logo" src={BRAND_LOGO} alt="YouTube logo" onerror={() => (logoError = true)} />
      {/if}
      <input placeholder="Add a comment…" bind:value={comment} disabled={commentInputDisabled} />
    </div>

    <footer class="modal-foot">
      <button class="apply" onclick={() => (app.shareOpen = false)}>Close</button>
    </footer>
  </div>
</div>

<style>
  .scrim {
    position:fixed;inset:0;z-index:var(--yt-z-modal);display:grid;place-items:center;background:var(--yt-overlay);
  }
  .share-modal {
    width:min(560px,92vw);padding:var(--yt-space-6);border:1px solid var(--yt-border);border-radius:var(--yt-radius-xl);background:var(--yt-surface);box-shadow:var(--yt-shadow-modal);position:relative;
  }
  .modal-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--yt-space-4);}
  h2{margin:0;font-size:var(--yt-fs-2xl);font-weight:var(--yt-weight-black);}
  .close{width:32px;height:32px;border-radius:var(--yt-radius-pill);background:none;color:var(--yt-text-soft);}
  .close:hover{background:var(--yt-elevated);}
  .link-row{display:flex;gap:var(--yt-space-2);align-items:center;margin-bottom:var(--yt-space-4);}
  .pill{flex:1;padding:10px var(--yt-space-4);border-radius:var(--yt-radius-md);background:var(--yt-card);color:var(--yt-text-soft);font-size:var(--yt-fs-sm);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
  .copy-btn{padding:10px var(--yt-space-4);border-radius:var(--yt-radius-pill);background:var(--yt-crimson);color:var(--yt-on-accent);font-weight:var(--yt-weight-bold);}
  .copy-btn:hover{background:#ff1a44;}
  .platform-row{flex-wrap:wrap;gap:var(--yt-space-2);margin:var(--yt-space-4) 0;}
  .platform-icon{width:56px;height:56px;border-radius:var(--yt-radius-pill);display:flex;align-items:center;justify-content:center;color:#fff;}
  .section{margin:var(--yt-space-5)0 var(--yt-space-3);font-size:var(--yt-fs-md);font-weight:var(--yt-weight-bold);color:var(--yt-text-soft);text-transform:uppercase;letter-spacing:0.08em;}
  .contacts{list-style:none;margin:0;padding:0;display:grid;gap:var(--yt-space-2);}
  .contact{display:flex;align-items:center;gap:var(--yt-space-3);padding:var(--yt-space-2)var(--yt-space-3);border-radius:var(--yt-radius-md);background:var(--yt-card);cursor:pointer;}
  .contact:hover{background:var(--yt-elevated);}
  .avatar{width:64px;height:64px;border-radius:var(--yt-radius-pill);background:var(--yt-card);display:flex;align-items:center;justify-content:center;}
  .name-container{flex:1;text-align:center;}
  .name{font-weight:var(--yt-weight-semibold);}
  .subs{font-size:var(--yt-fs-xs);color:var(--yt-text-dim);}
  .sent{align-self:center;color:var(--yt-accent);font-weight:var(--yt-weight-bold);}
  .comment{margin-top:var(--yt-space-5);display:flex;align-items:center;gap:var(--yt-space-3);}
  .logo{width:56px;height:24px;border-radius:var(--yt-radius-sm);background:var(--yt-card);}
  input{flex:1;height:40px;padding-inline:var(--yt-space-4);border-radius:var(--yt-radius-md);border:1px solid var(--yt-border);background:var(--yt-card);color:var(--yt-text);font:inherit;}
  input::placeholder{color:var(--yt-text-dim);}
  input:disabled{opacity:0.6;cursor:not-allowed;}
  .modal-foot{display:flex;justify-content:flex-end;margin-top:var(--yt-space-5);}
  .apply{padding:10px var(--yt-space-6);border-radius:var(--yt-radius-pill);background:var(--yt-accent);color:var(--yt-on-accent);font-weight:var(--yt-weight-bold);}
  .apply:hover{background:var(--yt-accent-bright);}
</style>