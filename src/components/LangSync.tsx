"use client";

import { useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

/**
 * Keeps <html lang="…"> in sync with the active language.
 * Must be rendered inside LanguageProvider.
 * Uses a side-effect only — renders nothing.
 */
export default function LangSync() {
  const { language } = useLanguage();

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return null;
}
