import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, Check, Gift, Layers, Mail, Pause, Play, ShieldCheck, Star, Truck, Fish, Trees, Waves, X } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BEST_SELLER_EXTERNAL,
  CATCH_PHOTOS,
  CATEGORIES,
  FOUNDER,
  HOME_FAQ,
  HOME_HERO,
  INSTAGRAM,
  OFFER_LADDER,
  RATING,
  REVIEWS,
  WHY_IMG,
  type ExternalProduct,
} from "@/data/home";
import { PRODUCTS, STORE, WATER_BANDS, defaultColour, img, photoFor, productUrl, type Action, type Product, type WaterBand } from "@/data/collection";
import { money } from "@/lib/cart";
import { DEFAULT_STATE, toSearch } from "@/lib/filters";
import { loadAnswers, recommend, saveAnswers, type FinderAnswers, type WeightBand } from "@/lib/finder";
import { track } from "@/lib/track";
import { SafeImg } from "@/components/collection/Media";
import founderAsset from "@/assets/jaison-greer.webp.asset.json";
import { COLLECTION_COUNTS } from "@/lib/store";
import { priceLabel, specLine } from "@/components/collection/ProductCard";

const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function Stars({ n, className = "h-4 w-4" }: { n: number; className?: string }) {
  return (
    <span className="flex gap-0.5 text-primary" role="img" aria-label={`Rated ${n} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => <Star key={i} className={className} fill={i < n ? "currentColor" : "none"} />)}
    </span>
  );
}

/* ---------------- 1. Hero ---------------- */

export function HomeHero({ onShop, onFind }: { onShop: () => void; onFind: () => void }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  // Poster shows instantly; the video only loads once the page is interactive.
  useEffect(() => {
    if (reducedMotion()) return undefined;
    const onLoad = () => setShowVideo(true);
    if (document.readyState === "complete") {
      onLoad();
      return undefined;
    }
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) void v.play();
    else v.pause();
  };

  return (
    <section className="home-hero relative flex flex-col justify-end overflow-hidden">
      <img src={HOME_HERO.poster} alt="" className="absolute inset-0 h-full w-full object-cover" fetchPriority="high" />
      {showVideo && (
        <video
          ref={ref}
          src={HOME_HERO.video}
          poster={HOME_HERO.poster}
          muted
          autoPlay
          loop
          playsInline
          preload="metadata"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden
        />
      )}
      <div className="absolute inset-0" style={{ background: "var(--hero-overlay)" }} />

      <div className="home-hero-content relative mx-auto w-full max-w-[1320px] px-4 md:px-6">
        <div className="max-w-[640px]">
          <p className="eyebrow text-primary">Fuel the passion</p>
          <h1 className="mt-2 text-[34px] font-bold leading-[1.05] tracking-normal md:text-[56px]">
            Handcrafted timber stickbaits
          </h1>
          <p className="mt-3 text-base text-foreground/85">
            Hand-shaped, hand-painted, stainless through-wire. Veteran-owned and tested on Australian water.
          </p>
          <div className="hero-actions mt-5 grid gap-3 sm:flex sm:flex-wrap">
            <Button
              type="button"
              onClick={() => {
                track("hero_cta_click", { cta: "shop_best_sellers" });
                onShop();
              }}
              className="h-12 rounded-full bg-primary px-4 font-medium text-primary-foreground transition-colors duration-150 hover:bg-primary/90 md:px-6"
            >
              Shop best sellers
            </Button>
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                track("hero_cta_click", { cta: "find_my_lure" });
                onFind();
              }}
              className="min-h-12 rounded-full border border-foreground/40 bg-transparent text-foreground px-4 text-sm font-medium md:px-6 md:text-base transition-colors duration-150 hover:border-foreground"
            >
              Find my lure — 30 sec
            </Button>
          </div>
          <div className="hero-proof mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-foreground/85">
            <span className="flex items-center gap-2"><Star className="h-4 w-4 text-primary" /> {RATING.score} · {RATING.count} verified reviews</span>
            <span className="flex items-center gap-2"><Truck className="h-4 w-4" /> Free shipping over $129</span>
            <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> 30-day money-back</span>
          </div>
          <span aria-hidden className="mt-5 block h-6 w-px bg-primary" />
        </div>
      </div>

      {showVideo && (
        <Button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause background video" : "Play background video"}
          className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full border border-foreground/30 bg-background/50 backdrop-blur md:right-6"
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
      )}
    </section>
  );
}

/* ---------------- 2. Best sellers ---------------- */

export function ExternalCard({ item, eager }: { item: ExternalProduct; eager?: boolean }) {
  const [hidden, setHidden] = useState(false);
  if (hidden) return null;
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-transform duration-200 motion-safe:md:hover:-translate-y-0.5">
      <div className="relative aspect-square overflow-hidden bg-frame">
        <SafeImg
          src={item.photo}
          alt={item.name}
          loading={eager ? "eager" : "lazy"}
          onHide={() => setHidden(true)}
          className="absolute inset-0 h-full w-full object-contain p-[8%] transition-transform duration-200 motion-safe:md:group-hover:scale-[1.03]"
        />
        <a
          href={item.href}
          aria-label={`View ${item.name} on the store`}
          className="absolute bottom-3 right-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform duration-150 hover:scale-105"
        >
          <ArrowUpRight className="h-5 w-5" />
        </a>
      </div>
      <div className="flex flex-1 flex-col p-3.5">
        <h3 className="text-base font-semibold leading-tight">
          <a href={item.href} className="after:absolute after:inset-0 after:rounded-xl focus-visible:outline-none focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-ring">
            {item.name}
          </a>
        </h3>
        <p className="mt-1 text-sm">{item.spec}</p>
        <p className="mt-1 text-base font-semibold">{money(item.price)}</p>
      </div>
    </article>
  );
}

/* ---------------- 3. Offer ladder ---------------- */

const LADDER_ICONS = { truck: Truck, gift: Gift, layers: Layers } as const;

export function OfferLadder() {
  return (
    <section className="bg-primary text-primary-foreground" aria-label="Current offers">
      <div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-center gap-x-8 gap-y-3 px-4 py-4 md:justify-between md:px-6">
        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {OFFER_LADDER.map((s, i) => {
            const Icon = LADDER_ICONS[s.icon];
            return (
              <li key={s.label} className="offer-step flex items-center gap-3 text-[15px] font-semibold">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-primary-foreground/30">{i + 1}</span>
                {s.label}
              </li>
            );
          })}
        </ul>
        <a
          href={STORE + "/collections/all-bundles"}
          onClick={() => track("offer_ladder_click")}
          className="min-h-11 rounded-full bg-primary-foreground px-5 py-2.5 text-sm font-semibold text-primary transition-opacity hover:opacity-90"
        >
          Build a bundle
        </a>
      </div>
    </section>
  );
}

/* ---------------- 4. Lure finder ---------------- */

const ACTION_OPTIONS: { id: Action; label: string; desc: string }[] = [
  { id: "floating", label: "Floating", desc: "Works the surface — pause it in the strike zone." },
  { id: "sinking", label: "Sinking", desc: "Erratic, skittish action under the surface." },
];
const WEIGHT_OPTIONS: { id: WeightBand; label: string; desc: string }[] = [
  { id: "light", label: "Light", desc: "25–50g outfit" },
  { id: "medium", label: "Medium", desc: "65–115g outfit" },
  { id: "heavy", label: "Heavy", desc: "110–200g outfit" },
];

export function LureFinder({ onQuickAdd }: { onQuickAdd: (p: Product, el: HTMLElement) => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<FinderAnswers>>({});

  // Returning visitors jump straight to their last result.
  useEffect(() => {
    const saved = loadAnswers();
    if (saved) {
      setAnswers(saved);
      setStep(3);
    }
  }, []);

  const pick = <K extends keyof FinderAnswers>(key: K, value: FinderAnswers[K]) => {
    const next = { ...answers, [key]: value };
    setAnswers(next);
    track("finder_step", { step: key, value });
    if (key === "weight") {
      saveAnswers(next as FinderAnswers);
      track("finder_complete", next as Record<string, unknown>);
    }
    setStep((s) => s + 1);
  };

  const reset = () => {
    setAnswers({});
    setStep(0);
  };

  const result = step === 3 && answers.water && answers.action && answers.weight ? recommend(answers as FinderAnswers) : null;

  const optionCls =
    "flex min-h-24 h-auto w-full flex-col items-start gap-1 whitespace-normal rounded-lg border border-input bg-background p-4 text-left transition-colors duration-150 hover:border-primary focus-visible:border-primary";

  return (
    <div className="finder-experience">
      <div className="flex items-center justify-between gap-4">
        <div><p className="mb-2 text-sm font-medium">{step < 3 ? `Step ${step + 1} of 3` : "Your match"}</p><div className="flex gap-1.5" aria-hidden>
          {[0, 1, 2].map((i) => (
            <span key={i} className={`h-1.5 w-6 rounded-full ${i <= step ? "bg-primary" : "bg-muted"}`} />
          ))}
        </div></div>
        {step > 0 && (
          <Button variant="ghost" type="button" onClick={() => (step === 3 ? reset() : setStep((s) => s - 1))} className="flex min-h-11 items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> {step === 3 ? "Start over" : "Back"}
          </Button>
        )}
      </div>

      {step === 0 && (
        <fieldset className="finder-step mt-6" key={step}>
          <legend className="text-lg font-semibold md:text-xl">Where are you fishing?</legend>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {WATER_BANDS.map((b) => (
              <Button variant="outline" key={b.id} type="button" className={optionCls} onClick={() => pick("water", b.id)}>
                {b.id === "estuary" ? <Trees className="mb-2 h-5 w-5 text-primary" /> : b.id === "bluewater" ? <Waves className="mb-2 h-5 w-5 text-primary" /> : <Fish className="mb-2 h-5 w-5 text-primary" />}<span className="font-semibold">{b.label}</span>
                <span className="text-sm text-muted-foreground">{b.sizes.map((s) => `${s}mm`).join(" · ")}</span>
              </Button>
            ))}
          </div>
        </fieldset>
      )}

      {step === 1 && (
        <fieldset className="finder-step mt-6" key={step}>
          <legend className="text-lg font-semibold md:text-xl">Surface strikes or sub-surface?</legend>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {ACTION_OPTIONS.map((o) => (
              <Button variant="outline" key={o.id} type="button" className={optionCls} onClick={() => pick("action", o.id)}>
                <span className="font-semibold">{o.label}</span>
                <span className="text-sm text-muted-foreground">{o.desc}</span>
              </Button>
            ))}
          </div>
        </fieldset>
      )}

      {step === 2 && (
        <fieldset className="finder-step mt-6" key={step}>
          <legend className="text-lg font-semibold md:text-xl">How heavy is your rod?</legend>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {WEIGHT_OPTIONS.map((o) => (
              <Button variant="outline" key={o.id} type="button" className={optionCls} onClick={() => pick("weight", o.id)}>
                <span className="font-semibold">{o.label}</span>
                <span className="text-sm text-muted-foreground">{o.desc}</span>
              </Button>
            ))}
          </div>
        </fieldset>
      )}

      <Button asChild variant="link" className="mt-4 px-0 text-sm"><a href="/masters">Skip — show me all stickbaits →</a></Button>
      {result && (
        <div className="mt-6 grid items-center gap-6 md:grid-cols-[220px_1fr]">
          <div className="aspect-square overflow-hidden rounded-xl bg-frame">
            <img src={img(photoFor(result.pick, defaultColour(result.pick)), 600)} alt={result.pick.name} className="h-full w-full object-cover" />
          </div>
          <div>
            <p className="eyebrow text-primary">Your match</p>
            <p className="mt-2 text-xl font-semibold leading-snug">{result.why}</p>
            <p className="mt-1 text-base font-semibold">{priceLabel(result.pick)}</p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Button
                type="button"
                onClick={(e) => {
                  track("finder_add_to_cart", { product: result.pick.id });
                  onQuickAdd(result.pick, e.currentTarget);
                }}
                className="min-h-12 rounded-full bg-primary px-6 font-medium text-primary-foreground hover:bg-primary/90"
              >
                Add to cart
              </Button>
              {result.secondary && (
                <Button variant="outline" type="button" onClick={(e) => result.secondary && onQuickAdd(result.secondary, e.currentTarget)} className="min-h-12 rounded-full border border-input px-5 text-sm font-medium hover:border-foreground">
                  Or try the {result.secondary.name}
                </Button>
              )}
            </div>
            <a
              href={`/masters${toSearch({ ...DEFAULT_STATE, water: answers.water ? [answers.water] : [], action: answers.action ?? "all" })}`}
              className="mt-4 inline-flex min-h-11 items-center gap-1 text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              See all {WATER_BANDS.find((b) => b.id === answers.water)?.label.toLowerCase()} lures <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- 5. Shoppable catches ---------------- */

export function CatchGrid() {
  return (
    <>
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-6">
        {CATCH_PHOTOS.map((c) => (
          <CatchTile key={c.src} photo={c} />
        ))}
      </div>
      <p className="mt-6 text-center text-sm">
        <a href={INSTAGRAM} className="font-medium text-primary underline-offset-4 hover:underline">
          Tag @filletandreleaseco
        </a>{" "}
        <span className="text-muted-foreground">to be featured.</span>
      </p>
    </>
  );
}

function CatchTile({ photo }: { photo: { src: string; species: string } }) {
  const [hidden, setHidden] = useState(false);
  if (hidden) return null;
  return (
    <figure className="relative aspect-[4/5] overflow-hidden rounded-xl bg-frame">
      <SafeImg src={photo.src} alt={`Customer catch: ${photo.species}`} loading="lazy" onHide={() => setHidden(true)} className="h-full w-full object-cover" />
      <figcaption className="absolute bottom-3 left-3 rounded-full bg-background/60 px-3 py-1 text-xs font-medium backdrop-blur">{photo.species}</figcaption>
    </figure>
  );
}

/* ---------------- 6. Reviews ---------------- */

export function Reviews({ onQuickAdd }: { onQuickAdd: (p: Product, el: HTMLElement) => void }) {
  return (
    <div className="grid gap-8 md:grid-cols-[1fr_1.6fr] md:gap-16">
      <div>
        <p className="text-6xl font-bold tracking-tight">{RATING.score}</p>
        <Stars n={5} className="mt-2 h-5 w-5" />
        <p className="mt-2 text-sm text-muted-foreground">Based on {RATING.count} verified reviews</p>
      </div>
      <div className="grid gap-4">
        {REVIEWS.map((r) => {
          const p = PRODUCTS.find((x) => x.id === r.productId)!;
          return (
            <blockquote key={r.name} className="rounded-xl border border-border bg-card p-5">
              <Stars n={r.stars} />
              <p className="mt-3 text-lg leading-relaxed">“{r.quote}”</p>
              <footer className="mt-3 text-sm text-muted-foreground">— {r.name}, verified buyer</footer>
              <div className="mt-4 flex items-center gap-3 border-t border-border pt-4">
                <img src={img(photoFor(p, defaultColour(p)), 200)} alt="" className="h-14 w-14 rounded-lg bg-frame object-contain p-1" />
                <div className="flex-1 text-sm">
                  <p className="font-semibold">{p.name}</p>
                  <p className="text-muted-foreground">{specLine(p)}</p>
                  <p className="font-semibold">{priceLabel(p)}</p>
                </div>
                <Button
                  type="button"
                  aria-label={`Quick add ${p.name}`}
                  onClick={(e) => {
                    track("review_quick_add", { product: p.id });
                    onQuickAdd(p, e.currentTarget);
                  }}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform duration-150 hover:scale-105"
                >
                  +
                </Button>
              </div>
            </blockquote>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- 7. Why FAR ---------------- */

export function WhyFar() {
  return (
    <div className="grid items-center gap-8 md:grid-cols-2 md:gap-16">
      <div className="aspect-square overflow-hidden">
        <SafeImg src={WHY_IMG} alt="Masters stickbait close-up" loading="lazy" className="h-full w-full object-cover" />
      </div>
      <div>
        <h2 className="text-[26px] font-semibold leading-tight tracking-normal md:text-[32px]">Why anglers switch to timber</h2>
        <dl className="mt-6 divide-y divide-border border-y border-border">
          {[
            ["Body", "Hand-shaped timber", "Moulded ABS"],
            ["Hook hold", "Stainless through-wire", "Screw eyes"],
            ["Finish", "Hand-painted, one at a time", "Printed"],
          ].map(([k, a, b]) => (
            <div key={k} className="grid grid-cols-[1fr_1.4fr_1fr] items-center gap-3 py-3.5 text-[15px]">
              <dt className="text-muted-foreground">{k}</dt>
              <dd className="flex items-start gap-2 font-medium">
                <Check className="mt-1 h-4 w-4 shrink-0 text-primary" /> {a}
              </dd>
              <dd className="flex gap-2 text-muted-foreground"><X className="mt-1 h-4 w-4 shrink-0" />{b}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-5 flex items-start gap-2 text-sm font-medium">
          <ShieldCheck className="h-5 w-5 shrink-0 text-success" /> Fish it for 30 days. Not happy? Money back.
        </p>
        <Link to="/masters" className="mt-6 inline-flex min-h-12 items-center rounded-full bg-primary px-6 font-medium text-primary-foreground hover:bg-primary/90">
          Shop stickbaits
        </Link>
      </div>
    </div>
  );
}

/* ---------------- 8. Founder ---------------- */

export function Founder() {
  return (
    <div className="grid items-start gap-6 sm:grid-cols-[128px_minmax(0,1fr)] sm:items-center xl:grid-cols-[128px_minmax(0,1fr)_auto]">
      <img src={founderAsset.url} alt="Jaison Greer, FAR founder" loading="lazy" className="h-40 w-32 shrink-0 rounded-lg object-cover" />
      <div className="min-w-0">
        <p className="eyebrow text-primary">Veteran owned &amp; operated</p>
        <p className="mt-2 max-w-2xl text-foreground/85">{FOUNDER.text}</p><p className="mt-3 font-medium text-primary">Give back to Aussie veterans. Protect our waterways.</p>
      </div>
      <a href={FOUNDER.href} className="inline-flex min-h-11 shrink-0 items-center gap-1 text-sm font-medium text-primary underline-offset-4 hover:underline sm:col-start-2 xl:col-start-3">
        Read our story <ArrowUpRight className="h-4 w-4" />
      </a>
    </div>
  );
}

/* ---------------- 9. Category tiles ---------------- */

export function CategoryTiles() {
  return (
    <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5 md:gap-6">
      {CATEGORIES.map((c) => {
        const inner = (
          <>
            <span className="relative block aspect-[4/3] overflow-hidden bg-frame">
              <SafeImg src={c.photo} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-200 motion-safe:md:group-hover:scale-[1.03]" />
            </span>
            <span className="block p-4">
              <span className="block font-semibold">{c.name}</span>
              <span className="mt-0.5 block text-sm text-muted-foreground">{c.line}</span><span className="mt-2 block text-[13px] text-primary">{c.name === "Masters Stickbaits" ? COLLECTION_COUNTS["new-stick-bait-masters"] : c.name === "Ghost Drops" ? COLLECTION_COUNTS["ghost-drops-signature-stickbaits"] : c.name === "Liquidator PRO Jigs" ? COLLECTION_COUNTS.jigs : c.name === "Bundles" ? COLLECTION_COUNTS["all-bundles"] : COLLECTION_COUNTS.jerseys} products</span>
            </span>
          </>
        );
        const cls = "group block overflow-hidden rounded-lg border border-border bg-card last:col-span-2 md:last:col-span-1";
        return c.internal ? (
          <Link key={c.name} to={c.href as "/masters"} className={cls}>
            {inner}
          </Link>
        ) : (
          <a key={c.name} href={c.href} className={cls}>
            {inner}
          </a>
        );
      })}
    </div>
  );
}

/* ---------------- 10. FAQ ---------------- */

export function HomeFaq() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: HOME_FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a + (f.link ? ` ${f.link.label}: ${f.link.href}` : "") },
    })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Accordion type="single" collapsible defaultValue="q0">
        {HOME_FAQ.map((f, i) => (
          <AccordionItem key={i} value={`q${i}`} className="border-border">
            <AccordionTrigger className="min-h-14 text-left text-base font-medium hover:no-underline">{f.q}</AccordionTrigger>
            <AccordionContent className="text-[15px] leading-relaxed text-foreground/85">
              {f.a}
              {f.link && (
                <>
                  {" "}
                  <a href={f.link.href} className="font-medium text-primary underline underline-offset-4">
                    {f.link.label}
                  </a>
                  .
                </>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion><Button asChild variant="link" className="mt-4 px-0"><a href={STORE + "/pages/contact-us"}>Still unsure? Contact us →</a></Button>
    </>
  );
}

/* ---------------- 11. Email capture ---------------- */

export function EmailBand() {
  const [joined, setJoined] = useState(false);
  return (
    <section className="mt-16 border-y md:mt-24 border-border bg-card" aria-labelledby="em">
      <div className="mx-auto grid max-w-[1320px] items-center gap-10 px-4 py-14 md:grid-cols-[1.1fr_1fr] md:gap-16 md:px-6 md:py-20">
        <div>
          <div className="mb-5 flex items-center gap-3 text-primary">
            <Mail className="h-5 w-5" />
            <p className="eyebrow">Restock alerts</p>
          </div>
          <h2 id="em" className="max-w-lg text-[32px] font-semibold leading-tight md:text-[40px]">
            Get first dibs on the next batch.
          </h2>
          <p className="mt-4 max-w-md text-muted-foreground">
            Our lures sell out in small batches. Get restock alerts and early access before they go public.
          </p>
        </div>
        <div className="border-t border-border pt-8 md:border-l md:border-t-0 md:pl-12 md:pt-0">
          {joined ? (
            <div role="status" className="flex min-h-36 items-start gap-4 py-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
                <Check className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xl font-medium">You're on the list.</p>
                <p className="mt-2 text-muted-foreground">We'll email you before the next batch goes public.</p>
              </div>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                track("email_signup", { location: "home_band" });
                setJoined(true);
              }}
            >
              <label htmlFor="email" className="mb-3 block text-sm font-medium">
                Email address
              </label>
              <Input id="email" name="email" type="email" autoComplete="email" required placeholder="you@email.com" className="h-14 rounded-lg bg-background px-4 text-base md:text-base" />
              <Button type="submit" className="mt-3 h-14 w-full justify-between rounded-lg px-5 text-base shadow-none">
                Notify me <ArrowUpRight />
              </Button>
            </form>
          )}
          <p className="mt-4 text-[13px] text-muted-foreground">No spam. Unsubscribe any time.</p>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Sticky mobile CTA ---------------- */

export function StickyCta({ visible, onFind, onShop }: { visible: boolean; onFind: () => void; onShop: () => void }) {
  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/90 backdrop-blur transition-transform duration-200 md:hidden ${visible ? "translate-y-0" : "translate-y-full"}`}
      aria-hidden={!visible}
    >
      <div className="sticky-cta-inner grid grid-cols-2 gap-2 p-3">
        <Button
          variant="outline"
          type="button"
          tabIndex={visible ? 0 : -1}
          onClick={() => {
            track("sticky_cta_click", { cta: "find_my_lure" });
            onFind();
          }}
          className="min-h-12 flex-1 rounded-full border border-input text-sm font-medium"
        >
          Find my lure
        </Button>
        <Button
          type="button"
          tabIndex={visible ? 0 : -1}
          onClick={() => {
            track("sticky_cta_click", { cta: "shop_best_sellers" });
            onShop();
          }}
          className="min-h-12 flex-1 rounded-full bg-primary text-sm font-semibold text-primary-foreground"
        >
          Shop best sellers
        </Button>
      </div>
    </div>
  );
}

export { productUrl };
