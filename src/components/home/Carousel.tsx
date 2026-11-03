import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Carousel({ label, title, subhead, href, linkLabel = "Shop all →", kind = "products", children }: {
  label: string; title?: string; subhead?: string; href?: string; linkLabel?: string;
  kind?: "products" | "catches" | "reviews"; children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState({ start: true, end: false, fits: true, progress: 0 });
  useEffect(() => {
    const track = ref.current;
    if (!track) return;
    const update = () => {
      const max = track.scrollWidth - track.clientWidth;
      setState({ start: track.scrollLeft < 3, end: track.scrollLeft >= max - 3, fits: max < 3, progress: max > 0 ? track.scrollLeft / max : 1 });
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(track);
    track.addEventListener("scroll", update, { passive: true });
    return () => { observer.disconnect(); track.removeEventListener("scroll", update); };
  }, [children]);
  const move = (direction: number) => {
    const track = ref.current;
    if (!track) return;
    const child = track.firstElementChild;
    const width = child?.getBoundingClientRect().width ?? track.clientWidth;
    track.scrollBy({ left: direction * (width + 16), behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };
  return <div className={`product-carousel carousel-${kind}`} role="region" aria-label={label}>
    <div className="carousel-heading">
      <div>{title && <h2 className="section-title">{title}</h2>}{subhead && <p className="mt-2 text-[15px] text-muted-foreground">{subhead}</p>}</div>
      <div className="flex shrink-0 items-center gap-2">
        {href && <Button asChild variant="link" className="h-11 px-0 text-[13px] md:text-sm"><a href={href}>{linkLabel}</a></Button>}
        {!state.fits && <div className="hidden gap-2 md:flex">
          <Button variant="outline" size="icon" className="h-10 w-10 rounded-full" aria-label={`Previous ${label}`} title="Previous" disabled={state.start} onClick={() => move(-1)}><ArrowLeft /></Button>
          <Button variant="outline" size="icon" className="h-10 w-10 rounded-full" aria-label={`Next ${label}`} title="Next" disabled={state.end} onClick={() => move(1)}><ArrowRight /></Button>
        </div>}
      </div>
    </div>
    <div ref={ref} className="carousel-track" tabIndex={0} aria-label={`${label} cards`} onKeyDown={(event) => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); move(event.key === "ArrowRight" ? 1 : -1); }
    }}>{children}</div>
    {!state.fits && <div className="carousel-progress" role="progressbar" aria-label={`${label} scroll progress`} aria-valuenow={Math.round(state.progress * 100)} aria-valuemin={0} aria-valuemax={100}><div style={{ transform: `translateX(${state.progress * 300}%)` }} /></div>}
  </div>;
}