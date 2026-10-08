import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
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

function CatchVideo({ src, index }: { src: string; index: number }) {
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

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) void v.play();
    else v.pause();
  };

  return (
    <div ref={wrap} className="relative aspect-[9/16] w-44 shrink-0 snap-start overflow-hidden rounded-xl bg-frame md:w-56">
      {near && (
        <video
          ref={video}
          muted
          loop
          playsInline
          preload="metadata"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          className="h-full w-full object-cover"
        />
      )}
      <button type="button" onClick={toggle} aria-label={`${playing ? "Pause" : "Play"} customer catch video ${index}`} className="absolute inset-0 flex items-center justify-center">
        {!playing && (
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-background/70 backdrop-blur">
            <Play className="h-5 w-5" />
          </span>
        )}
      </button>
    </div>
  );
}

function CatchPhoto({ src, caption }: { src: string; caption?: string | undefined }) {
  const [hidden, setHidden] = useState(false);
  if (hidden) return null;
  return (
    <figure className="relative aspect-[4/5] w-56 shrink-0 snap-start overflow-hidden rounded-xl bg-frame md:w-72">
      <SafeImg src={src} alt={caption ?? "Customer catch on a Masters stickbait"} loading="lazy" onHide={() => setHidden(true)} className="h-full w-full object-cover" />
      {caption && <figcaption className="absolute inset-x-0 bottom-0 bg-background/70 px-3 py-2 text-[13px] font-medium backdrop-blur">{caption}</figcaption>}
    </figure>
  );
}

export function Catches({ items }: { items: CatchItem[] }) {
  let v = 0;
  return (
    <div className="-mx-4 mt-6 flex snap-x items-start gap-3 overflow-x-auto px-4 pb-2 no-scrollbar md:-mx-6 md:gap-4 md:px-6">
      {items.map((it, i) =>
        it.kind === "video" ? <CatchVideo key={i} src={it.src} index={++v} /> : <CatchPhoto key={i} src={it.src} caption={it.caption} />,
      )}
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
