# Fillet & Release Co. — Masters Stickbaits collection page

Build the brief exactly as written, at `/` (replacing the placeholder). Single page, no header/footer, no backend.

## Sections (top to bottom)
1. Breadcrumb, H1 + subline, proof line (wraps on mobile), kept compact so the first card row fits on 390x844.
2. Control row: All / Floating (7) / Sinking (5) toggle, water chips with live counts, "Colour & sort" button. Horizontal scroll on mobile with last chip cut off.
3. Active filter chips, Clear all, aria-live "Showing N lures".
4. Product grid: 13 cards (7F, 5S, GEN II last), 2/3/4 columns, "Bundle & save" tile at position 7 (hidden under 6 results).
5. Floating vs sinking columns with filter-and-scroll buttons.
6. Size guide table.
7. Customer catch strip (5 portrait video placeholders).
8. FAQ accordion (5 Qs, "[Jason to confirm]").
9. About Masters copy + 4 related collection tiles.
10. Email capture (client-side only, toast confirmation).

## Behaviour
- Cards: 4:3 SVG lure image (length scales with size, tinted per colour), desktop hover crossfade to in-water image, swatch hover swaps colour, one badge by priority, 44px "+" quick add, card link toasts "Would open product page: …".
- Filters: OR within group, AND across; zero-result options disabled; "In stock only" switch; colour filter swaps card images; 4 sort modes; state synced to URL with Shopify-style params and restored on load.
- Mobile sticky 48px bar (hide on scroll down, show on up) with toggle + "Filter & sort (n)"; panel is a bottom sheet with sticky "Show N lures" on mobile, popover on desktop.
- Quick add: bottom sheet/dialog, large named swatches, sold-out "Notify me" inline email, qty stepper, "Add to cart · $X", bundle nudge.
- Cart drawer: line items, free-shipping progress to $129, bundle tier discount (3/5/7/10 = 10/15/20/25%), subtotal, disabled Checkout. React state only.
- Accessibility: 44px targets, focus rings, aria-pressed chips, focus-trapped sheets with Esc/swipe close, named swatches, reserved image space, reduced-motion support.

## Visual
Warm off-white, near-black text, one muted accent (deep eucalyptus green) for primary actions/active states. Source Sans 3 (successor to Source Sans Pro) via Google Fonts link. Flat, 8px radius, 8px spacing scale.

## Technical details
- `src/data/collection.ts`: colours, products, sold-out map, water bands, bundle tiers, FAQ — all data in one file.
- `src/lib/filters.ts` (pure filter/sort/count/URL encode-decode) and `src/lib/cart.ts` (bundle tier, shipping math) with vitest tests for bundle tiers, free-shipping remaining, sold-out logic, and filter counts.
- Components under `src/components/collection/`: ProductCard, LureImage (SVG), FilterBar, FilterPanel, StickyBar, QuickAdd, CartDrawer, sections.
- Use shadcn-style Sheet/Dialog/Popover/Accordion/Switch (Radix) and sonner for toasts; mount Toaster in root.
- Design tokens in `src/styles.css`; route head() with page-specific title/description.
