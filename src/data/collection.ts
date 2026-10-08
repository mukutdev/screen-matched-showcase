// All collection data in one file so it can be ported to Shopify Liquid / metafields.

export type ColourId =
  | "tropic-holo"
  | "neon-fury"
  | "ghost"
  | "blue-pilchard"
  | "moon-rock"
  | "pink-lady";

export interface Colour {
  id: ColourId;
  name: string;
  /** base tint used for the SVG lure */
  base: string;
  /** secondary tint used for belly / pattern */
  accent: string;
  /** CSS background for the swatch pattern */
  swatch: string;
}

export const COLOURS: Colour[] = [
  {
    id: "tropic-holo",
    name: "Tropic Holo",
    base: "#1f9e8f",
    accent: "#f2d14b",
    swatch: "linear-gradient(135deg,#1f9e8f 0 33%,#7fd3c0 33% 66%,#f2d14b 66%)",
  },
  {
    id: "neon-fury",
    name: "Neon Fury",
    base: "#e2462f",
    accent: "#c8f03c",
    swatch: "repeating-linear-gradient(45deg,#e2462f 0 5px,#c8f03c 5px 10px)",
  },
  {
    id: "ghost",
    name: "Ghost",
    base: "#c9ccd1",
    accent: "#f4f4f2",
    swatch: "radial-gradient(circle at 30% 30%,#ffffff 0 25%,#c9ccd1 60%)",
  },
  {
    id: "blue-pilchard",
    name: "Blue Pilchard",
    base: "#1f4f8c",
    accent: "#dfe7ef",
    swatch: "linear-gradient(180deg,#1f4f8c 0 50%,#dfe7ef 50%)",
  },
  {
    id: "moon-rock",
    name: "Moon Rock",
    base: "#5b5a57",
    accent: "#a8a39a",
    swatch: "radial-gradient(circle at 25% 35%,#a8a39a 0 18%,transparent 19%),radial-gradient(circle at 70% 65%,#a8a39a 0 15%,transparent 16%),#5b5a57",
  },
  {
    id: "pink-lady",
    name: "Pink Lady",
    base: "#e66fa4",
    accent: "#fde3ee",
    swatch: "repeating-linear-gradient(90deg,#e66fa4 0 4px,#fde3ee 4px 8px)",
  },
];

export type Action = "floating" | "sinking";
export type WaterBand = "estuary" | "inshore" | "reef" | "bluewater";

export const WATER_BANDS: { id: WaterBand; label: string; sizes: number[] }[] = [
  { id: "estuary", label: "Estuary", sizes: [105] },
  { id: "inshore", label: "Inshore", sizes: [125, 150] },
  { id: "reef", label: "Reef & pelagics", sizes: [170] },
  { id: "bluewater", label: "Bluewater", sizes: [185, 220, 250] },
];

export const WATER_LABEL: Record<number, string> = {
  105: "Estuary · light",
  125: "Inshore",
  150: "Inshore reef",
  170: "Reef · pelagics",
  185: "Bluewater",
  220: "Big GT",
  250: "XL bluewater",
};

export function bandForSize(size: number): WaterBand {
  return WATER_BANDS.find((b) => b.sizes.includes(size))!.id;
}

export interface Variant {
  weight: number;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  line: "masters" | "gen2";
  action: Action;
  size: number;
  timber: string;
  variants: Variant[];
  colours: ColourId[];
  soldOut: ColourId[];
  bestSeller?: boolean;
  /** popularity rank for "Best selling" sort (lower = more popular) */
  badge?: "GEN II";
}

const ALL: ColourId[] = COLOURS.map((c) => c.id);

const floating: [number, number, number][] = [
  [105, 25, 39.99],
  [125, 40, 44.99],
  [150, 65, 54.99],
  [170, 90, 62.99],
  [185, 110, 69.99],
  [220, 155, 74.99],
  [250, 200, 79.99],
];

const sinking: [number, number, number][] = [
  [105, 33, 39.99],
  [125, 50, 44.99],
  [150, 80, 54.99],
  [170, 115, 62.99],
  [185, 140, 69.99],
];

const SOLD_OUT: Record<string, ColourId[]> = {
  "masters-150f": ["pink-lady"],
  "masters-220f": ["pink-lady", "neon-fury", "ghost", "moon-rock"],
  "masters-250f": ["pink-lady", "blue-pilchard"],
  "masters-125s": ["blue-pilchard"],
};

export const PRODUCTS: Product[] = [
  ...floating.map(([size, weight, price]) => ({
    id: `masters-${size}f`,
    name: `Masters ${size}F`,
    line: "masters" as const,
    action: "floating" as const,
    size,
    timber: "Korean pine",
    variants: [{ weight, price }],
    colours: ALL,
    soldOut: SOLD_OUT[`masters-${size}f`] ?? [],
    bestSeller: size === 150,
  })),
  ...sinking.map(([size, weight, price]) => ({
    id: `masters-${size}s`,
    name: `Masters ${size}S`,
    line: "masters" as const,
    action: "sinking" as const,
    size,
    timber: "Mahogany",
    variants: [{ weight, price }],
    colours: ALL,
    soldOut: SOLD_OUT[`masters-${size}s`] ?? [],
  })),
  {
    id: "gen2-pink-lady",
    name: "GEN II Stickbait — Pink Lady",
    line: "gen2",
    action: "floating",
    size: 150,
    timber: "Mahogany",
    variants: [
      { weight: 80, price: 49.99 },
      { weight: 100, price: 54.99 },
      { weight: 120, price: 59.99 },
    ],
    colours: ["pink-lady"],
    soldOut: [],
    badge: "GEN II",
  },
];

export const SIZE_GUIDE = [105, 125, 150, 170, 185, 220, 250].map((size) => ({
  size,
  floating: floating.find((f) => f[0] === size)?.[1],
  sinking: sinking.find((s) => s[0] === size)?.[1],
  water: WATER_LABEL[size],
  hook: size === 105 ? "BKK #2 or 1/0" : size === 250 ? "BKK 5/0 or 6/0" : "TBC",
}));

export const BUNDLE_TIERS = [
  { qty: 10, pct: 25 },
  { qty: 7, pct: 20 },
  { qty: 5, pct: 15 },
  { qty: 3, pct: 10 },
];

export const FREE_SHIPPING_THRESHOLD = 129;

export const FAQ = [
  {
    q: "Floating or sinking — which should I buy?",
    a: "Floating for surface work in calm to moderate water; sinking when wind and chop push you below. [Jason to confirm]",
  },
  {
    q: "What size stickbait for my fishing?",
    a: "105–125mm for estuary and inshore, 150–170mm for reef, 185mm+ for bluewater and GT. See the size guide above. [Jason to confirm]",
  },
  {
    q: "Why timber instead of plastic?",
    a: "Timber has natural buoyancy and a livelier action, and each blank is shaped and painted by hand. [Jason to confirm]",
  },
  {
    q: "How do I rig a Masters stickbait?",
    a: "Every Masters is through-wired. Match the hook to the size guide and use a solid ring. [Jason to confirm]",
    link: { label: "Rigging guide", href: "#" },
  },
  {
    q: "When is the next batch?",
    a: "Batches drop every few weeks. Join the list at the bottom of the page to hear first. [Jason to confirm]",
  },
];

export const RELATED = ["Ghost Drops", "Jigs", "Bundles", "Rigging guide"];
