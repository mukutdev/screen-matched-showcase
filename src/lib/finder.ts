import { PRODUCTS, WATER_BANDS, bandForSize, type Action, type Product, type WaterBand } from "@/data/collection";

export type WeightBand = "light" | "medium" | "heavy";
export interface FinderAnswers {
  water: WaterBand;
  action: Action;
  weight: WeightBand;
}

/** Rod/casting weight windows from the brief: light 25–50g, medium 65–115g, heavy 110–200g. */
const RANGE: Record<WeightBand, [number, number]> = {
  light: [25, 50],
  medium: [65, 115],
  heavy: [110, 200],
};

export interface FinderResult {
  pick: Product;
  why: string;
  secondary: Product | null;
}

/**
 * Maps the 3 answers to one Masters lure. PRODUCTS is size-ascending per action,
 * so the first match is the smallest size that fits the water band and weight window;
 * if no size fits the weight window, fall back to the smallest size for the water.
 */
export function recommend(a: FinderAnswers): FinderResult {
  const inWater = PRODUCTS.filter((p) => p.line === "masters" && p.action === a.action && bandForSize(p.size) === a.water);
  const [lo, hi] = RANGE[a.weight];
  const inWeight = inWater.filter((p) => {
    const w = p.variants[0]!.weight;
    return w >= lo && w <= hi;
  });
  const pool = inWeight.length ? inWeight : inWater;
  const pick = pool[0]!;
  const secondary =
    pool.find((p) => p.id !== pick.id) ??
    PRODUCTS.find((p) => p.line === "masters" && p.action !== a.action && bandForSize(p.size) === a.water) ??
    null;
  const waterLabel = WATER_BANDS.find((b) => b.id === a.water)!.label.toLowerCase();
  const why = `${pick.name} — ${pick.size}mm · ${pick.variants[0]!.weight}g · ${a.action === "floating" ? "Floating" : "Sinking"} · built for ${waterLabel}.`;
  return { pick, why, secondary };
}

const KEY = "far-finder";

export function saveAnswers(a: FinderAnswers) {
  try {
    localStorage.setItem(KEY, JSON.stringify(a));
  } catch {
    /* private mode */
  }
}

export function loadAnswers(): FinderAnswers | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const a = JSON.parse(raw) as FinderAnswers;
    return a.water && a.action && a.weight ? a : null;
  } catch {
    return null;
  }
}
