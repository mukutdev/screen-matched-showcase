import { createFileRoute } from "@tanstack/react-router";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { Play } from "lucide-react";
import { toast } from "sonner";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FAQ, RELATED, SIZE_GUIDE, type Product } from "@/data/collection";
import { apply, DEFAULT_STATE, fromSearch, toSearch, type FilterState } from "@/lib/filters";
import type { CartLine } from "@/lib/cart";
import { ProductCard } from "@/components/collection/ProductCard";
import { ActiveChips, ControlRow, StickyBar } from "@/components/collection/Filters";
import { QuickAdd } from "@/components/collection/QuickAdd";
import { CartDrawer } from "@/components/collection/CartDrawer";

const TITLE = "Masters Timber Stickbaits — Fillet & Release Co.";
const DESC = "Hand-painted timber stickbaits, through-wire built. 105–250mm, floating or sinking. Australian, veteran owned.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CollectionPage,
});

function CollectionPage() {
  const [s, setS] = useState<FilterState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);
  const set = (patch: Partial<FilterState>) => setS((p) => ({ ...p, ...patch }));
  const results = useMemo(() => apply(s), [s]);

  useEffect(() => {
    setS(fromSearch(window.location.search));
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (hydrated) window.history.replaceState(null, "", window.location.pathname + toSearch(s));
  }, [s, hydrated]);

  // sticky bar: show after scrolling past control row, hide on scroll down
  const controlRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [barVisible, setBarVisible] = useState(false);
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const past = (controlRef.current?.getBoundingClientRect().bottom ?? 0) < 0;
      setBarVisible(past && y < last);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // cart
  const [lines, setLines] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [quick, setQuick] = useState<{ p: Product; el: HTMLElement } | null>(null);
  const cartQty = lines.reduce((n, l) => n + l.qty, 0);
  const addLine = (l: Omit<CartLine, "key">) => {
    const key = `${l.productId}-${l.colour}-${l.spec}`;
    setLines((prev) => {
      const ex = prev.find((x) => x.key === key);
      return ex ? prev.map((x) => (x.key === key ? { ...x, qty: x.qty + l.qty } : x)) : [...prev, { ...l, key }];
    });
    setQuick(null);
    setTimeout(() => setCartOpen(true), 150);
  };

  const pickAction = (a: "floating" | "sinking") => {
    set({ action: a });
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const preferred = s.colours[0];
  const showBundle = results.length >= 6;

  return (
    <main className="mx-auto max-w-[1320px] px-4 pb-16 pt-3 md:px-6">
      <StickyBar s={s} set={set} resultCount={results.length} visible={barVisible} />

      <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
        <ol className="flex gap-1">
          <li><a href="#" className="hover:underline">Home</a> /</li>
          <li><a href="#" className="hover:underline">Lures</a> /</li>
          <li aria-current="page" className="text-foreground">Masters Stickbaits</li>
        </ol>
      </nav>
      <h1 className="mt-1 text-2xl font-bold leading-tight md:text-4xl">Masters Timber Stickbaits</h1>
      <p className="mt-0.5 text-sm md:text-base">Hand-painted timber, through-wire built. 105–250mm, floating or sinking.</p>
      <p className="mt-1 text-xs text-muted-foreground md:text-sm">
        <span className="text-foreground">★ 4.96</span> · 65 verified reviews · Free shipping over $129 · 30-day money back · Veteran owned
      </p>

      <div ref={controlRef} className="mt-3">
        <ControlRow s={s} set={set} resultCount={results.length} />
        <ActiveChips s={s} set={set} count={results.length} />
      </div>

      <div ref={gridRef} className="scroll-mt-16 mt-3 grid grid-cols-2 gap-x-3 gap-y-6 md:grid-cols-3 min-[1200px]:grid-cols-4 md:gap-x-5">
        {results.map((p, i) => (
          <Fragment key={p.id}>
            {i === 6 && showBundle && <BundleTile />}
            <ProductCard product={p} preferredColour={preferred} onQuickAdd={(prod, el) => setQuick({ p: prod, el })} />
          </Fragment>
        ))}
        {results.length === 6 && showBundle && <BundleTile />}
        {results.length === 0 && <p className="col-span-full py-8 text-center text-muted-foreground">No lures match. Try clearing a filter.</p>}
      </div>

      <section className="mt-16" aria-labelledby="fs">
        <h2 id="fs" className="text-xl font-bold md:text-2xl">Floating or sinking?</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 md:gap-6">
          {([
            ["floating", "Floating", "Works the surface with a walk-the-dog action. Best in calm to moderate water."],
            ["sinking", "Sinking", "Gets below the surface and holds in wind and chop."],
          ] as const).map(([id, t, d]) => (
            <div key={id} className="flex flex-col rounded-lg border border-border bg-card p-4">
              <h3 className="font-bold">{t}</h3>
              <p className="mt-1 flex-1 text-sm">{d}</p>
              <button type="button" onClick={() => pickAction(id)} className="mt-3 min-h-11 rounded-lg bg-primary px-3 text-sm font-semibold text-primary-foreground">
                Shop {t.toLowerCase()}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16" aria-labelledby="sg">
        <h2 id="sg" className="text-xl font-bold md:text-2xl">Size guide</h2>
        <div className="mt-4 overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="bg-muted">
              <tr>{["Size", "Floating weight", "Sinking weight", "Water", "Hook"].map((h) => <th key={h} className="px-3 py-2 font-semibold">{h}</th>)}</tr>
            </thead>
            <tbody>
              {SIZE_GUIDE.map((r) => (
                <tr key={r.size} className="border-t border-border">
                  <td className="px-3 py-2 font-semibold">{r.size}mm</td>
                  <td className="px-3 py-2">{r.floating ? `${r.floating}g` : "—"}</td>
                  <td className="px-3 py-2">{r.sinking ? `${r.sinking}g` : "—"}</td>
                  <td className="px-3 py-2">{r.water}</td>
                  <td className="px-3 py-2">{r.hook}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-16" aria-labelledby="cc">
        <h2 id="cc" className="text-xl font-bold md:text-2xl">Customer catches</h2>
        <div className="-mx-4 mt-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 no-scrollbar md:mx-0 md:px-0">
          {Array.from({ length: 5 }).map((_, i) => (
            <button key={i} type="button" aria-label={`Play customer catch video ${i + 1}`} className="relative aspect-[9/16] w-40 shrink-0 snap-start overflow-hidden rounded-lg bg-water md:w-52">
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-background/90"><Play className="h-5 w-5 text-foreground" /></span>
              </span>
              <span className="absolute bottom-2 left-2 text-sm font-semibold text-primary-foreground">Customer catch</span>
            </button>
          ))}
        </div>
      </section>

      <section className="mt-16 max-w-3xl" aria-labelledby="faq">
        <h2 id="faq" className="text-xl font-bold md:text-2xl">FAQ</h2>
        <Accordion type="single" collapsible className="mt-2">
          {FAQ.map((f, i) => (
            <AccordionItem key={i} value={`q${i}`}>
              <AccordionTrigger className="min-h-11 text-left text-base">{f.q}</AccordionTrigger>
              <AccordionContent className="text-sm">
                {f.a}
                {f.link && <> <a href={f.link.href} className="font-semibold text-primary underline">{f.link.label}</a></>}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="mt-16 max-w-3xl space-y-3 text-sm leading-relaxed">
        <h2 className="text-lg font-bold">About Masters stickbaits</h2>
        <p>
          Every Masters stickbait starts as a raw timber blank, shaped, sealed and hand-painted in small batches in Australia. Floating
          models are cut from Korean pine for a lively surface swim; sinking models use dense mahogany to cut through wind and chop.
          Each lure is through-wired from tow point to tail so the hooks stay connected even if a fish smashes the body.
        </p>
        <h2 className="text-lg font-bold">Built for Australian water</h2>
        <p>
          From 105mm estuary sizes for flathead and tailor to 250mm bluewater models for giant trevally and tuna, the range covers
          every style of casting. Sizes are matched to proven hook ranges, and every batch is swim-tested before it ships. Fillet &
          Release Co. is veteran owned and stands behind every lure with a 30-day money-back guarantee.
        </p>
      </section>

      <section className="mt-10" aria-labelledby="rel">
        <h2 id="rel" className="text-xl font-bold md:text-2xl">Related collections</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          {RELATED.map((r) => (
            <a key={r} href="#" className="flex min-h-24 items-end rounded-lg border border-border bg-card p-4 font-semibold hover:bg-accent">{r}</a>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-lg bg-accent p-6 md:p-10" aria-labelledby="em">
        <h2 id="em" className="text-xl font-bold md:text-2xl">Get notified when the next batch lands</h2>
        <form
          className="mt-4 flex max-w-lg gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            toast("Thanks — you're on the list.");
            e.currentTarget.reset();
          }}
        >
          <label htmlFor="email" className="sr-only">Email</label>
          <input id="email" type="email" required placeholder="you@email.com" className="min-h-12 min-w-0 flex-1 rounded-lg border border-input bg-card px-3" />
          <button className="min-h-12 rounded-lg bg-primary px-5 font-semibold text-primary-foreground">Join</button>
        </form>
      </section>

      <QuickAdd product={quick?.p ?? null} trigger={quick?.el ?? null} cartQty={cartQty} onClose={() => setQuick(null)} onAdd={addLine} />
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} lines={lines} onRemove={(k) => setLines((p) => p.filter((l) => l.key !== k))} />
    </main>
  );
}

function BundleTile() {
  return (
    <div className="flex flex-col justify-center rounded-lg border border-primary/30 bg-accent p-4 text-accent-foreground">
      <p className="text-lg font-bold">Bundle & save</p>
      <p className="mt-1 text-sm">Mix any sizes & colours.</p>
      <ul className="mt-2 space-y-0.5 text-sm font-semibold">
        <li>3 lures 10% off</li>
        <li>5 lures 15%</li>
        <li>7 lures 20%</li>
        <li>10 lures 25%</li>
      </ul>
    </div>
  );
}
