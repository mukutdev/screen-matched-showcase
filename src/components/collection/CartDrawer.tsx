import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { FREE_GIFT_THRESHOLD, FREE_SHIPPING_THRESHOLD } from "@/data/collection";
import { cartPermalink, cartTotals, money, nextTier, type CartLine } from "@/lib/cart";

export function CartDrawer({
  open,
  onOpenChange,
  lines,
  onRemove,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  lines: CartLine[];
  onRemove: (key: string) => void;
}) {
  const t = cartTotals(lines);
  const tier = nextTier(t.qty);
  // Two-step ladder: free shipping at $129, then a free $50 jig pack at $175.
  const milestone =
    t.toFree > 0
      ? { label: `${money(t.toFree)} away from free shipping`, pct: (t.subtotal / FREE_SHIPPING_THRESHOLD) * 100, aria: "Free shipping progress" }
      : t.toGift > 0
        ? {
            label: `${money(t.toGift)} away from a free $50 jig pack`,
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
        <ul className="flex-1 divide-y divide-border overflow-y-auto">
          {lines.length === 0 && <li className="py-6 text-sm text-muted-foreground">Your cart is empty.</li>}
          {lines.map((l) => (
            <li key={l.key} className="flex items-start gap-3 py-3">
              <img src={l.image} alt="" width={64} height={64} className="h-16 w-16 shrink-0 rounded-lg bg-frame object-contain p-1" />
              <div className="flex-1 text-sm">
                <p className="font-bold">{l.name}</p>
                <p className="text-muted-foreground">
                  {l.colourName} · {l.spec}
                </p>
                <p>
                  {l.qty} × {money(l.price)}
                </p>
              </div>
              <button type="button" onClick={() => onRemove(l.key)} className="min-h-11 px-2 text-sm underline">
                Remove
              </button>
            </li>
          ))}
        </ul>
        <div className="space-y-1 border-t border-border pt-3 text-sm">
          {tier && <p className="text-muted-foreground">Add {tier.more} more for {tier.pct}% off — mix any size</p>}
          <div className="flex justify-between">
            <span>Lures</span>
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
          <button
            type="button"
            disabled={!lines.length}
            onClick={() => window.location.assign(cartPermalink(lines))}
            className="mt-2 min-h-12 w-full rounded-full bg-primary font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            Checkout
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
