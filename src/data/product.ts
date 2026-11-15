import { PRODUCTS, variantId as shopifyVariantId, type ColourId } from "@/data/collection";

export const product = {
  id: "masters-floating",
  title: "Masters (Floating)",
  series: "Stickbaits",
  vendor: "Fillet & Release Co.",
  url: "/products/stickbaits-masters-floating",
  options: [
    { name: "Colour", position: 1, values: ["Neon Fury", "Tropic Holo", "Ghost", "Blue Pilchard", "Moon Rock", "Pink Lady"] },
    { name: "Size", position: 2, values: ["105mm", "125mm", "150mm", "170mm", "185mm", "220mm", "250mm"] },
  ],
  colourImages: {
    "Neon Fury": "https://filletandreleaseco.com/cdn/shop/files/FAR-170-neon-fury-3840_7c63d0f0-9552-4745-a409-2716088c622d.png?width=1200",
    "Tropic Holo": "https://filletandreleaseco.com/cdn/shop/files/FAR-170-lime-blue-3840_d33f0f5e-10dd-4dcc-9de2-e65eb04d7f7b.png?width=1200",
    Ghost: "https://filletandreleaseco.com/cdn/shop/files/FAR-170-white-holo-3840_c4d37243-aa08-48c4-a2d5-77a3495090f5.png?width=1200",
    "Blue Pilchard": "https://filletandreleaseco.com/cdn/shop/files/FAR-170-black-blue-3840_cb559b1d-ea61-48be-a940-9a1f47e44dbf.png?width=1200",
    "Moon Rock": "https://filletandreleaseco.com/cdn/shop/files/FAR-170-green-mackerel-3840_1950e13e-41bf-4d93-b109-971a52ee2eb2.png?width=1200",
    "Pink Lady": "https://filletandreleaseco.com/cdn/shop/files/FAR-170-blue-pink-mackerel-3840_6aa62284-5388-4c7d-bbd0-c8c4fbe35021.png?width=1200",
  },
} as const;

export type ColourName = keyof typeof product.colourImages;
export type SizeName = (typeof product.options)[1]["values"][number];

export const sizes = [
  { size: "105mm", mm: 105, weight: "25g", price: 3999, water: "Estuary · light", rings: "#5 or #6", hooks: "BKK #2 or 1/0" },
  { size: "125mm", mm: 125, weight: "40g", price: 4499, water: "Inshore", rings: "#6", hooks: "BKK #1 or 1/0" },
  { size: "150mm", mm: 150, weight: "65g", price: 5499, water: "Inshore reef", rings: "#7", hooks: "BKK 1/0 or 2/0", badge: "Best seller" },
  { size: "170mm", mm: 170, weight: "90g", price: 6299, water: "Reef · pelagics", rings: "#8", hooks: "BKK 2/0 or 3/0" },
  { size: "185mm", mm: 185, weight: "110g", price: 6999, water: "Bluewater", rings: "#8", hooks: "BKK 3/0 or 4/0" },
  { size: "220mm", mm: 220, weight: "155g", price: 7499, water: "Big GT", rings: null, hooks: null, badge: "Big fish" },
  { size: "250mm", mm: 250, weight: "200g", price: 7999, water: "XL bluewater", rings: null, hooks: "BKK 5/0 or 6/0" },
] as const;

export const soldOut: readonly (readonly [ColourName, SizeName])[] = [
  ["Neon Fury", "150mm"], ["Neon Fury", "170mm"], ["Neon Fury", "220mm"],
  ["Tropic Holo", "150mm"],
  ["Ghost", "150mm"], ["Ghost", "185mm"], ["Ghost", "220mm"],
  ["Blue Pilchard", "150mm"], ["Blue Pilchard", "250mm"],
  ["Moon Rock", "220mm"],
  ["Pink Lady", "150mm"], ["Pink Lady", "220mm"], ["Pink Lady", "250mm"],
];

export const bundleTiers = [
  { qty: 3, discount: 0.10 },
  { qty: 5, discount: 0.15, popular: true },
  { qty: 7, discount: 0.20 },
  { qty: 10, discount: 0.25 },
] as const;

export const shop = {
  currency: "AUD",
  currencySymbol: "$",
  freeShippingThreshold: 12900,
  dispatch: "Ships from Brisbane in 1 business day",
  guarantee: "30-day money-back guarantee",
  guaranteeHref: "/policies/refund-policy",
  rating: 4.97,
  reviewCount: 34,
  trust: [
    "100% Korean Pine timber",
    "2mm stainless through-wire",
    "Hand-painted, one at a time",
    "Australian, veteran owned",
  ],
} as const;

const colourIds: Record<ColourName, ColourId> = {
  "Neon Fury": "neon-fury",
  "Tropic Holo": "tropic-holo",
  Ghost: "ghost",
  "Blue Pilchard": "blue-pilchard",
  "Moon Rock": "moon-rock",
  "Pink Lady": "pink-lady",
};

export const colourId = (colour: ColourName): ColourId => colourIds[colour];

export const variants = product.options[0].values.flatMap((colour) =>
  sizes.map((size) => {
    const collectionProduct = PRODUCTS.find((item) => item.id === `masters-${size.mm}f`)!;
    return {
      id: shopifyVariantId(collectionProduct, colourId(colour as ColourName)),
      title: `${colour} / ${size.size}`,
      option1: colour as ColourName,
      option2: size.size,
      price: size.price,
      available: !soldOut.some(([soldColour, soldSize]) => soldColour === colour && soldSize === size.size),
      featured_image: product.colourImages[colour as ColourName],
    };
  }),
);

export const productContent = {
  gallery: {
    badge: "Korean Pine timber",
    captionLead: "Colourway",
    imageAlt: "Masters floating timber stickbait",
    scaleTitle: "True size scale",
    scaleDescription: "All seven lengths, proportional to the 250mm model.",
    previousColour: "Previous colourway",
    nextColour: "Next colourway",
  },
  buy: {
    action: "Floating stickbait",
    reviews: "verified reviews",
    afterpay: "or 4 interest-free payments of",
    colourLabel: "Colourway",
    sizeLabel: "Size",
    sizeHelp: "Which size?",
    soldOut: "Sold out",
    selected: "Selected",
    lowStock: "Only a few left in this colourway",
    inStock: "In stock",
    quantity: "Quantity",
    decreaseQuantity: "Decrease quantity",
    increaseQuantity: "Increase quantity",
    add: "Add to cart",
    buyNow: "Buy it now",
    freeShipping: "Free shipping unlocked",
    addForShipping: "Add {amount} for free shipping",
    shippingProgress: "Free shipping progress",
    riggingTitle: "Rigging for this size",
    riggingDescription: "Recommended terminal tackle for every Masters Floating size.",
    splitRings: "Split rings",
    hooks: "Hooks",
    contact: "Contact us for this size",
    openRigging: "Open size and rigging guide",
    close: "Close",
    previousSize: "Previous size",
    nextSize: "Next size",
    stickyAdd: "Add selected lure to cart",
  },
  sections: {
    bundleEyebrow: "Mix & match",
    bundleTitle: "Bundle and save",
    bundleDescription: "The more Masters you add, the more you save.",
    lures: "lures",
    off: "off",
    each: "each",
    save: "Save",
    popular: "Most popular",
    automatic: "Discount applied automatically in your cart",
    mix: "Mix any sizes and colourways",
    timberEyebrow: "Built differently",
    timberTitle: "Why timber?",
    timberMaster: "Masters",
    timberPlastic: "Mass-made ABS plastic",
    catchesTitle: "Caught on the Masters",
    catchesHandle: "@filletandreleaseco",
    catchesTag: "Tag #filletandrelease to be featured",
    photoPlaceholder: "Customer catch photo",
    videoPlaceholder: "Customer catch video",
    chartEyebrow: "Choose with confidence",
    chartTitle: "Full size and rigging chart",
    chartSize: "Size",
    chartWeight: "Weight",
    chartWater: "Water",
    chartAction: "Select",
    selectSize: "Select {size}",
    actionTitle: "Floating or sinking?",
    actionDescription: "Two actions for different water. The same six colourways and handcrafted timber build.",
    from: "From",
    reviewsEyebrow: "From the water",
    reviewsTitle: "Verified customer reviews",
    reviewPlaceholder: "Review placeholder",
    reviewPending: "Live customer reviews will appear here when connected to the store's reviews app.",
    verified: "Verified buyer",
    questionsTitle: "Questions, answered",
    questionsDescription: "Dispatch, returns, rigging and future batches.",
  },
  timberRows: [
    { label: "Body", masters: "Hand-shaped Korean Pine", plastic: "Moulded ABS" },
    { label: "Hook hold", masters: "Heavy-duty through-wire", plastic: "Screw eyes" },
    { label: "Finish", masters: "Hand-painted one at a time", plastic: "Printed" },
  ],
  benefits: [
    { title: "Explosive surface strikes", text: "A floating timber stickbait stays ready in the strike zone, turning follows into committed surface hits." },
    { title: "You control the action", text: "Sweep, pause or burn it back. Your rod work sets the pace and lets you react to the fish." },
    { title: "Natural timber movement", text: "Hand-shaped Korean Pine gives every Masters a lively, responsive action that plastic cannot reproduce." },
  ],
  catchPlaceholders: [
    { kind: "photo", label: "Catch photo one" },
    { kind: "video", label: "Catch video one" },
    { kind: "photo", label: "Catch photo two" },
    { kind: "photo", label: "Catch photo three" },
    { kind: "video", label: "Catch video two" },
  ],
  actionChoices: [
    { title: "Floating", range: "105–250mm", fromPrice: 3999, description: "Sits in the strike zone on the pause. Work the surface and let the timber rise when you stop.", image: product.colourImages["Tropic Holo"], imageAlt: "Floating Masters timber stickbait", cta: "Shop floating", current: true, href: product.url },
    { title: "Sinking", range: "105–185mm", fromPrice: 3999, description: "Works beneath the surface with an erratic action that imitates a fleeing baitfish.", image: product.colourImages["Blue Pilchard"], imageAlt: "Sinking Masters timber stickbait", cta: "Explore sinking", current: false, href: "https://filletandreleaseco.com/products/floating-stickbaits" },
  ],
  reviews: [
    { name: "Raymond Renton", text: "Extremely happy with my first ever order. Great quality and they cast a mile! Swim action is insane", verified: true, placeholder: false },
    { name: "Customer review", text: "", verified: false, placeholder: true },
    { name: "Customer review", text: "", verified: false, placeholder: true },
  ],
  questions: [
    { q: "When will my order ship?", a: shop.dispatch + "." },
    { q: "What if the lure is not right for me?", a: "Every order is covered by our 30-day money-back guarantee. Read the refund policy for the full terms." },
    { q: "What hooks and split rings should I use?", a: "Use the full size and rigging chart above to match BKK hooks and split rings to your lure. For sizes without a published recommendation, contact us before rigging." },
    { q: "When do sold-out colourways return?", a: "Masters are made in small batches, so return timing varies by colour and size. Contact us to ask about the next planned batch." },
  ],
} as const;

export const productContact = {
  email: "filletandrelease@outlook.com.au",
  href: "https://filletandreleaseco.com/pages/contact-us",
};
