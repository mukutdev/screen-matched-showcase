import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { HOME_HERO } from "@/data/home";
import type { Product } from "@/data/collection";
import type { CartLine } from "@/lib/cart";
import { canAddDirect, STORE_ROWS, storeLine, type StoreProduct } from "@/lib/store";
import { track } from "@/lib/track";
import { QuickAdd } from "@/components/collection/QuickAdd";
import { CartDrawer } from "@/components/collection/CartDrawer";
import { Carousel } from "@/components/home/Carousel";
import { StoreProductCard, StoreQuickAdd } from "@/components/home/StoreProductCard";
import { StoreHeader, StoreFooter } from "@/components/home/StoreChrome";
import { HomeCatches, HomeReviews } from "@/components/home/HomeMedia";
import { CategoryTiles, EmailBand, Founder, HomeFaq, HomeHero, LureFinder, OfferLadder, StickyCta, WhyFar } from "@/components/home/HomeSections";

const TITLE = "Handcrafted Timber Fishing Lures | Fillet & Release Co. (FAR)";
const DESC = "Shop handcrafted timber stickbaits, Ghost Drops, jigging bundles and fishing apparel. Veteran owned and tested on Australian water.";
export const Route = createFileRoute("/")({ head: () => ({ meta: [
  { title: TITLE }, { name: "description", content: DESC }, { property: "og:title", content: TITLE }, { property: "og:description", content: DESC }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
] }), component: HomePage });

function HomePage() {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [quick, setQuick] = useState<{ p: Product; el: HTMLElement } | null>(null);
  const [storeQuick, setStoreQuick] = useState<{ p: StoreProduct; el: HTMLElement } | null>(null);
  const [added, setAdded] = useState<string | null>(null);
  const cartQty = lines.reduce((n, l) => n + l.qty, 0);
  const addLine = (line: Omit<CartLine, "key">) => {
    const key = String(line.variantId);
    setLines((prev) => prev.some((l) => l.key === key) ? prev.map((l) => l.key === key ? { ...l, qty: l.qty + line.qty } : l) : [...prev, { ...line, key }]);
    setQuick(null); setStoreQuick(null);
    setTimeout(() => setCartOpen(true), 150);
  };
  const openQuick = (p: Product, el: HTMLElement) => setQuick({ p, el });
  const openStoreQuick = (p: StoreProduct, el: HTMLElement) => {
    track("bestseller_quick_add", { product: p.id });
    const variant = p.variants[0];
    if (canAddDirect(p) && variant) {
      setAdded(p.id); addLine(storeLine(p, variant)); setTimeout(() => setAdded(null), 1300);
    } else setStoreQuick({ p, el });
  };
  const heroRef = useRef<HTMLDivElement>(null);
  const bestRef = useRef<HTMLElement>(null);
  const finderRef = useRef<HTMLElement>(null);
  const [pastHero, setPastHero] = useState(false);
  useEffect(() => {
    const scroll = () => setPastHero((heroRef.current?.getBoundingClientRect().bottom ?? 1) < 0);
    scroll(); window.addEventListener("scroll", scroll, { passive: true });
    return () => window.removeEventListener("scroll", scroll);
  }, []);
  const scrollTo = (el: HTMLElement | null) => el?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  const toBest = () => scrollTo(bestRef.current);
  const toFinder = () => scrollTo(finderRef.current);
  const row = (key: "best" | "ghost" | "bundles" | "apparel", title: string, href: string, subhead?: string) => <Carousel label={title} title={title} href={href} subhead={subhead} linkLabel={`Shop all ${key === "best" ? "" : key === "ghost" ? "Ghost Drops " : key + " "}→`}>
    {STORE_ROWS[key].map((p, i) => <StoreProductCard key={p.id} product={p} eager={key === "best" && i < 4} added={added === p.id} onQuickAdd={openStoreQuick} />)}
  </Carousel>;
  return <>
    <StoreHeader qty={cartQty} onCart={() => setCartOpen(true)} onFind={toFinder} onBest={toBest} onOverlayChange={setOverlayOpen} onQuickAdd={openStoreQuick} />
    <div ref={heroRef}><HomeHero onShop={toBest} onFind={toFinder} /></div>
    <main>
      <section ref={bestRef} id="best-sellers" className="page-width home-section first-section">{row("best", "Best sellers", "https://filletandreleaseco.com/collections/best-sellers-1")}</section>
      <div className="home-section"><OfferLadder /></div>
      <section className="page-width home-section">{row("ghost", "Ghost Drops", "https://filletandreleaseco.com/collections/ghost-drops-signature-stickbaits", "60–135mm timber stickbaits for estuary and light work.")}</section>
      <section ref={finderRef} id="finder" className="home-section surface-section"><div className="page-width"><h2 className="section-title">Not sure which lure? Answer 3 questions.</h2><div className="mt-6"><LureFinder onQuickAdd={openQuick} /></div></div></section>
      <section className="page-width home-section"><HomeCatches onQuickAdd={openQuick} /></section>
      <section className="home-section surface-section" aria-label="Customer reviews"><div className="page-width"><HomeReviews onQuickAdd={openQuick} /></div></section>
      <section className="page-width home-section">{row("bundles", "Bundles — save up to 30%", "https://filletandreleaseco.com/collections/all-bundles")}</section>
      <section className="page-width home-section"><WhyFar /></section>
      <section className="home-section surface-section"><div className="page-width">{row("apparel", "Apparel", "https://filletandreleaseco.com/collections/jerseys", "Fishing jerseys, long sleeves, beanies and caps.")}</div></section>
      <section className="page-width home-section" aria-label="About the founder"><Founder /></section>
      <section className="page-width home-section"><h2 className="section-title">Shop by category</h2><CategoryTiles /></section>
      <section id="faq" className="page-width home-section grid gap-6 md:grid-cols-[1fr_1.6fr] md:gap-16"><div><h2 className="section-title">The last questions</h2><p className="mt-3 text-muted-foreground">Shipping, returns, rigging and where our lures are made.</p></div><HomeFaq /></section>
      <EmailBand />
    </main>
    <StoreFooter />
    <StickyCta visible={pastHero && !cartOpen && !quick && !storeQuick && !overlayOpen} onFind={toFinder} onShop={toBest} />
    <QuickAdd product={quick?.p ?? null} trigger={quick?.el ?? null} cartQty={cartQty} onClose={() => setQuick(null)} onAdd={addLine} />
    <StoreQuickAdd product={storeQuick?.p ?? null} trigger={storeQuick?.el ?? null} onClose={() => setStoreQuick(null)} onAdd={addLine} />
    <CartDrawer open={cartOpen} onOpenChange={setCartOpen} lines={lines} onRemove={(key) => setLines((prev) => prev.filter((line) => line.key !== key))} onQuantityChange={(key, qty) => setLines((prev) => qty <= 0 ? prev.filter((line) => line.key !== key) : prev.map((line) => line.key === key ? { ...line, qty } : line))} onUpsell={(p, el) => { setCartOpen(false); openStoreQuick(p, el); }} />
  </>;
}
