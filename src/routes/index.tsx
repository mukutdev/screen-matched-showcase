import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { BEST_SELLER_EXTERNAL, BEST_SELLER_PRODUCT, HOME_HERO } from "@/data/home";
import type { Product } from "@/data/collection";
import type { CartLine } from "@/lib/cart";
import { track } from "@/lib/track";
import { ProductCard } from "@/components/collection/ProductCard";
import { QuickAdd } from "@/components/collection/QuickAdd";
import { CartDrawer } from "@/components/collection/CartDrawer";
import {
  CatchGrid,
  CategoryTiles,
  EmailBand,
  ExternalCard,
  Founder,
  HomeFaq,
  HomeHero,
  LureFinder,
  OfferLadder,
  Reviews,
  StickyCta,
  WhyFar,
} from "@/components/home/HomeSections";

const TITLE = "Handcrafted Timber Fishing Lures | Fillet & Release Co. (FAR)";
const DESC = "Handmade timber fishing lures from Australia.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: HOME_HERO.poster },
      { name: "twitter:image", content: HOME_HERO.poster },
    ],
  }),
  component: HomePage,
});

const h2 = "text-[26px] font-semibold leading-tight tracking-[-0.01em] md:text-[32px]";

function HomePage() {
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
  const openQuick = (p: Product, el: HTMLElement) => setQuick({ p, el });

  // section targets + sticky mobile CTA visibility
  const heroRef = useRef<HTMLDivElement>(null);
  const bestRef = useRef<HTMLDivElement>(null);
  const finderRef = useRef<HTMLDivElement>(null);
  const [pastHero, setPastHero] = useState(false);
  useEffect(() => {
    const onScroll = () => setPastHero((heroRef.current?.getBoundingClientRect().bottom ?? 1) < 0);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toBest = () => bestRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  const toFinder = () => finderRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <>
      <div ref={heroRef}>
        <HomeHero onShop={toBest} onFind={toFinder} />
      </div>

      <main className="mx-auto max-w-[1320px] px-4 md:px-6">
        {/* 2. Best sellers — the money row, right under the hero */}
        <section ref={bestRef} className="scroll-mt-4 pt-10 md:pt-14" aria-labelledby="bs">
          <div className="flex items-baseline justify-between gap-4">
            <h2 id="bs" className={h2}>Best sellers</h2>
            <a href="/masters" className="min-h-11 text-sm font-medium text-primary underline-offset-4 hover:underline">Shop all →</a>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 md:gap-6 lg:grid-cols-4">
            <ProductCard
              product={BEST_SELLER_PRODUCT}
              eager
              onQuickAdd={(p, el) => {
                track("bestseller_quick_add", { product: p.id });
                openQuick(p, el);
              }}
            />
            {BEST_SELLER_EXTERNAL.map((item) => (
              <ExternalCard key={item.name} item={item} eager />
            ))}
          </div>
        </section>
      </main>

      {/* 3. Offer ladder */}
      <div className="mt-14 md:mt-20">
        <OfferLadder />
      </div>

      <main className="mx-auto max-w-[1320px] px-4 md:px-6">
        {/* 4. Lure finder */}
        <section ref={finderRef} className="mt-14 scroll-mt-4 md:mt-24" aria-labelledby="lf">
          <h2 id="lf" className={h2}>Not sure which lure? Answer 3 questions.</h2>
          <div className="mt-6">
            <LureFinder onQuickAdd={openQuick} />
          </div>
        </section>

        {/* 5. Shoppable catches */}
        <section className="mt-14 md:mt-24" aria-labelledby="cg">
          <h2 id="cg" className={h2}>Caught on FAR</h2>
          <CatchGrid />
        </section>

        {/* 6. Reviews */}
        <section className="mt-14 md:mt-24" aria-labelledby="rv">
          <h2 id="rv" className="sr-only">Reviews</h2>
          <Reviews onQuickAdd={openQuick} />
        </section>

        {/* 7. Why FAR */}
        <section className="mt-14 md:mt-24">
          <WhyFar />
        </section>

        {/* 8. Founder */}
        <section className="mt-14 md:mt-24" aria-label="About the founder">
          <Founder />
        </section>

        {/* 9. Category tiles */}
        <section className="mt-14 md:mt-24" aria-labelledby="ct">
          <h2 id="ct" className={h2}>Shop by category</h2>
          <CategoryTiles />
        </section>

        {/* 10. FAQ */}
        <section className="mt-14 grid gap-6 md:mt-24 md:grid-cols-[1fr_1.6fr] md:gap-16" aria-labelledby="faq">
          <div>
            <h2 id="faq" className={h2}>The last questions</h2>
            <p className="mt-3 text-muted-foreground">Shipping, returns, rigging and where our lures are made.</p>
          </div>
          <HomeFaq />
        </section>
      </main>

      {/* 11. Email capture */}
      <EmailBand />

      <StickyCta visible={pastHero && !cartOpen && !quick} onFind={toFinder} onShop={toBest} />
      <QuickAdd product={quick?.p ?? null} trigger={quick?.el ?? null} cartQty={cartQty} onClose={() => setQuick(null)} onAdd={addLine} />
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} lines={lines} onRemove={(k) => setLines((p) => p.filter((l) => l.key !== k))} />
    </>
  );
}
