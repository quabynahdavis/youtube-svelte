<script lang="ts">
  /*
    Icon — Phosphor Svelte icon integration for clean, modern glyphs.
  */
  import {
    List,
    MagnifyingGlass,
    ArrowDown,
    Bell,
    Gear,
    DotsThreeVertical,
    DotsThree,
    CaretDown,
    CaretUp,
    CaretRight,
    X,
    Check,
    CheckCircle,
    Play,
    PlayCircle,
    Sliders,
    House,
    Compass,
    Video,
    Television,
    ClockCounterClockwise,
    Clock,
    ThumbsUp,
    ListDashes,
    FolderOpen,
    Users,
    Chat,
    ShareNetwork,
    MinusCircle,
    Prohibit,
    Flag,
    Plus,
    BookmarkSimple,
    Sparkle,
    Fire,
    Share,
    Folder,
    WhatsappLogo,
    FacebookLogo,
    XLogo,
    EnvelopeSimple,
    RedditLogo,
    PinterestLogo
  } from 'phosphor-svelte';

  interface Props {
    name: string;
    size?: number;
    class?: string;
  }

  let { name, size = 20, class: cls = '' }: Props = $props();

  const iconMap: Record<string, any> = {
    hamburger: List,
    search: MagnifyingGlass,
    'arrow-south': ArrowDown,
    bell: Bell,
    gear: Gear,
    'more-vert': DotsThreeVertical,
    'more-horiz': DotsThree,
    'chevron-down': CaretDown,
    'chevron-up': CaretUp,
    'chevron-right': CaretRight,
    close: X,
    check: Check,
    'check-circle': CheckCircle,
    play: Play,
    'play-circle': PlayCircle,
    sliders: Sliders,
    home: House,
    explore: Compass,
    shorts: Video,
    tv: Television,
    history: ClockCounterClockwise,
    clock: Clock,
    'thumb-up': ThumbsUp,
    playlists: ListDashes,
    collections: FolderOpen,
    subs: Users,
    comment: Chat,
    share2: ShareNetwork,
    'minus-circle': MinusCircle,
    ban: Prohibit,
    flag: Flag,
    plus: Plus,
    bookmark: BookmarkSimple,
    sparkles: Sparkle,
    flame: Fire,
    share: Share,
    folder: Folder,
    whatsapp: WhatsappLogo,
    facebook: FacebookLogo,
    x: XLogo,
    email: EnvelopeSimple,
    reddit: RedditLogo,
    pinterest: PinterestLogo,
    bluesky: Share
  };

  const SelectedIcon = $derived(iconMap[name] || House);
</script>

<SelectedIcon {size} class={cls} weight="regular" />