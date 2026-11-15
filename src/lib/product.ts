import { bundleTiers, product, shop, sizes, variants, type ColourName, type SizeName } from "@/data/product";

export const colours = product.options[0].values as readonly ColourName[];
export const sizeNames = product.options[1].values as readonly SizeName[];

export function getSize(size: SizeName) {
  return sizes.find((item) => item.size === size)!;
}

export function getVariant(colour: ColourName, size: SizeName) {
  return variants.find((variant) => variant.option1 === colour && variant.option2 === size)!;
}

export function isAvailable(colour: ColourName, size: SizeName) {
  return getVariant(colour, size).available;
}

export function nearestAvailableSize(colour: ColourName, requested: SizeName): SizeName {
  if (isAvailable(colour, requested)) return requested;
  const requestedIndex = sizeNames.indexOf(requested);
  return [...sizeNames]
    .sort((a, b) => {
      const distance = Math.abs(sizeNames.indexOf(a) - requestedIndex) - Math.abs(sizeNames.indexOf(b) - requestedIndex);
      return distance || sizeNames.indexOf(a) - sizeNames.indexOf(b);
    })
    .find((size) => isAvailable(colour, size))!;
}

export function availableCountForSize(size: SizeName) {
  return colours.filter((colour) => isAvailable(colour, size)).length;
}

export function bundleQuote(price: number, tier: (typeof bundleTiers)[number]) {
  return {
    unitCents: Math.round(price * (1 - tier.discount)),
    savingCents: Math.round(price * tier.qty * tier.discount),
  };
}

export function shippingProgress(subtotalCents: number) {
  const remainingCents = Math.max(0, shop.freeShippingThreshold - subtotalCents);
  return {
    remainingCents,
    unlocked: remainingCents === 0,
    percent: Math.min(100, Math.max(0, (subtotalCents / shop.freeShippingThreshold) * 100)),
  };
}

export function moneyFromCents(cents: number) {
  return `${shop.currencySymbol}${(cents / 100).toFixed(2)}`;
}

export function validColour(value: unknown): ColourName {
  return colours.includes(value as ColourName) ? (value as ColourName) : colours[0]!;
}

export function validSize(value: unknown): SizeName {
  return sizeNames.includes(value as SizeName) ? (value as SizeName) : sizeNames[0];
}

export function validSelection(colourValue: unknown, sizeValue: unknown) {
  const colour = validColour(colourValue);
  return { colour, size: nearestAvailableSize(colour, validSize(sizeValue)) };
}
