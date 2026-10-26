<script lang="ts">
  /*
    ContextMenu — right-click / ⋮ overflow menu, per "Context Menu*.png" and
    "Video Options*.png". TODO(next step):
      - items with icons from /assets/icons/*.png (white on transparency)
      - submenu ("Save to playlist", quality options per "Quality Options.png")
      - viewport-clamping positioning + outside-click/Escape closing
  */
  interface Props {
    x: number;
    y: number;
    items: string[];
    onPick?: (item: string) => void;
  }

  let { x, y, items, onPick }: Props = $props();
</script>

<menu class="context-menu" style:top="{y}px" style:left="{x}px">
  {#each items as item}
    <li>
      <button class="entry" onclick={() => onPick?.(item)}>{item}</button>
    </li>
  {/each}
</menu>

<style>
  .context-menu {
    position: fixed;
    z-index: var(--yt-z-context);
    min-width: 200px;
    margin: 0;
    padding: var(--yt-space-2);
    list-style: none;
    border: 1px solid var(--yt-border);
    border-radius: var(--yt-radius-md);
    background: var(--yt-elevated);
    box-shadow: var(--yt-shadow-modal);
  }
  .entry {
    display: block;
    width: 100%;
    padding: 10px var(--yt-space-3);
    border-radius: var(--yt-radius-sm);
    background: none;
    color: var(--yt-text);
    text-align: left;
    font-size: var(--yt-fs-md);
  }
  .entry:hover {
    background: var(--yt-card);
  }
</style>
