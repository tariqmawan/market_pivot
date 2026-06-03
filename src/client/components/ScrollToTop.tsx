import React from "react";
import { useLocation } from "react-router-dom";

/**
 * Scroll the window to the top on every pathname change.
 * Preserves explicit `#hash` jumps if present.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  React.useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.replace("#", ""));
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, hash]);

  return null;
}
