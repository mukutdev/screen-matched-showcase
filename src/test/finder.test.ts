import { describe, expect, it } from "vitest";
import { recommend } from "@/lib/finder";

describe("lure finder mapping", () => {
  it("inshore + floating + medium recommends the Masters 150F (65g)", () => {
    const r = recommend({ water: "inshore", action: "floating", weight: "medium" });
    expect(r.pick.id).toBe("masters-150f");
    expect(r.why).toContain("150mm · 65g · Floating");
  });

  it("estuary + floating + light recommends the Masters 105F (25g)", () => {
    expect(recommend({ water: "estuary", action: "floating", weight: "light" }).pick.id).toBe("masters-105f");
  });

  it("estuary + sinking + light recommends the Masters 105S (33g)", () => {
    expect(recommend({ water: "estuary", action: "sinking", weight: "light" }).pick.id).toBe("masters-105s");
  });

  it("bluewater + floating + heavy recommends the Masters 185F (110g)", () => {
    expect(recommend({ water: "bluewater", action: "floating", weight: "heavy" }).pick.id).toBe("masters-185f");
  });

  it("bluewater + sinking has no heavy option, so falls back to the smallest bluewater sinking (185S)", () => {
    expect(recommend({ water: "bluewater", action: "sinking", weight: "heavy" }).pick.id).toBe("masters-185s");
  });

  it("secondary pick is never the same product as the pick", () => {
    const r = recommend({ water: "reef", action: "floating", weight: "medium" });
    expect(r.pick.id).toBe("masters-170f");
    expect(r.secondary).not.toBeNull();
    expect(r.secondary!.id).not.toBe(r.pick.id);
  });
});
