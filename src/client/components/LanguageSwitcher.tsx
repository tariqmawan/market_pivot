import React, { useState, useRef, useEffect } from "react";
import { useI18n, languages, type LanguageCode } from "../i18n";

interface LanguageSwitcherProps {
  variant?: "dropdown" | "strip";
  className?: string;
}

// Simple flag mapping for language codes
const getFlag = (code: LanguageCode): string => {
  const flagMap: Record<LanguageCode, string> = {
    en: "🇺🇸",
    ar: "🇸🇦",
    zh: "🇨🇳",
    ja: "🇯🇵",
    ko: "🇰🇷",
    th: "🇹🇭",
    vi: "🇻🇳",
    it: "🇮🇹",
    es: "🇪🇸",
    de: "🇩🇪",
    fr: "🇫🇷",
    pt: "🇵🇹",
    ru: "🇷🇺",
    pl: "🇵🇱",
    tr: "🇹🇷",
  };
  return flagMap[code] || "🌐";
};

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = "dropdown",
  className = "",
}) => {
  const { language, setLanguage } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = languages.find((l) => l.code === language) ?? languages[0];

  const handleSelect = (code: LanguageCode) => {
    setLanguage(code);
    setOpen(false);
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (variant === "strip") {
    return (
      <div className={`lang-strip ${className}`} role="navigation" aria-label="Language selection">
        {languages.map((lang) => (
          <button
            key={lang.code}
            type="button"
            className={`lang-strip-btn ${language === lang.code ? "active" : ""}`}
            onClick={() => handleSelect(lang.code)}
            aria-pressed={language === lang.code}
            title={lang.label}
          >
            <span className="lang-flag" aria-hidden="true">{getFlag(lang.code)}</span>
            <span className="lang-copy">
              <span className="lang-native">{lang.label}</span>
              <span className="lang-subtitle">{lang.shortLabel}</span>
            </span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={`lang-switcher ${className}`} ref={ref}>
      <button
        type="button"
        className="lang-switcher-trigger"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Language: ${current.label}`}
      >
        <span className="lang-flag" aria-hidden="true">{getFlag(current.code)}</span>
        <span className="lang-code">{current.shortLabel}</span>
        <svg
          className={`lang-chevron ${open ? "open" : ""}`}
          width="12" height="12" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2.5"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <ul
          className="lang-switcher-menu"
          role="listbox"
          aria-label="Select language"
        >
          {languages.map((lang) => (
            <li
              key={lang.code}
              role="option"
              aria-selected={language === lang.code}
              className={`lang-option ${language === lang.code ? "active" : ""}`}
              onClick={() => handleSelect(lang.code)}
              onKeyDown={(e) => e.key === "Enter" && handleSelect(lang.code)}
              tabIndex={0}
            >
              <span className="lang-flag" aria-hidden="true">{getFlag(lang.code)}</span>
              <span className="lang-native">{lang.label}</span>
              <span className="lang-english">{lang.shortLabel}</span>
              {language === lang.code && (
                <svg className="lang-check" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LanguageSwitcher;
