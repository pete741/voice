// @clinicmastery/voice: the single source of truth for the Clinic Mastery voice.
// Consumed as raw TS via transpilePackages (same pattern as
// @clinicmastery/breakeven-engine), so no build step.

export {
  BANNED_WORDS,
  BANNED_WORD_PATTERNS,
  HYPHEN_REPAIRS,
  enforceVoice,
  enforceVoiceDeep,
} from "./enforce";

export {
  HARD_VOICE_RULES,
  COACHING_VOICE,
  composeSystemPrompt,
} from "./voice";
