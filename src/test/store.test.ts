import { describe, expect, it } from "vitest";
import { canAddDirect, matchingVariant, STORE_ROWS, storeLine } from "@/lib/store";
import { cartTotals } from "@/lib/cart";

describe("Round-two shopping rules", () => {
  it("each product appears in only one home merchandise row", () => {
    const ids = ["best", "ghost", "bundles", "apparel"].flatMap((key) => STORE_ROWS[key as "best"].map((p) => p.id));
    expect(new Set(ids).size).toBe(ids.length);
  });
  it("Reef Day Jigging Bundle adds directly without a variant sheet", () => {
    const bundle = STORE_ROWS.best.find((p) => p.name === "Reef Day Jigging Bundle (10x Jigs)");
    expect(bundle).toBeDefined();
    if (!bundle) return;
    expect(canAddDirect(bundle)).toBe(true);
  });
  it("jerseys require size and colour choices", () => {
    const jersey = STORE_ROWS.best.find((p) => p.name === "Crew Neck Fishing Jersey - Maori Sea Perch");
    expect(jersey).toBeDefined();
    if (!jersey) return;
    expect(canAddDirect(jersey)).toBe(false);
    expect(matchingVariant(jersey, ["Black", "S"])?.available).toBe(true);
    expect(matchingVariant(jersey, ["Blue", "S"])?.available).toBe(false);
    expect(jersey.options.find((o) => o.name === "Size")?.values).toContain("3XL");
  });
  it("free shipping at $129 progresses to a $175 free jig pack", () => {
    const line = { key: "test", productId: "test", name: "", colour: "ghost" as const, colourName: "", spec: "", price: 129, qty: 1, variantId: 1, image: "", bundleEligible: false };
    expect(cartTotals([line]).toFree).toBe(0);
    expect(cartTotals([line]).toGift).toBe(46);
    expect(cartTotals([{ ...line, price: 175 }]).toGift).toBe(0);
  });
  it("apparel and pre-discounted bundles don't count toward the Masters bundle discount", () => {
    const p = STORE_ROWS.best[0];
    expect(p).toBeDefined();
    const v = p?.variants[0];
    if (!p || !v) return;
    expect(cartTotals([{ ...storeLine(p, v, 3), key: "test" }]).discount).toBe(0);
  });
});