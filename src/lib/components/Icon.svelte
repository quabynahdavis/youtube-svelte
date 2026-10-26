<script lang="ts">
  /*
    Icon — shared inline-SVG glyph set (v1 uses NO png assets).
    Stroke-based line icons, 20px default, stroke 1.8, currentColor;
    a few glyphs are filled (play, sparkle, brand marks).

    TODO(later): swap selected glyphs for /assets/icons/<name>.png
    (white on transparency) once the asset set is mapped.
  */
  interface Props {
    name: string;
    size?: number;
    class?: string;
  }

  let { name, size = 20, class: cls = '' }: Props = $props();
</script>

<svg
  width={size}
  height={size}
  viewBox="0 0 20 20"
  fill="none"
  stroke="currentColor"
  stroke-width="1.8"
  stroke-linecap="round"
  stroke-linejoin="round"
  class={cls}
  aria-hidden="true"
>
  {#if name === 'hamburger'}
    <path d="M3 5.5h14M3 10h14M3 14.5h14" />
  {:else if name === 'search'}
    <circle cx="9" cy="9" r="4.8" />
    <path d="m12.6 12.6 4 4" />
  {:else if name === 'arrow-south'}
    <path d="M10 4.5v10.5M10 15l-3.6-3.6M10 15l3.6-3.6" />
  {:else if name === 'bell'}
    <path d="M10 2.6a4.7 4.7 0 0 0-4.7 4.7v3.2L4 12.8h12l-1.3-2.3V7.3A4.7 4.7 0 0 0 10 2.6Z" />
    <path d="M8.6 15.4a1.5 1.5 0 0 0 2.8 0" />
  {:else if name === 'gear'}
    <circle cx="10" cy="10" r="2.7" />
    <path d="M10 3v1.8M10 15.2V17M17 10h-1.8M4.8 10H3M15 5l-1.3 1.3M6.3 13.7 5 15M5 5l1.3 1.3M13.7 13.7 15 15" />
  {:else if name === 'more-vert'}
    <circle cx="10" cy="4.6" r="1.35" fill="currentColor" stroke="none" />
    <circle cx="10" cy="10" r="1.35" fill="currentColor" stroke="none" />
    <circle cx="10" cy="15.4" r="1.35" fill="currentColor" stroke="none" />
  {:else if name === 'more-horiz'}
    <circle cx="4.6" cy="10" r="1.35" fill="currentColor" stroke="none" />
    <circle cx="10" cy="10" r="1.35" fill="currentColor" stroke="none" />
    <circle cx="15.4" cy="10" r="1.35" fill="currentColor" stroke="none" />
  {:else if name === 'chevron-down'}
    <path d="m5 7.6 5 5 5-5" />
  {:else if name === 'chevron-up'}
    <path d="m5 12.4 5-5 5 5" />
  {:else if name === 'chevron-right'}
    <path d="m7.6 5 5 5-5 5" />
  {:else if name === 'close'}
    <path d="m5 5 10 10M15 5 5 15" />
  {:else if name === 'check'}
    <path d="m4.4 10.4 3.4 3.4 7.6-8" />
  {:else if name === 'check-circle'}
    <circle cx="10" cy="10" r="7.4" />
    <path d="m6.9 10.2 2 2 4.2-4.8" />
  {:else if name === 'play'}
    <path d="M7.4 5.4v9.2l7.6-4.6Z" fill="currentColor" stroke="none" />
  {:else if name === 'play-circle'}
    <circle cx="10" cy="10" r="7.4" />
    <path d="M8.6 7.4v5.2l4.4-2.6Z" fill="currentColor" stroke="none" />
  {:else if name === 'sliders'}
    <path d="M3 6.2h3.6M10.9 6.2H17M3 13.8h7.6M13.9 13.8H17" />
    <circle cx="8.4" cy="6.2" r="1.7" fill="var(--yt-card, #1f1f1f)" />
    <circle cx="12.4" cy="13.8" r="1.7" fill="var(--yt-card, #1f1f1f)" />
  {:else if name === 'sort'}
    <path d="M5.5 4.5v10.7M5.5 15.2 3.2 12.9M5.5 15.2l2.3-2.3M14.5 15.5V4.8M14.5 4.8l-2.3 2.3M14.5 4.8l2.3 2.3" />
  {:else if name === 'calendar'}
    <rect x="3.4" y="4.8" width="13.2" height="11.6" rx="2" />
    <path d="M3.4 8.6h13.2M7 2.9v3.4M13 2.9v3.4" />
  {:else if name === 'grid'}
    <rect x="3.4" y="3.4" width="5.6" height="5.6" rx="1.6" />
    <rect x="11" y="3.4" width="5.6" height="5.6" rx="1.6" />
    <rect x="3.4" y="11" width="5.6" height="5.6" rx="1.6" />
    <rect x="11" y="11" width="5.6" height="5.6" rx="1.6" />
  {:else if name === 'rows'}
    <path d="M3.4 5.6h13.2M3.4 10h13.2M3.4 14.4h13.2" />
  {:else if name === 'list'}
    <rect x="3.2" y="4.4" width="5" height="5" rx="1.4" />
    <path d="M10.6 6.9h6.4M3.2 14.6h13.8M10.6 12.1h6.2" />
  {:else if name === 'plus'}
    <path d="M10 4.4v11.2M4.4 10h11.2" />
  {:else if name === 'plus-circle'}
    <circle cx="10" cy="10" r="7.4" />
    <path d="M10 6.6v6.8M6.6 10h6.8" />
  {:else if name === 'share'}
    <path d="M11.2 5.2 16 9.1l-4.8 3.9v-2.7C7.9 10.4 5.4 12.2 4.2 15c0-5.6 4-7.2 7-7.4V5.2Z" fill="currentColor" stroke="none" />
  {:else if name === 'clock'}
    <circle cx="10" cy="10" r="7.2" />
    <path d="M10 6.4V10l2.6 1.6" />
  {:else if name === 'history'}
    <path d="M10 4a6 6 0 1 1-6 6M10 4V2M10 4l2.4-1.2" transform-origin="10 10" />
    <path d="M3.8 8.6 4 10.6l2-1.6" />
    <path d="M10 7v3.2l2.4 1.4" />
  {:else if name === 'thumb-up'}
    <path d="M6.9 8.7v8H5.3c-.6 0-1-.5-1-1.1V9.8c0-.6.4-1.1 1-1.1h1.6Zm0 0 3-5.4c.4-.8 1.6-.4 1.6.5 0 .3-.9 2.3-.9 3.4.5-.2.7-.3 1-.3h3.1c1 0 1.6.9 1.4 1.8l-1.4 4.9c-.2.7-.8 1.1-1.5 1.1H6.9Z" />
  {:else if name === 'thumb-down'}
    <path d="M13.1 11.3v-8h1.6c.6 0 1 .5 1 1.1v5.8c0 .6-.4 1.1-1 1.1h-1.6Zm0 0-3 5.4c-.4.8-1.6.4-1.6-.5 0-.3.9-2.3.9-3.4-.5.2-.7.3-1 .3H5.3c-1 0-1.6-.9-1.4-1.8l1.4-4.9C5.5 5.7 6.1 5.3 6.8 5.3h6.3Z" />
  {:else if name === 'comment'}
    <path d="M10 4.2c-3.7 0-6.7 2.5-6.7 5.5 0 1.7.9 3.1 2.3 4.1L4.9 17l2.9-1.6c.7.2 1.4.3 2.2.3 3.7 0 6.7-2.5 6.7-5.6S13.7 4.2 10 4.2Z" />
  {:else if name === 'queue'}
    <rect x="3.4" y="4.4" width="13.2" height="9.2" rx="2" />
    <path d="M10 6.8v4.4M7.8 9h4.4M7 16.6c1.9.8 4.1.8 6 0" />
  {:else if name === 'bookmark'}
    <path d="M5.6 3.6h8.8v13l-4.4-3-4.4 3v-13Z" />
  {:else if name === 'ban'}
    <circle cx="10" cy="10" r="7.2" />
    <path d="M5.2 5.2l9.6 9.6" />
  {:else if name === 'minus-circle'}
    <circle cx="10" cy="10" r="7.2" />
    <path d="M6.8 10h6.4" />
  {:else if name === 'flag'}
    <path d="M5.4 17.4V3.6M5.4 4c3.2-1.4 6.6 1.5 9.8.2v6.3c-3.2 1.3-6.6-1.6-9.8-.2" />
  {:else if name === 'home'}
    <path d="M3.8 9.6 10 4.2l6.2 5.4V16c0 .5-.4.9-.9.9h-3.4v-4.4H8.1v4.4H4.7c-.5 0-.9-.4-.9-.9V9.6Z" />
  {:else if name === 'explore'}
    <circle cx="10" cy="10" r="7.2" />
    <path d="m12.8 7.2-2.2 4-4.4 2.4 2.2-4 4.4-2.4Z" />
  {:else if name === 'shorts'}
    <rect x="5.8" y="2.9" width="8.4" height="14.2" rx="4.2" />
    <path d="m8.8 7.3 4 2.7-4 2.7Z" fill="currentColor" stroke="none" />
  {:else if name === 'tv'}
    <rect x="3" y="4.6" width="14" height="10.2" rx="2" />
    <path d="M7 17.4h6M10 15v2.4" />
  {:else if name === 'playlists'}
    <rect x="3.4" y="4" width="6" height="6" rx="1.8" />
    <path d="M12 6h4.6M12 10h4.6M3.4 14.2h13.2M3.4 17h9" />
  {:else if name === 'collections'}
    <rect x="3.2" y="3.2" width="6" height="6" rx="1.8" />
    <rect x="10.8" y="3.2" width="6" height="6" rx="1.8" />
    <rect x="3.2" y="10.8" width="6" height="6" rx="1.8" />
    <rect x="10.8" y="10.8" width="6" height="6" rx="1.8" />
  {:else if name === 'subs'}
    <rect x="3.4" y="5" width="13.2" height="7.4" rx="1.8" />
    <path d="M9 7.2 12.2 8.7 9 10.2Z" fill="currentColor" stroke="none" />
    <path d="M6 15.4h8" />
  {:else if name === 'sparkle'}
    <path d="M10 2.8 11.6 8l5.4 2-5.4 2L10 17.2 8.4 12 3 10l5.4-2L10 2.8Z" fill="currentColor" stroke="none" />
  {:else if name === 'pencil'}
    <path d="m4 16 .3-2.8 8.9-8.9 2.5 2.5-8.9 8.9L4 16ZM13.2 4.3l1.4-1.4c.5-.5 1.2-.5 1.7 0l.8.8c.5.5.5 1.2 0 1.7l-1.4 1.4-2.5-2.5Z" />
  {:else if name === 'bolt'}
    <path d="M11.2 2.8 5.6 11h3.6l-.4 6.2L14.4 9h-3.6l.4-6.2Z" fill="currentColor" stroke="none" />
  {:else if name === 'globe'}
    <circle cx="10" cy="10" r="7.2" />
    <path d="M2.8 10h14.4M10 2.8c3 3.6 3 10.8 0 14.4-3-3.6-3-10.8 0-14.4Z" />
  {:else if name === 'music'}
    <path d="M7.4 15.4V5.2l8.2-1.7v10" />
    <circle cx="5.6" cy="15.6" r="1.9" fill="currentColor" stroke="none" />
    <circle cx="13.8" cy="13.9" r="1.9" fill="currentColor" stroke="none" />
  {:else if name === 'x'}
    <path d="M4.2 4.2 15.8 15.8M15.8 4.2 4.2 15.8" />
  {:else if name === 'whatsapp'}
    <path d="M17.5 4.5c-2.3 0-4.5 1.8-4.5 4 0 1.6 1.1 3 2.7 3.7V17.5l4.3-4.3c1.4-1.6 2.2-3.7 2.2-5.9C20.5 6.3 18.7 4.5 16.5 4.5Z" fill="currentColor" stroke="none" />
  {:else if name === 'facebook'}
    <path d="M17.5 5H5.5C3.7 5 2.5 6.2 2.5 8v9c0 1.8 1.2 3 3 3h7.5v-6h-3V9.5h3V7.5c0-2.5 1.5-4 4-4h3.5v5.5h-2.5c-0.5 0-1 0.2-1 1V12h3l-0.5 4H14.5V20h3c1.8 0 3-1.2 3-3V8C20.5 6.2 19.3 5 17.5 5Z" fill="currentColor" stroke="none" />
  {:else if name === 'email'}
    <path d="M18 5H4c-1.1 0-2 0.9-2 2v7c0 1.1 0.9 2 2 2h14c1.1 0 2-0.9 2-2V7c0-1.1-0.9-2-2-2ZM18 15H4V7.5l7 4.5 7-4.5V15Z" fill="currentColor" stroke="none" />
  {:else if name === 'reddit'}
    <path d="M16.5 12.5c0-1.6-1.3-3-3-3s-3 1.3-3 3c0 0.8 0.5 1.5 1.2 1.8L8 16.5c-0.5 0.8-0.3 1.8 0.4 2.3 0.7 0.5 1.7 0.3 2.2-0.4l1.8-1.8c2.3 1.2 4.8 0.5 5.7-1.6 0.9-2-1.2-3.6-3-3.6Zm-8.5 0c0-1.1 0.9-2 2-2s2 0.9 2 2c0 0.5-0.3 1-0.8 1.2-0.2 0.1-0.5 0.1-0.7 0C10.2 13.6 9 13 9 12.5ZM14.5 5.5c-0.8 0-1.5 0.6-1.6 1.4l-1.5 5.5c-0.1 0.4 0.2 0.8 0.6 0.8h3c0.4 0 0.7-0.4 0.6-0.8l-1.5-5.5C16 6.1 15.3 5.5 14.5 5.5Zm-4 0C9.3 5.5 8.5 6.1 8.5 6.9l-1.5 5.5c-0.1 0.4 0.2 0.8 0.6 0.8h3c0.4 0 0.7-0.4 0.6-0.8l-1.5-5.5C10.7 6.1 10 5.5 9 5.5Z" fill="currentColor" stroke="none" />
  {:else if name === 'pinterest'}
    <path d="M12.5 4c-4.4 0-8 3.6-8 8 0 2.2 1 4.2 2.7 5.5-0.4 0.5-0.6 1.1-0.4 1.6 0.2 0.5 0.7 0.8 1.2 0.6 1.4-0.4 2.4-1.5 2.4-3.5 0-1.8-1.1-3.3-2.7-3.3-1.5 0-2.5 1-2.5 2.2 0 1.3 0.8 2.4 2.1 2.4 1 0 1.8-0.6 2.1-1.2 0.2-0.4 0.5-0.8 1.1-0.8 0.6 0 1.1 0.4 1.1 1 0 0.7-0.3 1.4-0.8 1.9 1.1 0.2 2.2 0.9 2.2 2.6 0 3.2-2.2 5.8-5.8 5.8-3.1 0-5.7-2.1-5.7-5.2C4.5 7.6 7.1 4 11.5 4c1.5 0 2.8 0.3 4 1Z" fill="currentColor" stroke="none" />
  {:else if name === 'bluesky'}
    <path d="M10 2.5c-4.1 0-7.5 3.4-7.5 7.5s3.4 7.5 7.5 7.5 7.5-3.4 7.5-7.5S14.1 2.5 10 2.5Zm3.5 11.5c0 1.5-1.2 2.7-2.7 2.7-1 0-1.8-0.5-2.3-1.2-1.2-1.7-2.5-3-4.3-3.7-0.7 1.2-1.8 2.2-3.1 2.5-1.9 0.4-3.8 0.3-5.3-1-0.6-0.5-1-1.2-1-2.1 0-2.3 1.8-4.2 4.1-4.2 2.3 0 4.1 1.9 4.1 4.2 0 0.9-0.4 1.7-1.1 2.2 1.5-1.3 2.6-2.1 4.5-2.5C16.5 11 17.5 12.5 17.5 14Z" fill="currentColor" stroke="none" />
  {:else}
    <circle cx="10" cy="10" r="6.5" />
  {/if}
</svg>

<style>
  svg {
    display: block;
    flex: none;
  }
</style>
