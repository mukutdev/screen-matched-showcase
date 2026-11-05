import { useState } from "react";
import { ArrowLeft, ArrowRight, Plus, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Carousel } from "./Carousel";
import { Stars } from "./HomeSections";
import { CATCH_PHOTOS, INSTAGRAM, RATING, REVIEWS } from "@/data/home";
import { PRODUCTS, defaultColour, img, photoFor, type Product } from "@/data/collection";
import { money } from "@/lib/cart";

export function HomeCatches({ onQuickAdd }: { onQuickAdd: (p: Product, el: HTMLElement) => void }) {
  const [active, setActive] = useState<number | null>(null);
  const move = (delta: number) => setActive((n) => n === null ? null : (n + delta + CATCH_PHOTOS.length) % CATCH_PHOTOS.length);
  return <>
    <Carousel label="Caught on FAR" title="Caught on FAR" kind="catches" href={INSTAGRAM} linkLabel="Follow FAR ↗">
      {CATCH_PHOTOS.map((photo, i) => <figure key={photo.src} className="home-catch relative aspect-[4/5] overflow-hidden rounded-lg bg-frame">
        <Button variant="ghost" className="h-full w-full p-0" aria-label={`Open ${photo.species} catch photo ${i + 1}`} onClick={() => setActive(i)}><img src={photo.src} alt={`${photo.species} caught by a FAR angler`} loading="lazy" width={900} height={1125} className="h-full w-full object-cover" /></Button>
        <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-background/75 px-3 py-1 text-[13px] font-medium">{photo.species}</span>
        {photo.productId && (() => { const p = PRODUCTS.find((item) => item.id === photo.productId); return p ? <figcaption className="catch-shop-overlay"><p className="mb-3 text-sm">Caught on {p.name}</p><Button onClick={(e) => onQuickAdd(p, e.currentTarget)}>Shop it <Plus /></Button></figcaption> : null; })()}
      </figure>)}
      <a href={INSTAGRAM} className="flex aspect-[4/5] flex-col items-center justify-center rounded-lg border border-border bg-card px-5 text-center"><p className="text-xl font-semibold">Your next catch.</p><p className="mt-4 text-primary">Tag @filletandreleaseco<br />to get featured ↗</p></a>
    </Carousel>
    <Dialog open={active !== null} onOpenChange={(open) => { if (!open) setActive(null); }}><DialogContent className="max-w-3xl bg-background p-3" onKeyDown={(e) => { if (e.key === "ArrowRight") { e.preventDefault(); move(1); } if (e.key === "ArrowLeft") { e.preventDefault(); move(-1); } }}><DialogTitle className="sr-only">FAR catch photos</DialogTitle><DialogDescription className="sr-only">Customer catches</DialogDescription>
      {active !== null && <div className="overflow-x-auto" onTouchStart={(e) => { e.currentTarget.dataset['touchStart'] = String(e.touches[0]?.clientX ?? 0); }} onTouchEnd={(e) => { const delta = (e.changedTouches[0]?.clientX ?? 0) - Number(e.currentTarget.dataset['touchStart']); if (Math.abs(delta) > 40) move(delta < 0 ? 1 : -1); }}><img src={CATCH_PHOTOS[active]?.src} alt={CATCH_PHOTOS[active]?.species} className="max-h-[70vh] w-full object-contain" /></div>}
      <div className="flex items-center justify-between"><Button variant="outline" size="icon" aria-label="Previous catch photo" onClick={() => move(-1)}><ArrowLeft /></Button><p className="text-sm" aria-live="polite">{active === null ? "" : `${active + 1} / ${CATCH_PHOTOS.length} · ${CATCH_PHOTOS[active]?.species}`}</p><Button variant="outline" size="icon" aria-label="Next catch photo" onClick={() => move(1)}><ArrowRight /></Button></div>
    </DialogContent></Dialog>
  </>;
}

export function HomeReviews({ onQuickAdd }: { onQuickAdd: (p: Product, el: HTMLElement) => void }) {
  return <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12"><div className="min-w-0"><p className="text-6xl font-bold">{RATING.score}</p><Stars n={5} className="mt-3 h-5 w-5" /><p className="mt-3 text-sm text-muted-foreground">Based on {RATING.count} verified reviews</p></div><Carousel label="Customer reviews" title="From the water" kind="reviews">{REVIEWS.map((r) => <ReviewCard key={r.name + r.quote} review={r} onQuickAdd={onQuickAdd} />)}</Carousel></div>;
}
function ReviewCard({ review: r, onQuickAdd }: { review: typeof REVIEWS[number]; onQuickAdd: (p: Product, el: HTMLElement) => void }) {
  const [expanded, setExpanded] = useState(false);
  const p = PRODUCTS.find((item) => item.id === r.productId);
  return <blockquote className="flex min-w-0 flex-col rounded-lg border border-border bg-background p-5">{r.sample && <p className="mb-3 text-[13px] font-medium text-muted-foreground">Sample · not customer feedback</p>}<Stars n={r.stars} /><p className={`mt-4 text-base leading-relaxed ${expanded ? "" : "line-clamp-4"}`}>“{r.quote}”</p><Button variant="link" className="mt-1 w-fit px-0 text-[13px]" aria-expanded={expanded} onClick={() => setExpanded(!expanded)}>{expanded ? "Read less" : "Read more"}</Button><footer className="mt-3 text-sm">{r.name}<span className="mt-1 block text-[13px] text-muted-foreground">{r.sample ? "Illustrative copy" : "Verified buyer"}</span></footer>{p && <div className="mt-auto grid grid-cols-[48px_minmax(0,1fr)_40px] items-center gap-3 border-t border-border pt-4"><img src={img(photoFor(p, defaultColour(p)), 200)} alt="" loading="lazy" className="h-12 w-12 rounded bg-frame object-contain" /><div className="min-w-0 text-[13px]"><p className="font-medium">{p.name}</p><p className="mt-1 text-primary">{money(p.variants[0]?.price ?? 0)}</p></div><Button size="icon" className="h-10 w-10 rounded-full" aria-label={`Quick add ${p.name} from review`} onClick={(e) => onQuickAdd(p, e.currentTarget)}><Plus /></Button></div>}</blockquote>;
}