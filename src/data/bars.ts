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

/** Downtown Clemson — zoomed to fit College Ave + Sloan + Esso. */
export const CLEMSON_CENTER = { lat: 34.6836, lng: -82.8405 };
export const CLEMSON_DEFAULT_ZOOM = 14;

export const bars: Bar[] = [
  {
    id: "ttt",
    name: "Tiger Town Tavern",
    nickname: "TTT",
    lat: 34.68323,
    lng: -82.837401,
    address: "368 College Ave",
    crowd: "buzzing",
    deal: "Daily specials all week",
    cover: "Varies by night",
    vibe:
      "Iconic multi-level student and alumni staple with daily specials.",
    alert: null,
    chat: [
      {
        id: "ttt1",
        author: "soph",
        text: "Not packed yet — perfect window",
        minutesAgo: 4,
      },
      {
        id: "ttt2",
        author: "cam",
        text: "Upstairs is moving, downstairs still chill",
        minutesAgo: 12,
      },
    ],
  },
  {
    id: "esso",
    name: "The Esso Club",
    nickname: "Esso",
    lat: 34.682978,
    lng: -82.846288,
    address: "129 Old Greenville Hwy",
    crowd: "packed",
    deal: "Game-day specials + cold pitchers",
    cover: "Usually no cover",
    vibe:
      "Historic 1930s gas station turned legendary game-day meat-and-three and sports bar near Death Valley.",
    alert: null,
    chat: [
      {
        id: "esso1",
        author: "jake_t",
        text: "Patio is slammed. Grab a spot early.",
        minutesAgo: 3,
      },
      {
        id: "esso2",
        author: "mads",
        text: "Classic Esso energy tonight",
        minutesAgo: 9,
      },
    ],
  },
  {
    id: "nicks",
    name: "Nick's Tavern and Deli",
    nickname: "Nick's",
    lat: 34.683562,
    lng: -82.837835,
    address: "107 Sloan St",
    crowd: "chill",
    deal: "Sandwich + beer specials",
    cover: "No cover",
    vibe:
      "Clemson's oldest tavern (est. 1976), known for a relaxed dive vibe and sandwiches.",
    alert: null,
    chat: [
      {
        id: "n1",
        author: "will",
        text: "Quiet dive night — perfect warm-up",
        minutesAgo: 7,
      },
      {
        id: "n2",
        author: "aria",
        text: "Fried mushrooms hitting different",
        minutesAgo: 16,
      },
    ],
  },
  {
    id: "backstreets",
    name: "Backstreets Pub & Grill",
    nickname: "Backstreets",
    lat: 34.683654,
    lng: -82.836657,
    address: "102 Earle St",
    crowd: "buzzing",
    deal: "Wings + pizza specials",
    cover: "Free before 10",
    vibe:
      "Two-story pub with outdoor decks, huge beer selection, wings, and pizza.",
    alert: null,
    chat: [
      {
        id: "bs1",
        author: "ree",
        text: "Deck is open and filling up",
        minutesAgo: 5,
      },
      {
        id: "bs2",
        author: "nolan",
        text: "Beer list is actually stacked",
        minutesAgo: 14,
      },
    ],
  },
  {
    id: "tds",
    name: "TD's of Clemson",
    nickname: "TD's",
    lat: 34.682828,
    lng: -82.837478,
    address: "339 College Ave",
    crowd: "buzzing",
    deal: "$2 wells 8–10",
    cover: "No cover early",
    vibe: "Popular game-day sports bar right across from campus.",
    alert: null,
    chat: [
      {
        id: "td1",
        author: "kai",
        text: "Game on every screen. Solid start spot.",
        minutesAgo: 6,
      },
    ],
  },
  {
    id: "study-hall",
    name: "Study Hall",
    lat: 34.683386,
    lng: -82.837647,
    address: "101A Sloan St",
    crowd: "packed",
    deal: "Jet Fuel specials",
    cover: "$5–10 after 10",
    vibe:
      'Energetic late-night party bar and club famous for its "Jet Fuel" drink.',
    alert: null,
    chat: [
      {
        id: "sh1",
        author: "devon",
        text: "Line starting. Jet Fuel flowing.",
        minutesAgo: 2,
      },
      {
        id: "sh2",
        author: "mads",
        text: "This is the late-night move",
        minutesAgo: 11,
      },
    ],
  },
  {
    id: "roar",
    name: "ROAR Clemson",
    nickname: "ROAR",
    lat: 34.683766,
    lng: -82.837108,
    address: "376 College Ave",
    crowd: "buzzing",
    deal: "VIP tables + bottle specials",
    cover: "Cover after 10 on weekends",
    vibe: "Downtown nightlife spot featuring DJs and dance music.",
    alert: null,
    chat: [
      {
        id: "r1",
        author: "lex",
        text: "DJ just started — dance floor opening up",
        minutesAgo: 4,
      },
    ],
  },
  {
    id: "itsurwiener",
    name: "Itsurwiener",
    nickname: "The Wien",
    lat: 34.684296,
    lng: -82.836243,
    address: "101 Keith St",
    crowd: "buzzing",
    deal: "48oz litches + gameday specials",
    cover: "Varies · Basement later",
    vibe:
      "Sports bar upstairs (The Wien) and underground dance club downstairs (The Basement) — Clemson's entertainment destination.",
    alert: null,
    chat: [
      {
        id: "iw1",
        author: "brooke",
        text: "Upstairs packed for the game. Basement opens later.",
        minutesAgo: 5,
      },
      {
        id: "iw2",
        author: "tyler",
        text: "LED wall going hard tonight",
        minutesAgo: 12,
      },
    ],
  },
  {
    id: "el-paso",
    name: "El Paso Tacos & Tequila",
    nickname: "El Paso's",
    lat: 34.682898,
    lng: -82.840584,
    address: "189 Old Greenville Hwy",
    crowd: "chill",
    deal: "Margarita + taco specials",
    cover: "No cover",
    vibe:
      "Mexican and Tex-Mex with a full tequila bar, margaritas, and a big patio at Plaza One 89.",
    alert: null,
    chat: [
      {
        id: "ep1",
        author: "sam",
        text: "Patio seats open. Margs are hitting.",
        minutesAgo: 7,
      },
    ],
  },
  {
    id: "sushi-356",
    name: "356 Sushi & Martini Bar",
    nickname: "356",
    lat: 34.683142,
    lng: -82.837381,
    address: "366 College Ave",
    crowd: "chill",
    deal: "Martini + roll specials",
    cover: "No cover early",
    vibe:
      "Sushi and cocktail bar on College Ave — rolls, martinis, and late nights Thu–Sat.",
    alert: null,
    chat: [
      {
        id: "s356-1",
        author: "nina",
        text: "Chill vibe upstairs. Good mid-night reset.",
        minutesAgo: 9,
      },
    ],
  },
  {
    id: "loose-change",
    name: "Loose Change",
    lat: 34.682885,
    lng: -82.837499,
    address: "349 College Ave",
    crowd: "chill",
    deal: "Happy hour drafts",
    cover: "No cover",
    vibe: "Casual pub and social hangout.",
    alert: null,
    chat: [
      {
        id: "lc1",
        author: "tay",
        text: "Lowkey and open seats near the front",
        minutesAgo: 10,
      },
    ],
  },
  {
    id: "walkons",
    name: "Walk-On's Sports Bistreaux",
    nickname: "Walk-On's",
    lat: 34.687435,
    lng: -82.835918,
    address: "403 College Ave",
    crowd: "dead",
    deal: "Game-day apps + pitcher deals",
    cover: "No cover",
    vibe: "Spacious sports bar and eatery.",
    alert: null,
    chat: [
      {
        id: "wo1",
        author: "chris",
        text: "Huge TVs, plenty of tables right now",
        minutesAgo: 13,
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
