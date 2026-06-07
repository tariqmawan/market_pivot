import React from "react";
import { useSEO } from "../lib/useSEO";
import { useI18n } from "../i18n";



const GOLD = "#C9A87B";
const DARK = "#0f172a";
const MUTED = "#6b7280";

const sections = [
  {
    title: "Overview",
    content: `This Privacy Policy explains how MarketsPivot ("we", "our", "us") collects, uses, and shares information when you use our website and services. By accessing MarketsPivot, you agree to the practices described in this policy.`,
  },
  {
    title: "Information We Collect",
    items: [
      "Account information (name, email address) when you create an account.",
      "Usage data (pages viewed, features used, session duration) to improve our services.",
      "Technical data (IP address, browser type, device information) transmitted by your browser.",
      "Preferences and settings you configure within the platform.",
    ],
  },
  {
    title: "How We Use Your Information",
    items: [
      "To provide, maintain, and improve the MarketsPivot platform.",
      "To personalize content and tailor market data to your interests.",
      "To send account-related notifications and service updates.",
      "To monitor security, detect fraud, and enforce our terms.",
      "To analyze platform usage patterns and improve user experience.",
    ],
  },
  {
    title: "Data Sharing",
    content: `We do not sell your personal information. We may share data with trusted service providers who assist in operating the platform (e.g., cloud infrastructure, analytics), and where disclosure is required by law or regulatory authority.`,
  },
  {
    title: "Cookies & Tracking",
    content: `We use cookies and similar technologies to maintain sessions, remember preferences, and analyze traffic. You may configure your browser to refuse cookies, though some features may not function correctly without them.`,
  },
  {
    title: "Data Retention",
    content: `We retain your account information for as long as your account is active. You may request deletion of your data by contacting us. Certain data may be retained for legal or compliance purposes even after account closure.`,
  },
  {
    title: "Your Rights",
    items: [
      "Access and review the personal data we hold about you.",
      "Request correction of inaccurate or incomplete data.",
      "Request deletion of your account and associated data.",
      "Object to or restrict certain processing of your data.",
      "Contact us with any privacy concerns at support@marketspivot.example.",
    ],
  },
  {
    title: "Security",
    content: `We implement industry-standard security measures including HTTPS encryption, hashed password storage, and access controls. No method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.`,
  },
  {
    title: "Changes to This Policy",
    content: `We may update this Privacy Policy from time to time. We will notify you of significant changes by updating the "Last updated" date at the top of this page. Continued use of the platform after changes constitutes your acceptance.`,
  },
  {
    title: "Contact",
    content: `Questions about this Privacy Policy can be directed to: support@marketspivot.example`,
  },
];

const PrivacyPolicy: React.FC = () => {
  const { t } = useI18n();
  useSEO({ title: "Privacy Policy", description: "MarketsPivot privacy policy — how we collect, use, and protect your data.", canonical: "https://marketspivot.com/privacy", noindex: true });

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: DARK }}>

      {/* Hero */}
      <section style={{
        background: `linear-gradient(135deg, #0f1e2e 0%, #162030 60%, #1a2a3a 100%)`,
        padding: "64px 5vw 56px",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 15% 50%, rgba(201,168,123,0.1) 0%, transparent 55%)",
          pointerEvents: "none",
        }} />
        <div style={{ maxWidth: 760, position: "relative" }}>
          <div style={{
            display: "inline-block", padding: "4px 12px", marginBottom: 20,
            border: `1px solid rgba(201,168,123,0.35)`,
            background: "rgba(201,168,123,0.08)",
            color: GOLD, fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase",
          }}>
            Legal
          </div>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, color: "#ffffff", lineHeight: 1.1, marginBottom: 14 }}>
            Privacy Policy
          </h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, fontWeight: 600 }}>
            Last updated: January 1, 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section style={{ background: "#f8f9fa", padding: "0 5vw 80px" }}>
        <div style={{ maxWidth: 840, margin: "0 auto", display: "grid", gridTemplateColumns: "200px 1fr", gap: 48, paddingTop: 48 }}>

          {/* Sidebar TOC */}
          <aside style={{ position: "sticky", top: 80, alignSelf: "start" }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: MUTED, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>{t("privacypolicy.h0")}</div>
            <nav style={{ display: "grid", gap: 2 }}>
              {sections.map((s) => (
                <a
                  key={s.title}
                  href={`#${s.title.toLowerCase().replace(/\s+/g, "-")}`}
                  style={{
                    color: MUTED, fontSize: 13, fontWeight: 600, textDecoration: "none",
                    padding: "5px 0 5px 10px",
                    borderLeft: `2px solid #e5e7eb`,
                    transition: "color 0.2s, border-color 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = GOLD; e.currentTarget.style.borderLeftColor = GOLD; }}
                  onMouseLeave={e => { e.currentTarget.style.color = MUTED; e.currentTarget.style.borderLeftColor = "#e5e7eb"; }}
                >
                  {s.title}
                </a>
              ))}
            </nav>
          </aside>

          {/* Sections */}
          <div style={{ display: "grid", gap: 40 }}>
            {sections.map((s, i) => (
              <div key={i} id={s.title.toLowerCase().replace(/\s+/g, "-")}
                style={{ paddingBottom: 40, borderBottom: i < sections.length - 1 ? "1px solid #e5e7eb" : "none" }}
              >
                <h2 style={{
                  fontSize: 18, fontWeight: 800, color: DARK, marginBottom: 14,
                  display: "flex", alignItems: "center", gap: 10,
                }}>
                  <span style={{ width: 4, height: 18, background: GOLD, display: "inline-block", flexShrink: 0 }} />
                  {s.title}
                </h2>
                {s.content && (
                  <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.75 }}>{s.content}</p>
                )}
                {s.items && (
                  <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 10 }}>
                    {s.items.map((item, j) => (
                      <li key={j} style={{ display: "flex", gap: 10, fontSize: 15, color: "#374151", lineHeight: 1.65 }}>
                        <span style={{ color: GOLD, fontWeight: 800, flexShrink: 0, marginTop: 2 }}>→</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            {/* Footer note */}
            <div style={{
              padding: "20px 24px",
              background: "#ffffff",
              borderLeft: `4px solid ${GOLD}`,
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}>
              <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.6, margin: 0 }}>
                This policy applies to all users of MarketsPivot. If you have questions, please contact{" "}
                <a href="mailto:support@marketspivot.example" style={{ color: GOLD, fontWeight: 700 }}>
                  support@marketspivot.example
                </a>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
