import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";
import { HERO, type CatchItem } from "@/data/collection";
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

function CatchVideo({ src, poster, index, active, onActivate }: { src: string; poster: string; index: number; active: boolean; onActivate: () => void }) {
  const wrap = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e?.isIntersecting && (setNear(true), io.disconnect()), { rootMargin: "300px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const v = video.current;
    if (!near || !v) return;
    if (v.canPlayType("application/vnd.apple.mpegurl")) {
      v.src = src;
      return;
    }
    let hls: { destroy: () => void } | undefined;
    let cancelled = false;
    void import("hls.js").then(({ default: Hls }) => {
      if (cancelled || !Hls.isSupported()) return;
      const h = new Hls({ startLevel: 0 });
      h.loadSource(src);
      h.attachMedia(v);
      hls = h;
    });
    return () => {
      cancelled = true;
      hls?.destroy();
    };
  }, [near, src]);

  useEffect(() => {
    if (!active) video.current?.pause();
  }, [active]);

  const toggle = () => {
    if (!active) {
      onActivate();
      return;
    }
    const v = video.current;
    if (!v) return;
    if (v.paused) void v.play().catch(() => setPlaying(false));
    else v.pause();
  };

  return (
    <div ref={wrap} className="relative h-full w-full overflow-hidden bg-frame">
      {!near && <SafeImg src={poster} alt="Customer catch on a Masters stickbait" loading="lazy" className="h-full w-full object-cover" />}
      {near && (
        <video
          ref={video}
          poster={poster}
          muted
          loop
          playsInline
          preload="metadata"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          className="h-full w-full object-cover"
        />
      )}
      <div className="catch-overlay" />
      <Button variant="ghost" type="button" onClick={toggle} aria-label={active ? `${playing ? "Pause" : "Play"} customer catch video ${index}` : `Focus customer catch video ${index}`} className="absolute inset-0 h-full w-full rounded-none p-0 text-media-foreground hover:bg-transparent hover:text-media-foreground">
        {!playing && (
          <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-media-foreground bg-gallery-ink/20">
            <Play className="h-5 w-5" fill="currentColor" />
          </span>
        )}
      </Button>
    </div>
  );
}

function CatchPhoto({ src, caption }: { src: string; caption?: string | undefined }) {
  const [hidden, setHidden] = useState(false);
  if (hidden) return null;
  return (
    <figure className="relative h-full w-full overflow-hidden bg-frame">
      <SafeImg src={src} alt={caption ?? "Customer catch on a Masters stickbait"} loading="lazy" onHide={() => setHidden(true)} className="h-full w-full object-cover" />
      <div className="catch-overlay" />
      {caption && <figcaption className="catch-caption">{caption}</figcaption>}
    </figure>
  );
}

export function Catches({ items }: { items: CatchItem[] }) {
  const [carouselRef, api] = useEmblaCarousel({ align: "center", loop: true, startIndex: Math.min(2, items.length - 1) });
  const [selected, setSelected] = useState(Math.min(2, items.length - 1));

  useEffect(() => {
    if (!api) return;
    const sync = () => setSelected(api.selectedScrollSnap());
    sync();
    api.on("select", sync);
    api.on("reInit", sync);
    return () => {
      api.off("select", sync);
      api.off("reInit", sync);
    };
  }, [api]);

  return (
    <div className="catch-carousel" role="region" aria-roledescription="carousel" aria-label="Customer catches">
      <div ref={carouselRef} className="catch-viewport" onKeyDown={(event) => {
        if (event.key === "ArrowLeft") { event.preventDefault(); api?.scrollPrev(); }
        if (event.key === "ArrowRight") { event.preventDefault(); api?.scrollNext(); }
      }}>
        <div className="catch-track">
          {items.map((it, i) => (
            <div key={it.src} role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${items.length}`} aria-current={selected === i ? "true" : undefined} data-distance={Math.min(Math.abs(i - selected), items.length - Math.abs(i - selected))} className="catch-slide">
              <div className="catch-media">
                {it.kind === "video" ? <CatchVideo src={it.src} poster={it.poster} index={i + 1} active={selected === i} onActivate={() => api?.scrollTo(i)} /> : (
                  <>
                    <CatchPhoto src={it.src} caption={it.caption} />
                    {selected !== i && <Button type="button" variant="ghost" aria-label={`Focus customer catch photo ${i + 1}`} onClick={() => api?.scrollTo(i)} className="absolute inset-0 h-full w-full hover:bg-transparent" />}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Button type="button" variant="ghost" size="icon" className="catch-arrow catch-arrow-prev" aria-label="Previous catch" title="Previous catch" onClick={() => api?.scrollPrev()}><ArrowLeft /></Button>
      <span className="sr-only" aria-live="polite">Catch {selected + 1} of {items.length}</span>
      <Button type="button" variant="ghost" size="icon" className="catch-arrow catch-arrow-next" aria-label="Next catch" title="Next catch" onClick={() => api?.scrollNext()}><ArrowRight /></Button>
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
