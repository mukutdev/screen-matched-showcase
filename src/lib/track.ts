// Analytics hooks: pushes to window.dataLayer so any tag manager can pick events up.
export type TrackEvent =
  | "hero_cta_click"
  | "bestseller_quick_add"
  | "finder_step"
  | "finder_complete"
  | "finder_add_to_cart"
  | "offer_ladder_click"
  | "ugc_shop_it"
  | "review_quick_add"
  | "email_signup"
  | "sticky_cta_click";

export function track(event: TrackEvent, detail?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { dataLayer?: unknown[] };
  (w.dataLayer ??= []).push({ event, ...detail });
  if (import.meta.env.DEV) console.debug("[track]", event, detail ?? {});
}
