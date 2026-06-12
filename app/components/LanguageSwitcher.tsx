"use client";
import { useState, useEffect } from "react";
import { LANGUAGES, LANG_STORAGE_KEY } from "../i18n/config";

export function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("en");

  useEffect(() => {
    const saved = localStorage.getItem(LANG_STORAGE_KEY) ?? "en";
    setCurrent(saved);
  }, []);

  const currentLang = LANGUAGES.find((l) => l.code === current) ?? LANGUAGES[0];

  function switchTo(code: string) {
    localStorage.setItem(LANG_STORAGE_KEY, code);
    setOpen(false);
    window.location.reload();
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-all"
        aria-label="Switch language"
      >
        <span>{currentLang.flag}</span>
        <span>{currentLang.nativeName}</span>
        <span className="text-xs opacity-50">▾</span>
      </button>

      {open && (
        <>
          {/* Backdrop to close on outside click */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full mt-1 bg-white rounded-xl border border-gray-200 shadow-xl z-50 max-h-64 overflow-y-auto min-w-44">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => switchTo(lang.code)}
                className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50 text-left transition-colors ${
                  lang.code === current
                    ? "bg-orange-50 text-orange-600 font-semibold"
                    : "text-gray-700"
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.nativeName}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
