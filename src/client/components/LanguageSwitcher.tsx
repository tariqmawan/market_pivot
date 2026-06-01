import React, { useRef, useEffect, useState } from "react";
import { useI18n, languages, type LanguageCode } from "../i18n";

interface LanguageSwitcherProps {
  variant?: "horizontal-scroll" | "dropdown" | "strip";
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
  variant = "horizontal-scroll",
  className = "",
}) => {
  const { language, setLanguage } = useI18n();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [scrollStart, setScrollStart] = useState(0);

  const handleSelect = (code: LanguageCode) => {
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

  // Horizontal scroll layout - all 15 languages visible with scroll
  return (
    <div className={`lang-scroll-container ${className}`} role="navigation" aria-label="Language selection">
      <div
        className="lang-scroll-track"
        ref={scrollRef}
        role="region"
        aria-label="Scrollable language options"
      >
        {languages.map((lang) => (
          <button
            key={lang.code}
            type="button"
            className={`lang-scroll-btn ${language === lang.code ? "active" : ""}`}
            onClick={() => handleSelect(lang.code)}
            aria-pressed={language === lang.code}
            title={lang.label}
          >
            <span className="lang-flag" aria-hidden="true">{getFlag(lang.code)}</span>
            <span className="lang-scroll-label">
              <span className="lang-native">{lang.label}</span>
              <span className="lang-code">{lang.shortLabel}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSwitcher;
