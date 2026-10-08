import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Drawer, DrawerContent, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { Switch } from "@/components/ui/switch";
import { useIsMobile } from "@/hooks/use-mobile";
import { COLOURS, WATER_BANDS, type Action } from "@/data/collection";
import { countWith, optionCount, type FilterState, type SortMode } from "@/lib/filters";
import { Swatch } from "./Media";

type Set = (patch: Partial<FilterState>) => void;

const toggle = <T,>(arr: T[], v: T) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

export function ActionToggle({ s, set, compact }: { s: FilterState; set: Set; compact?: boolean }) {
  const opts: { id: Action | "all"; label: string }[] = [
    { id: "all", label: "All" },
    { id: "floating", label: `Floating (${countWith(s, { action: "floating" })})` },
    { id: "sinking", label: `Sinking (${countWith(s, { action: "sinking" })})` },
  ];
  return (
    <div className="flex shrink-0 rounded-full border border-input bg-card p-0.5" role="group" aria-label="Action">
      {opts.map((o) => {
        const disabled = o.id !== "all" && countWith(s, { action: o.id }) === 0;
        return (
          <button
            key={o.id}
            type="button"
            aria-pressed={s.action === o.id}
            disabled={disabled}
            onClick={() => set({ action: o.id })}
            className={`${compact ? "min-h-9" : "min-h-10"} whitespace-nowrap rounded-full px-3 text-sm aria-pressed:bg-primary aria-pressed:font-semibold aria-pressed:text-primary-foreground disabled:opacity-40`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

const chip =
  "min-h-11 shrink-0 whitespace-nowrap rounded-full border border-input bg-card px-3.5 text-sm aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:font-semibold aria-pressed:text-primary-foreground disabled:opacity-40";

export function activeCount(s: FilterState) {
  return (s.action !== "all" ? 1 : 0) + s.water.length + s.colours.length + (s.inStock ? 1 : 0);
}

function PanelBody({ s, set }: { s: FilterState; set: Set }) {
  const sorts: { id: SortMode; label: string }[] = [
    { id: "size", label: "Size small → large" },
    { id: "price-asc", label: "Price low → high" },
    { id: "price-desc", label: "Price high → low" },
    { id: "best", label: "Best selling" },
  ];
  return (
    <div className="space-y-5">
      <fieldset>
        <legend className="mb-2 text-sm font-semibold">Colour</legend>
        <div className="grid grid-cols-2 gap-2">
          {COLOURS.map((c) => {
            const n = optionCount(s, "colours", c.id);
            const on = s.colours.includes(c.id);
            return (
              <button
                key={c.id}
                type="button"
                aria-pressed={on}
                disabled={!on && n === 0}
                onClick={() => set({ colours: toggle(s.colours, c.id) })}
                className="flex min-h-11 items-center gap-2 rounded-full border border-input px-2 text-left text-sm aria-pressed:border-primary aria-pressed:bg-accent disabled:opacity-40"
              >
                <Swatch colour={c.id} size={24} />
                <span>
                  {c.name} <span className="text-muted-foreground">({n})</span>
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>
      <label className="flex min-h-11 items-center justify-between text-sm font-semibold">
        In stock only
        <Switch checked={s.inStock} onCheckedChange={(v) => set({ inStock: v })} />
      </label>
      <fieldset>
        <legend className="mb-2 text-sm font-semibold">Sort</legend>
        <div className="space-y-1">
          {sorts.map((o) => (
            <label key={o.id} className="flex min-h-11 cursor-pointer items-center gap-3 text-sm">
              <input
                type="radio"
                name="sort"
                checked={s.sort === o.id}
                onChange={() => set({ sort: o.id })}
                className="h-5 w-5 accent-[var(--primary)]"
              />
              {o.label}
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
}

export function FilterPanel({
  s,
  set,
  resultCount,
  open,
  onOpenChange,
  trigger,
}: {
  s: FilterState;
  set: Set;
  resultCount: number;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  trigger: React.ReactNode;
}) {
  const mobile = useIsMobile();
  if (mobile) {
    return (
      <>
        {trigger}
        <Drawer open={open} onOpenChange={onOpenChange}>
          <DrawerContent className="max-h-[90vh] bg-background">
            <div className="overflow-y-auto px-4 pt-2">
              <DrawerTitle className="mb-1 text-lg font-bold">Colour & sort</DrawerTitle>
              <DrawerDescription className="sr-only">Filter by colour and choose sort order</DrawerDescription>
              <PanelBody s={s} set={set} />
            </div>
            <div className="sticky bottom-0 border-t border-border bg-background p-4">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="min-h-12 w-full rounded-full bg-primary font-semibold text-primary-foreground"
              >
                Show {resultCount} lure{resultCount === 1 ? "" : "s"}
              </button>
            </div>
          </DrawerContent>
        </Drawer>
      </>
    );
  }
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent align="end" className="w-96 bg-background">
        <PanelBody s={s} set={set} />
      </PopoverContent>
    </Popover>
  );
}

export function ControlRow({ s, set, resultCount }: { s: FilterState; set: Set; resultCount: number }) {
  const [open, setOpen] = useState(false);
  const extra = s.colours.length + (s.inStock ? 1 : 0);
  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 no-scrollbar md:mx-0 md:flex-wrap md:px-0">
      <ActionToggle s={s} set={set} />
      {WATER_BANDS.map((b) => {
        const n = optionCount(s, "water", b.id);
        const on = s.water.includes(b.id);
        return (
          <button
            key={b.id}
            type="button"
            aria-pressed={on}
            disabled={!on && n === 0}
            onClick={() => set({ water: toggle(s.water, b.id) })}
            className={chip}
          >
            {b.label} <span className="text-muted-foreground">({n})</span>
          </button>
        );
      })}
      <FilterPanel
        s={s}
        set={set}
        resultCount={resultCount}
        open={open}
        onOpenChange={setOpen}
        trigger={
          <button type="button" onClick={() => setOpen(true)} className={`${chip} inline-flex items-center gap-1.5`} aria-expanded={open}>
            <SlidersHorizontal className="h-4 w-4" /> Colour & sort{extra ? ` (${extra})` : ""}
          </button>
        }
      />
    </div>
  );
}

export function StickyBar({ s, set, resultCount, visible }: { s: FilterState; set: Set; resultCount: number; visible: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`fixed inset-x-0 top-0 z-40 flex h-12 items-center justify-between gap-2 border-b border-border bg-background px-4 transition-transform duration-200 md:hidden ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
      aria-hidden={!visible}
    >
      <ActionToggle s={s} set={set} compact />
      <FilterPanel
        s={s}
        set={set}
        resultCount={resultCount}
        open={open}
        onOpenChange={setOpen}
        trigger={
          <button type="button" tabIndex={visible ? 0 : -1} onClick={() => setOpen(true)} className="min-h-11 whitespace-nowrap text-sm font-semibold">
            Filter & sort ({activeCount(s)})
          </button>
        }
      />
    </div>
  );
}

export function ActiveChips({ s, set, count }: { s: FilterState; set: Set; count: number }) {
  const chips: { label: string; remove: () => void }[] = [];
  if (s.action !== "all") chips.push({ label: s.action === "floating" ? "Floating" : "Sinking", remove: () => set({ action: "all" }) });
  if (s.size) chips.push({ label: `${s.size}mm`, remove: () => set({ size: null }) });
  s.water.forEach((w) => chips.push({ label: WATER_BANDS.find((b) => b.id === w)!.label, remove: () => set({ water: s.water.filter((x) => x !== w) }) }));
  s.colours.forEach((c) => chips.push({ label: COLOURS.find((x) => x.id === c)!.name, remove: () => set({ colours: s.colours.filter((x) => x !== c) }) }));
  if (s.inStock) chips.push({ label: "In stock only", remove: () => set({ inStock: false }) });
  return (
    <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
      {chips.map((c) => (
        <button key={c.label} type="button" onClick={c.remove} className="inline-flex min-h-9 items-center gap-1 rounded-full bg-muted px-3" aria-label={`Remove filter ${c.label}`}>
          {c.label} <X className="h-3.5 w-3.5" />
        </button>
      ))}
      {chips.length > 0 && (
        <button type="button" onClick={() => set({ action: "all", water: [], colours: [], inStock: false, size: null })} className="min-h-9 px-1 underline">
          Clear all
        </button>
      )}
      <span aria-live="polite" className="ml-auto text-muted-foreground">
        Showing {count} lure{count === 1 ? "" : "s"}
      </span>
    </div>
  );
}
