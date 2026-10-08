import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { COLOURS, WATER_LABEL, type ColourId, type Product } from "@/data/collection";
import { money } from "@/lib/cart";
import { LureImage, Swatch } from "./LureImage";

export function priceLabel(p: Product) {
  const ps = p.variants.map((v) => v.price);
  return ps.length > 1 ? `${money(Math.min(...ps))}–${Math.max(...ps).toFixed(2)} · ${ps.length} weights` : money(ps[0]);
}

export function specLine(p: Product) {
  const w = p.variants.length > 1 ? `${p.variants[0].weight}–${p.variants.at(-1)!.weight}g` : `${p.variants[0].weight}g`;
  return `${p.size}mm · ${w} · ${p.line === "gen2" ? "Topwater" : p.action === "floating" ? "Floating" : "Sinking"}`;
}

export function ProductCard({
  product: p,
  preferredColour,
  onQuickAdd,
}: {
  product: Product;
  preferredColour?: ColourId | undefined;
  onQuickAdd: (p: Product, trigger: HTMLElement) => void;
}) {
  const initial = preferredColour && p.colours.includes(preferredColour) ? preferredColour : p.colours[0];
  const [hoverColour, setHoverColour] = useState<ColourId | null>(null);
  const colour = hoverColour ?? initial;
  const colourName = COLOURS.find((c) => c.id === colour)!.name;
  const allSold = p.colours.every((c) => p.soldOut.includes(c));
  const badge = allSold ? "Sold out" : p.bestSeller ? "Best seller" : p.badge;

  const open = (e: React.MouseEvent) => {
    e.preventDefault();
    toast(`Would open product page: ${p.name} – ${colourName}`);
  };

  return (
    <article className="group relative">
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border">
        <div className="absolute inset-0">
          <LureImage colour={colour} size={p.size} />
        </div>
        <div className="absolute inset-0 opacity-0 transition-opacity duration-300 md:group-hover:opacity-100">
          <LureImage colour={colour} size={p.size} water />
        </div>
        {badge && (
          <span
            className={`absolute left-2 top-2 rounded px-2 py-0.5 text-xs font-semibold ${
              badge === "Sold out" ? "bg-foreground text-background" : "bg-primary text-primary-foreground"
            }`}
          >
            {badge}
          </span>
        )}
        <button
          type="button"
          aria-label={`Quick add ${p.name}`}
          disabled={allSold}
          onClick={(e) => onQuickAdd(p, e.currentTarget)}
          className="absolute bottom-2 right-2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-background text-foreground ring-1 ring-border transition-colors hover:bg-primary hover:text-primary-foreground disabled:opacity-40"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
      <div className="mt-2 space-y-0.5 pr-1">
        <h3 className="text-[15px] font-bold leading-tight">
          <a href="#" onClick={open} className="after:absolute after:inset-0 after:rounded-lg focus-visible:outline-none focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-ring">
            {p.name}
          </a>
        </h3>
        <p className="text-sm">{specLine(p)}</p>
        <p className="text-sm text-muted-foreground">{WATER_LABEL[p.size]}</p>
        <p className="text-[15px] font-bold">{priceLabel(p)}</p>
      </div>
      <div className="relative z-10 mt-1.5 flex w-fit flex-wrap items-center gap-1.5">
        <div className="flex gap-1" onMouseLeave={() => setHoverColour(null)}>
          {p.colours.map((c) => {
            const so = p.soldOut.includes(c);
            const name = COLOURS.find((x) => x.id === c)!.name;
            return (
              <span key={c} role="img" aria-label={`${name}${so ? ", sold out" : ""}`} onMouseEnter={() => setHoverColour(c)}>
                <Swatch colour={c} soldOut={so} size={16} />
              </span>
            );
          })}
        </div>
        <span className="text-xs text-muted-foreground">
          {p.colours.length} colour{p.colours.length > 1 ? "s" : ""}
        </span>
      </div>
    </article>
  );
}
