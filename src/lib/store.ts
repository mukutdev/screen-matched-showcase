import snapshot from "@/data/store-snapshot.json";
import { defaultColour, img, photoFor, variantId, type Product } from "@/data/collection";
import type { CartLine } from "@/lib/cart";

export interface StoreVariant { id: number; title: string; price: number; available: boolean; options: string[]; compareAt: number }
export interface StoreProduct { id: string; name: string; price: number; image: string; url: string; category: string; spec: string; options: { name: string; values: string[] }[]; variants: StoreVariant[] }
export const STORE_ROWS: Record<"best" | "ghost" | "bundles" | "apparel" | "addons", StoreProduct[]> = snapshot;
export const ALL_STORE_PRODUCTS = Object.values(STORE_ROWS).flat().filter((p, i, all) => all.findIndex((x) => x.id === p.id) === i);
export const COLLECTION_COUNTS = snapshot.collectionCounts;
export const OPTIMIZED_POSTER = snapshot.poster;
export function canAddDirect(p: StoreProduct) { return p.options.length === 0 && p.variants.length === 1 && p.variants[0]?.available === true; }
export function matchingVariant(p: StoreProduct, selected: string[]) { return p.variants.find((v) => selected.every((value, index) => v.options[index] === value)); }
export function storeLine(p: StoreProduct, v: StoreVariant, qty = 1): Omit<CartLine, "key"> {
  return { productId: p.id, name: p.name, colour: "ghost", colourName: v.title === "Default Title" ? "" : v.title, spec: p.category === "apparel" ? "Apparel" : "", price: v.price, qty, variantId: v.id, image: p.image, bundleEligible: false };
}
export function mastersStoreProduct(p: Product): StoreProduct {
  const colour = defaultColour(p);
  const live = ALL_STORE_PRODUCTS.find((x) => x.url.includes(p.action === "floating" ? "stickbaits-masters-floating" : "floating-stickbaits"));
  return { id: p.id, name: p.name, price: p.variants[0]?.price ?? 0, image: img(photoFor(p, colour), 600), url: live?.url ?? "https://filletandreleaseco.com/collections/new-stick-bait-masters", category: "masters", spec: `${p.size}mm`, options: [], variants: [{ id: variantId(p, colour), title: colour, price: p.variants[0]?.price ?? 0, available: true, options: [], compareAt: 0 }] };
}