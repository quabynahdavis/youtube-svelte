/*
  youtube-redesign — live chat mock data
  ======================================
  Ground-truthed from the Chat.png / Chat-1.png Figma artboard
  (820x1866): membership tier badges ($4.99, 2 months, 1 year, $50),
  chat messages from enjoyer accounts, @mentions, system/action
  messages wrapped in asterisks, and a "Type to chat..." input.
*/

export type ChatMessageType = 'chat' | 'system';

export interface ChatBadge {
  /** e.g. "$4.99", "2 mo", "1 yr", "$50" */
  label: string;
  /** true for paid tiers ($4.99 / $50), false for duration tiers */
  paid?: boolean;
}

export interface ChatMessage {
  id: string;
  type: ChatMessageType;
  user?: string;        // username (omitted for system messages)
  text: string;         // message body, may contain @mentions
  verified?: boolean;   // accent-colored username tick
  member?: boolean;     // renders a membership badge next to the username
  badge?: ChatBadge;    // membership badge to render
  ts?: string;          // optional timestamp
}

export const CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'c-1',
    type: 'chat',
    user: 'youtube enjoyer',
    text: 'first! 🔥',
    member: true,
    badge: { label: '$4.99', paid: true },
    ts: '1:02',
  },
  {
    id: 'c-2',
    type: 'chat',
    user: 'bob',
    text: '@youtube enjoyer welcome to the chat!',
    ts: '1:04',
  },
  {
    id: 'c-3',
    type: 'chat',
    user: 'videowatcher',
    text: 'this redesign is actually clean',
    verified: true,
    ts: '1:06',
  },
  {
    id: 'c-4',
    type: 'system',
    text: '*opens youtube to enjoy videos*',
    ts: '1:08',
  },
  {
    id: 'c-5',
    type: 'chat',
    user: 'therizzler',
    text: '@videowatcher facts',
    member: true,
    badge: { label: '2 mo' },
    ts: '1:10',
  },
  {
    id: 'c-6',
    type: 'chat',
    user: 'gamer123',
    text: 'who else is here in 2026?',
    verified: true,
    member: true,
    badge: { label: '$50', paid: true },
    ts: '1:13',
  },
  {
    id: 'c-7',
    type: 'chat',
    user: 'imhonestlyoutofusernameideas',
    text: '@bob @gamer123 what are we watching?',
    ts: '1:16',
  },
  {
    id: 'c-8',
    type: 'chat',
    user: 'videoenthusiast',
    text: 'love the layout so far',
    member: true,
    badge: { label: '1 yr' },
    ts: '1:19',
  },
  {
    id: 'c-9',
    type: 'system',
    text: '*watches this video*',
    ts: '1:22',
  },
  {
    id: 'c-10',
    type: 'chat',
    user: 'youtube enjoyer',
    text: '@therizzler youre killing it',
    member: true,
    badge: { label: '$4.99', paid: true },
    ts: '1:25',
  },
  {
    id: 'c-11',
    type: 'chat',
    user: 'bob',
    text: 'subscribe if youre new to the channel!',
    ts: '1:28',
  },
  {
    id: 'c-12',
    type: 'chat',
    user: 'videowatcher',
    text: '@videoenthusiast agreed 100%',
    verified: true,
    ts: '1:31',
  },
];
