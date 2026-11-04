// Home page data. Product/collection data stays in collection.ts; this is home-only content.
import { COLOURS, PRODUCTS, STORE, img, type Product } from "./collection";
import catchPhotos from "./catch-photos.json";
import { OPTIMIZED_POSTER } from "@/lib/store";

const CDN = "https://cdn.shopify.com/s/files/1/0590/7657/5306/files/";

export const HOME_HERO = {
  video: STORE + "/cdn/shop/videos/c/vp/c73c9012992f4063ac09787c18cc904a/c73c9012992f4063ac09787c18cc904a.HD-1080p-7.2Mbps-46403998.mp4",
  poster: OPTIMIZED_POSTER,
};

/** One review figure everywhere on the site (matches the collection page). */
export const RATING = { score: 4.96, count: 65 };

export interface ExternalProduct {
  name: string;
  spec: string;
  price: number;
  photo: string;
  href: string;
}

/** The one Masters lure in the best-seller row — gets the real quick-add sheet. */
export const BEST_SELLER_PRODUCT: Product = PRODUCTS.find((p) => p.id === "masters-150f")!;

/** Other best sellers, linked straight to their store product pages. */
export const BEST_SELLER_EXTERNAL: ExternalProduct[] = [
  {
    name: "Ghost Drop — Footballer Trout",
    spec: "Artist Series · 120mm · Sinking",
    price: 41.99,
    photo: CDN + "Ghost_Drops-13.jpg?v=1781084391",
    href: STORE + "/products/ghost-drop-artist-series-footballer-trout",
  },
  {
    name: "Artist Series Bundle",
    spec: "3 × 120mm Ghost Drops",
    price: 166.25,
    photo: CDN + "ARTIST_SERIES_BUNDLE_1.png?v=1770758302",
    href: STORE + "/products/artist-series-120mm-bundle",
  },
  {
    name: "Reef Day Jigging Bundle",
    spec: "10 × Liquidator PRO jigs",
    price: 149.99,
    photo: CDN + "jig_bundle_10pack.jpg?v=1786141809",
    href: STORE + "/products/new-jig-bundle",
  },
];

export const OFFER_LADDER = [
  { icon: "truck", label: "Free shipping at $129" },
  { icon: "gift", label: "Free $50 jig pack at $175" },
  { icon: "layers", label: "Mix 3+ lures, save up to 25%" },
] as const;

export interface CatchPhoto {
  src: string;
  species: string;
  productId?: string;
}

export const CATCH_PHOTOS: CatchPhoto[] = catchPhotos;

export const INSTAGRAM = "https://www.instagram.com/filletandreleaseco";

export interface Review {
  stars: number;
  quote: string;
  name: string;
  productId: string;
  sample?: boolean;
}

/** Real reviews from the store — add more as they're approved. */
export const REVIEWS: Review[] = [
  {
    stars: 5,
    quote: "Had an absolute session on the Silver Herring. Rig however you like and they still swim amazing.",
    name: "Jack F.",
    productId: "masters-150f",
  },
  {
    stars: 5,
    quote: "A compact timber stickbait for the lighter outfit. The 105F would be my pick for working the edges on an estuary morning.",
    name: "Sample review",
    productId: "masters-105f",
    sample: true,
  },
  {
    stars: 5,
    quote: "For an inshore session, I'd reach for the 125F. A handy middle size when I want to keep the presentation compact without going too light.",
    name: "Sample review",
    productId: "masters-125f",
    sample: true,
  },
  {
    stars: 5,
    quote: "The 170S would be my choice for a reef outfit when I want a sinking presentation. A larger timber lure to round out the tackle tray.",
    name: "Sample review",
    productId: "masters-170s",
    sample: true,
  },
];

export const WHY_IMG = CDN + "g3_cd3aef85-1b3c-45b3-9006-6cea52043eb2.png";

export const FOUNDER = {
  text: "Veteran owned & operated. FAR was started by Jaison Greer, an Aussie veteran who turned carving lures into a new purpose after six years' service.",
  href: STORE + "/pages/about-us",
};

export interface CategoryTile {
  name: string;
  line: string;
  href: string;
  internal?: boolean;
  photo: string;
}

export const CATEGORIES: CategoryTile[] = [
  { name: "Masters Stickbaits", line: "105–250mm · floating or sinking", href: "/masters", internal: true, photo: img(COLOURS[0]!.photo, 800) },
  { name: "Ghost Drops", line: "60–135mm · Originals · Moonlight · Artist Series", href: STORE + "/collections/ghost-drops-signature-stickbaits", photo: CDN + "Ghost_Drops-14.jpg?v=1781257568&width=800" },
  { name: "Liquidator PRO Jigs", line: "75–120g mid/slow pitch", href: STORE + "/collections/jigs", photo: CDN + "Bundles-3_1.jpg?v=1771388242&width=800" },
  { name: "Bundles", line: "Save up to 30%", href: STORE + "/collections/all-bundles", photo: CDN + "mystery_box-2.jpg?v=1771314758&width=800" },
  { name: "Apparel", line: "Jerseys, long sleeves, beanies & caps", href: STORE + "/collections/jerseys", photo: CDN + "1_948d3589-e04b-4f0e-b060-546b32a1f9b8.png?v=1779960235&width=800" },
];

export const HOME_FAQ: { q: string; a: string; link?: { label: string; href: string } }[] = [
  { q: "How fast is shipping?", a: "Orders are packed and dispatched within 1–2 business days, with tracked delivery Australia-wide. Orders over $129 ship free." },
  { q: "What if I'm not happy?", a: "Every order is covered by our 30-day money-back guarantee. Fish it for 30 days — if you're not happy, you get your money back." },
  { q: "Do they come rigged, and what hooks do I need?", a: "Lures ship unrigged so you can rig to your target species. The size guide lists BKK hook and split-ring sizes per lure, or read our", link: { label: "rigging guide", href: STORE + "/pages/rigging-guide-new" } },
  { q: "Timber or plastic — and where are they made?", a: "Every lure is hand-shaped from sustainably sourced mahogany or Korean pine, crafted with Indonesian artisans and finished and QC'd to FAR standards. Designed and tested in Australia; veteran owned & operated." },
];
