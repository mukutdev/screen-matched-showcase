import { PRODUCTS, bandForSize, type Action, type ColourId, type Product, type WaterBand } from "@/data/collection";

export type SortMode = "size" | "price-asc" | "price-desc" | "best";

export interface FilterState {
  action: Action | "all";
  water: WaterBand[];
  colours: ColourId[];
  inStock: boolean;
  sort: SortMode;
}

export const DEFAULT_STATE: FilterState = { action: "all", water: [], colours: [], inStock: false, sort: "size" };

const minPrice = (p: Product) => Math.min(...p.variants.map((v) => v.price));

export function matches(p: Product, s: FilterState): boolean {
  if (s.action !== "all" && (p.line === "gen2" || p.action !== s.action)) return false;
  if (s.water.length && !s.water.includes(bandForSize(p.size))) return false;
  if (s.colours.length) {
    const ok = s.colours.some(
      (c) => p.colours.includes(c) && (!s.inStock || !p.soldOut.includes(c)),
    );
    if (!ok) return false;
  } else if (s.inStock && p.colours.every((c) => p.soldOut.includes(c))) {
    return false;
  }
  return true;
}

export function sortProducts(list: Product[], sort: SortMode): Product[] {
  const base = (a: Product, b: Product) => {
    if ((a.line === "gen2") !== (b.line === "gen2")) return a.line === "gen2" ? 1 : -1;
    if (a.size !== b.size) return a.size - b.size;
    return a.action === b.action ? 0 : a.action === "floating" ? -1 : 1;
  };
  const out = [...list];
  if (sort === "size") out.sort(base);
  if (sort === "price-asc") out.sort((a, b) => minPrice(a) - minPrice(b) || base(a, b));
  if (sort === "price-desc") out.sort((a, b) => minPrice(b) - minPrice(a) || base(a, b));
  if (sort === "best") out.sort((a, b) => Number(!!b.bestSeller) - Number(!!a.bestSeller) || base(a, b));
  return out;
}

export function apply(s: FilterState, products = PRODUCTS) {
  return sortProducts(products.filter((p) => matches(p, s)), s.sort);
}

/** count of results if `patch` were applied (used for live option counts) */
export function countWith(s: FilterState, patch: Partial<FilterState>) {
  return PRODUCTS.filter((p) => matches(p, { ...s, ...patch })).length;
}

/** count for adding a single option to an OR group: evaluate the group as only that option */
export function optionCount<K extends "water" | "colours">(s: FilterState, key: K, value: FilterState[K][number]) {
  return countWith(s, { [key]: [value] } as Partial<FilterState>);
}

const P = {
  action: "filter.p.m.custom.action",
  water: "filter.p.m.custom.water",
  colour: "filter.v.option.colour",
  stock: "filter.v.availability",
  sort: "sort_by",
};
const SORT_PARAM: Record<SortMode, string> = {
  size: "manual",
  "price-asc": "price-ascending",
  "price-desc": "price-descending",
  best: "best-selling",
};

export function toSearch(s: FilterState): string {
  const q = new URLSearchParams();
  if (s.action !== "all") q.set(P.action, s.action);
  s.water.forEach((w) => q.append(P.water, w));
  s.colours.forEach((c) => q.append(P.colour, c));
  if (s.inStock) q.set(P.stock, "1");
  if (s.sort !== "size") q.set(P.sort, SORT_PARAM[s.sort]);
  const str = q.toString();
  return str ? `?${str}` : "";
}

export function fromSearch(search: string): FilterState {
  const q = new URLSearchParams(search);
  const action = q.get(P.action);
  const sortEntry = Object.entries(SORT_PARAM).find(([, v]) => v === q.get(P.sort));
  return {
    action: action === "floating" || action === "sinking" ? action : "all",
    water: q.getAll(P.water).filter((w): w is WaterBand => ["estuary", "inshore", "reef", "bluewater"].includes(w)),
    colours: q.getAll(P.colour) as ColourId[],
    inStock: q.get(P.stock) === "1",
    sort: (sortEntry?.[0] as SortMode) ?? "size",
  };
}
