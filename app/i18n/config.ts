export const LANGUAGES = [
  { code: "en", name: "English",   nativeName: "English",    flag: "🇬🇧", dir: "ltr" },
  { code: "hi", name: "Hindi",     nativeName: "हिंदी",       flag: "🇮🇳", dir: "ltr" },
  { code: "bn", name: "Bengali",   nativeName: "বাংলা",       flag: "🇮🇳", dir: "ltr" },
  { code: "te", name: "Telugu",    nativeName: "తెలుగు",      flag: "🇮🇳", dir: "ltr" },
  { code: "mr", name: "Marathi",   nativeName: "मराठी",       flag: "🇮🇳", dir: "ltr" },
  { code: "ta", name: "Tamil",     nativeName: "தமிழ்",       flag: "🇮🇳", dir: "ltr" },
  { code: "gu", name: "Gujarati",  nativeName: "ગુજરાતી",     flag: "🇮🇳", dir: "ltr" },
  { code: "kn", name: "Kannada",   nativeName: "ಕನ್ನಡ",       flag: "🇮🇳", dir: "ltr" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം",      flag: "🇮🇳", dir: "ltr" },
  { code: "or", name: "Odia",      nativeName: "ଓଡ଼ିଆ",       flag: "🇮🇳", dir: "ltr" },
  { code: "pa", name: "Punjabi",   nativeName: "ਪੰਜਾਬੀ",      flag: "🇮🇳", dir: "ltr" },
  { code: "as", name: "Assamese",  nativeName: "অসমীয়া",     flag: "🇮🇳", dir: "ltr" },
  { code: "ur", name: "Urdu",      nativeName: "اردو",        flag: "🇮🇳", dir: "rtl" },
] as const;

export type LangCode = typeof LANGUAGES[number]["code"];
export const DEFAULT_LANG: LangCode = "en";
export const LANG_STORAGE_KEY = "jee_lang_v1";
