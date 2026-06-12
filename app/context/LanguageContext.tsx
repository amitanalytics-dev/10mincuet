"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { getTranslation } from "../i18n";
import type { TranslationKeys } from "../i18n";
import type { LangCode } from "../i18n/config";
import { LANG_STORAGE_KEY, DEFAULT_LANG } from "../i18n/config";

interface LanguageCtx {
  lang: LangCode;
  setLang: (l: LangCode) => void;
  t: TranslationKeys;
}

const Ctx = createContext<LanguageCtx>({
  lang: "en",
  setLang: () => {},
  t: getTranslation("en"),
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<LangCode>(DEFAULT_LANG);

  useEffect(() => {
    const saved = localStorage.getItem(LANG_STORAGE_KEY) as LangCode | null;
    if (saved) setLangState(saved);
  }, []);

  function setLang(l: LangCode) {
    setLangState(l);
    localStorage.setItem(LANG_STORAGE_KEY, l);
    document.documentElement.lang = l;
    document.documentElement.dir = l === "ur" ? "rtl" : "ltr";
  }

  return (
    <Ctx.Provider value={{ lang, setLang, t: getTranslation(lang) }}>
      {children}
    </Ctx.Provider>
  );
}

export function useLanguage() {
  return useContext(Ctx);
}
