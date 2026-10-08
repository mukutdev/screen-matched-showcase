import { useEffect, useState, type ReactNode } from "react";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { COLOURS, type ColourId, type Product } from "@/data/collection";
import { money, nextTier, type CartLine } from "@/lib/cart";
import { Swatch } from "./LureImage";
import { specLine } from "./ProductCard";

export function ResponsiveModal({
  open,
  onOpenChange,
  title,
  description,
  returnFocus,
  children,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  title: string;
  description?: string;
  returnFocus?: HTMLElement | null;
  children: ReactNode;
}) {
  const mobile = useIsMobile();
  const onCloseAutoFocus = (e: Event) => {
    if (returnFocus) {
      e.preventDefault();
      returnFocus.focus();
    }
  };
  if (mobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[90vh] bg-background" onCloseAutoFocus={onCloseAutoFocus}>
          <div className="overflow-y-auto px-4 pb-4 pt-2">
            <DrawerTitle className="text-lg font-bold">{title}</DrawerTitle>
            {description && <DrawerDescription className="text-sm text-muted-foreground">{description}</DrawerDescription>}
            {children}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-background" onCloseAutoFocus={onCloseAutoFocus}>
        <DialogTitle className="text-lg font-bold">{title}</DialogTitle>
        {description && <DialogDescription className="text-sm text-muted-foreground">{description}</DialogDescription>}
        {children}
      </DialogContent>
    </Dialog>
  );
}

export function QuickAdd({
  product,
  trigger,
  cartQty,
  onClose,
  onAdd,
}: {
  product: Product | null;
  trigger: HTMLElement | null;
  cartQty: number;
  onClose: () => void;
  onAdd: (line: Omit<CartLine, "key">) => void;
}) {
  const [colour, setColour] = useState<ColourId | null>(null);
  const [variant, setVariant] = useState(0);
  const [qty, setQty] = useState(1);
  const [notify, setNotify] = useState<ColourId | null>(null);

  useEffect(() => {
    if (product) {
      setColour(product.colours.find((c) => !product.soldOut.includes(c)) ?? null);
      setVariant(0);
      setQty(1);
      setNotify(null);
    }
  }, [product]);

  if (!product) return null;
  const v = product.variants[variant];
  const tier = nextTier(cartQty + qty);

  return (
    <ResponsiveModal
      open={!!product}
      onOpenChange={(o) => !o && onClose()}
      title={product.name}
      description={`${product.name} · ${product.size}mm · ${v.weight}g · ${specLine(product).split(" · ").at(-1)}`}
      returnFocus={trigger}
    >
      {product.variants.length > 1 && (
        <fieldset className="mt-4">
          <legend className="mb-2 text-sm font-semibold">Weight</legend>
          <div className="flex gap-2">
            {product.variants.map((x, i) => (
              <button
                key={x.weight}
                type="button"
                aria-pressed={i === variant}
                onClick={() => setVariant(i)}
                className="min-h-11 rounded-lg border border-input px-3 text-sm aria-pressed:border-primary aria-pressed:bg-accent aria-pressed:font-semibold"
              >
                {x.weight}g · {money(x.price)}
              </button>
            ))}
          </div>
        </fieldset>
      )}
      <fieldset className="mt-4">
        <legend className="mb-2 text-sm font-semibold">Colour</legend>
        <div className="grid grid-cols-2 gap-2">
          {product.colours.map((c) => {
            const name = COLOURS.find((x) => x.id === c)!.name;
            const so = product.soldOut.includes(c);
            return (
              <div key={c}>
                <button
                  type="button"
                  aria-pressed={colour === c}
                  aria-label={`${name}${so ? ", sold out" : ""}`}
                  disabled={so}
                  onClick={() => setColour(c)}
                  className="flex min-h-11 w-full items-center gap-2 rounded-lg border border-input px-2 text-left text-sm aria-pressed:border-primary aria-pressed:bg-accent disabled:text-muted-foreground"
                >
                  <Swatch colour={c} soldOut={so} size={28} />
                  <span className="leading-tight">
                    {name}
                    {so && <span className="block text-xs">Sold out</span>}
                  </span>
                </button>
                {so &&
                  (notify === c ? (
                    <form
                      className="mt-1 flex gap-1"
                      onSubmit={(e) => {
                        e.preventDefault();
                        toast(`We'll email you when ${name} is back.`);
                        setNotify(null);
                      }}
                    >
                      <input
                        type="email"
                        required
                        aria-label={`Email for ${name} restock`}
                        placeholder="Email"
                        className="min-h-11 w-full min-w-0 rounded-lg border border-input bg-card px-2 text-sm"
                      />
                      <button className="min-h-11 rounded-lg bg-primary px-2 text-xs font-semibold text-primary-foreground">OK</button>
                    </form>
                  ) : (
                    <button type="button" onClick={() => setNotify(c)} className="min-h-11 text-xs font-semibold text-primary underline">
                      Notify me
                    </button>
                  ))}
              </div>
            );
          })}
        </div>
      </fieldset>
      <div className="mt-4 flex items-center gap-3">
        <span className="text-sm font-semibold">Qty</span>
        <div className="flex items-center rounded-lg border border-input">
          <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))} className="flex h-11 w-11 items-center justify-center">
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-8 text-center tabular-nums" aria-live="polite">{qty}</span>
          <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => q + 1)} className="flex h-11 w-11 items-center justify-center">
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
      <button
        type="button"
        disabled={!colour}
        onClick={() => {
          const c = COLOURS.find((x) => x.id === colour)!;
          onAdd({
            productId: product.id,
            name: product.name,
            colour: c.id,
            colourName: c.name,
            spec: `${product.size}mm · ${v.weight}g`,
            price: v.price,
            qty,
          });
        }}
        className="mt-4 min-h-12 w-full rounded-lg bg-primary font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        Add to cart · {money(v.price * qty)}
      </button>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        {tier ? `Add ${tier.more} more lure${tier.more > 1 ? "s" : ""} for ${tier.pct}% off — mix any size` : "Top bundle tier: 25% off everything"}
      </p>
    </ResponsiveModal>
  );
}
