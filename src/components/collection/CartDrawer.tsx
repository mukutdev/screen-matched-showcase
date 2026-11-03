import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { FREE_GIFT_THRESHOLD, FREE_SHIPPING_THRESHOLD } from "@/data/collection";
import { cartPermalink, cartTotals, money, nextTier, type CartLine } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { STORE_ROWS, type StoreProduct } from "@/lib/store";

export function CartDrawer({
  open,
  onOpenChange,
  lines,
  onRemove,
  onQuantityChange,
  onUpsell,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  lines: CartLine[];
  onRemove: (key: string) => void;
  onQuantityChange?: (key: string, qty: number) => void;
  onUpsell?: (p: StoreProduct, el: HTMLElement) => void;
}) {
  const t = cartTotals(lines);
  const tier = nextTier(t.eligibleQty);
  // Two-step ladder: free shipping at $129, then a free $50 jig pack at $175.
  const milestone =
    t.toFree > 0
      ? { label: `You're ${money(t.toFree)} away from free shipping`, pct: (t.subtotal / FREE_SHIPPING_THRESHOLD) * 100, aria: "Free shipping progress" }
      : t.toGift > 0
        ? {
            label: `${money(t.toGift)} away from your free jig pack`,
            pct: ((t.subtotal - FREE_SHIPPING_THRESHOLD) / (FREE_GIFT_THRESHOLD - FREE_SHIPPING_THRESHOLD)) * 100,
            aria: "Free jig pack progress",
          }
        : { label: "Free shipping + free $50 jig pack unlocked", pct: 100, aria: "All rewards unlocked" };
  const pct = Math.min(100, Math.max(0, milestone.pct));
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col bg-background sm:max-w-md">
        <SheetTitle className="text-xl font-bold">Your cart ({t.qty})</SheetTitle>
        <SheetDescription className="sr-only">Cart contents and totals</SheetDescription>
        <div>
          <p className="text-sm">{milestone.label}</p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100} aria-label={milestone.aria}>
            <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto"><ul className="divide-y divide-border">
          {lines.length === 0 && <li className="py-6 text-sm text-muted-foreground">Your cart is empty.</li>}
          {lines.map((l) => (
            <li key={l.key} className="flex items-start gap-3 py-3">
              <img src={l.image} alt="" width={64} height={64} className="h-16 w-16 shrink-0 rounded-lg bg-frame object-contain p-1" />
              <div className="min-w-0 flex-1 text-sm">
                <p className="font-bold">{l.name}</p>
                <p className="text-muted-foreground">
                  {[l.colourName, l.spec].filter(Boolean).join(" · ")}
                </p>
                <p>
                  {l.qty} × {money(l.price)}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2">
                <Button variant="ghost" size="icon" title="Remove" aria-label={`Remove ${l.name}`} onClick={() => onRemove(l.key)}><Trash2 /></Button>
                {onQuantityChange && <div className="flex items-center gap-1"><Button variant="outline" size="icon" className="h-8 w-8" aria-label={`Decrease ${l.name} quantity`} onClick={() => onQuantityChange(l.key, l.qty - 1)}><Minus /></Button><span className="w-5 text-center text-sm" aria-live="polite">{l.qty}</span><Button variant="outline" size="icon" className="h-8 w-8" aria-label={`Increase ${l.name} quantity`} onClick={() => onQuantityChange(l.key, l.qty + 1)}><Plus /></Button></div>}
              </div>
            </li>
          ))}
        </ul>
        {onUpsell && <div className="border-t border-border pt-4"><p className="mb-3 text-sm font-semibold">Complete your rig</p>{STORE_ROWS.addons.filter((p) => !lines.some((line) => line.productId === p.id)).map((p) => <div key={p.id} className="flex items-center gap-3 py-2"><img src={p.image} alt="" loading="lazy" className="h-14 w-14 rounded bg-frame object-contain" /><div className="flex-1 text-sm"><p>{p.name}</p><p className="text-primary">{money(p.price)}</p></div><Button size="icon" className="rounded-full" aria-label={`Add ${p.name}`} onClick={(e) => onUpsell(p, e.currentTarget)}><Plus /></Button></div>)}</div>}</div>
        <div className="space-y-1 border-t border-border pt-3 text-sm">
          {tier && t.eligibleQty > 0 && <p className="text-muted-foreground">Add {tier.more} more for {tier.pct}% off — mix any size</p>}
          <div className="flex justify-between">
            <span>Items</span>
            <span>{money(t.gross)}</span>
          </div>
          <div className="flex justify-between text-success">
            <span>Bundle discount {t.pct ? `(${t.pct}%)` : ""}</span>
            <span>−{money(t.discount)}</span>
          </div>
          <div className="flex justify-between text-base font-bold">
            <span>Subtotal</span>
            <span>{money(t.subtotal)}</span>
          </div>
          <Button
            type="button"
            disabled={!lines.length}
            onClick={() => window.location.assign(cartPermalink(lines))}
            className="mt-2 min-h-12 w-full rounded-full bg-primary font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            Checkout
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
