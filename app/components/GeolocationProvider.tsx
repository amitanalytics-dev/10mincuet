"use client";
import { useEffect, useState } from "react";
import { LANGUAGES, LANG_STORAGE_KEY } from "../i18n/config";

const REGION_TO_LANG: Record<string, string> = {
  "IN-TN": "ta",
  "IN-KA": "kn",
  "IN-AP": "te",
  "IN-TG": "te",
  "IN-KL": "ml",
  "IN-MH": "mr",
  "IN-GJ": "gu",
  "IN-WB": "bn",
  "IN-OR": "or",
  "IN-PB": "pa",
  "IN-AS": "as",
  "IN-DL": "hi",
  "IN-UP": "hi",
  "IN-RJ": "hi",
  "IN-MP": "hi",
  "IN-HR": "hi",
  "IN-BR": "hi",
  "IN-UK": "hi",
  "IN-HP": "hi",
};

export function GeolocationProvider({ children }: { children: React.ReactNode }) {
  const [suggested, setSuggested] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    const dismissed = localStorage.getItem("jee_lang_dismissed");
    if (saved || dismissed) return;

    fetch("/api/geo-detect")
      .then((r) => r.json())
      .then(({ region }: { region: string }) => {
        const lang = REGION_TO_LANG[region];
        if (lang && lang !== "en") setSuggested(lang);
      })
      .catch(() => {});
  }, []);

  function accept() {
    if (!suggested) return;
    localStorage.setItem(LANG_STORAGE_KEY, suggested);
    setSuggested(null);
    window.location.reload();
  }

  function dismiss() {
    localStorage.setItem("jee_lang_dismissed", "1");
    setSuggested(null);
  }

  const langInfo = LANGUAGES.find((l) => l.code === suggested);

  return (
    <>
      {children}
      {suggested && langInfo && (
        <div className="fixed bottom-4 left-4 right-4 max-w-sm mx-auto bg-white border border-gray-200 rounded-2xl shadow-xl p-4 z-50">
          <p className="text-sm font-semibold text-gray-900 mb-3">
            {langInfo.flag} Switch to {langInfo.nativeName}?
          </p>
          <div className="flex gap-2">
            <button
              onClick={accept}
              className="flex-1 bg-orange-500 text-white font-bold py-2 rounded-lg text-sm hover:bg-orange-600 transition-all"
            >
              Yes, switch
            </button>
            <button
              onClick={dismiss}
              className="flex-1 border border-gray-200 text-gray-600 font-medium py-2 rounded-lg text-sm hover:bg-gray-50 transition-all"
            >
              No thanks
            </button>
          </div>
        </div>
      )}
    </>
  );
}
