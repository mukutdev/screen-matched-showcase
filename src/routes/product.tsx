import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Check, Minus, Plus, ShieldCheck, ShoppingBag } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ResponsiveModal } from "@/components/collection/QuickAdd";
import { CartDrawer } from "@/components/collection/CartDrawer";
import { StoreFooter, StoreHeader } from "@/components/home/StoreChrome";
import { StoreQuickAdd } from "@/components/home/StoreProductCard";
import { ActionSection, BundleSection, CatchesSection, QuestionsSection, ReviewsSection, SizeChart, TimberSection } from "@/components/product/ProductSections";
import { colourId, product, productContent, shop, sizes, type ColourName, type SizeName } from "@/data/product";
import { STORE } from "@/data/collection";
import { useIsMobile } from "@/hooks/use-mobile";
import { cartTotals, type CartLine } from "@/lib/cart";
import { availableCountForSize, colours, getSize, getVariant, isAvailable, moneyFromCents, nearestAvailableSize, shippingProgress, validSelection } from "@/lib/product";
import type { StoreProduct } from "@/lib/store";

const TITLE = "Masters Floating Timber Stickbait | Fillet & Release Co.";
const DESC = "Choose from seven floating Masters stickbait sizes and six colourways. Hand-shaped Korean Pine, through-wire construction and free shipping over $129.";

export const Route = createFileRoute("/product")({
  validateSearch: (search: Record<string, unknown>) => validSelection(search.colour, search.size),
  head: () => ({ meta: [
    { title: TITLE },
    { name: "description", content: DESC },
    { property: "og:title", content: TITLE },
    { property: "og:description", content: DESC },
    { property: "og:type", content: "product" },
    { property: "og:image", content: product.colourImages["Neon Fury"] },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:image", content: product.colourImages["Neon Fury"] },
  ] }),
  component: ProductPage,
});

function optionKeys(event: KeyboardEvent<HTMLButtonElement>) {
  if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
  event.preventDefault();
  const buttons = Array.from(event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>("button:not(:disabled)") ?? []);
  const index = buttons.indexOf(event.currentTarget);
  const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? buttons.length - 1 : (index + (["ArrowRight", "ArrowDown"].includes(event.key) ? 1 : -1) + buttons.length) % buttons.length;
  buttons[nextIndex]?.focus();
  buttons[nextIndex]?.click();
}

function ProductPage() {
  const { colour: selectedColour, size: selectedSize } = Route.useSearch();
  const navigate = useNavigate();
  const mobile = useIsMobile();
  const [qty, setQty] = useState(1);
  const [lines, setLines] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [riggingOpen, setRiggingOpen] = useState(false);
  const [storeQuick, setStoreQuick] = useState<{ p: StoreProduct; el: HTMLElement } | null>(null);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [pastBuy, setPastBuy] = useState(false);
  const buyRef = useRef<HTMLElement>(null);
  const variant = getVariant(selectedColour, selectedSize);
  const size = getSize(selectedSize);
  const totals = cartTotals(lines);
  const shipping = shippingProgress(Math.round(totals.subtotal * 100));
  const lowStock = availableCountForSize(selectedSize) <= 2;
  const b = productContent.buy;
  const g = productContent.gallery;

  useEffect(() => {
    const onScroll = () => setPastBuy((buyRef.current?.getBoundingClientRect().bottom ?? 1) < 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const select = (colour: ColourName, requestedSize: SizeName) => {
    const size = nearestAvailableSize(colour, requestedSize);
    void navigate({ to: "/product", search: { colour, size }, replace: true });
    setQty(1);
  };
  const selectColour = (colour: ColourName) => select(colour, selectedSize);
  const selectSize = (size: SizeName) => select(selectedColour, size);
  const scrollToBuy = () => buyRef.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  const selectFromChart = (size: SizeName) => { selectSize(size); scrollToBuy(); };

  const addLine = (line: Omit<CartLine, "key">) => {
    const key = String(line.variantId);
    setLines((previous) => previous.some((item) => item.key === key)
      ? previous.map((item) => item.key === key ? { ...item, qty: item.qty + line.qty } : item)
      : [...previous, { ...line, key }]);
    setStoreQuick(null);
    window.setTimeout(() => setCartOpen(true), 120);
  };
  const addSelected = () => addLine({
    productId: product.id,
    name: product.title,
    colour: colourId(selectedColour),
    colourName: selectedColour,
    spec: `${selectedSize} · ${size.weight}`,
    price: variant.price / 100,
    qty,
    variantId: variant.id,
    image: variant.featured_image,
    bundleEligible: true,
  });
  const cartQty = lines.reduce((sum, line) => sum + line.qty, 0);

  return <div className="product-page">
    <StoreHeader qty={cartQty} onCart={() => setCartOpen(true)} onFind={() => void navigate({ to: "/", hash: "finder" })} onBest={() => void navigate({ to: "/", hash: "best-sellers" })} onOverlayChange={setOverlayOpen} onQuickAdd={(p, el) => setStoreQuick({ p, el })} />
    <main>
      <section ref={buyRef} className="page-width product-buy" aria-labelledby="product-title">
        <div className="product-gallery">
          <div className="product-main-image">
            <span className="product-timber-pill">{g.badge}</span>
            <img src={variant.featured_image} alt={`${g.imageAlt} — ${selectedColour}`} width={1200} height={1200} fetchPriority="high" />
          </div>
          <p className="product-image-caption"><span>{g.captionLead}</span>{selectedColour}</p>
          <div className="product-thumbnails" aria-label={b.colourLabel}>
            {colours.filter((colour) => colour !== selectedColour).map((colour) => <button key={colour} type="button" onClick={() => selectColour(colour)} aria-label={colour}>
              <img src={product.colourImages[colour]} alt="" loading="lazy" />
            </button>)}
          </div>
          <div className="product-scale" aria-labelledby="product-scale-title">
            <div className="product-scale-heading"><h2 id="product-scale-title">{g.scaleTitle}</h2><p>{g.scaleDescription}</p></div>
            <div className="product-scale-list">
              {sizes.map((item) => {
                const selected = item.size === selectedSize;
                const available = isAvailable(selectedColour, item.size);
                return <button type="button" key={item.size} disabled={!available} onClick={() => selectSize(item.size)} className={selected ? "is-selected" : ""} aria-pressed={selected} aria-label={`${item.size} · ${item.weight}${available ? "" : ` · ${b.soldOut}`}`}>
                  <span className="product-scale-size">{item.size}</span>
                  <span className="product-scale-track"><span style={{ width: `${(item.mm / sizes[sizes.length - 1].mm) * 100}%` }} /></span>
                  <span className="product-scale-weight">{selected ? item.weight : available ? "" : b.soldOut}</span>
                </button>;
              })}
            </div>
          </div>
        </div>

        <div className="product-buybox">
          <p className="eyebrow">{product.series}</p>
          <h1 id="product-title">{product.title}</h1>
          <p className="product-dynamic-spec">{selectedSize} · {size.weight} · {b.action}</p>
          <a className="product-rating-link" href="#reviews"><span aria-hidden="true">★★★★★</span><span>{shop.rating} · {shop.reviewCount} {b.reviews}</span></a>
          <div className="product-price-block"><p className="product-price">{moneyFromCents(variant.price)}</p><p>{b.afterpay} {moneyFromCents(variant.price / 4)}</p></div>

          <fieldset className="product-option-group">
            <legend>{b.colourLabel}<span>{selectedColour}</span></legend>
            <div className="product-colour-options" role="group" aria-label={b.colourLabel}>
              {colours.map((colour) => {
                const available = isAvailable(colour, selectedSize);
                return <button key={colour} type="button" className="product-colour-button" aria-label={`${colour}${available ? "" : `, ${b.soldOut}`}`} aria-pressed={selectedColour === colour} data-unavailable={!available || undefined} onKeyDown={optionKeys} onClick={() => selectColour(colour)}>
                  <span style={{ backgroundImage: `url("${product.colourImages[colour]}")` }} />
                </button>;
              })}
            </div>
          </fieldset>

          <fieldset className="product-option-group">
            <legend>{b.sizeLabel}<button type="button" onClick={() => setRiggingOpen(true)}>{b.sizeHelp}</button></legend>
            <div className="product-size-options" role="group" aria-label={b.sizeLabel}>
              {sizes.map((item) => {
                const available = isAvailable(selectedColour, item.size);
                return <button key={item.size} type="button" disabled={!available} aria-pressed={selectedSize === item.size} onKeyDown={optionKeys} onClick={() => selectSize(item.size)} className="product-size-button">
                  {"badge" in item && item.badge && <span className="product-size-badge">{item.badge}</span>}
                  <strong>{item.size}</strong><span>{item.weight} · {moneyFromCents(item.price)}</span><small>{item.water}</small>{!available && <em>{b.soldOut}</em>}
                </button>;
              })}
            </div>
          </fieldset>

          <p className="product-stock"><span aria-hidden="true" />{lowStock ? b.lowStock : `${b.inStock} · ${shop.dispatch}`}</p>
          <div className="product-purchase-row">
            <div className="product-quantity" aria-label={b.quantity}>
              <button type="button" aria-label={b.decreaseQuantity} disabled={qty <= 1} onClick={() => setQty((value) => Math.max(1, value - 1))}><Minus /></button>
              <span aria-live="polite">{qty}</span>
              <button type="button" aria-label={b.increaseQuantity} onClick={() => setQty((value) => value + 1)}><Plus /></button>
            </div>
            <Button type="button" className="product-add-button" onClick={addSelected}><ShoppingBag aria-hidden="true" />{b.add} · {moneyFromCents(variant.price * qty)}</Button>
          </div>
          <Button type="button" variant="outline" className="product-buy-now" onClick={addSelected}>{b.buyNow}</Button>

          <div className="product-shipping">
            <p>{shipping.unlocked ? b.freeShipping : b.addForShipping.replace("{amount}", moneyFromCents(shipping.remainingCents))}</p>
            <div role="progressbar" aria-label={b.shippingProgress} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(shipping.percent)}><span style={{ width: `${shipping.percent}%` }} /></div>
          </div>
          <a className="product-guarantee" href={STORE + shop.guaranteeHref}><ShieldCheck aria-hidden="true" />{shop.guarantee}</a>
          <ul className="product-trust">{shop.trust.map((item) => <li key={item}><Check aria-hidden="true" />{item}</li>)}</ul>

          <Accordion type="single" collapsible defaultValue={mobile ? undefined : "rigging"} className="product-rigging">
            <AccordionItem value="rigging"><AccordionTrigger>{b.riggingTitle}</AccordionTrigger><AccordionContent>
              <dl><div><dt>{b.splitRings}</dt><dd>{size.rings ?? b.contact}</dd></div><div><dt>{b.hooks}</dt><dd>{size.hooks ?? b.contact}</dd></div></dl>
            </AccordionContent></AccordionItem>
          </Accordion>
        </div>
      </section>

      <BundleSection price={variant.price} />
      <TimberSection />
      <CatchesSection />
      <SizeChart selectedColour={selectedColour} selectedSize={selectedSize} onSelect={selectFromChart} />
      <ActionSection onFloating={scrollToBuy} />
      <ReviewsSection />
      <QuestionsSection />
    </main>
    <StoreFooter />

    {pastBuy && !cartOpen && !storeQuick && !overlayOpen && <div className="product-sticky">
      <div className="product-sticky-inner">
        <img src={variant.featured_image} alt="" />
        <div className="product-sticky-copy"><strong>{product.title}</strong><span>{selectedColour} · {selectedSize}</span></div>
        <span className="product-sticky-price">{moneyFromCents(variant.price)}</span>
        <Button type="button" onClick={addSelected} aria-label={b.stickyAdd}>{b.add}</Button>
      </div>
    </div>}

    <ResponsiveModal open={riggingOpen} onOpenChange={setRiggingOpen} title={b.riggingTitle} description={b.riggingDescription}>
      <div className="product-rigging-drawer">{sizes.map((item) => <div key={item.size} className={item.size === selectedSize ? "is-selected" : ""}>
        <strong>{item.size} · {item.weight}</strong><p>{item.water}</p><dl><div><dt>{b.splitRings}</dt><dd>{item.rings ?? b.contact}</dd></div><div><dt>{b.hooks}</dt><dd>{item.hooks ?? b.contact}</dd></div></dl>
        <Button type="button" variant="outline" disabled={!isAvailable(selectedColour, item.size)} onClick={() => { selectSize(item.size); setRiggingOpen(false); }}>{isAvailable(selectedColour, item.size) ? productContent.sections.selectSize.replace("{size}", item.size) : b.soldOut}</Button>
      </div>)}</div>
    </ResponsiveModal>
    <StoreQuickAdd product={storeQuick?.p ?? null} trigger={storeQuick?.el ?? null} onClose={() => setStoreQuick(null)} onAdd={addLine} />
    <CartDrawer open={cartOpen} onOpenChange={setCartOpen} lines={lines} checkout={false} onRemove={(key) => setLines((previous) => previous.filter((line) => line.key !== key))} onQuantityChange={(key, nextQty) => setLines((previous) => nextQty <= 0 ? previous.filter((line) => line.key !== key) : previous.map((line) => line.key === key ? { ...line, qty: nextQty } : line))} />
  </div>;
}
