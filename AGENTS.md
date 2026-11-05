<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture
- All collection/product data lives in src/data/collection.ts; filter and cart rules are pure functions in src/lib — keeps the prototype portable to Shopify Liquid and testable.
- `/` is the conversion-first home page; the Masters collection lives at `/masters`. Home store merchandise uses normalized live-catalog snapshots and StoreQuickAdd; finder Masters use the existing QuickAdd, with one shared CartDrawer.
- Analytics events go through src/lib/track.ts (window.dataLayer push) — add new events there, never ad-hoc gtag calls.
- Use Embla for the centered catch carousel, with active-slide state pausing inactive videos — keeps touch navigation reliable and prevents simultaneous playback.
- Home product, photo and review rows use Carousel's native scroll-snap track; keep the Masters video coverflow separate because its playback and focus behavior differ.
- Responsive home layouts use shrinkable grid tracks and a content-sized hero with reserved header space so carousels cannot widen the page or clip the headline.
- Store merchandise snapshots and collection data are browser-safe static data; never invent stock, reviews or catch-to-product associations when public data is unavailable.
- Cart lines identify variants and explicitly mark non-Masters merchandise as ineligible for the Masters mix-and-match discount to avoid discounting apparel and pre-bundled products.
