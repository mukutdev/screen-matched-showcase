// All collection data in one file so it can be ported to Shopify Liquid / metafields.

export type ColourId =
  | "tropic-holo"
  | "neon-fury"
  | "ghost"
  | "blue-pilchard"
  | "moon-rock"
  | "pink-lady";

const CDN = "https://cdn.shopify.com/s/files/1/0590/7657/5306/files/";

export interface Colour {
  id: ColourId;
  name: string;
  /** square 3840px colourway photo on Shopify CDN (append &width=) */
  photo: string;
}

export const COLOURS: Colour[] = [
  { id: "tropic-holo", name: "Tropic Holo", photo: CDN + "FAR-170-lime-blue-3840_d33f0f5e-10dd-4dcc-9de2-e65eb04d7f7b.png?v=1791074726" },
  { id: "neon-fury", name: "Neon Fury", photo: CDN + "FAR-170-neon-fury-3840_7c63d0f0-9552-4745-a409-2716088c622d.png?v=1791074705" },
  { id: "ghost", name: "Ghost", photo: CDN + "FAR-170-white-holo-3840_c4d37243-aa08-48c4-a2d5-77a3495090f5.png?v=1791074754" },
  { id: "blue-pilchard", name: "Blue Pilchard", photo: CDN + "FAR-170-black-blue-3840_cb559b1d-ea61-48be-a940-9a1f47e44dbf.png?v=1791074776" },
  { id: "moon-rock", name: "Moon Rock", photo: CDN + "FAR-170-green-mackerel-3840_1950e13e-41bf-4d93-b109-971a52ee2eb2.png?v=1791074792" },
  { id: "pink-lady", name: "Pink Lady", photo: CDN + "FAR-170-blue-pink-mackerel-3840_6aa62284-5388-4c7d-bbd0-c8c4fbe35021.png?v=1791074804" },
];

export const GEN2_PHOTOS = [
  CDN + "Untitled_design_-_2026-04-05T063046.578.png?v=1775507156",
  CDN + "Untitled_design_-_2026-05-10T183216.091.png?v=1778402022",
  CDN + "Untitled_design_-_2026-05-10T183332.715.png?v=1778402023",
];

export const img = (url: string, width: number) => `${url}&width=${width}`;
export const colourById = (id: ColourId) => COLOURS.find((c) => c.id === id)!;

export const STORE = "https://filletandreleaseco.com";
export const PRODUCT_URL = {
  floating: STORE + "/products/stickbaits-masters-floating",
  sinking: STORE + "/products/floating-stickbaits",
  gen2: STORE + "/products/far-co-stickbaits-new-release",
};

const FLOAT_IDS: Record<ColourId, number[]> = {
  "neon-fury": [43345142644810, 43345142677578, 43345142710346, 43345142743114, 43345142775882, 43345176887370, 43345176920138],
  "tropic-holo": [43345142808650, 43345142841418, 43345142874186, 43345142906954, 43345142939722, 43345176952906, 43345176985674],
  ghost: [43345142972490, 43345143005258, 43345143038026, 43345143070794, 43345143103562, 43345177018442, 43345177051210],
  "blue-pilchard": [43345143300170, 43345143332938, 43345143365706, 43345143398474, 43345143431242, 43345177149514, 43345177182282],
  "moon-rock": [43345143136330, 43345143169098, 43345143201866, 43345143234634, 43345143267402, 43345177083978, 43345177116746],
  "pink-lady": [43345143464010, 43345143496778, 43345143529546, 43345143562314, 43345143595082, 43345177215050, 43345177247818],
};
const SINK_IDS: Record<ColourId, number[]> = {
  "tropic-holo": [43282610978890, 43282611011658, 43282611044426, 43282611077194, 43282611109962],
  "neon-fury": [43282610749514, 43282610782282, 43282610815050, 43282610847818, 43282610880586],
  ghost: [43282611208266, 43282611241034, 43282611273802, 43282611306570, 43282611339338],
  "moon-rock": [43282611437642, 43282611470410, 43282611503178, 43282611535946, 43282611568714],
  "blue-pilchard": [43282611667018, 43282611699786, 43282611732554, 43282611765322, 43282611798090],
  "pink-lady": [43282611896394, 43282611929162, 43282611961930, 43282611994698, 43282612027466],
};
const FLOAT_SIZES = [105, 125, 150, 170, 185, 220, 250];
const SINK_SIZES = [105, 125, 150, 170, 185];
export const GEN2_IDS = [41638110724170, 41638110756938, 41755795882058];

/** Shopify variant id for a product / colour / weight-variant index */
export function variantId(p: Product, colour: ColourId, variantIndex = 0): number {
  if (p.line === "gen2") return GEN2_IDS[variantIndex] ?? GEN2_IDS[0]!;
  return p.action === "floating" ? FLOAT_IDS[colour][FLOAT_SIZES.indexOf(p.size)]! : SINK_IDS[colour][SINK_SIZES.indexOf(p.size)]!;
}

export function productUrl(p: Product, colour: ColourId, variantIndex = 0): string {
  const base = p.line === "gen2" ? PRODUCT_URL.gen2 : PRODUCT_URL[p.action];
  return `${base}?variant=${variantId(p, colour, variantIndex)}`;
}

/** first in-stock colour (COLOURS order), preferring `preferred` if available */
export function defaultColour(p: Product, preferred?: ColourId): ColourId {
  if (preferred && p.colours.includes(preferred) && !p.soldOut.includes(preferred)) return preferred;
  return p.colours.find((c) => !p.soldOut.includes(c)) ?? p.colours[0]!;
}

export function photoFor(p: Product, colour: ColourId): string {
  return p.line === "gen2" ? GEN2_PHOTOS[0]! : colourById(colour).photo;
}

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
    name: "GEN II — Pink Lady",
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

export const SIZE_GUIDE = [
  { size: 105, water: "Estuary · light", floating: "25g", sinking: "33g", rings: "#5 or #6", hooks: "BKK #2 or 1/0" },
  { size: 125, water: "Inshore", floating: "40g", sinking: "50g", rings: "#6", hooks: "BKK #1 or 1/0" },
  { size: 150, water: "Inshore reef", floating: "65g", sinking: "80g", rings: "#7", hooks: "BKK 1/0 or 2/0" },
  { size: 170, water: "Reef · pelagics", floating: "90g", sinking: "115g", rings: "#8", hooks: "BKK 2/0 or 3/0" },
  { size: 185, water: "Bluewater", floating: "110g", sinking: "140g", rings: "#8", hooks: "BKK 3/0 or 4/0" },
  { size: 220, water: "Big GT", floating: "155g", sinking: "—", rings: "See product page", hooks: "See product page" },
  { size: 250, water: "XL bluewater", floating: "200g", sinking: "—", rings: "See product page", hooks: "BKK 5/0 or 6/0" },
];

export const BUNDLE_TIERS = [
  { qty: 10, pct: 25 },
  { qty: 7, pct: 20 },
  { qty: 5, pct: 15 },
  { qty: 3, pct: 10 },
];

export const FREE_SHIPPING_THRESHOLD = 129;

export const RIGGING_GUIDE = STORE + "/pages/rigging-guide-new";

export const FAQ: { q: string; a: string; link?: { label: string; href: string } }[] = [
  { q: "Floating or sinking — which should I buy?", a: "Floating (Korean pine) works the surface for explosive topwater strikes and can be paused in the strike zone. Sinking (mahogany) gets below the surface with an erratic, skittish action that imitates a fleeing baitfish." },
  { q: "What size do I need?", a: "105mm suits estuary and light work, 125–150mm inshore and inshore reef, 170mm reef and pelagics, 185mm bluewater, 220mm big GT and 250mm XL bluewater. Match the weight to your rod's casting rating — see the size guide." },
  { q: "Why timber instead of plastic?", a: "Every Masters is hand-shaped from solid timber, hand-painted one at a time and built on heavy-duty 2mm through-wire instead of screw eyes, so the hooks stay connected to the wire." },
  { q: "What hooks and split rings do I need?", a: "See the size guide for BKK hook and split-ring sizes per size, or read our", link: { label: "rigging guide", href: RIGGING_GUIDE } },
  { q: "When is the next batch?", a: "Masters are made in small batches. Register below and we'll email you what's in production and when the next batch is available." },
  { q: "What if I'm not happy?", a: "Every order is covered by our 30-day money-back guarantee." },
];

export const RELATED = [
  { name: "Ghost Drops", img: STORE + "/cdn/shop/files/rig-ghost-2-Qd2koGOR.png?v=1787555912&width=800", href: STORE + "/collections/ghost-drops-signature-stickbaits" },
  { name: "Liquidator PRO Jigs", img: STORE + "/cdn/shop/files/Copy_of_1-1_Jigs-2_1.jpg?v=1786765686&width=800", href: STORE + "/collections/jigs" },
  { name: "Bundles", img: STORE + "/cdn/shop/files/mystery_box-2.jpg?v=1771314758&width=800", href: STORE + "/collections/all-bundles" },
  { name: "Rigging guide", img: STORE + "/cdn/shop/files/rig-stickbait-1-ML6vL0t2_1.jpg?v=1787555839&width=800", href: RIGGING_GUIDE },
];

const V = (id: string) => `${STORE}/cdn/shop/videos/c/vp/${id}/${id}.m3u8?v=0`;
export const HERO = {
  video: STORE + "/cdn/shop/videos/c/vp/b58a1e70038743c2aca263098138ea65/b58a1e70038743c2aca263098138ea65.HD-1080p-7.2Mbps-93999858.mp4?v=0",
  poster: STORE + "/cdn/shop/files/preview_images/b58a1e70038743c2aca263098138ea65.thumbnail.0000000000_1920x.jpg?v=1789031058",
};

export type CatchItem = { kind: "video"; src: string } | { kind: "photo"; src: string; caption?: string };
export const CATCHES: CatchItem[] = [
  { kind: "video", src: V("e157077b6d814686a2813aabae24de24") },
  { kind: "photo", src: STORE + "/cdn/shop/files/preview_images/77849a9cc6c643dd8cde8aa2473c27d9.thumbnail.0000000000.jpg?v=1771226129&width=1000", caption: "GT on the 150F Masters" },
  { kind: "video", src: V("ee12b81bf4d642399f4a76b44310ce2d") },
  { kind: "photo", src: STORE + "/cdn/shop/files/Screenshot_2025-11-02_221640_45eee645-c982-44e4-a839-d3317d431c31.png?v=1780048370&width=900" },
  { kind: "video", src: V("183128181efb46efb73802244e171392") },
  { kind: "photo", src: STORE + "/cdn/shop/files/Screenshot_2026-01-28_195530.png?v=1769590544&width=900" },
  { kind: "video", src: V("339c3f4138ce4847ace6f3c529d04973") },
  { kind: "photo", src: STORE + "/cdn/shop/files/Screenshot_2026-01-28_195504.png?v=1771367017&width=900" },
  { kind: "video", src: V("e4632be962324f178c789d442eb71642") },
  { kind: "photo", src: STORE + "/cdn/shop/files/g3_cd3aef85-1b3c-45b3-9006-6cea52043eb2.png?v=1789023936&width=900" },
];
