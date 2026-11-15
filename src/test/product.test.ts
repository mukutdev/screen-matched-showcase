import { describe, expect, it } from "vitest";
import { bundleTiers, shop, sizes, soldOut, variants } from "@/data/product";
import { availableCountForSize, bundleQuote, getVariant, nearestAvailableSize, shippingProgress, validSelection } from "@/lib/product";

describe("Masters Floating product variants", () => {
  it("generates all 42 colour and size combinations with 13 sold out", () => {
    expect(variants).toHaveLength(42);
    expect(variants.filter((variant) => !variant.available)).toHaveLength(13);
    expect(soldOut).toHaveLength(13);
  });

  it("moves a sold-out colour request to the nearest available size", () => {
    expect(nearestAvailableSize("Neon Fury", "150mm")).toBe("125mm");
    expect(nearestAvailableSize("Pink Lady", "250mm")).toBe("220mm");
    expect(nearestAvailableSize("Ghost", "105mm")).toBe("105mm");
  });

  it("derives low-stock warnings from actual combinations remaining", () => {
    expect(availableCountForSize("150mm")).toBe(1);
    expect(availableCountForSize("220mm")).toBe(2);
    expect(availableCountForSize("105mm")).toBe(6);
  });

  it("keeps size and colour as the variant intersection", () => {
    const variant = getVariant("Moon Rock", "185mm");
    expect(variant.option1).toBe("Moon Rock");
    expect(variant.option2).toBe("185mm");
    expect(variant.price).toBe(6999);
    expect(variant.available).toBe(true);
  });

  it("repairs unavailable URL selections", () => {
    expect(validSelection("Neon Fury", "220mm")).toEqual({ colour: "Neon Fury", size: "185mm" });
    expect(validSelection("invalid", "invalid")).toEqual({ colour: "Neon Fury", size: "105mm" });
  });
});

describe("Masters Floating pricing", () => {
  it("derives the five-lure tier from the selected 150mm price", () => {
    const tier = bundleTiers.find((item) => item.qty === 5)!;
    const quote = bundleQuote(sizes.find((size) => size.size === "150mm")!.price, tier);
    expect(quote.unitCents).toBe(4674);
    expect(quote.savingCents).toBe(4124);
  });

  it("recomputes savings when the size changes", () => {
    const tier = bundleTiers[0];
    expect(bundleQuote(3999, tier).savingCents).toBe(1200);
    expect(bundleQuote(7999, tier).savingCents).toBe(2400);
  });

  it("unlocks free shipping at exactly $129", () => {
    expect(shippingProgress(shop.freeShippingThreshold - 1)).toMatchObject({ unlocked: false, remainingCents: 1 });
    expect(shippingProgress(shop.freeShippingThreshold)).toMatchObject({ unlocked: true, remainingCents: 0, percent: 100 });
  });
});
