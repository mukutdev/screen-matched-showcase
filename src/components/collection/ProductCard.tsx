import { useState } from "react";
import { Plus } from "lucide-react";
import { COLOURS, WATER_LABEL, defaultColour, img, photoFor, productUrl, type ColourId, type Product } from "@/data/collection";
import { money } from "@/lib/cart";
import { Swatch } from "./Media";

export function priceLabel(p: Product) {
  const ps = p.variants.map((v) => v.price);
  return ps.length > 1 ? `${money(Math.min(...ps))}–${Math.max(...ps).toFixed(2)}` : money(ps[0]!);
}

export function specLine(p: Product) {
  if (p.line === "gen2") return `${p.timber} · Topwater · ${p.variants[0]!.weight}–${p.variants.at(-1)!.weight}g`;
  return `${p.size}mm · ${p.variants[0]!.weight}g · ${p.action === "floating" ? "Floating" : "Sinking"}`;
}

export function altFor(p: Product, colour: ColourId) {
  const name = COLOURS.find((c) => c.id === colour)!.name;
  return p.line === "gen2" ? `GEN II stickbait in ${name}` : `${p.name} ${p.action} stickbait in ${name}`;
}

export function ProductCard({
  product: p,
  preferredColour,
  eager,
  onQuickAdd,
}: {
  product: Product;
  preferredColour?: ColourId | undefined;
  eager?: boolean;
  onQuickAdd: (p: Product, trigger: HTMLElement) => void;
}) {
  const initial = defaultColour(p, preferredColour);
  const [hoverColour, setHoverColour] = useState<ColourId | null>(null);
  const colour = hoverColour ?? initial;
  const allSold = p.colours.every((c) => p.soldOut.includes(c));
  const badge = allSold ? "Sold out" : p.bestSeller ? "Best seller" : p.badge;
  const badgeCls =
    badge === "Sold out"
      ? "bg-muted text-muted-foreground"
      : badge === "Best seller"
        ? "bg-primary text-primary-foreground"
        : "border border-foreground/40 text-foreground bg-background/60";

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-transform duration-200 motion-safe:md:hover:-translate-y-0.5">
      <div className="relative aspect-square overflow-hidden bg-frame">
        {/* stacked colour photos for 200ms crossfade */}
        {p.colours.map((c) => (
          <img
            key={c}
            src={img(photoFor(p, c), 900)}
            alt={c === colour ? altFor(p, c) : ""}
            aria-hidden={c !== colour}
            loading={eager && c === initial ? "eager" : "lazy"}
            fetchPriority={eager && c === initial ? "high" : "auto"}
            width={900}
            height={900}
            className={`absolute inset-0 h-full w-full object-contain p-[8%] transition-[opacity,transform] duration-200 motion-safe:md:group-hover:scale-[1.03] ${
              c === colour ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        {badge && <span className={`absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-xs font-medium uppercase tracking-[0.08em] ${badgeCls}`}>{badge}</span>}
        <button
          type="button"
          aria-label={`Quick add ${p.name}`}
          disabled={allSold}
          onClick={(e) => onQuickAdd(p, e.currentTarget)}
          className="absolute bottom-3 right-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform duration-150 hover:scale-105 disabled:opacity-40"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
      <div className="flex flex-1 flex-col p-3.5">
        <h3 className="text-base font-semibold leading-tight">
          <a
            href={productUrl(p, colour)}
            className="after:absolute after:inset-0 after:rounded-xl focus-visible:outline-none focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-ring"
          >
            {p.name}
          </a>
        </h3>
        <p className="mt-1 text-sm">{specLine(p)}</p>
        {p.line !== "gen2" && <p className="text-[13px] text-muted-foreground">{WATER_LABEL[p.size]}</p>}
        <p className="mt-1 text-base font-semibold">{priceLabel(p)}</p>
        <div className="relative z-10 mt-2 flex w-fit flex-wrap items-center gap-2">
          <div className="flex gap-1.5" onMouseLeave={() => setHoverColour(null)}>
            {p.colours.map((c) => {
              const so = p.soldOut.includes(c);
              const name = COLOURS.find((x) => x.id === c)!.name;
              return (
                <span key={c} role="img" aria-label={`${name}${so ? ", sold out" : ""}`} onMouseEnter={() => setHoverColour(c)}>
                  <Swatch colour={c} soldOut={so} />
                </span>
              );
            })}
          </div>
          <span className="text-xs text-muted-foreground">
            {p.colours.length} colour{p.colours.length > 1 ? "s" : ""}
          </span>
        </div>
      </div>
    </article>
  );
}
