import { describe, expect, it } from "vitest";
import { apply, DEFAULT_STATE, fromSearch, toSearch } from "@/lib/filters";
import { bundlePct, cartTotals, nextTier } from "@/lib/cart";

describe("collection rules", () => {
  it("shows 13 cards by default with GEN II last", () => {
    const r = apply(DEFAULT_STATE);
    expect(r).toHaveLength(13);
    expect(r[12]?.id).toBe("gen2-pink-lady");
    expect(r[0]?.id).toBe("masters-105f");
    expect(r[1]?.id).toBe("masters-105s");
  });
  it("action filter counts: 7 floating masters, 5 sinking", () => {
    expect(apply({ ...DEFAULT_STATE, action: "sinking" })).toHaveLength(5);
    expect(apply({ ...DEFAULT_STATE, action: "floating" })).toHaveLength(7);
  });
  it("Bluewater band is 185, 220, 250", () => {
    const sizes = apply({ ...DEFAULT_STATE, water: ["bluewater"], action: "floating" }).map((p) => p.size);
    expect(sizes).toEqual([185, 220, 250]);
  });
  it("colour filter hides sold-out cards only with in-stock on", () => {
    const s = { ...DEFAULT_STATE, colours: ["blue-pilchard" as const], action: "sinking" as const };
    expect(apply(s).some((p) => p.id === "masters-125s")).toBe(true);
    expect(apply({ ...s, inStock: true }).some((p) => p.id === "masters-125s")).toBe(false);
  });
  it("round-trips URL state", () => {
    const s = { ...DEFAULT_STATE, action: "floating" as const, water: ["inshore" as const], sort: "price-desc" as const };
    expect(fromSearch(toSearch(s))).toEqual(s);
  });
  it("bundle tiers: 3=10%, 5=15%, 7=20%, 10=25%", () => {
    expect(bundlePct(2)).toBe(0);
    expect(bundlePct(3)).toBe(10);
    expect(bundlePct(5)).toBe(15);
    expect(bundlePct(7)).toBe(20);
    expect(bundlePct(10)).toBe(25);
    expect(nextTier(1)).toEqual({ more: 2, pct: 10 });
  });
  it("free shipping remaining from $129", () => {
    const t = cartTotals([{ key: "a", productId: "x", name: "", colour: "ghost", colourName: "", spec: "", price: 54.99, qty: 1 }]);
    expect(t.toFree).toBe(74.01);
  });
});
