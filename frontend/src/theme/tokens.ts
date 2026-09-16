// Skyline Empire — Art Deco design tokens (1926 Manhattan speculation).
// Palette lifted from the canonical web build for brand parity.

export const colors = {
  ink: "#0B0F19", // primary background
  ink2: "#0E1320", // sunken
  panel: "#131A2B", // raised panel
  panelHi: "#1B2437", // hover / active panel
  gold: "#D4AF37", // primary accent
  goldSoft: "#E6C868",
  goldDim: "#7F5A1F", // secondary gold (minority, borders)
  goldDeep: "#5C4318",
  cream: "#F2E8D5", // primary text
  creamDim: "#B7AD97", // secondary text
  creamFaint: "#7C7462", // tertiary / captions
  line: "rgba(212,175,55,0.28)", // hairline gold border
  lineSoft: "rgba(212,175,55,0.14)",
  overlay: "rgba(6,9,16,0.82)",
  danger: "#B4433B",
  dangerDeep: "#7F1D1D",
  success: "#2E7D4F",
  ok: "#14532D",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radius = {
  sm: 4,
  md: 8,
  lg: 14,
  pill: 999,
} as const;

export const fonts = {
  display: "PlayfairBlack",
  displayBold: "PlayfairBold",
  serif: "Playfair",
  body: "Inter",
  bodyMedium: "InterMedium",
  bodySemi: "InterSemiBold",
  bodyBold: "InterBold",
  mono: "Mono",
} as const;

// Static game reference data (mirrors GET /api). Colors drive tile/chain skin.
export type ChainId =
  | "astor"
  | "vanderbilt"
  | "chrysler"
  | "waldorf"
  | "starlight"
  | "paramount"
  | "rockefeller";

export interface ChainMeta {
  id: ChainId;
  name: string;
  tier: 0 | 1 | 2;
  color: string;
}

export const CHAINS: ChainMeta[] = [
  { id: "astor", name: "Astor", tier: 0, color: "#14532D" },
  { id: "vanderbilt", name: "Vanderbilt", tier: 0, color: "#7F1D1D" },
  { id: "chrysler", name: "Chrysler", tier: 1, color: "#94A3B8" },
  { id: "waldorf", name: "Waldorf", tier: 1, color: "#581C87" },
  { id: "starlight", name: "Starlight", tier: 1, color: "#FBBF24" },
  { id: "paramount", name: "Paramount", tier: 2, color: "#1E3A8A" },
  { id: "rockefeller", name: "Rockefeller", tier: 2, color: "#C2410C" },
];

export const CHAIN_MAP: Record<string, ChainMeta> = Object.fromEntries(
  CHAINS.map((c) => [c.id, c]),
);

export const TIER_NAMES = ["Economy", "Prestige", "Luxury"] as const;

export const PERSONAS: Record<
  string,
  { name: string; monogram: string; tagline: string }
> = {
  baron: { name: "The Baron", monogram: "B", tagline: "Balanced" },
  broker: { name: "The Broker", monogram: "K", tagline: "Conservative" },
  raider: { name: "The Raider", monogram: "R", tagline: "Aggressive" },
  speculator: { name: "The Speculator", monogram: "S", tagline: "Luxury-chaser" },
};

export const SABOTAGE: Record<
  string,
  { name: string; description: string }
> = {
  wall_street_rumor: {
    name: "Wall Street Rumor",
    description: "Choose a rival. They lose $1,000 to a market panic.",
  },
  prohibition_raid: {
    name: "Prohibition Raid",
    description: "Choose a chain. Its top shareholder forfeits 1 share to the market.",
  },
  insider_tip: {
    name: "Insider Tip",
    description: "Peek at the next 5 tiles you will draw from the deck.",
  },
};

// Text color that reads on a given chain color background.
export function onChain(color: string): string {
  // starlight (#FBBF24) and chrysler (#94A3B8) are light → dark ink text.
  const light = ["#FBBF24", "#94A3B8"];
  return light.includes(color) ? colors.ink : colors.cream;
}

export function chainMeta(
  id: string,
  metaList?: ChainMeta[],
): ChainMeta {
  const list = metaList ?? CHAINS;
  return list.find((c) => c.id === id) ?? CHAIN_MAP[id] ?? CHAINS[0];
}

export const money = (n: number): string =>
  "$" + Math.round(n).toLocaleString("en-US");
