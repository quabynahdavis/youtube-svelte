<script lang="ts">
  /*
    Icon — Lucide Svelte icon integration for clean, modern glyphs.
  */
  import {
    Menu,
    Search,
    ArrowDown,
    Bell,
    Settings,
    MoreVertical,
    MoreHorizontal,
    ChevronDown,
    ChevronUp,
    ChevronRight,
    X,
    Check,
    CheckCircle,
    Play,
    PlayCircle,
    SlidersHorizontal,
    Home,
    Compass,
    Video,
    Tv,
    History,
    Clock,
    ThumbsUp,
    ListVideo,
    FolderKanban,
    Users,
    MessageSquare,
    Share2,
    MinusCircle,
    Ban,
    Flag,
    Plus,
    Bookmark,
    Sparkles,
    Flame,
    Share,
    Folder
  } from 'lucide-svelte';

  interface Props {
    name: string;
    size?: number;
    class?: string;
  }

  let { name, size = 20, class: cls = '' }: Props = $props();

  const iconMap: Record<string, any> = {
    hamburger: Menu,
    search: Search,
    'arrow-south': ArrowDown,
    bell: Bell,
    gear: Settings,
    'more-vert': MoreVertical,
    'more-horiz': MoreHorizontal,
    'chevron-down': ChevronDown,
    'chevron-up': ChevronUp,
    'chevron-right': ChevronRight,
    close: X,
    check: Check,
    'check-circle': CheckCircle,
    play: Play,
    'play-circle': PlayCircle,
    sliders: SlidersHorizontal,
    home: Home,
    explore: Compass,
    shorts: Video,
    tv: Tv,
    history: History,
    clock: Clock,
    'thumb-up': ThumbsUp,
    playlists: ListVideo,
    collections: FolderKanban,
    subs: Users,
    comment: MessageSquare,
    share2: Share2,
    'minus-circle': MinusCircle,
    ban: Ban,
    flag: Flag,
    plus: Plus,
    bookmark: Bookmark,
    sparkles: Sparkles,
    flame: Flame,
    share: Share,
    folder: Folder
  };

  const SelectedIcon = $derived(iconMap[name] || Home);
</script>

<SelectedIcon {size} class={cls} />
