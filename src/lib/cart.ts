import { BUNDLE_TIERS, FREE_SHIPPING_THRESHOLD, type ColourId } from "@/data/collection";

export interface CartLine {
  key: string;
  productId: string;
  name: string;
  colour: ColourId;
  colourName: string;
  spec: string;
  price: number;
  qty: number;
  variantId: number;
  image: string;
}

export function bundlePct(totalQty: number): number {
  return BUNDLE_TIERS.find((t) => totalQty >= t.qty)?.pct ?? 0;
}

export function nextTier(totalQty: number) {
  const asc = [...BUNDLE_TIERS].reverse();
  const t = asc.find((x) => x.qty > totalQty);
  return t ? { more: t.qty - totalQty, pct: t.pct } : null;
}

export function cartTotals(lines: CartLine[]) {
  const qty = lines.reduce((s, l) => s + l.qty, 0);
  const gross = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const pct = bundlePct(qty);
  const discount = Math.round(gross * pct) / 100;
  const subtotal = Math.round((gross - discount) * 100) / 100;
  const toFree = Math.max(0, Math.round((FREE_SHIPPING_THRESHOLD - subtotal) * 100) / 100);
  return { qty, gross, pct, discount, subtotal, toFree };
}

export const money = (n: number) => `$${n.toFixed(2)}`;

/** Shopify cart permalink: /cart/<variantId>:<qty>,... */
export function cartPermalink(lines: Pick<CartLine, "variantId" | "qty">[]): string {
  const qty = new Map<number, number>();
  lines.forEach((l) => qty.set(l.variantId, (qty.get(l.variantId) ?? 0) + l.qty));
  return `https://filletandreleaseco.com/cart/${[...qty].map(([v, q]) => `${v}:${q}`).join(",")}`;
}
