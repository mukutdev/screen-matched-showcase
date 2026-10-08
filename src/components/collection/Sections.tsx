import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Pause, Play, Star, Volume2, VolumeX } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";
import { HERO, type CatchVideo as CatchVideoItem } from "@/data/collection";
import { SafeImg } from "./Media";

const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function Hero({ onShop, onSize }: { onShop: () => void; onSize: () => void }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  useEffect(() => setShowVideo(!reducedMotion()), []);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) void v.play();
    else v.pause();
  };

  return (
    <section className="relative flex h-[60vh] max-h-[480px] min-h-[420px] flex-col justify-end overflow-hidden md:h-[72vh] md:max-h-[680px] md:min-h-[520px]">
      <img src={HERO.poster} alt="" className="absolute inset-0 h-full w-full object-cover" fetchPriority="high" />
      {showVideo && (
        <video
          ref={ref}
          src={HERO.video}
          poster={HERO.poster}
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

      <div className="relative mx-auto w-full max-w-[1320px] px-4 pb-6 md:px-6 md:pb-10">
        <div className="max-w-[640px]">
          <nav aria-label="Breadcrumb" className="text-[13px] text-muted-foreground">
            <ol className="flex gap-1.5">
              <li><a href="https://filletandreleaseco.com/" className="hover:text-foreground">Home</a> /</li>
              <li><a href="https://filletandreleaseco.com/collections/all" className="hover:text-foreground">Lures</a> /</li>
              <li aria-current="page" className="text-foreground">Masters Stickbaits</li>
            </ol>
          </nav>
          <p className="eyebrow mt-4 text-primary">Masters series</p>
          <h1 className="mt-2 text-[36px] font-bold leading-[1.05] tracking-[-0.02em] md:text-[56px]">Masters Timber Stickbaits</h1>
          <p className="mt-3 text-base text-foreground/85">
            Hand-shaped, hand-painted timber with 2mm through-wire. Seven sizes from 105mm estuary to 250mm bluewater — floating or sinking.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" onClick={onShop} className="min-h-12 rounded-full bg-primary px-6 font-medium text-primary-foreground transition-colors duration-150 hover:bg-primary/90">
              Shop the range
            </button>
            <button type="button" onClick={onSize} className="min-h-12 rounded-full border border-foreground/40 px-6 font-medium transition-colors duration-150 hover:border-foreground">
              Find your size
            </button>
          </div>
        </div>
      </div>

      <div className="relative border-t border-border bg-background/40 backdrop-blur-sm">
        <ul className="mx-auto flex max-w-[1320px] gap-6 overflow-x-auto whitespace-nowrap px-4 py-3 text-[13px] no-scrollbar md:justify-between md:px-6">
          <li><span className="text-primary">★ 4.96</span> · 65 verified reviews</li>
          <li>Free shipping over $129</li>
          <li>30-day money back</li>
          <li>Veteran owned &amp; operated</li>
        </ul>
      </div>

      {showVideo && (
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause background video" : "Play background video"}
          className="absolute right-4 top-4 flex h-11 md:top-auto md:bottom-16 w-11 items-center justify-center rounded-full border border-foreground/30 bg-background/50 backdrop-blur md:right-6"
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>
      )}
    </section>
  );
}

function Stars({ n, className = "h-4 w-4" }: { n: number; className?: string }) {
  return (
    <span className="flex justify-center gap-0.5 text-primary" role="img" aria-label={`Rated ${n} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => <Star key={i} className={className} fill={i < n ? "currentColor" : "none"} />)}
    </span>
  );
}

function CatchCard({ item, near, active, onActivate, playToken }: { item: CatchVideoItem; near: boolean; active: boolean; onActivate: () => void; playToken: number }) {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);

  // Attach the stream once near the viewport; only the active card buffers beyond metadata.
  useEffect(() => {
    const v = video.current;
    if (!near || !v) return;
    const seek = () => { if (v.currentTime === 0) v.currentTime = 0.1; };
    v.addEventListener("loadedmetadata", seek, { once: true });
    if (v.canPlayType("application/vnd.apple.mpegurl")) {
      v.src = item.src;
      return () => v.removeEventListener("loadedmetadata", seek);
    }
    let hls: { destroy: () => void } | undefined;
    let cancelled = false;
    void import("hls.js").then(({ default: Hls }) => {
      if (cancelled || !Hls.isSupported()) return;
      const h = new Hls({ startLevel: 0, maxBufferLength: active ? 30 : 2 });
      h.loadSource(item.src);
      h.attachMedia(v);
      hls = h;
    });
    return () => { cancelled = true; hls?.destroy(); v.removeEventListener("loadedmetadata", seek); };
  }, [near, item.src, active]);

  useEffect(() => { if (!active) video.current?.pause(); }, [active]);

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) { v.muted = muted; void v.play().catch(() => setPlaying(false)); }
    else v.pause();
  };

  useEffect(() => { if (playToken && active) toggle(); }, [playToken]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="catch-card" onClick={active ? undefined : onActivate}>
      {near && (
        <video
          ref={video}
          playsInline
          preload="metadata"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          onClick={active ? toggle : undefined}
          className="h-full w-full object-cover"
        />
      )}
      <div className="catch-overlay" />
      {!playing && (
        <button type="button" tabIndex={active ? 0 : -1} className="catch-play" aria-label={active ? `Play video from ${item.name}` : `Show video from ${item.name}`} onClick={(e) => { e.stopPropagation(); if (active) toggle(); else onActivate(); }}>
          <Play className="h-5 w-5 translate-x-0.5" fill="currentColor" />
        </button>
      )}
      {active && playing && (
        <button type="button" className="catch-mute" aria-label={muted ? "Unmute" : "Mute"} onClick={(e) => { e.stopPropagation(); const m = !muted; setMuted(m); if (video.current) video.current.muted = m; }}>
          {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
      )}
      <div className="pointer-events-none absolute inset-x-0 bottom-5 flex flex-col items-center gap-1.5">
        <span className="flex items-center gap-1.5 text-base font-semibold text-foreground">
          {item.name}
          {item.verified && (
            <span role="img" aria-label="Verified buyer" className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Check className="h-2.5 w-2.5" strokeWidth={4} />
            </span>
          )}
        </span>
        <Stars n={item.rating} />
      </div>
    </div>
  );
}

export function Catches({ items }: { items: CatchVideoItem[] }) {
  const count = items.length;
  // Duplicated so the loop always has enough slides to wrap on wide screens.
  const slides = [...items, ...items];
  const start = Math.min(2, count - 1);
  const [carouselRef, api] = useEmblaCarousel({ align: "center", loop: true, startIndex: start, duration: reducedMotion() ? 0 : 25 });
  const [snap, setSnap] = useState(start);
  const [near, setNear] = useState(false);
  const [playToken, setPlayToken] = useState(0);
  const region = useRef<HTMLDivElement>(null);
  const selected = snap % count;

  useEffect(() => {
    const el = region.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e?.isIntersecting && (setNear(true), io.disconnect()), { rootMargin: "300px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!api) return;
    const sync = () => setSnap(api.selectedScrollSnap());
    sync();
    api.on("select", sync);
    api.on("reInit", sync);
    return () => { api.off("select", sync); api.off("reInit", sync); };
  }, [api]);

  const total = slides.length;
  const goTo = (i: number) => {
    // pick the closest duplicate of item i
    const a = i, b = i + count;
    const d = (x: number) => Math.min(Math.abs(x - snap), total - Math.abs(x - snap));
    api?.scrollTo(d(a) <= d(b) ? a : b);
  };

  return (
    <div
      ref={region}
      tabIndex={0}
      className="catch-carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label="Customer catch videos"
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return;
        if (e.key === "ArrowLeft") { e.preventDefault(); api?.scrollPrev(); }
        if (e.key === "ArrowRight") { e.preventDefault(); api?.scrollNext(); }
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setPlayToken((t) => t + 1); }
      }}
    >
      <div ref={carouselRef} className="catch-viewport">
        <div className="catch-track">
          {slides.map((it, i) => {
            const raw = Math.abs(i - snap);
            const dist = Math.min(raw, total - raw);
            return (
              <div key={i} role="group" aria-roledescription="slide" aria-label={`${(i % count) + 1} of ${count}`} aria-hidden={dist > 2 || (i !== snap && i % count === selected) ? true : undefined} data-distance={dist} className="catch-slide">
                <CatchCard item={it} near={near && dist <= 2} active={i === snap} onActivate={() => api?.scrollTo(i)} playToken={i === snap ? playToken : 0} />
              </div>
            );
          })}
        </div>
      </div>
      <button type="button" className="catch-arrow catch-arrow-prev" aria-label="Previous video" onClick={() => api?.scrollPrev()}><ArrowLeft className="h-5 w-5" /></button>
      <button type="button" className="catch-arrow catch-arrow-next" aria-label="Next video" onClick={() => api?.scrollNext()}><ArrowRight className="h-5 w-5" /></button>
      <div className="catch-dots">
        {items.map((it, i) => (
          <button key={i} type="button" aria-label={`Go to video ${i + 1}`} onClick={() => goTo(i)} className={`h-2 w-2 rounded-full ${i === selected ? "bg-primary" : "bg-muted-foreground/40"}`} />
        ))}
      </div>
      <span className="sr-only" aria-live="polite">Video {selected + 1} of {count}</span>
    </div>
  );
}

export function RelatedTile({ name, img, href }: { name: string; img: string; href: string }) {
  const [hidden, setHidden] = useState(false);
  if (hidden) return null;
  return (
    <a href={href} className="group relative block aspect-[4/5] overflow-hidden rounded-xl bg-frame">
      <SafeImg src={img} alt="" loading="lazy" onHide={() => setHidden(true)} className="h-full w-full object-cover transition-transform duration-200 motion-safe:md:group-hover:scale-[1.03]" />
      <span className="absolute inset-0" style={{ background: "var(--hero-overlay)" }} />
      <span className="absolute bottom-4 left-4 text-lg font-semibold">{name}</span>
    </a>
  );
}
