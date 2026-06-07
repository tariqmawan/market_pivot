import React from "react";
import { adminGet } from "../api/client";
import DataTable from "../components/ui/DataTable";
import PageHeader from "../components/ui/PageHeader";
import { useI18n } from "../../i18n";



// ─── Types ────────────────────────────────────────────────────────────────────

type SeoPageKey = "Home" | "Markets" | "Crypto" | "Forex" | "Commodities" | "Regions" | "About" | "Pricing";

interface SeoPageMeta {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  canonical: string;
  robots_index: "index" | "noindex";
  robots_follow: "follow" | "nofollow";
}

interface SeoSettings {
  pages: Record<SeoPageKey, SeoPageMeta>;
  robotsTxt: string;
  sitemapEnabled: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SEO_PAGE_KEYS: SeoPageKey[] = [
  "Home", "Markets", "Crypto", "Forex", "Commodities", "Regions", "About", "Pricing",
];

const DEFAULT_ROBOTS_TXT = `User-agent: *
Allow: /

Sitemap: https://marketspivot.com/sitemap.xml`;

function buildDefaultMeta(title: string, desc: string): SeoPageMeta {
  return {
    title,
    description: desc,
    ogTitle: title,
    ogDescription: desc,
    ogImage: "",
    canonical: "",
    robots_index: "index",
    robots_follow: "follow",
  };
}

const DEFAULT_SEO_SETTINGS: SeoSettings = {
  pages: {
    Home: buildDefaultMeta(
      "MarketsPivot — Global Market Intelligence",
      "Real-time data on stocks, forex, crypto, commodities and more."
    ),
    Markets: buildDefaultMeta(
      "Markets Overview — MarketsPivot",
      "Explore global equity markets, exchanges and market movers."
    ),
    Crypto: buildDefaultMeta(
      "Crypto Markets — MarketsPivot",
      "Live cryptocurrency prices, market cap and volume data."
    ),
    Forex: buildDefaultMeta(
      "Forex & Currencies — MarketsPivot",
      "Real-time currency exchange rates and FX market data."
    ),
    Commodities: buildDefaultMeta(
      "Commodities — MarketsPivot",
      "Gold, oil, silver and agricultural commodity spot prices."
    ),
    Regions: buildDefaultMeta(
      "Regional Markets — MarketsPivot",
      "Market intelligence organized by geographic region."
    ),
    About: buildDefaultMeta(
      "About — MarketsPivot",
      "Learn about MarketsPivot and our market intelligence platform."
    ),
    Pricing: buildDefaultMeta(
      "Pricing — MarketsPivot",
      "Simple, transparent pricing for market intelligence access."
    ),
  },
  robotsTxt: DEFAULT_ROBOTS_TXT,
  sitemapEnabled: true,
};

const LS_KEY = "mp_seo_settings";

function loadFromStorage(): SeoSettings {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as SeoSettings;
      // Merge with defaults so new keys are always present
      return {
        ...DEFAULT_SEO_SETTINGS,
        ...parsed,
        pages: { ...DEFAULT_SEO_SETTINGS.pages, ...parsed.pages },
      };
    }
  } catch {
    // ignore parse errors
  }
  return DEFAULT_SEO_SETTINGS;
}

// ─── SEO Tab Component ────────────────────────────────────────────────────────

function SeoTab() {
  const { t } = useI18n();
  const [settings, setSettings] = React.useState<SeoSettings>(() => loadFromStorage());
  const [activePage, setActivePage] = React.useState<SeoPageKey>("Home");
  const [toast, setToast] = React.useState<string | null>(null);

  const meta = settings.pages[activePage];

  function updateMeta(field: keyof SeoPageMeta, value: string) {
    setSettings((prev) => ({
      ...prev,
      pages: {
        ...prev.pages,
        [activePage]: { ...prev.pages[activePage], [field]: value },
      },
    }));
  }

  function handleSave() {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(settings));
      setToast(t("adminSeo.saved"));
      setTimeout(() => setToast(null), 2800);
    } catch {
      setToast(t("adminSeo.errorSaving"));
      setTimeout(() => setToast(null), 2800);
    }
  }

  function handleReset() {
    setSettings(DEFAULT_SEO_SETTINGS);
    setToast(t("adminSeo.resetDefaults"));
    setTimeout(() => setToast(null), 2800);
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 8,
    background: "rgba(255,255,255,0.06)",
    color: "#f8fafc",
    fontSize: 14,
    fontWeight: 800,
    padding: "11px 12px",
    boxSizing: "border-box",
    outline: "none",
    fontFamily: "inherit",
  };

  const textareaStyle: React.CSSProperties = {
    ...inputStyle,
    resize: "vertical",
    minHeight: 72,
  };

  const labelStyle: React.CSSProperties = {
    display: "grid",
    gap: 6,
    color: "rgba(248,250,252,0.72)",
    fontSize: 12,
    fontWeight: 900,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  };

  const counterStyle = (len: number, max: number): React.CSSProperties => ({
    fontSize: 11,
    fontWeight: 700,
    color: len > max ? "#f87171" : "rgba(248,250,252,0.45)",
    textAlign: "right",
  });

  return (
    <div style={{ display: "grid", gap: 18 }}>

      {/* Toast */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: 24,
            right: 28,
            zIndex: 9999,
            background: "linear-gradient(135deg,#d9b16d,#a27841)",
            color: "#0f172a",
            fontWeight: 900,
            fontSize: 14,
            padding: "12px 22px",
            borderRadius: 10,
            boxShadow: "0 8px 32px rgba(0,0,0,0.38)",
            pointerEvents: "none",
          }}
        >
          {toast}
        </div>
      )}

      {/* Page selector */}
      <div className="mp-admin-card">
        <div className="mp-admin-card-head">
          <h2>{t("admin/platformpage.h0_l211")}</h2>
          <span className="mp-admin-muted">{t("admin/platformpage.h1")}</span>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          {SEO_PAGE_KEYS.map((page) => (
            <button
              key={page}
              onClick={() => setActivePage(page)}
              className="mp-admin-action-btn"
              style={
                activePage === page
                  ? {
                      background: "linear-gradient(135deg,#d9b16d,#a27841)",
                      color: "#0f172a",
                      minHeight: 36,
                      padding: "0 16px",
                      fontSize: 13,
                    }
                  : {
                      background: "rgba(255,255,255,0.06)",
                      color: "rgba(248,250,252,0.82)",
                      border: "1px solid rgba(255,255,255,0.10)",
                      minHeight: 36,
                      padding: "0 16px",
                      fontSize: 13,
                    }
              }
            >
              {page}
            </button>
          ))}
        </div>
      </div>

      {/* Meta fields */}
      <div className="mp-admin-card">
        <div className="mp-admin-card-head">
          <h2>{t("adminSeo.metaTags", { page: activePage } as any)}</h2>
          <span className="mp-admin-muted">{t("admin/platformpage.h2")}</span>
        </div>

        <div className="mp-admin-customer-form" style={{ gap: 16 }}>

          {/* Title */}
          <label style={labelStyle}>
            <span style={{ display: "flex", justifyContent: "space-between" }}>
              <span>{t("admin/platformpage.h3")}</span>
              <span style={counterStyle(meta.title.length, 60)}>
                {meta.title.length}/60
              </span>
            </span>
            <input
              type="text"
              value={meta.title}
              maxLength={80}
              onChange={(e) => updateMeta("title", e.target.value)}
              placeholder={t("admin/platformpage.h4")}
              style={inputStyle}
            />
          </label>

          {/* Meta description */}
          <label style={labelStyle}>
            <span style={{ display: "flex", justifyContent: "space-between" }}>
              <span>{t("admin/platformpage.h5")}</span>
              <span style={counterStyle(meta.description.length, 160)}>
                {meta.description.length}/160
              </span>
            </span>
            <textarea
              value={meta.description}
              maxLength={200}
              rows={3}
              onChange={(e) => updateMeta("description", e.target.value)}
              placeholder={t("admin/platformpage.h6")}
              style={textareaStyle}
            />
          </label>

          {/* Two-column: OG Title + OG Image */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <label style={labelStyle}>{t("adminSeo.ogTitle")}<input
                type="text"
                value={meta.ogTitle}
                onChange={(e) => updateMeta("ogTitle", e.target.value)}
                placeholder={t("admin/platformpage.h7")}
                style={inputStyle}
              />
            </label>
            <label style={labelStyle}>{t("adminSeo.ogImageUrl")}<input
                type="text"
                value={meta.ogImage}
                onChange={(e) => updateMeta("ogImage", e.target.value)}
                placeholder="https://..."
                style={inputStyle}
              />
            </label>
          </div>

          {/* OG Description */}
          <label style={labelStyle}>{t("adminSeo.ogDescription")}<textarea
              value={meta.ogDescription}
              rows={2}
              onChange={(e) => updateMeta("ogDescription", e.target.value)}
              placeholder={t("admin/platformpage.h8")}
              style={textareaStyle}
            />
          </label>

          {/* Canonical + robots row */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 16 }}>
            <label style={labelStyle}>{t("adminSeo.canonicalUrl")}<input
                type="text"
                value={meta.canonical}
                onChange={(e) => updateMeta("canonical", e.target.value)}
                placeholder="https://marketspivot.com/..."
                style={inputStyle}
              />
            </label>
            <label style={labelStyle}>{t("adminSeo.index")}<select
                value={meta.robots_index}
                onChange={(e) => updateMeta("robots_index", e.target.value as "index" | "noindex")}
                style={inputStyle}
              >
                <option value="index">{t("admin/platformpage.h9")}</option>
                <option value="noindex">{t("admin/platformpage.h10")}</option>
              </select>
            </label>
            <label style={labelStyle}>{t("adminSeo.follow")}<select
                value={meta.robots_follow}
                onChange={(e) => updateMeta("robots_follow", e.target.value as "follow" | "nofollow")}
                style={inputStyle}
              >
                <option value="follow">{t("admin/platformpage.h11")}</option>
                <option value="nofollow">{t("admin/platformpage.h12")}</option>
              </select>
            </label>
          </div>

        </div>
      </div>

      {/* Global settings */}
      <div className="mp-admin-card">
        <div className="mp-admin-card-head">
          <h2>{t("admin/platformpage.h13")}</h2>
          <span className="mp-admin-muted">{t("admin/platformpage.h14")}</span>
        </div>

        <div className="mp-admin-customer-form" style={{ gap: 16 }}>

          {/* Robots.txt */}
          <label style={labelStyle}>{t("adminSeo.robotsTxt")}<textarea
              value={settings.robotsTxt}
              rows={6}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, robotsTxt: e.target.value }))
              }
              placeholder={t("admin/platformpage.h0_l393")}
              style={{ ...textareaStyle, minHeight: 120, fontFamily: "monospace", fontSize: 13 }}
            />
          </label>

          {/* Sitemap toggle */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 16px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.10)",
              background: "rgba(255,255,255,0.04)",
            }}
          >
            <div>
              <div style={{ color: "#f8fafc", fontWeight: 900, fontSize: 14 }}>{t("admin/platformpage.h15")}</div>
              <div className="mp-admin-muted" style={{ marginTop: 2 }}>
                {t("adminSeo.sitemapHint")}
              </div>
            </div>
            <button
              onClick={() =>
                setSettings((prev) => ({ ...prev, sitemapEnabled: !prev.sitemapEnabled }))
              }
              style={{
                width: 52,
                height: 28,
                borderRadius: 999,
                border: "none",
                cursor: "pointer",
                background: settings.sitemapEnabled
                  ? "linear-gradient(135deg,#d9b16d,#a27841)"
                  : "rgba(255,255,255,0.12)",
                position: "relative",
                transition: "background 0.2s ease",
                flexShrink: 0,
              }}
              aria-pressed={settings.sitemapEnabled}
              title={settings.sitemapEnabled ? t("adminSeo.disableSitemap") : t("adminSeo.enableSitemap")}
            >
              <span
                style={{
                  position: "absolute",
                  top: 3,
                  left: settings.sitemapEnabled ? 26 : 3,
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: "#fff",
                  transition: "left 0.2s ease",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
                }}
              />
            </button>
          </div>

        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
        <button
          className="mp-admin-action-btn"
          onClick={handleReset}
          style={{
            background: "rgba(255,255,255,0.06)",
            color: "rgba(248,250,252,0.82)",
            border: "1px solid rgba(255,255,255,0.14)",
          }}
        >{t("adminSeo.resetToDefaults")}</button>
        <button className="mp-admin-action-btn" onClick={handleSave}>{t("adminSeo.saveSettings")}</button>
      </div>

    </div>
  );
}

// ─── Main PlatformPage ────────────────────────────────────────────────────────

export default function PlatformPage({ tab }: { tab: "api" | "seo" | "ads" | "audit" }) {
  const [rows, setRows] = React.useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = React.useState(tab !== "seo");

  const config = {
    api:   { title: "API Management",  path: "/platform/api-keys", subtitle: "Keys, rate limits, usage" },
    seo:   { title: "SEO Management",  path: "/platform/seo",      subtitle: "Meta tags, canonical URLs and robots settings" },
    ads:   { title: "Advertisements",  path: "/platform/ads",      subtitle: "Campaigns and placements" },
    audit: { title: "Audit Logs",      path: "/audit-logs",        subtitle: "Admin action trail" },
  }[tab];

  React.useEffect(() => {
    if (tab === "seo") return;
    setLoading(true);
    (async () => {
      try {
        const res = await adminGet<Record<string, unknown>[]>(
          config.path,
          tab === "audit" ? { page: 1, limit: 50 } : undefined
        );
        setRows(res.data);
      } catch {
        setRows([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [config.path, tab]);

  return (
    <div className="mp-admin-content">
      <PageHeader title={config.title} subtitle={config.subtitle} />

      {tab === "seo" ? (
        <SeoTab />
      ) : (
        <DataTable
          loading={loading}
          rows={rows}
          columns={
            tab === "audit"
              ? [
                  { key: "action",     label: "Action" },
                  { key: "resource",   label: "Resource" },
                  { key: "actorEmail", label: "Actor" },
                  {
                    key: "created_at",
                    label: "When",
                    render: (r) => new Date(String(r.created_at)).toLocaleString(),
                  },
                ]
              : [
                  { key: "name", label: "Name" },
                  { key: "id",   label: "ID" },
                ]
          }
        />
      )}
    </div>
  );
}
