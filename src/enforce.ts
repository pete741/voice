// The mechanical guarantee behind the Clinic Mastery voice. The prompt ASKS a
// model for the hard rules; this GUARANTEES them on every string before it
// reaches a person. Shared across products so the rules never drift.

export const BANNED_WORDS = [
  "world-class",
  "world class",
  "results-driven",
  "results driven",
  "synergy",
  "cutting edge",
  "cutting-edge",
  "best in class",
  "best-in-class",
  "game changer",
  "game-changer",
];

// Short banned words need boundaries: "roi" must not match "Fitzroi", and
// "leverage" must not match inside another word.
export const BANNED_WORD_PATTERNS = [/\broi\b/i, /\bleverages?d?\b/i];

// Common hyphenated compounds with their Clinic Mastery repairs. Applied
// mechanically; any other hyphenated token is only flagged, because clinic
// names and URLs make blanket de-hyphenation unsafe.
export const HYPHEN_REPAIRS: Record<string, string> = {
  "break-even": "break even",
  "break-evens": "break evens",
  "follow-up": "follow up",
  "follow-ups": "follow ups",
  "long-term": "long term",
  "short-term": "short term",
  "high-intent": "high intent",
  "low-intent": "low intent",
  "cost-per-client": "cost per client",
  "cost-per-booking": "cost per booking",
  "full-time": "full time",
  "part-time": "part time",
  "set-up": "set up",
  "cost-effective": "cost effective",
  "read-only": "read only",
  "well-known": "well known",
};

/** Strip the AI tells the prompt sometimes misses. Em and en dashes become
 *  commas (the most common correct repair); known hyphenated compounds are
 *  repaired; banned words and any residual hyphenation are flagged for
 *  visibility (not silently rewritten, to stay safe on names and URLs). */
export function enforceVoice(text: string): string {
  let out = text
    .replace(/\s*—\s*/g, ", ")
    .replace(/\s*–\s*/g, ", ")
    .replace(/ {2,}/g, " ");
  for (const [bad, good] of Object.entries(HYPHEN_REPAIRS)) {
    out = out.replace(new RegExp(bad, "gi"), good);
  }
  for (const word of BANNED_WORDS) {
    if (out.toLowerCase().includes(word)) {
      console.warn(`[voice] banned phrase survived generation: "${word}"`);
    }
  }
  for (const re of BANNED_WORD_PATTERNS) {
    if (re.test(out)) {
      console.warn(`[voice] banned word survived generation: ${re}`);
    }
  }
  const residual = out.match(/\b[a-z]+-[a-z]+\b/gi);
  if (residual && residual.length > 0) {
    console.warn(
      `[voice] hyphenated words in output: ${[...new Set(residual)]
        .slice(0, 5)
        .join(", ")}`
    );
  }
  return out;
}

/** Apply enforceVoice to every string in a structured value, keeping the shape
 *  intact. Use on a whole structured model result (e.g. a messages array). */
export function enforceVoiceDeep<T>(value: T): T {
  if (typeof value === "string") return enforceVoice(value) as T;
  if (Array.isArray(value)) return value.map(enforceVoiceDeep) as T;
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) out[k] = enforceVoiceDeep(v);
    return out as T;
  }
  return value;
}
