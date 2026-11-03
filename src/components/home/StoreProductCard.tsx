import { useEffect, useState } from "react";
import { Check, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResponsiveModal } from "@/components/collection/QuickAdd";
import { money, type CartLine } from "@/lib/cart";
import { matchingVariant, storeLine, type StoreProduct } from "@/lib/store";

export function StoreProductCard({ product: p, onQuickAdd, eager = false, added = false }: { product: StoreProduct; onQuickAdd: (p: StoreProduct, el: HTMLElement) => void; eager?: boolean; added?: boolean }) {
  const colourIndex = p.options.findIndex((o) => /colou?r/i.test(o.name));
  const colour = p.options[colourIndex];
  const available = p.variants.some((v) => v.available);
  const saving = p.variants.reduce((max, v) => Math.max(max, v.compareAt > v.price ? Math.round((1 - v.price / v.compareAt) * 100) : 0), 0);
  const spec = p.category === "apparel" ? "Fishing apparel" : p.name.includes("Ghost") ? "Timber stickbaits · Sinking" : p.name.includes("Jig") ? "10 × Liquidator PRO jigs" : p.name.includes("Artist Series Bundle") ? "3 × Ghost Drops · choose your size" : p.category === "bundles" || /Mystery/.test(p.name) ? "Mixed timber lure bundle" : "Handcrafted timber lures";
  return <article className="store-product group">
    <div className="relative aspect-square overflow-hidden bg-frame">
      <a href={p.url} tabIndex={-1}><img src={p.image} alt={p.name} loading={eager ? "eager" : "lazy"} width={800} height={800} className="h-full w-full object-contain p-3 transition-transform duration-200 motion-safe:group-hover:scale-105" /></a>
      {saving > 0 && <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-[13px] font-medium text-primary-foreground">Save {saving}%</span>}
      <Button size="icon" disabled={!available} aria-label={`Quick add ${p.name}`} title={available ? "Quick add" : "Sold out"} onClick={(e) => onQuickAdd(p, e.currentTarget)} className={`absolute bottom-3 right-3 h-11 w-11 rounded-full ${added ? "motion-safe:animate-bounce" : ""}`}>{added ? <Check /> : <Plus />}</Button>
    </div>
    <div className="flex flex-1 flex-col p-4">
      <h3 className="text-base font-semibold leading-snug"><a href={p.url}>{p.name}</a></h3>
      <p className="mt-2 text-[13px] text-muted-foreground">{spec}</p>
      <p className="mt-2 font-semibold">{money(p.price)}{p.variants.some((v) => v.price !== p.price) && <span className="ml-1 text-[13px] font-normal text-muted-foreground">from</span>}</p>
      {colour && <div className="mt-3 flex flex-wrap items-center gap-2"><div className="flex gap-1">{colour.values.slice(0, 6).map((value, i) => <span key={value} className={`product-swatch swatch-${i}`} role="img" aria-label={value} title={value} />)}</div><span className="text-[13px] text-muted-foreground">{colour.values.length} colours</span></div>}
      {!available && <p className="mt-2 text-[13px] text-muted-foreground">Sold out</p>}
    </div>
  </article>;
}

export function StoreQuickAdd({ product: p, trigger, onClose, onAdd }: { product: StoreProduct | null; trigger: HTMLElement | null; onClose: () => void; onAdd: (line: Omit<CartLine, "key">) => void }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [qty, setQty] = useState(1);
  useEffect(() => { setSelected(p?.variants.find((v) => v.available)?.options ?? p?.variants[0]?.options ?? []); setQty(1); }, [p]);
  if (!p) return null;
  const variant = matchingVariant(p, selected);
  return <ResponsiveModal open={true} onOpenChange={(open) => { if (!open) onClose(); }} title={p.name} description="Choose your options" returnFocus={trigger}>
    <img src={p.image} alt={p.name} className="mt-4 aspect-[4/3] w-full rounded-lg bg-frame object-contain p-3" />
    {p.options.map((option, index) => <fieldset key={option.name} className="mt-5"><legend className="mb-2 text-sm font-semibold">{option.name}</legend>
      <div className="flex flex-wrap gap-2">{option.values.map((value) => {
        const possible = p.variants.some((v) => v.available && v.options[index] === value && selected.every((choice, i) => i >= index || v.options[i] === choice));
        return <Button key={value} variant="outline" aria-pressed={selected[index] === value} disabled={!possible} className="h-11 min-w-11 aria-pressed:border-primary aria-pressed:bg-secondary disabled:line-through" onClick={() => {
          const next = [...selected]; next[index] = value;
          const match = p.variants.find((v) => v.available && next.every((choice, i) => i > index || v.options[i] === choice));
          setSelected(match?.options ?? next);
        }}>{value === "XXL" || value === "2XL" ? "2XL" : value}</Button>;
      })}</div></fieldset>)}
    {p.category === "apparel" && <Button asChild variant="link" className="mt-2 px-0"><a href={`${p.url}#size-guide`} target="_blank" rel="noreferrer">Size guide ↗</a></Button>}
    <div className="mt-5 flex items-center gap-3"><span className="text-sm">Quantity</span><Button variant="outline" size="icon" aria-label="Decrease quantity" disabled={qty <= 1} onClick={() => setQty(Math.max(1, qty - 1))}><Minus /></Button><span className="w-6 text-center" aria-live="polite">{qty}</span><Button variant="outline" size="icon" aria-label="Increase quantity" onClick={() => setQty(qty + 1)}><Plus /></Button></div>
    <Button className="mt-5 h-12 w-full text-base" disabled={!variant?.available} onClick={() => { if (variant?.available) onAdd(storeLine(p, variant, qty)); }}>Add to cart {variant ? `· ${money(variant.price * qty)}` : ""}</Button>
  </ResponsiveModal>;
}