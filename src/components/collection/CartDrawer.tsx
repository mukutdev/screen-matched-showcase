import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { FREE_SHIPPING_THRESHOLD } from "@/data/collection";
import { cartTotals, money, nextTier, type CartLine } from "@/lib/cart";
import { Swatch } from "./LureImage";

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
  const pct = Math.min(100, ((FREE_SHIPPING_THRESHOLD - t.toFree) / FREE_SHIPPING_THRESHOLD) * 100);
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col bg-background sm:max-w-md">
        <SheetTitle className="text-xl font-bold">Your cart ({t.qty})</SheetTitle>
        <SheetDescription className="sr-only">Cart contents and totals</SheetDescription>
        <div>
          <p className="text-sm">
            {t.toFree > 0 ? `${money(t.toFree)} away from free shipping` : "You've unlocked free shipping"}
          </p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100} aria-label="Free shipping progress">
            <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <ul className="flex-1 divide-y divide-border overflow-y-auto">
          {lines.map((l) => (
            <li key={l.key} className="flex items-start gap-3 py-3">
              <Swatch colour={l.colour} size={36} />
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
          <div className="flex justify-between text-primary">
            <span>Bundle discount {t.pct ? `(${t.pct}%)` : ""}</span>
            <span>−{money(t.discount)}</span>
          </div>
          <div className="flex justify-between text-base font-bold">
            <span>Subtotal</span>
            <span>{money(t.subtotal)}</span>
          </div>
          <button disabled className="mt-2 min-h-12 w-full rounded-lg bg-primary font-semibold text-primary-foreground opacity-50">
            Checkout
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
