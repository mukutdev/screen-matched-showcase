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
- `/` is the conversion-first home page (src/components/home/HomeSections.tsx); the Masters collection lives at `/masters`. Home reuses the collection's ProductCard, QuickAdd and CartDrawer so cart behaviour is identical across pages.
- Analytics events go through src/lib/track.ts (window.dataLayer push) — add new events there, never ad-hoc gtag calls.
- Use Embla for the centered catch carousel, with active-slide state pausing inactive videos — keeps touch navigation reliable and prevents simultaneous playback.
