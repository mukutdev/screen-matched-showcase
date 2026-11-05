import { useEffect, useRef, useState } from "react";
import { ChevronDown, Facebook, Instagram, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { CATEGORIES, INSTAGRAM } from "@/data/home";
import { STORE } from "@/data/collection";
import { ALL_STORE_PRODUCTS, type StoreProduct } from "@/lib/store";
import { money } from "@/lib/cart";
import logoAsset from "@/assets/far-lettering.png.asset.json";
import payVisa from "@/assets/pay/visa.png.asset.json";
import payMastercard from "@/assets/pay/mastercard.png.asset.json";
import payPaypal from "@/assets/pay/paypal.png.asset.json";
import payApplepay from "@/assets/pay/applepay.png.asset.json";
import payAmex from "@/assets/pay/amex.png.asset.json";
import payGpay from "@/assets/pay/gpay.png.asset.json";

const PAYMENT_ICONS = [
  { name: "Visa", src: payVisa.url },
  { name: "Mastercard", src: payMastercard.url },
  { name: "PayPal", src: payPaypal.url },
  { name: "Apple Pay", src: payApplepay.url },
  { name: "American Express", src: payAmex.url },
  { name: "Google Pay", src: payGpay.url },
];

const SHOP_ALL = STORE + "/collections/shop-all";
const BEST = STORE + "/collections/best-sellers-1";
const FACEBOOK = "https://www.facebook.com/filletandreleaseco";
const NAV = [{ label: "Our Story", href: STORE + "/pages/about-us" }, { label: "Rigging Guide", href: STORE + "/pages/rigging-guide-new" }, { label: "Contact", href: STORE + "/pages/contact-us" }];
const Logo = () => <a href="/" aria-label="Fillet & Release Co. home"><img src={logoAsset.url} alt="FAR — Fillet & Release Co." width={150} height={43} className="brand-logo" /></a>;
const Social = () => <div className="flex gap-2"><Button asChild size="icon" variant="ghost" aria-label="Instagram"><a href={INSTAGRAM}><Instagram /></a></Button><Button asChild size="icon" variant="ghost" aria-label="Facebook"><a href={FACEBOOK}><Facebook /></a></Button></div>;

export function StoreHeader({ qty, onCart, onFind, onBest, onOverlayChange, onQuickAdd }: { qty: number; onCart: () => void; onFind: () => void; onBest: () => void; onOverlayChange: (open: boolean) => void; onQuickAdd: (p: StoreProduct, el: HTMLElement) => void }) {
  const [solid, setSolid] = useState(false);
  const [message, setMessage] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [mega, setMega] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [search, setSearch] = useState(false);
  const [query, setQuery] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    const scroll = () => setSolid(window.scrollY > 80);
    scroll(); window.addEventListener("scroll", scroll, { passive: true });
    return () => window.removeEventListener("scroll", scroll);
  }, []);
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (hovered || motion.matches) return;
    const interval = setInterval(() => setMessage((n) => 1 - n), 5000);
    return () => clearInterval(interval);
  }, [hovered]);
  useEffect(() => { onOverlayChange(mega || mobile || search); }, [mega, mobile, search, onOverlayChange]);
  useEffect(() => {
    const escape = (e: KeyboardEvent) => { if (e.key === "Escape") setMega(false); };
    window.addEventListener("keydown", escape);
    return () => { window.removeEventListener("keydown", escape); if (timer.current) clearTimeout(timer.current); };
  }, []);
  const close = () => { setMega(false); setMobile(false); };
  const results = query.trim() ? ALL_STORE_PRODUCTS.filter((p) => `${p.name} ${p.spec}`.toLowerCase().includes(query.toLowerCase())).slice(0, 8) : [];
  return <>
    <div className="announcement" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}><a href={SHOP_ALL}>{message === 0 ? "Free shipping on orders over $129" : "Spend $175, get a free $50 jig pack"}</a></div>
    <header className={`store-header ${solid ? "is-solid" : ""} ${mega ? "menu-open" : ""}`}>
      <div className="header-inner">
        <Button variant="ghost" size="icon" className="h-11 w-11 lg:hidden" aria-label="Open menu" onClick={() => setMobile(true)}><Menu /></Button>
        <Logo />
        <nav aria-label="Main navigation" className="hidden items-center gap-7 lg:flex">
          <Button asChild variant="ghost" className="px-0"><a href="/">Home</a></Button>
          <div onMouseEnter={() => { if (timer.current) clearTimeout(timer.current); timer.current = setTimeout(() => setMega(true), 150); }} onMouseLeave={() => { if (timer.current) clearTimeout(timer.current); timer.current = setTimeout(() => setMega(false), 150); }}>
            <Button variant="ghost" className="px-0" aria-expanded={mega} aria-controls="shop-mega" onClick={() => setMega(!mega)}>Shop <ChevronDown className={mega ? "rotate-180" : ""} /></Button>
          </div>
          {NAV.map((n) => <Button asChild key={n.label} variant="ghost" className="px-0"><a href={n.href}>{n.label}</a></Button>)}
        </nav>
        <div className="flex items-center gap-0 md:gap-2">
          <Button variant="ghost" size="icon" className="h-11 w-11" aria-label="Search products" title="Search" onClick={() => setSearch(true)}><Search /></Button>
          <Button asChild variant="ghost" size="icon" className="hidden h-11 w-11 lg:inline-flex" aria-label="Your account" title="Account"><a href={STORE + "/account"}><User /></a></Button>
          <Button variant="ghost" size="icon" className="relative h-11 w-11" aria-label={`Open cart, ${qty} items`} title="Cart" onClick={onCart}><ShoppingBag /><span className="cart-count">{qty}</span></Button>
        </div>
      </div>
      {mega && <div id="shop-mega" className="mega-menu" onMouseEnter={() => { if (timer.current) clearTimeout(timer.current); }} onMouseLeave={() => setMega(false)}>
        <div className="mega-grid">{CATEGORIES.map((c) => <a key={c.name} href={c.href} className="mega-category" onClick={close}><img src={c.photo} alt="" loading="lazy" className="aspect-square w-full rounded-lg bg-frame object-contain" /><h3 className="mt-3 font-semibold">{c.name}</h3><p className="mt-1 text-[13px] text-muted-foreground">{c.line}</p></a>)}
          <div className="space-y-3 border-l border-border pl-6"><Button variant="link" className="block px-0" onClick={() => { close(); onBest(); }}>Best Sellers</Button><Button asChild variant="link" className="block px-0"><a href={SHOP_ALL}>Shop All</a></Button><Button variant="link" className="block px-0" onClick={() => { close(); onFind(); }}>Find my lure</Button><a href={SHOP_ALL} className="block rounded-lg bg-primary p-4 text-primary-foreground"><p className="font-semibold">A free $50 jig pack</p><p className="mt-2 text-[13px]">Spend $175 and complete your next session.</p></a></div>
        </div>
      </div>}
    </header>
    <Sheet open={mobile} onOpenChange={setMobile}><SheetContent side="left" className="flex w-full max-w-sm flex-col overflow-y-auto p-5"><SheetTitle><Logo /></SheetTitle><SheetDescription className="sr-only">Shop categories and helpful links</SheetDescription>
      <nav aria-label="Mobile navigation" className="mt-5">{CATEGORIES.map((c) => <a key={c.name} href={c.href} className="mobile-menu-row" onClick={close}><img src={c.photo} alt="" loading="lazy" className="h-10 w-10 rounded bg-frame object-contain" /><span>{c.name}</span></a>)}
        <Button variant="ghost" className="mobile-menu-row w-full justify-start px-0" onClick={() => { close(); onBest(); }}>Best Sellers</Button><a href={SHOP_ALL} className="mobile-menu-row">Shop All</a>{NAV.map((n) => <a key={n.label} href={n.href} className="mobile-menu-row">{n.label}</a>)}
      </nav><div className="mt-auto border-t border-border pt-6"><p className="text-sm text-primary">Free shipping on orders over $129</p><Social /></div>
    </SheetContent></Sheet>
    <Dialog open={search} onOpenChange={setSearch}><DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto bg-background"><DialogTitle>Search FAR</DialogTitle><DialogDescription className="sr-only">Find products by name</DialogDescription>
      <Input autoFocus type="search" aria-label="Search products" placeholder="Search lures, jigs, apparel…" value={query} onChange={(e) => setQuery(e.target.value)} className="h-12 text-base" />
      {!query && <div><p className="mb-3 text-sm text-muted-foreground">Popular</p><div className="flex flex-wrap gap-2">{["150mm stickbait", "Ghost Drops", "Jigs", "Bundles"].map((text) => <Button variant="outline" key={text} className="rounded-full" onClick={() => setQuery(text === "150mm stickbait" ? "Masters" : text === "Bundles" ? "Bundle" : text)}>{text}</Button>)}</div></div>}
      {query && <ul className="divide-y divide-border">{results.length === 0 && <li className="py-5 text-muted-foreground">No products found.</li>}{results.map((p) => <li key={p.id} className="flex items-center gap-4 py-3"><a href={p.url}><img src={p.image} alt="" className="h-16 w-16 rounded bg-frame object-contain" /></a><a href={p.url} className="flex-1 text-sm"><p className="font-medium">{p.name}</p><p className="mt-1 text-primary">{money(p.price)}</p></a><Button size="icon" aria-label={`Quick add ${p.name}`} onClick={(e) => { setSearch(false); onQuickAdd(p, e.currentTarget); }}>+</Button></li>)}</ul>}
      {query && <Button asChild variant="link"><a href={STORE + "/search?q=" + encodeURIComponent(query)}>See all results →</a></Button>}
    </DialogContent></Dialog>
  </>;
}

const FOOTER_GROUPS = [
  { title: "Shop", links: [...CATEGORIES.map((c) => ({ label: c.name, href: c.href })), { label: "Best Sellers", href: BEST }, { label: "Shop All", href: SHOP_ALL }] },
  { title: "Help", links: [{ label: "Shipping", href: STORE + "/policies/shipping-policy" }, { label: "Returns & Refunds", href: STORE + "/policies/refund-policy" }, { label: "Contact Us", href: STORE + "/pages/contact-us" }, { label: "Rigging Guide", href: STORE + "/pages/rigging-guide-new" }, { label: "FAQ", href: "/#faq" }] },
  { title: "About", links: [{ label: "Our Story", href: STORE + "/pages/about-us" }] },
];
function FooterLinks({ group }: { group: typeof FOOTER_GROUPS[number] }) { return <><ul className="space-y-3">{group.links.map((link) => <li key={link.label}><a href={link.href} className="text-sm text-muted-foreground hover:text-primary">{link.label}</a></li>)}</ul>{group.title === "About" && <><p className="mt-5 text-sm text-primary">Give back to Aussie veterans.<br />Protect our waterways.</p><p className="mt-4 text-sm text-muted-foreground">Veteran owned &amp; operated</p></>}</>; }
export function StoreFooter() {
  return <footer className="store-footer"><div className="tight-lines" aria-label="Tight lines">TIGHT LINES.</div><div className="page-width pb-10">
    <div className="hidden grid-cols-4 gap-10 md:grid">{FOOTER_GROUPS.map((group) => <div key={group.title}><h3 className="mb-5 font-semibold">{group.title}</h3><FooterLinks group={group} /></div>)}<BrandColumn /></div>
    <div className="md:hidden"><Accordion type="multiple">{FOOTER_GROUPS.map((group) => <AccordionItem key={group.title} value={group.title}><AccordionTrigger>{group.title}</AccordionTrigger><AccordionContent><FooterLinks group={group} /></AccordionContent></AccordionItem>)}</Accordion><div className="mt-8"><BrandColumn /></div></div>
    <div className="mt-12 flex flex-wrap items-center justify-between gap-5 border-t border-border pt-6 text-[13px] text-muted-foreground"><div className="flex flex-wrap gap-x-5 gap-y-3"><span>© {new Date().getUTCFullYear()} Fillet &amp; Release Co.</span>{[["Privacy Policy", "privacy-policy"], ["Terms of Service", "terms-of-service"], ["Shipping Policy", "shipping-policy"], ["Refund Policy", "refund-policy"]].map(([label, path]) => <a key={path} href={STORE + "/policies/" + path}>{label}</a>)}</div><div className="flex items-center gap-2" aria-label="Secure checkout">{PAYMENT_ICONS.map((icon) => <span key={icon.name} className="flex h-7 items-center justify-center rounded-md bg-white px-2"><img src={icon.src} alt={icon.name} title={icon.name} className="h-3.5 w-auto" loading="lazy" /></span>)}</div></div>
  </div></footer>;
}
function BrandColumn() { return <div><Logo /><p className="mt-4 text-sm text-muted-foreground">Premium handcrafted timber lures. Designed by an ex-military founder. Tested on Australian water.</p><a href="mailto:filletandrelease@outlook.com.au" className="mt-4 block break-all text-sm">filletandrelease@outlook.com.au</a><div className="mt-3"><Social /></div></div>; }