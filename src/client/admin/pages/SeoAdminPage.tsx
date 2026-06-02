import React from "react";
import PageHeader from "../components/ui/PageHeader";
import AdminCrudPage from "../components/ui/AdminCrudPage";
import AdminAnalyticsCards from "../components/ui/AdminAnalyticsCards";
import type { AdminColumn } from "../components/ui/AdminTable";
import type { FormFieldDef } from "../components/ui/AdminFormBuilder";
import {
  useSeoMetaAdminStore,
  useSeoRedirectAdminStore,
  useSeoSitemapAdminStore,
  type SeoMetaEntry,
  type SeoRedirect,
  type SeoSitemapEntry,
} from "../stores/seoStore";

type Tab = "meta" | "redirects" | "sitemap" | "robots";

const TWITTER_CARD_OPTIONS = [
  { value: "summary", label: "summary" },
  { value: "summary_large_image", label: "summary_large_image" },
  { value: "app", label: "app" },
  { value: "player", label: "player" },
];

const REDIRECT_CODE_OPTIONS = [
  { value: "301", label: "301 — Permanent" },
  { value: "302", label: "302 — Found" },
  { value: "307", label: "307 — Temporary Redirect" },
  { value: "308", label: "308 — Permanent Redirect" },
];

const CHANGEFREQ_OPTIONS = [
  "always",
  "hourly",
  "daily",
  "weekly",
  "monthly",
  "yearly",
  "never",
].map((v) => ({ value: v, label: v }));

const metaColumns: AdminColumn<SeoMetaEntry>[] = [
  { key: "path", label: "Path", width: "180px" },
  {
    key: "title",
    label: "Title",
    render: (r) => (
      <div>
        <strong>{r.title}</strong>
        <div
          style={{
            fontSize: 11,
            color: r.title.length > 60 ? "#fbbf24" : "rgba(248,250,252,0.5)",
          }}
        >
          {r.title.length}/60
        </div>
      </div>
    ),
  },
  {
    key: "description",
    label: "Description",
    render: (r) => (
      <div>
        <span style={{ fontSize: 13 }}>{r.description.slice(0, 80)}{r.description.length > 80 ? "…" : ""}</span>
        <div
          style={{
            fontSize: 11,
            color: r.description.length > 160 ? "#fbbf24" : "rgba(248,250,252,0.5)",
          }}
        >
          {r.description.length}/160
        </div>
      </div>
    ),
  },
  {
    key: "robotsIndex",
    label: "Index",
    width: "90px",
    render: (r) => (r.robotsIndex ? "✓" : "noindex"),
    value: (r) => (r.robotsIndex ? 1 : 0),
  },
];

const metaFields: FormFieldDef<SeoMetaEntry>[] = [
  { key: "path", label: "Path", type: "text", required: true, placeholder: "/stocks", span: 2 },
  { key: "title", label: "Meta Title", type: "text", required: true, span: 2, help: "Recommended: 50–60 chars" },
  { key: "description", label: "Meta Description", type: "textarea", required: true, span: 2, help: "Recommended: 140–160 chars" },
  { key: "keywords", label: "Keywords", type: "tags", span: 2 },
  { key: "canonical", label: "Canonical URL", type: "url", span: 2 },
  { key: "ogTitle", label: "OG Title", type: "text" },
  { key: "ogDescription", label: "OG Description", type: "text" },
  { key: "ogImage", label: "OG Image URL", type: "url", span: 2 },
  { key: "twitterCard", label: "Twitter Card", type: "select", options: TWITTER_CARD_OPTIONS },
  { key: "twitterSite", label: "Twitter Site", type: "text", placeholder: "@handle" },
  { key: "robotsIndex", label: "Allow Indexing", type: "checkbox" },
  { key: "robotsFollow", label: "Allow Follow", type: "checkbox" },
  { key: "schema", label: "Structured Schema (JSON-LD)", type: "textarea", span: 2, help: "Raw JSON-LD" },
  { key: "notes", label: "Internal Notes", type: "textarea", span: 2 },
];

const redirectColumns: AdminColumn<SeoRedirect>[] = [
  { key: "from", label: "From" },
  { key: "to", label: "To" },
  {
    key: "code",
    label: "Code",
    width: "90px",
    render: (r) => (
      <span
        style={{
          padding: "3px 8px",
          borderRadius: 6,
          fontSize: 11,
          fontWeight: 800,
          background:
            r.code === 301 || r.code === 308
              ? "rgba(16,185,129,0.15)"
              : "rgba(251,191,36,0.15)",
          color: r.code === 301 || r.code === 308 ? "#6ee7b7" : "#fbbf24",
        }}
      >
        {r.code}
      </span>
    ),
    value: (r) => r.code,
  },
  {
    key: "active",
    label: "Active",
    width: "80px",
    render: (r) => (r.active ? "✅" : "—"),
    value: (r) => (r.active ? 1 : 0),
  },
  { key: "hits", label: "Hits", align: "right", width: "80px" },
];

const redirectFields: FormFieldDef<SeoRedirect>[] = [
  { key: "from", label: "From Path", type: "text", required: true, placeholder: "/old-path" },
  { key: "to", label: "To Path", type: "text", required: true, placeholder: "/new-path" },
  { key: "code", label: "Status Code", type: "select", options: REDIRECT_CODE_OPTIONS, required: true },
  { key: "active", label: "Active", type: "checkbox" },
  { key: "hits", label: "Recorded Hits", type: "number", min: 0 },
];

const sitemapColumns: AdminColumn<SeoSitemapEntry>[] = [
  { key: "path", label: "Path" },
  {
    key: "priority",
    label: "Priority",
    align: "right",
    width: "100px",
    render: (r) => r.priority.toFixed(1),
    value: (r) => r.priority,
  },
  { key: "changefreq", label: "Change Freq.", width: "140px" },
  { key: "lastmod", label: "Last Modified", width: "140px" },
  {
    key: "active",
    label: "Active",
    width: "80px",
    render: (r) => (r.active ? "✅" : "—"),
    value: (r) => (r.active ? 1 : 0),
  },
];

const sitemapFields: FormFieldDef<SeoSitemapEntry>[] = [
  { key: "path", label: "Path", type: "text", required: true, placeholder: "/" },
  { key: "priority", label: "Priority (0.0–1.0)", type: "number", min: 0, max: 1, step: 0.1, required: true },
  { key: "changefreq", label: "Change Frequency", type: "select", options: CHANGEFREQ_OPTIONS, required: true },
  { key: "lastmod", label: "Last Modified", type: "date", required: true },
  { key: "active", label: "Include in sitemap.xml", type: "checkbox" },
];

const DEFAULT_ROBOTS = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api

Sitemap: https://marketspivot.com/sitemap.xml`;

function RobotsTab() {
  const [text, setText] = React.useState<string>(() => {
    try {
      return localStorage.getItem("mp-admin-seo-robots") ?? DEFAULT_ROBOTS;
    } catch {
      return DEFAULT_ROBOTS;
    }
  });
  const [savedAt, setSavedAt] = React.useState<number | null>(null);

  const save = () => {
    try {
      localStorage.setItem("mp-admin-seo-robots", text);
      setSavedAt(Date.now());
      window.setTimeout(() => setSavedAt(null), 2400);
    } catch {
      window.alert("Could not save robots.txt to local storage.");
    }
  };

  return (
    <div className="mp-admin-content">
      <PageHeader
        title="robots.txt"
        subtitle="Crawl directives for search engine bots"
        actions={
          <>
            <button type="button" className="mp-admin-link-btn" onClick={() => setText(DEFAULT_ROBOTS)}>
              Reset to default
            </button>
            <button type="button" className="mp-admin-action-btn" onClick={save}>
              {savedAt ? "✓ Saved" : "Save robots.txt"}
            </button>
          </>
        }
      />
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={18}
        style={{
          width: "100%",
          padding: 14,
          borderRadius: 10,
          background: "rgba(255,255,255,0.04)",
          color: "#f8fafc",
          border: "1px solid rgba(255,255,255,0.10)",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          fontSize: 13,
          lineHeight: 1.55,
          outline: "none",
          resize: "vertical",
        }}
      />
    </div>
  );
}

export default function SeoAdminPage() {
  const [tab, setTab] = React.useState<Tab>("meta");

  const metaItems = useSeoMetaAdminStore((s) => s.items);
  const redirectItems = useSeoRedirectAdminStore((s) => s.items);
  const sitemapItems = useSeoSitemapAdminStore((s) => s.items);

  const summary = (
    <AdminAnalyticsCards
      cards={[
        { label: "Pages with Meta", value: metaItems.length },
        {
          label: "Indexable",
          value: metaItems.filter((m) => m.robotsIndex).length,
          tone: "positive",
        },
        {
          label: "Active Redirects",
          value: redirectItems.filter((r) => r.active).length,
        },
        {
          label: "Sitemap Entries",
          value: sitemapItems.filter((s) => s.active).length,
        },
      ]}
      columns={4}
    />
  );

  return (
    <div>
      <div className="mp-admin-content" style={{ paddingBottom: 0 }}>
        <PageHeader
          title="SEO Management"
          subtitle="Meta tags, OpenGraph, Twitter cards, canonicals, redirects, sitemap, structured data"
        />
        {summary}
        <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
          {(["meta", "redirects", "sitemap", "robots"] as const).map((t) => (
            <button
              key={t}
              type="button"
              className="mp-admin-action-btn"
              onClick={() => setTab(t)}
              style={
                tab === t
                  ? undefined
                  : {
                      background: "rgba(255,255,255,0.06)",
                      color: "rgba(248,250,252,0.82)",
                      border: "1px solid rgba(255,255,255,0.10)",
                    }
              }
            >
              {t === "meta"
                ? "Meta / OG / Schema"
                : t === "redirects"
                ? "Redirects"
                : t === "sitemap"
                ? "Sitemap"
                : "robots.txt"}
            </button>
          ))}
        </div>
      </div>

      {tab === "meta" && (
        <AdminCrudPage<SeoMetaEntry>
          title="Page Meta"
          subtitle="Per-route SEO metadata, OpenGraph, Twitter cards, canonical URLs, and JSON-LD schema"
          useStore={useSeoMetaAdminStore}
          columns={metaColumns}
          formFields={metaFields}
          searchKeys={["path", "title", "description"]}
          defaultEntry={{
            path: "/",
            title: "",
            description: "",
            keywords: [],
            canonical: "",
            ogTitle: "",
            ogDescription: "",
            ogImage: "",
            twitterCard: "summary_large_image",
            twitterSite: "@marketspivot",
            robotsIndex: true,
            robotsFollow: true,
            schema: "",
            notes: "",
          }}
          exportName="seo-meta"
          validate={(entry) => {
            const errs: Partial<Record<keyof SeoMetaEntry, string>> = {};
            if (!entry.path.startsWith("/")) errs.path = "Path must start with /";
            if (metaItems.some((m) => m.path === entry.path && m.id !== entry.id))
              errs.path = "Meta already exists for this path";
            if (entry.schema) {
              try {
                JSON.parse(entry.schema);
              } catch {
                errs.schema = "Schema must be valid JSON";
              }
            }
            return errs;
          }}
        />
      )}

      {tab === "redirects" && (
        <AdminCrudPage<SeoRedirect>
          title="Redirects"
          subtitle="Path-level URL redirects with status code and analytics"
          useStore={useSeoRedirectAdminStore}
          columns={redirectColumns}
          formFields={redirectFields}
          searchKeys={["from", "to"]}
          defaultEntry={{
            from: "",
            to: "",
            code: 301,
            active: true,
            hits: 0,
          }}
          exportName="seo-redirects"
          validate={(entry) => {
            const errs: Partial<Record<keyof SeoRedirect, string>> = {};
            if (!entry.from.startsWith("/")) errs.from = "Must start with /";
            if (!entry.to.startsWith("/") && !entry.to.startsWith("http"))
              errs.to = "Must start with / or http";
            if (entry.from === entry.to) errs.to = "From and To cannot be the same";
            if (redirectItems.some((r) => r.from === entry.from && r.id !== entry.id))
              errs.from = "Redirect already defined for this path";
            return errs;
          }}
        />
      )}

      {tab === "sitemap" && (
        <AdminCrudPage<SeoSitemapEntry>
          title="Sitemap Entries"
          subtitle="sitemap.xml management — paths, priority, change frequency"
          useStore={useSeoSitemapAdminStore}
          columns={sitemapColumns}
          formFields={sitemapFields}
          searchKeys={["path"]}
          defaultEntry={{
            path: "/",
            priority: 0.5,
            changefreq: "weekly",
            lastmod: new Date().toISOString().split("T")[0],
            active: true,
          }}
          exportName="seo-sitemap"
          validate={(entry) => {
            const errs: Partial<Record<keyof SeoSitemapEntry, string>> = {};
            if (!entry.path.startsWith("/")) errs.path = "Path must start with /";
            if (entry.priority < 0 || entry.priority > 1)
              errs.priority = "Priority must be between 0.0 and 1.0";
            if (sitemapItems.some((s) => s.path === entry.path && s.id !== entry.id))
              errs.path = "Entry already exists for this path";
            return errs;
          }}
        />
      )}

      {tab === "robots" && <RobotsTab />}
    </div>
  );
}
