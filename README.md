# @clinicmastery/voice

The single source of truth for the Clinic Mastery voice, shared across products
so it never drifts between the marketing site, the in-app copilot (Allie), and
the therapist mentor.

Consumed as raw TypeScript via `transpilePackages` (the same pattern as
`@clinicmastery/breakeven-engine`), so there is no build step.

## What it exports

**Voice DNA (persona-neutral)**
- `COACHING_VOICE` — how a Clinic Mastery coach talks: warm, direct, wins first,
  the numbers are the scoreboard. Distilled from hundreds of real coaching calls.
- `HARD_VOICE_RULES` — the non-negotiable rules (no em dashes, no hyphenated
  compounds, no agency speak, specific over abstract, plain human sentences).
- `composeSystemPrompt(parts)` — join system-prompt parts consistently.

**Mechanical enforcement**
- `enforceVoice(text)` — guarantees the hard rules on a string after generation
  (em/en dashes become commas, known hyphenated compounds are repaired, banned
  words and residual hyphenation are flagged).
- `enforceVoiceDeep(value)` — the same over every string in a structured value.
- `BANNED_WORDS`, `BANNED_WORD_PATTERNS`, `HYPHEN_REPAIRS` — the underlying lists.

## How a product uses it

Wrap your own identity around the shared DNA, then enforce after generation:

```ts
import {
  COACHING_VOICE,
  HARD_VOICE_RULES,
  composeSystemPrompt,
  enforceVoiceDeep,
} from "@clinicmastery/voice";

const system = composeSystemPrompt([ALLIE_PERSONA, COACHING_VOICE, HARD_VOICE_RULES]);
// ...generate...
const safe = enforceVoiceDeep(modelResult);
```

The DNA is deliberately persona-neutral: it is the STYLE, not the "who". Allie
never claims to be Pete; the marketing site's assistant is Pete's AI. Both speak
the same voice from here.
