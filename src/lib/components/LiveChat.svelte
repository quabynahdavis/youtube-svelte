<script lang="ts">
  /*
    LiveChat — chat panel overlay per Chat.png / Chat-1.png (820x1866).
    Mounted by App when app.chatOpen is true; closed via onClose, the ✕
    button, the scrim, or Esc.

    Props:
      open    — mirrored mount flag (parent gates mounting via {#if})
      onClose — close callback invoked by the consumer
  */
  import { CHAT_MESSAGES } from '../data/chat';
  import { type ChatMessage } from '../data/chat';
  import Avatar from './Avatar.svelte';
  import Icon from './Icon.svelte';
  import { tick } from 'svelte';

  interface Props {
    open?: boolean;
    onClose: () => void;
  }

  let { open = true, onClose }: Props = $props();

  // live message stack (mock data seeded, send appends a "you" message)
  const messages = $state<ChatMessage[]>([...CHAT_MESSAGES]);
  let draft = $state('');
  let sendDisabled = $derived(draft.trim().length === 0);
  let listEl = $state<HTMLDivElement | undefined>(undefined);

  function scrollToBottom(): void {
    void tick().then(() => {
      if (listEl) listEl.scrollTop = listEl.scrollHeight;
    });
  }

  function send(): void {
    const value = draft.trim();
    if (!value) return;
    messages.push({
      id: `c-${Date.now()}`,
      type: 'chat',
      user: 'you',
      text: value,
      ts: 'now',
    });
    draft = '';
    scrollToBottom();
  }

  function onKeyDown(e: KeyboardEvent): void {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
    if (e.key === 'Escape') onClose();
  }

  // split message text into plain / @mention segments for accented mentions
  function mentionParts(text: string): Array<{ t: 'mention' | 'text'; v: string }> {
    const parts: Array<{ t: 'mention' | 'text'; v: string }> = [];
    const re = /@([A-Za-z0-9_]+)/g;
    let last = 0;
    let match: RegExpExecArray | null;
    while ((match = re.exec(text))) {
      if (match.index > last) parts.push({ t: 'text', v: text.slice(last, match.index) });
      parts.push({ t: 'mention', v: match[0] });
      last = match.index + match[0].length;
    }
    if (last < text.length) parts.push({ t: 'text', v: text.slice(last) });
    return parts;
  }

  $effect(() => {
    scrollToBottom();
    return () => {
      // no-op teardown
    };
  });
</script>

{#if open}
  <div
    class="chat-wrap"
    role="dialog"
    aria-modal="true"
    aria-label="Live Chat"
    tabindex="-1"
    onkeydown={(e) => e.key === 'Escape' && onClose()}
  >
    <div class="scrim" role="presentation" onclick={onClose} onkeydown={(e) => e.key === 'Escape' && onClose()}></div>
    <aside class="chat-panel">
      <header class="chat-head">
        <h2>Live Chat</h2>
        <button class="close" aria-label="Close live chat" onclick={onClose}>✕</button>
      </header>

      <div class="messages" bind:this={listEl}>
        {#each messages as m (m.id)}
          {#if m.type === 'system'}
            <div class="sys-msg">{m.text}</div>
          {:else}
            <div class="msg">
              <Avatar src={undefined} name={m.user ?? ''} size={28} />
              <div class="bubble">
                <div class="msg-head">
                  <span class="user" class:verified={m.verified}>{m.user}</span>
                  {#if m.member && m.badge}
                    <span class="badge" class:paid={m.badge.paid}>{m.badge.label}</span>
                  {/if}
                  {#if m.ts}<span class="ts">{m.ts}</span>{/if}
                </div>
                <div class="body">
                  {#each mentionParts(m.text) as part}
                    {#if part.t === 'mention'}
                      <span class="mention">{part.v}</span>
                    {:else}
                      {part.v}
                    {/if}
                  {/each}
                </div>
              </div>
            </div>
          {/if}
        {/each}
      </div>

      <footer class="chat-foot">
        <input
          class="input"
          placeholder="Type to chat..."
          bind:value={draft}
          disabled={sendDisabled}
          onkeydown={onKeyDown}
        />
        <button class="send" disabled={sendDisabled} onclick={send}>
          <Icon name="send" size={18} />
        </button>
      </footer>
    </aside>
  </div>
{/if}

<style>
  .chat-wrap {
    position: fixed;
    inset: 0;
    z-index: var(--yt-z-panel);
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
  }
  .scrim {
    position: absolute;
    inset: 0;
    background: var(--yt-overlay);
  }
  .chat-panel {
    position: relative;
    z-index: 1;
    width: min(440px, 100vw);
    height: 100dvh;
    max-height: 100dvh;
    background: var(--yt-surface);
    border-left: 1px solid var(--yt-border);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    outline: none;
  }
  .chat-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--yt-space-4) var(--yt-space-6);
    border-bottom: 1px solid var(--yt-border);
    flex: none;
  }
  .chat-head h2 {
    margin: 0;
    font-size: var(--yt-fs-xl);
    font-weight: var(--yt-weight-semibold);
    color: var(--yt-text);
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
  .close {
    width: 32px;
    height: 32px;
    border-radius: var(--yt-radius-pill);
    background: none;
    color: var(--yt-text-soft);
    font-size: 18px;
    line-height: 1;
  }
  .close:hover {
    background: var(--yt-elevated);
    color: var(--yt-text);
  }
  .messages {
    flex: 1;
    overflow-y: auto;
    padding: var(--yt-space-4) var(--yt-space-6);
    display: flex;
    flex-direction: column;
    gap: var(--yt-space-3);
  }
  .msg {
    display: flex;
    gap: var(--yt-space-3);
    align-items: flex-start;
  }
  .bubble {
    flex: 1;
    min-width: 0;
  }
  .msg-head {
    display: flex;
    align-items: baseline;
    gap: var(--yt-space-2);
    margin-bottom: 2px;
    flex-wrap: wrap;
  }
  .user {
    font-size: var(--yt-fs-sm);
    font-weight: var(--yt-weight-medium);
    color: var(--yt-text);
  }
  .user.verified {
    color: var(--yt-accent);
  }
  .badge {
    font-size: 10px;
    font-weight: var(--yt-weight-bold);
    padding: 1px 7px;
    border-radius: var(--yt-radius-pill);
    background: var(--yt-elevated);
    color: var(--yt-text-soft);
    white-space: nowrap;
  }
  .badge.paid {
    background: var(--yt-accent-soft);
    color: var(--yt-accent);
  }
  .ts {
    font-size: var(--yt-fs-xs);
    color: var(--yt-text-dim);
    margin-left: auto;
    white-space: nowrap;
  }
  .body {
    font-size: var(--yt-fs-sm);
    color: var(--yt-text);
    line-height: var(--yt-line-normal);
  }
  .mention {
    color: var(--yt-accent);
    font-weight: var(--yt-weight-semibold);
  }
  .sys-msg {
    font-size: var(--yt-fs-xs);
    color: var(--yt-text-dim);
    font-style: italic;
    padding: var(--yt-space-1) var(--yt-space-3);
    border-radius: var(--yt-radius-md);
    background: var(--yt-card);
    text-align: center;
    max-width: -moz-fit-content;
    max-width: fit-content;
    margin-inline: auto;
  }
  .chat-foot {
    border-top: 1px solid var(--yt-border);
    padding: var(--yt-space-3) var(--yt-space-6);
    background: var(--yt-surface);
    flex: none;
    display: flex;
    gap: var(--yt-space-2);
    align-items: center;
  }
  .input {
    flex: 1;
    height: 40px;
    padding-inline: var(--yt-space-4);
    border-radius: var(--yt-radius-pill);
    border: 1px solid var(--yt-border);
    background: var(--yt-card);
    color: var(--yt-text);
    font: inherit;
    font-size: var(--yt-fs-sm);
  }
  .input::placeholder {
    color: var(--yt-text-dim);
  }
  .input:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  .send {
    width: 40px;
    height: 40px;
    border-radius: var(--yt-radius-pill);
    border: none;
    background: var(--yt-accent);
    color: var(--yt-on-accent);
    cursor: pointer;
    display: grid;
    place-items: center;
    flex: none;
  }
  .send:hover:not(:disabled) {
    background: #ff1a44;
  }
  .send:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
