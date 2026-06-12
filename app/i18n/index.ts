import { en } from "./translations/en";
import { hi } from "./translations/hi";
import { bn } from "./translations/bn";
import { te } from "./translations/te";
import { mr } from "./translations/mr";
import { ta } from "./translations/ta";
import { gu } from "./translations/gu";
import { kn } from "./translations/kn";
import { ml } from "./translations/ml";
import { or } from "./translations/or";
import { pa } from "./translations/pa";
import { as as as_ } from "./translations/as";
import { ur } from "./translations/ur";
import type { LangCode } from "./config";
import type { TranslationKeys } from "./translations/en";

// Locale dicts are now Partial<TranslationKeys> — missing keys fall back to en
// at the key level (not the whole object), so we can ship new feature labels
// in English first and translate them in a follow-up pass via
// scripts/translate-i18n.mjs without breaking the build.
export const translations: Record<LangCode, Partial<TranslationKeys>> = {
  en, hi, bn, te, mr, ta, gu, kn, ml, or, pa, as: as_, ur,
};

export function getTranslation(lang: LangCode | string): TranslationKeys {
  const dict = translations[lang as LangCode];
  if (!dict || lang === "en") return en;
  return { ...en, ...dict };
}

export type { TranslationKeys };
