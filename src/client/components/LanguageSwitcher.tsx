import React, { useRef, useEffect, useState } from "react";
import { useI18n, SUPPORTED_LANGUAGES, type SupportedLang } from "../i18n";




interface LanguageSwitcherProps {
  variant?: "horizontal-scroll" | "dropdown" | "strip";
  className?: string;
}

// Use only the languages that have actual i18next resources initialized.
// SUPPORTED_LANGUAGES comes from src/client/i18n/config.ts — single source of truth.
const FLAGS: Record<SupportedLang, string> = {
  en: "🇺🇸",
  ar: "🇸🇦",
  zh: "🇨🇳",
  fr: "🇫🇷",
  pt: "🇵🇹",
  ru: "🇷🇺",
  ja: "🇯🇵",
  ko: "🇰🇷",
  es: "🇪🇸",
  hi: "🇮🇳",
  th: "🇹🇭",
  vi: "🇻🇳",
  de: "🇩🇪",
  pl: "🇵🇱",
  tr: "🇹🇷",
  id: "🇮🇩",
  ms: "🇲🇾",
};

const getFlag = (code: SupportedLang): string => FLAGS[code] ?? "🌐";

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = "horizontal-scroll",
  className = "",
}) => {
  const { t, language, setLanguage } = useI18n();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [scrollStart, setScrollStart] = useState(0);

  const handleSelect = (code: SupportedLang) => {
    setLanguage(code);
  };

  // Mouse wheel horizontal scrolling
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || variant !== "horizontal-scroll") return;

    const handleWheel = (e: WheelEvent) => {
      // Only handle horizontal scrolling if shift key is pressed or vertical scroll in horizontal scroll container
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        scrollContainer.scrollLeft += e.deltaY;
      }
    };

    scrollContainer.addEventListener("wheel", handleWheel, { passive: false });
    return () => scrollContainer.removeEventListener("wheel", handleWheel);
  }, [variant]);

  // Touch swipe horizontal scrolling
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || variant !== "horizontal-scroll") return;

    const handleTouchStart = (e: TouchEvent) => {
      setIsDragging(true);
      setDragStart(e.touches[0].clientX);
      setScrollStart(scrollContainer.scrollLeft);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      const delta = e.touches[0].clientX - dragStart;
      scrollContainer.scrollLeft = scrollStart - delta;
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
    };

    scrollContainer.addEventListener("touchstart", handleTouchStart, false);
    scrollContainer.addEventListener("touchmove", handleTouchMove, { passive: true });
    scrollContainer.addEventListener("touchend", handleTouchEnd, false);

    return () => {
      scrollContainer.removeEventListener("touchstart", handleTouchStart);
      scrollContainer.removeEventListener("touchmove", handleTouchMove);
      scrollContainer.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging, dragStart, scrollStart, variant]);

  if (variant === "strip") {
    return (
      <div className={`lang-strip ${className}`} role="navigation" aria-label={t("src_client_components_languageswitcher__l98__h0")}>
        {SUPPORTED_LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            type="button"
            className={`lang-strip-btn ${language === lang.code ? "active" : ""}`}
            onClick={() => handleSelect(lang.code)}
            aria-pressed={language === lang.code}
            title={lang.nativeLabel}
            // Prevent duplicate rendering: key already used in DOM, lang.nativeLabel rendered once.
          >
            <span className="lang-flag" aria-hidden="true">{getFlag(lang.code)}</span>
            <span className="lang-copy">
              <span className="lang-native">{lang.nativeLabel}</span>
            </span>
          </button>
        ))}
      </div>
    );
  }

  // Horizontal scroll layout — all 17 supported languages
  return (
    <div className={`lang-scroll-container ${className}`} role="navigation" aria-label={t("src_client_components_languageswitcher__l121__h2")}>
      <div
        className="lang-scroll-track"
        ref={scrollRef}
        role="region"
        aria-label={t("src_client_components_languageswitcher__l126__h4")}
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            type="button"
            className={`lang-scroll-btn ${language === lang.code ? "active" : ""}`}
            onClick={() => handleSelect(lang.code)}
            aria-pressed={language === lang.code}
            title={lang.nativeLabel}
          >
            <span className="lang-flag" aria-hidden="true">{getFlag(lang.code)}</span>
            <span className="lang-scroll-label">
              <span className="lang-native">{lang.nativeLabel}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSwitcher;
