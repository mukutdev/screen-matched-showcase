import { createFileRoute } from "@tanstack/react-router";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, Check, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CATCHES, COLOURS, FAQ, HERO, RELATED, SIZE_GUIDE, img, type Product } from "@/data/collection";
import { apply, DEFAULT_STATE, fromSearch, toSearch, type FilterState } from "@/lib/filters";
import type { CartLine } from "@/lib/cart";
import { ProductCard } from "@/components/collection/ProductCard";
import { ActiveChips, ControlRow, StickyBar } from "@/components/collection/Filters";
import { QuickAdd } from "@/components/collection/QuickAdd";
import { CartDrawer } from "@/components/collection/CartDrawer";
import { Catches, Hero, RelatedTile } from "@/components/collection/Sections";

const TITLE = "Masters Timber Stickbaits — Fillet & Release Co.";
const DESC = "Hand-shaped, hand-painted timber stickbaits on 2mm through-wire. Seven sizes, 105–250mm, floating or sinking. Veteran owned.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: HERO.poster },
      { name: "twitter:image", content: HERO.poster },
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

  const toGrid = () => controlRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  const pickAction = (a: "floating" | "sinking") => {
    set({ action: a, size: null });
    toGrid();
  };
  const pickSize = (size: number) => {
    set({ size, water: [] });
    toGrid();
  };
  const [joined, setJoined] = useState(false);

  const preferred = s.colours[0];
  const showBundle = results.length >= 6;
  const tropic = img(COLOURS[0]!.photo, 1200);
  const pilchard = img(COLOURS[3]!.photo, 1200);
  const h2 = "text-[26px] font-semibold leading-tight tracking-[-0.01em] md:text-[32px]";

  return (
    <>
      <StickyBar s={s} set={set} resultCount={results.length} visible={barVisible} />
      <Hero onShop={toGrid} onSize={() => document.getElementById("size-guide")?.scrollIntoView({ behavior: "smooth" })} />

      <main className="mx-auto max-w-[1320px] px-4 pb-0 md:px-6">
        <div ref={controlRef} className="scroll-mt-4 pt-5">
          <ControlRow s={s} set={set} resultCount={results.length} />
          <ActiveChips s={s} set={set} count={results.length} />
        </div>

        <div ref={gridRef} className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {results.map((p, i) => (
            <Fragment key={p.id}>
              {i === 6 && showBundle && <BundleTile photo={tropic} />}
              <ProductCard product={p} eager={i < 4} preferredColour={preferred} onQuickAdd={(prod, el) => setQuick({ p: prod, el })} />
            </Fragment>
          ))}
          {results.length === 6 && showBundle && <BundleTile photo={tropic} />}
          {results.length === 0 && <p className="col-span-full py-10 text-center text-muted-foreground">No lures match these filters. Try clearing one.</p>}
        </div>

        <section className="mt-24" aria-labelledby="fs">
          <p className="eyebrow text-muted-foreground">Choose your action</p>
          <h2 id="fs" className={`${h2} mt-2`}>Floating or sinking?</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 md:gap-6">
            {([
              ["floating", "Floating", "Korean pine. Works the surface. Work it fast when fish are fired up, slow it down when they're hesitant, or pause it and let the floating timber sit in the strike zone.", tropic, 7],
              ["sinking", "Sinking", "Mahogany. Erratic, skittish sub-surface action that imitates a fleeing or wounded baitfish.", pilchard, 5],
            ] as const).map(([id, t, d, bg, n]) => (
              <div key={id} className="relative flex min-h-[420px] flex-col justify-end overflow-hidden rounded-xl border border-border bg-frame p-6 md:min-h-[520px] md:p-8">
                <img src={bg} alt={`Masters ${t.toLowerCase()} stickbait`} loading="lazy" className="absolute inset-x-0 top-0 h-[70%] w-full object-contain p-[8%]" />
                <div className="absolute inset-0" style={{ background: "var(--hero-overlay)" }} />
                <div className="relative max-w-md">
                  <h3 className="text-2xl font-semibold">{t}</h3>
                  <p className="mt-2 text-foreground/85">{d}</p>
                  <button type="button" onClick={() => pickAction(id)} className="mt-5 min-h-12 rounded-full bg-primary px-6 font-medium text-primary-foreground hover:bg-primary/90">
                    Shop {t.toLowerCase()} ({n})
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="size-guide" className="mt-24 scroll-mt-6" aria-labelledby="sg">
          <p className="eyebrow text-muted-foreground">Seven sizes</p>
          <h2 id="sg" className={`${h2} mt-2`}>Size guide</h2>
          <div className="mt-6 hidden overflow-hidden rounded-xl border border-border md:block">
            <table className="w-full text-left text-[15px]">
              <thead className="bg-card">
                <tr>
                  {["Size", "Water", "Floating weight", "Sinking weight", "Split rings", "Hooks", ""].map((h, i) => (
                    <th key={i} className="eyebrow px-4 py-3 text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SIZE_GUIDE.map((r) => (
                  <tr key={r.size} className="border-t border-border transition-colors duration-150 hover:bg-card">
                    <td className="px-4 py-3 font-semibold">{r.size}mm</td>
                    <td className="px-4 py-3">{r.water}</td>
                    <td className="px-4 py-3">{r.floating}</td>
                    <td className="px-4 py-3">{r.sinking}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.rings}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.hooks}</td>
                    <td className="px-4 py-1 text-right">
                      <button type="button" onClick={() => pickSize(r.size)} className="min-h-11 rounded-full px-4 font-medium text-primary underline-offset-4 hover:underline">
                        Shop {r.size}mm
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="mt-6 space-y-3 md:hidden">
            {SIZE_GUIDE.map((r) => (
              <li key={r.size} className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold">{r.size}mm <span className="text-sm font-normal text-muted-foreground">· {r.water}</span></p>
                  <button type="button" onClick={() => pickSize(r.size)} className="min-h-11 rounded-full border border-input px-4 text-sm font-medium">Shop</button>
                </div>
                <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                  <dt className="text-muted-foreground">Floating</dt><dd>{r.floating}</dd>
                  <dt className="text-muted-foreground">Sinking</dt><dd>{r.sinking}</dd>
                  <dt className="text-muted-foreground">Split rings</dt><dd>{r.rings}</dd>
                  <dt className="text-muted-foreground">Hooks</dt><dd>{r.hooks}</dd>
                </dl>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-24" aria-labelledby="tp">
          <h2 id="tp" className={h2}>Timber vs plastic</h2>
          <div className="mt-6 grid grid-cols-[1fr_1.3fr_1.3fr] overflow-hidden rounded-xl border border-border text-sm md:text-base">
            <div className="p-4" />
            <div className="border-x border-primary/50 bg-primary/10 p-4 font-semibold text-primary">Fillet &amp; Release Masters</div>
            <div className="p-4 font-semibold text-muted-foreground">Typical plastic</div>
            {[
              ["Body", "Hand-shaped timber", "Moulded ABS"],
              ["Hook hold", "Heavy-duty through-wire", "Screw eyes"],
              ["Finish", "Hand-painted, one at a time", "Printed"],
            ].map(([k, a, b], i, arr) => (
              <Fragment key={k}>
                <div className="border-t border-border p-4 text-muted-foreground">{k}</div>
                <div className={`flex items-start gap-2 border-x border-t border-primary/50 border-t-border bg-primary/10 p-4 ${i === arr.length - 1 ? "border-b-0" : ""}`}>
                  <Check className="mt-1 h-4 w-4 shrink-0 text-primary" /> {a}
                </div>
                <div className="border-t border-border p-4 text-muted-foreground">{b}</div>
              </Fragment>
            ))}
          </div>
        </section>

        <section className="mt-24" aria-labelledby="cc">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <h2 id="cc" className={h2}>Caught on the Masters</h2>
            <p className="text-sm text-muted-foreground"><span className="text-primary">★ 4.96</span> from 65 verified reviews</p>
          </div>
          <Catches items={CATCHES} />
        </section>

        <section className="mt-24 grid gap-6 md:grid-cols-[1fr_1.6fr] md:gap-16" aria-labelledby="faq">
          <div>
            <h2 id="faq" className={h2}>Questions, answered</h2>
            <p className="mt-3 text-muted-foreground">Choosing between floating and sinking, picking a size and rigging it right.</p>
          </div>
          <Accordion type="single" collapsible>
            {FAQ.map((f, i) => (
              <AccordionItem key={i} value={`q${i}`} className="border-border">
                <AccordionTrigger className="min-h-14 text-left text-base font-medium hover:no-underline">{f.q}</AccordionTrigger>
                <AccordionContent className="text-[15px] leading-relaxed text-foreground/85">
                  {f.a}
                  {f.link && <> <a href={f.link.href} className="font-medium text-primary underline underline-offset-4">{f.link.label}</a>.</>}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        <section className="mt-24" aria-labelledby="rel">
          <h2 id="rel" className={h2}>Keep exploring</h2>
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-6">
            {RELATED.map((r) => <RelatedTile key={r.name} {...r} />)}
          </div>
        </section>
      </main>

      <section className="mt-24 border-y border-border bg-card" aria-labelledby="em">
        <div className="mx-auto grid max-w-[1320px] items-center gap-10 px-4 py-14 md:grid-cols-[1.1fr_1fr] md:gap-16 md:px-6 md:py-20">
          <div>
            <div className="mb-5 flex items-center gap-3 text-primary"><Mail className="h-5 w-5" /><p className="eyebrow">Next batch · Masters series</p></div>
            <h2 id="em" className="max-w-lg text-[32px] font-semibold leading-tight md:text-[40px]">Get notified when<br className="hidden md:block" /> the next batch lands.</h2>
            <p className="mt-4 max-w-md text-muted-foreground">Register your interest — we'll email you what's in production and when the next batch is available.</p>
          </div>
          <div className="border-t border-border pt-8 md:border-l md:border-t-0 md:pl-12 md:pt-0">
            {joined ? (
              <div role="status" className="flex min-h-36 items-start gap-4 py-5"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-success/10 text-success"><Check className="h-5 w-5" /></span><div><p className="text-xl font-medium">You're on the list.</p><p className="mt-2 text-muted-foreground">We'll be in touch when the next batch is ready.</p></div></div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setJoined(true); }}>
                <label htmlFor="email" className="mb-3 block text-sm font-medium">Email address</label>
                <Input id="email" name="email" type="email" autoComplete="email" required placeholder="you@email.com" className="h-14 rounded-lg bg-background px-4 text-base md:text-base" />
                <Button type="submit" className="mt-3 h-14 w-full justify-between rounded-lg px-5 text-base shadow-none">Get notified <ArrowUpRight /></Button>
              </form>
            )}
            <p className="mt-4 text-[13px] text-muted-foreground">No spam. Unsubscribe any time.</p>
          </div>
        </div>
      </section>

      <QuickAdd product={quick?.p ?? null} trigger={quick?.el ?? null} cartQty={cartQty} onClose={() => setQuick(null)} onAdd={addLine} />
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} lines={lines} onRemove={(k) => setLines((p) => p.filter((l) => l.key !== k))} />
    </>
  );
}

function BundleTile({ photo }: { photo: string }) {
  return (
    <div className="relative flex flex-col justify-center overflow-hidden rounded-xl border border-primary/50 bg-card p-5">
      <img src={photo} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-contain p-[8%] opacity-15" />
      <div className="relative">
        <p className="eyebrow text-primary">Mix &amp; match</p>
        <p className="mt-1 text-xl font-semibold">Bundle &amp; save</p>
        <p className="mt-1 text-sm text-muted-foreground">Mix any sizes &amp; colours</p>
        <ul className="mt-4 divide-y divide-border text-sm">
          {[[3, "10% off"], [5, "15%"], [7, "20%"], [10, "25%"]].map(([q, pct]) => (
            <li key={q} className="flex justify-between py-1.5"><span>{q} lures</span><span className="font-semibold text-primary">{pct}</span></li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">Discount applied automatically in cart</p>
      </div>
    </div>
  );
}
