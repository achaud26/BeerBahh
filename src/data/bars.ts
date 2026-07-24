export type CrowdLevel = "dead" | "chill" | "buzzing" | "packed";

export type BarAlert = "private_event" | "rented_out" | null;

export type ChatMessage = {
  id: string;
  author: string;
  text: string;
  minutesAgo: number;
};

export type Bar = {
  id: string;
  name: string;
  nickname?: string;
  lat: number;
  lng: number;
  address: string;
  crowd: CrowdLevel;
  deal: string;
  cover: string;
  vibe: string;
  alert: BarAlert;
  chat: ChatMessage[];
};

export const CLEMSON_CENTER = { lat: 34.6837, lng: -82.8371 };

export const bars: Bar[] = [
  {
    id: "esso",
    name: "Esso Club",
    lat: 34.6831,
    lng: -82.8362,
    address: "129 Old Greenville Hwy",
    crowd: "packed",
    deal: "$3 domestics till 11",
    cover: "$5 after 10",
    vibe: "Classic Clemson chaos. Loud, sticky floors, pure Tiger energy.",
    alert: null,
    chat: [
      {
        id: "e1",
        author: "jake_t",
        text: "Line wrapping past the lot rn",
        minutesAgo: 2,
      },
      {
        id: "e2",
        author: "mads",
        text: "DJ actually cooking tonight",
        minutesAgo: 6,
      },
      {
        id: "e3",
        author: "will",
        text: "Bathroom situation is mid. Plan accordingly.",
        minutesAgo: 11,
      },
    ],
  },
  {
    id: "ttt",
    name: "Tiger Town Tavern",
    nickname: "TTT",
    lat: 34.6842,
    lng: -82.8378,
    address: "368 College Ave",
    crowd: "buzzing",
    deal: "Half-off apps happy hour",
    cover: "Free before 9",
    vibe: "College Ave staple. Good mix, easy to bounce between spots.",
    alert: null,
    chat: [
      {
        id: "t1",
        author: "soph",
        text: "Not packed yet — perfect window",
        minutesAgo: 4,
      },
      {
        id: "t2",
        author: "cam",
        text: "Trivia leftovers still lingering upstairs",
        minutesAgo: 18,
      },
    ],
  },
  {
    id: "tds",
    name: "TD's",
    lat: 34.6848,
    lng: -82.8365,
    address: "College Ave",
    crowd: "chill",
    deal: "$2 wells 8–10",
    cover: "No cover",
    vibe: "Lowkey start. Grab a crew and warm up here.",
    alert: null,
    chat: [
      {
        id: "d1",
        author: "nolan",
        text: "Quiet but the deal is actually fire",
        minutesAgo: 8,
      },
      {
        id: "d2",
        author: "aria",
        text: "Two booths open near the back",
        minutesAgo: 15,
      },
    ],
  },
  {
    id: "backstreets",
    name: "Backstreets",
    lat: 34.6826,
    lng: -82.8384,
    address: "Near downtown",
    crowd: "buzzing",
    deal: "Ladies night specials",
    cover: "$7 after 10:30",
    vibe: "Dance floor energy. Hits later.",
    alert: null,
    chat: [
      {
        id: "b1",
        author: "ree",
        text: "Starting to fill. Music slapped at 10.",
        minutesAgo: 5,
      },
    ],
  },
  {
    id: "study-hall",
    name: "Study Hall",
    lat: 34.6854,
    lng: -82.8389,
    address: "College Ave",
    crowd: "dead",
    deal: "Pitcher specials all night",
    cover: "No cover",
    vibe: "Ghost town right now — great if you want space.",
    alert: "private_event",
    chat: [
      {
        id: "s1",
        author: "devon",
        text: "Private event till 11. Don't waste the Uber.",
        minutesAgo: 3,
      },
      {
        id: "s2",
        author: "kai",
        text: "Can confirm. Bouncer turned us away.",
        minutesAgo: 9,
      },
    ],
  },
];

export const crowdCopy: Record<
  CrowdLevel,
  { label: string; short: string; color: string }
> = {
  dead: { label: "Dead", short: "Ghosted", color: "var(--pin-dead)" },
  chill: { label: "Chill", short: "Warming up", color: "var(--pin-chill)" },
  buzzing: {
    label: "Buzzing",
    short: "Getting good",
    color: "var(--pin-buzzing)",
  },
  packed: { label: "Packed", short: "Herd is in", color: "var(--pin-packed)" },
};

export const alertCopy: Record<
  Exclude<BarAlert, null>,
  { label: string; detail: string }
> = {
  private_event: {
    label: "Private event",
    detail: "Closed to the public for now.",
  },
  rented_out: {
    label: "Rented out",
    detail: "Whole spot booked tonight.",
  },
};
