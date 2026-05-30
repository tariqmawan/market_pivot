import React from "react";
import { useSEO } from "../lib/useSEO";

const GOLD = "#C9A87B";
const DARK = "#0f172a";
const MUTED = "#6b7280";

const sections = [
  {
    title: "Acceptance of Terms",
    content: `By accessing or using MarketsPivot, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.`,
  },
  {
    title: "Use of the Service",
    items: [
      "Use the platform only for lawful purposes and in accordance with these Terms.",
      "Not attempt to gain unauthorized access to any part of the platform.",
      "Not interfere with or disrupt the integrity or performance of the service.",
      "Not use automated tools to scrape, harvest, or extract data without written permission.",
      "Not impersonate any person or entity or misrepresent your affiliation.",
    ],
  },
  {
    title: "Market Data Disclaimer",
    content: `Information provided on MarketsPivot is for general informational purposes only. All market data, prices, and financial information are provided "as is" without warranty of any kind. This content does not constitute investment advice, financial advice, trading advice, or any other sort of advice. You should not make any financial decision based solely on information from this platform.`,
  },
  {
    title: "User Accounts",
    items: [
      "You are responsible for maintaining the confidentiality of your login credentials.",
      "You are responsible for all activity that occurs under your account.",
      "You must notify us immediately of any unauthorized use of your account.",
      "We reserve the right to terminate accounts that violate these Terms.",
    ],
  },
  {
    title: "Intellectual Property",
    content: `The MarketsPivot platform, including its design, code, and content, is owned by MarketsPivot and protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.`,
  },
  {
    title: "Subscription & Billing",
    content: `Some features of MarketsPivot require a paid subscription. Subscription fees are billed in advance on a monthly or annual basis. You may cancel at any time, and cancellation will take effect at the end of the current billing period. Refunds are not provided for partial billing periods.`,
  },
  {
    title: "Limitation of Liability",
    content: `To the fullest extent permitted by law, MarketsPivot shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the service. Our total liability shall not exceed the amount you paid in the 12 months prior to the claim.`,
  },
  {
    title: "Termination",
    content: `We may suspend or terminate your access to the service at any time, with or without cause, with or without notice. Upon termination, your right to use the service ceases immediately. Provisions that by their nature should survive termination shall survive.`,
  },
  {
    title: "Changes to Terms",
    content: `We reserve the right to modify these Terms at any time. We will provide notice of material changes by updating the "Last updated" date. Your continued use of the service after changes constitutes your acceptance of the revised Terms.`,
  },
  {
    title: "Governing Law",
    content: `These Terms shall be governed by applicable law. Any disputes relating to these Terms or the service shall be resolved through binding arbitration or in the courts of applicable jurisdiction.`,
  },
  {
    title: "Contact",
    content: `Questions about these Terms of Service can be directed to: support@marketspivot.example`,
  },
];

const TermsOfService: React.FC = () => {
  useSEO({ title: "Terms of Service", description: "MarketsPivot terms of service — acceptable use, disclaimers, and account policies.", canonical: "https://marketspivot.com/terms", noindex: true });

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: DARK }}>

      {/* Hero */}
      <section style={{
        background: `linear-gradient(135deg, #10181e 0%, #141f28 60%, #0f1e2e 100%)`,
        padding: "64px 5vw 56px",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 80% 30%, rgba(201,168,123,0.09) 0%, transparent 55%)",
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
            Terms of Service
          </h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, fontWeight: 600 }}>
            Last updated: January 1, 2026
          </p>
        </div>
      </section>

      {/* Alert banner */}
      <div style={{
        background: "rgba(201,168,123,0.08)", borderBottom: `2px solid ${GOLD}`,
        padding: "14px 5vw",
      }}>
        <p style={{ maxWidth: 840, margin: "0 auto", fontSize: 13, color: "#92400e", fontWeight: 700 }}>
          ⚠ The information on MarketsPivot is for informational purposes only and does not constitute financial or investment advice.
        </p>
      </div>

      {/* Content */}
      <section style={{ background: "#f8f9fa", padding: "0 5vw 80px" }}>
        <div style={{ maxWidth: 840, margin: "0 auto", display: "grid", gridTemplateColumns: "200px 1fr", gap: 48, paddingTop: 48 }}>

          {/* Sidebar TOC */}
          <aside style={{ position: "sticky", top: 80, alignSelf: "start" }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: MUTED, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Contents</div>
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

            <div style={{ marginTop: 32, padding: "14px 16px", background: "#ffffff", border: `1px solid #e5e7eb`, borderLeft: `3px solid ${GOLD}` }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: MUTED, textTransform: "uppercase", marginBottom: 8 }}>Quick Links</div>
              <div style={{ display: "grid", gap: 6 }}>
                <a href="/privacy" style={{ color: GOLD, fontSize: 13, fontWeight: 700, textDecoration: "none" }}>Privacy Policy →</a>
                <a href="/about" style={{ color: GOLD, fontSize: 13, fontWeight: 700, textDecoration: "none" }}>About Us →</a>
              </div>
            </div>
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

            <div style={{
              padding: "20px 24px",
              background: "#ffffff",
              borderLeft: `4px solid ${GOLD}`,
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}>
              <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.6, margin: 0 }}>
                By using MarketsPivot you agree to these Terms. Questions?{" "}
                <a href="mailto:support@marketspivot.example" style={{ color: GOLD, fontWeight: 700 }}>
                  Contact us
                </a>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsOfService;
