import { describe, it, expect } from "vitest";

import {
  enforceVoice,
  enforceVoiceDeep,
  BANNED_WORDS,
} from "./index";

describe("enforceVoice", () => {
  it("turns em and en dashes into commas", () => {
    expect(enforceVoice("Do this, then that, keep going")).toBe(
      "Do this, then that, keep going"
    );
    expect(enforceVoice("raise fees, then watch profit")).not.toContain("—");
    expect(enforceVoice("a, b")).toBe("a, b");
  });

  it("repairs known hyphenated compounds", () => {
    expect(enforceVoice("your break-even is close")).toContain("break even");
    expect(enforceVoice("a long-term play")).toContain("long term");
    expect(enforceVoice("cost-per-client matters")).toContain("cost per client");
  });

  it("collapses the double space a dash swap can leave", () => {
    // "a — b" -> "a, b" not "a,  b"
    expect(enforceVoice("a — b")).toBe("a, b");
  });

  it("leaves clean copy untouched", () => {
    const clean = "Nice, that is a healthy margin. Want to model a fee rise?";
    expect(enforceVoice(clean)).toBe(clean);
  });

  it("exposes the banned word list for reference", () => {
    expect(BANNED_WORDS).toContain("world class");
  });
});

describe("enforceVoiceDeep", () => {
  it("cleans every string in a structured value, keeping shape", () => {
    const out = enforceVoiceDeep({
      messages: ["your break-even is close", "raise fees—win"],
      n: 3,
    });
    expect(out.messages[0]).toContain("break even");
    expect(out.messages[1]).not.toContain("—");
    expect(out.n).toBe(3);
  });
});
