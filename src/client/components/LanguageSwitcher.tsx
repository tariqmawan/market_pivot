import React, { useEffect, useRef, useState } from "react";
import { SUPPORTED_LANGUAGES, useI18n, type SupportedLang } from "../i18n";

interface LanguageSwitcherProps {
  variant?: "horizontal-scroll" | "dropdown" | "strip";
  className?: string;
}

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

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || variant === "dropdown") return;

    const handleWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
        event.preventDefault();
        scrollContainer.scrollLeft += event.deltaY;
      }
    };

    scrollContainer.addEventListener("wheel", handleWheel, { passive: false });
    return () => scrollContainer.removeEventListener("wheel", handleWheel);
  }, [variant]);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || variant === "dropdown") return;

    const handleTouchStart = (event: TouchEvent) => {
      setIsDragging(true);
      setDragStart(event.touches[0].clientX);
      setScrollStart(scrollContainer.scrollLeft);
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (!isDragging) return;
      const delta = event.touches[0].clientX - dragStart;
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
  }, [dragStart, isDragging, scrollStart, variant]);

  if (variant === "dropdown") {
    return (
      <label className={`lang-switcher-select ${className}`}>
        <span className="sr-only">{t("preferredLanguage")}</span>
        <select
          value={language}
          aria-label={t("preferredLanguage")}
          onChange={(event) => handleSelect(event.target.value as SupportedLang)}
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.nativeLabel}
            </option>
          ))}
        </select>
      </label>
    );
  }

  if (variant === "strip") {
    return (
      <div className={`lang-strip ${className}`} role="navigation" aria-label={t("languageSelector")}>
        {SUPPORTED_LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            type="button"
            className={`lang-strip-btn ${language === lang.code ? "active" : ""}`}
            onClick={() => handleSelect(lang.code)}
            aria-pressed={language === lang.code}
            title={lang.nativeLabel}
          >
            <span className="lang-flag" aria-hidden="true">{lang.flag}</span>
            <span className="lang-copy">
              <span className="lang-native">{lang.nativeLabel}</span>
            </span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={`lang-scroll-container ${className}`} role="navigation" aria-label={t("languageSelector")}>
      <div className="lang-scroll-track" ref={scrollRef} role="region" aria-label={t("languageOptions")}>
        {SUPPORTED_LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            type="button"
            className={`lang-scroll-btn ${language === lang.code ? "active" : ""}`}
            onClick={() => handleSelect(lang.code)}
            aria-pressed={language === lang.code}
            title={lang.nativeLabel}
          >
            <span className="lang-flag" aria-hidden="true">{lang.flag}</span>
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
