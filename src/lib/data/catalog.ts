/*
  youtube-redesign — mock catalog
  ===============================
  Typed mock dataset for the redesign demo. Components/pages consume
  `CHANNELS` + `VIDEOS` plus the small helpers below. Asset paths
  (files land in `public/assets/`, owned by the asset agent — never
  copy files here; use fallback styling until they appear):

    Thumb   (video):  /assets/thumbs/<video-slug>.png
    Thumb   (short):  /assets/shorts/<slug>.png
    Avatar:           /assets/avatars/<channel-slug>.png
    Banner:           /assets/banners/juxtoppassed-banner.png
    Brand logo:       /assets/logo.png
    Icons (unused v1): /assets/icons/<icon-name>.png (white on transparency)

  Numbers match the mockups where they are shown (Collections card
  sub counts, Shorts "10M views · 3 weeks ago", Juxtoppassed 293K).
  Home-grid vs Subs-timeline view counts differ between artboards in
  the Figma set; the Home artboard wins (single source of truth).
*/

/* ----------------------------- Types ----------------------------- */

export type VideoType = 'video' | 'short';

/** Which built-in collection a video/listing can surface in ("Plays In" rows). */
export type PlaysIn = 'Gaming' | 'Design & Code' | 'Tech';

export interface Channel {
  slug: string;
  name: string;
  verified: boolean;
  subs: number;
  avatar: string;
  banner?: string;
}

export interface Video {
  slug: string;
  title: string;
  channel: string;
  views: number;
  age: string;
  tags: string[];
  duration: string;
  thumb: string;
  type: VideoType;
  playsIn?: PlaysIn;
}

/* ----------------------------- Assets ---------------------------- */

export const BRAND_LOGO = '/assets/logo.png';
export const SHARE_URL = 'https://youtu.be/dQw4w9WgXcQ';

/** `/assets/icons/<name>.png` — reserved for v2; v1 uses inline SVGs. */
export const iconUrl = (name: string): string => `/assets/icons/${name}.png`;

/* ----------------------------- Chips ----------------------------- */

/** Home filter chips, mockup order ("All" = white active pill). */
export const CHIPS = [
  'All',
  'Subscriptions',
  'Posts',
  'Music',
  'Tech',
  'Design',
  'Live',
  'Playlists',
  'Cats',
  'Electronics',
  'New Creators',
  'Art',
  'Tech News',
  'Lofi beats',
  'UI/UX',
] as const;

/** Shorts page variant, per Shorts.png. */
export const SHORTS_CHIPS = [
  'All',
  'Music',
  'Tech',
  'Design',
  'Live',
  'Playlists',
  'Cats',
  'Electronics',
  'Art',
  'Tech News',
  'Lofi beats',
  'UI/UX Redesign',
  'New Creators',
] as const;

/** Non-"New Creators" chips that never had a mock tail icon. */
export const NEW_CREATOR_SLUGS = [
  'brandonshepherd',
  'coding-with-ai',
  'daniel-kraff',
  'bog',
  'ok',
] as const;

/** Collections ("Plays In") rows seen in the mockups. */
export const COLLECTIONS = ['Gaming', 'Design & Code', 'Tech'] as const satisfies readonly PlaysIn[];

/** Groups on the Subscriptions ▸ Collections tab, per Collections.png. */
export const COLLECTION_GROUPS: Array<{ name: PlaysIn; channels: string[] }> = [
  { name: 'Gaming', channels: ['ninjashyper', 'eve-online', 'howtobasic', 'cyberpunk-game', 'fortnite', 'the-game-theorists', 'gamespot', 'playstation'] },
  { name: 'Design & Code', channels: ['juxtoppassed', 'fireship', 'brandonshepherd', 'coding-with-ai', 'daniel-kraff'] },
  { name: 'Tech', channels: ['bog', 'vsauce', 'the-report-of-the-week'] },
];

export const SUBSCRIBED_CHANNEL_SLUGS: string[] = COLLECTION_GROUPS.flatMap((g) => g.channels);

/* ----------------------------- Channels -------------------------- */

export const CHANNELS: Channel[] = [
  // — content channels —
  { slug: 'juxtoppassed',           name: 'Juxtoppassed',           verified: true,  subs: 293_000,    avatar: '/assets/avatars/juxtoppassed.png',           banner: '/assets/banners/juxtoppassed-banner.png' },
  { slug: 'lofi-girl',              name: 'Lofi Girl',              verified: true,  subs: 14_000_000, avatar: '/assets/avatars/lofi-girl.png' },
  { slug: 'wvw',                    name: 'WWV',                    verified: true,  subs: 3_800_000,  avatar: '/assets/avatars/wvw.png' },
  { slug: 'the-critical-drinker',   name: 'The Critical Drinker',   verified: true,  subs: 1_020_000,  avatar: '/assets/avatars/the-critical-drinker.png' },
  { slug: 'brandonshepherd',        name: 'Brandon Shepherd',       verified: false, subs: 99_600,     avatar: '/assets/avatars/brandonshepherd.png' },
  { slug: 'preppy-kitchen',         name: 'Preppy Kitchen',         verified: true,  subs: 4_600_000,  avatar: '/assets/avatars/preppy-kitchen.png' },
  { slug: 'the-game-theorists',     name: 'The Game Theorists',     verified: true,  subs: 19_400_000, avatar: '/assets/avatars/the-game-theorists.png' },
  { slug: 'dailydoseofinternetcats', name: 'DailyDoseOfInternetCats', verified: true, subs: 2_990_000,  avatar: '/assets/avatars/dailydoseofinternetcats.png' },
  { slug: 'fireship',               name: 'Fireship',               verified: true,  subs: 3_470_000,  avatar: '/assets/avatars/fireship.png' },
  { slug: 'theprimetime',           name: 'ThePrimeTime',           verified: true,  subs: 412_000,    avatar: '/assets/avatars/theprimetime.png' },
  { slug: 'ninjashyper',            name: 'Ninja',                  verified: true,  subs: 23_300_000, avatar: '/assets/avatars/ninjashyper.png' },
  { slug: 'eve-online',             name: 'EVE Online',             verified: true,  subs: 14_100_000, avatar: '/assets/avatars/eve-online.png' },
  { slug: 'howtobasic',             name: 'HowToBasic',             verified: true,  subs: 17_400_000, avatar: '/assets/avatars/howtobasic.png' },
  { slug: 'coding-with-ai',         name: 'Coding with AI',         verified: false, subs: 602_000,    avatar: '/assets/avatars/coding-with-ai.png' },
  { slug: 'cyberpunk-game',         name: 'Cyberpunk Game',         verified: true,  subs: 1_700_000,  avatar: '/assets/avatars/cyberpunk-game.png' },
  { slug: 'fortnite',               name: 'Fortnite',               verified: true,  subs: 12_900_000, avatar: '/assets/avatars/fortnite.png' },
  { slug: 'gamespot',               name: 'GameSpot',               verified: true,  subs: 5_800_000,  avatar: '/assets/avatars/gamespot.png' },
  { slug: 'playstation',            name: 'PlayStation',            verified: true,  subs: 16_000_000, avatar: '/assets/avatars/playstation.png' },
  { slug: 'bog',                    name: 'Bog',                    verified: false, subs: 19_800,     avatar: '/assets/avatars/bog.png' },
  { slug: 'vsauce',                 name: 'Vsauce',                 verified: true,  subs: 23_300_000, avatar: '/assets/avatars/vsauce.png' },
  { slug: 'the-report-of-the-week', name: 'TheReportOfTheWeek',     verified: true,  subs: 2_580_000,  avatar: '/assets/avatars/the-report-of-the-week.png' },
  { slug: 'daniel-kraff',           name: 'Daniel Kraff',           verified: false, subs: 23_800_000, avatar: '/assets/avatars/daniel-kraff.png' },
  { slug: 'man-carrying-thing',     name: 'Man Carrying Thing',     verified: true,  subs: 640_000,    avatar: '/assets/avatars/man-carrying-thing.png' },
  { slug: 'screen-junkies',         name: 'Screen Junkies',         verified: true,  subs: 7_300_000,  avatar: '/assets/avatars/screen-junkies.png' },
  { slug: 'ok',                     name: 'ok',                     verified: false, subs: 12_000,     avatar: '/assets/avatars/ok.png' },
  // — fake accounts shown in the share sheet —
  { slug: 'youtube-enjoyer',             name: 'YouTube Enjoyer',             verified: false, subs: 3, avatar: '/assets/avatars/youtube-enjoyer.png' },
  { slug: 'happy-youtube-enjoyer',       name: 'HappyYouTube Enjoyer',        verified: false, subs: 8, avatar: '/assets/avatars/happy-youtube-enjoyer.png' },
  { slug: 'evil-youtube-enjoyer',        name: 'EvilYouTube Enjoyer',         verified: false, subs: 1, avatar: '/assets/avatars/evil-youtube-enjoyer.png' },
  { slug: 'indifferent-youtube-enjoyer', name: 'Indifferent YouTubeEnjo',     verified: false, subs: 0, avatar: '/assets/avatars/indifferent-youtube-enjoyer.png' },
];

/* ----------------------------- Videos ---------------------------- */

export const VIDEOS: Video[] = [
  // In Case You Missed — Juxtoppassed shelf
  { slug: 'how-websites-learned-to-fit-everywhere', title: 'How Websites Learned to Fit Everywhere',  channel: 'juxtoppassed', views: 150_000, age: '4 months ago',  tags: ['Design', 'UI/UX Redesign'], duration: '12:07', thumb: '/assets/thumbs/how-websites-learned-to-fit-everywhere.png', type: 'video', playsIn: 'Design & Code' },
  { slug: 'redesigned-discord-ui-cozier',           title: 'I Redesigned Discord UI just to make it Cozier', channel: 'juxtoppassed', views: 433_000, age: '1 month ago', tags: ['Design', 'UI/UX Design'], duration: '12:07', thumb: '/assets/thumbs/redesigned-discord-ui-cozier.png', type: 'video', playsIn: 'Design & Code' },
  { slug: 'everything-about-color',                 title: 'everything about color (literally)',      channel: 'juxtoppassed', views: 319_000, age: '3 months ago',  tags: ['Art', 'Design'], duration: '12:07', thumb: '/assets/thumbs/everything-about-color.png', type: 'video', playsIn: 'Design & Code' },
  { slug: 'blurring-things-in-quirky-ways',         title: 'I tried blurring things in Quirky ways',  channel: 'juxtoppassed', views: 304_000, age: '5 months ago',  tags: ['Design', 'Art'], duration: '12:07', thumb: '/assets/thumbs/blurring-things-in-quirky-ways.png', type: 'video', playsIn: 'Design & Code' },

  // Home grid
  { slug: 'redesigned-youtube-ui-from-scratch',     title: 'I Redesigned the ENTIRE YouTube UI from Scratch', channel: 'juxtoppassed', views: 520_000, age: '1 day ago', tags: ['UI/UX Design', 'UI/UX Redesign', 'Tech'], duration: '12:07', thumb: '/assets/thumbs/redesigned-youtube-ui-from-scratch.png', type: 'video', playsIn: 'Design & Code' },
  { slug: 'christmas-lofi-radio',                   title: 'christmas lofi radio 🎄cozy beats to get festive to', channel: 'lofi-girl', views: 120_000, age: '1 day ago', tags: ['Lofi beats', 'Music', 'Live'], duration: '12:07', thumb: '/assets/thumbs/christmas-lofi-radio.png', type: 'video' },
  { slug: 'how-a-cat-works',                        title: 'How a cat works',                     channel: 'wvw',          views: 4_000_000, age: '11 months ago', tags: ['Cats'], duration: '12:07', thumb: '/assets/thumbs/how-a-cat-works.png', type: 'video' },
  { slug: 'impossible-laptop-fan',                  title: 'The IMPOSSIBLE Laptop Fan...',        channel: 'juxtoppassed', views: 991_000, age: '2 months ago',  tags: ['Electronics', 'Tech'], duration: '12:07', thumb: '/assets/thumbs/impossible-laptop-fan.png', type: 'video', playsIn: 'Tech' },
  { slug: 'game-theory-fixed-zelda-timeline',       title: "Game Theory: I Fixed Zelda's BROKEN Timeline!", channel: 'the-game-theorists', views: 2_300_000, age: '3 weeks ago', tags: ['Video Games'], duration: '12:07', thumb: '/assets/thumbs/game-theory-fixed-zelda-timeline.png', type: 'video', playsIn: 'Gaming' },
  { slug: 'first-person-camera-islands-available-now', title: 'First-Person Camera Creator Makes Islands Available Now', channel: 'eve-online', views: 260_000, age: '6 days ago', tags: ['Video Games'], duration: '12:07', thumb: '/assets/thumbs/first-person-camera-islands-available-now.png', type: 'video', playsIn: 'Gaming' },
  { slug: 'turned-famous-logos-into-emojis',        title: 'I Turned Famous Logos into Emojis',    channel: 'juxtoppassed', views: 388_000, age: '2 months ago',  tags: ['Art', 'Design'], duration: '12:07', thumb: '/assets/thumbs/turned-famous-logos-into-emojis.png', type: 'video', playsIn: 'Design & Code' },
  { slug: 'thomas-bergersen-a-christmas-carol',     title: 'Thomas Bergersen - A Christmas Carol (Trailer)', channel: 'bog', views: 47_000,  age: '1 week ago',   tags: ['Music'], duration: '12:07', thumb: '/assets/thumbs/thomas-bergersen-a-christmas-carol.png', type: 'video' },
  { slug: 'the-best-and-worst-of-2024',             title: 'The Best And Worst Of 2024',          channel: 'the-report-of-the-week', views: 340_000, age: '2 months ago', tags: ['Tech News'], duration: '12:07', thumb: '/assets/thumbs/the-best-and-worst-of-2024.png', type: 'video', playsIn: 'Tech' },
  { slug: 'the-every-ui-ux-website-explained',      title: 'The Every UI/UX Website Explained',   channel: 'theprimetime', views: 108_000, age: '1 day ago',     tags: ['UI/UX', 'Tech', 'Linux'], duration: '12:07', thumb: '/assets/thumbs/the-every-ui-ux-website-explained.png', type: 'video', playsIn: 'Tech' },
  { slug: 'josh-hutcherson-whistle',                title: 'Josh Hutcherson Whistle',             channel: 'ok',           views: 8_900_000, age: '6 months ago', tags: ['Posts'], duration: '12:07', thumb: '/assets/thumbs/josh-hutcherson-whistle.png', type: 'video' },
  { slug: 'classic-gingerbread-cookies-recipe',     title: 'Classic Gingerbread Cookies Recipe',  channel: 'preppy-kitchen', views: 1_300_000, age: '3 weeks ago', tags: [], duration: '12:07', thumb: '/assets/thumbs/classic-gingerbread-cookies-recipe.png', type: 'video' },
  { slug: 'gingerbread-man-recipe',                 title: 'GINBREAD COOKIES | gingerbread man recipe', channel: 'preppy-kitchen', views: 620_000, age: '1 month ago', tags: [], duration: '12:07', thumb: '/assets/thumbs/gingerbread-man-recipe.png', type: 'video' },

  // Cat shorts
  { slug: 'put-this-cat-in-jail',                   title: 'Put this cat in jail',                channel: 'dailydoseofinternetcats', views: 10_000_000, age: '3 weeks ago', tags: ['Cats'], duration: '12:07', thumb: '/assets/shorts/put-this-cat-in-jail.png', type: 'short' },
  { slug: 'pizza-crust-really-wants-me',            title: 'Pizza Crust Really wants M...',       channel: 'dailydoseofinternetcats', views: 10_000_000, age: '3 weeks ago', tags: ['Cats'], duration: '12:07', thumb: '/assets/shorts/pizza-crust-really-wants-me.png', type: 'short' },

  // Extra grid filler so channels have content
  { slug: 'the-worst-movie-villains-of-the-year',   title: 'The WORST Movie Villains of the Year', channel: 'the-critical-drinker', views: 890_000, age: '2 weeks ago', tags: [], duration: '12:07', thumb: '/assets/thumbs/the-worst-movie-villains-of-the-year.png', type: 'video' },
  { slug: 'how-many-ways-can-you-count-to-infinity', title: 'How Many Ways Can You Count to Infinity?', channel: 'vsauce', views: 2_100_000, age: '8 months ago', tags: [], duration: '12:07', thumb: '/assets/thumbs/how-many-ways-can-you-count-to-infinity.png', type: 'video' },
  { slug: 'react-in-100-seconds',                   title: 'React in 100 Seconds',                channel: 'fireship',     views: 1_100_000, age: '3 weeks ago',  tags: ['Tech'], duration: '12:07', thumb: '/assets/thumbs/react-in-100-seconds.png', type: 'video', playsIn: 'Tech' },
  { slug: 'i-built-the-ultimate-gaming-setup',      title: 'I Built the Ultimate Gaming Setup',   channel: 'ninjashyper',  views: 760_000, age: '5 days ago',    tags: ['Electronics', 'Video Games'], duration: '12:07', thumb: '/assets/thumbs/i-built-the-ultimate-gaming-setup.png', type: 'video', playsIn: 'Gaming' },
  { slug: 'cyberpunk-update-2-3-overview',          title: 'Update 2.3 | Official Overview',      channel: 'cyberpunk-game', views: 2_400_000, age: '1 week ago', tags: ['Video Games'], duration: '12:07', thumb: '/assets/thumbs/cyberpunk-update-2-3-overview.png', type: 'video', playsIn: 'Gaming' },
  { slug: 'the-best-games-of-2024-top-10',          title: 'The Best Games of 2024 — Top 10',     channel: 'gamespot',     views: 540_000, age: '1 month ago',   tags: ['Video Games'], duration: '12:07', thumb: '/assets/thumbs/the-best-games-of-2024-top-10.png', type: 'video', playsIn: 'Gaming' },
];

/* ----------------------------- Formatting ------------------------ */

/** 293_000 → "293K"; 10_000_000 → "10M"; 99_600 → "99.6K"; 2_580_000 → "2.58M". */
export function formatCount(n: number): string {
  const brief = (v: number): string => {
    const scaled = Math.round(v * (v < 10 ? 100 : 10)) / (v < 10 ? 100 : 10);
    return `${Number.isInteger(scaled) ? scaled : scaled}`;
  };
  if (n >= 1e9) return `${brief(n / 1e9)}B`;
  if (n >= 1e6) return `${brief(n / 1e6)}M`;
  if (n >= 1e3) return `${brief(n / 1e3)}K`;
  return `${n}`;
}

/* --------------------------- Filter helpers ---------------------- */

/** Chip matching: exact tag hit, the UI/UX* family, or New Creators cohort. */
export function matchesChip(video: Video, chip: string): boolean {
  if (chip === 'All') return true;
  if (chip === 'New Creators') return NEW_CREATOR_SLUGS.includes(video.channel as never);
  return video.tags.includes(chip) ||
    (chip === 'UI/UX' && video.tags.some((t) => t.startsWith('UI/UX')));
}

/** Substring hit used by personalize "Excluded Content". */
export function isExcludedBy(
  video: Video,
  entries: string[],
  opts: { includeShortsType?: boolean } = {},
): boolean {
  return entries.some((raw) => {
    const entry = raw.trim().toLowerCase();
    if (!entry) return false;
    if (opts.includeShortsType && entry === 'shorts' && video.type === 'short') return true;
    const channel = getChannel(video.channel);
    return (
      video.title.toLowerCase().includes(entry) ||
      video.slug.toLowerCase().includes(entry) ||
      (channel?.name.toLowerCase().includes(entry) ?? false) ||
      video.channel.toLowerCase().includes(entry)
    );
  });
}

/**
 * Repetition for mock-density: cycles the pool until `min` items so grids
 * look full like the artboards (key `${slug}#${k}` is unique per instance).
 */
export function spreadVideos(videos: Video[], min: number): Array<{ video: Video; key: string }> {
  if (videos.length === 0) return [];
  return Array.from({ length: min }, (_, k) => ({
    video: videos[k % videos.length],
    key: `${videos[k % videos.length].slug}#${k}`,
  }));
}

/* ---------------------------- Lookups ---------------------------- */

export const getChannel = (slug: string): Channel | undefined =>
  CHANNELS.find((c) => c.slug === slug);

export const getVideos = (): Video[] => VIDEOS.filter((v) => v.type === 'video');

export const getShorts = (): Video[] => VIDEOS.filter((v) => v.type === 'short');

export const getChannelVideos = (slug: string): Video[] =>
  VIDEOS.filter((v) => v.channel === slug);

/** Videos of a set of channels (used by the Subscriptions timeline). */
export const getChannelSetVideos = (slugs: readonly string[]): Video[] =>
  VIDEOS.filter((v) => slugs.includes(v.channel));
