import React from "react";
import { Link, useParams } from "react-router-dom";
import "../styles/index.css";
import { useI18n } from "../i18n";
import { translateStatic } from "../i18n/translate";



/**
 * Static category-page config. Each entry now stores *translation keys* instead
 * of hardcoded English display text, so the language switcher re-renders them
 * immediately via `t(key, englishFallback)`.
 */
interface CategoryConfig {
  eyebrowKey: string;
  titleKey: string;
  descriptionKey: string;
  icon: string;
  items: Array<{ nameKey: string; value: string; change: number }>;
  features: Array<{ key: string }>;
  insights: Array<{ key: string }>;
  cta: {
    eyebrowKey: string;
    titleKey: string;
    descriptionKey: string;
    buttonKey: string;
  };
  metricLabels: {
    itemsCount: string;
    updatesDaily: string;
    coverage: string;
  };
  metricValues: {
    itemsCountDefault: string;
    updatesDaily: string;
    coverage: string;
  };
}

const categoryConfigs: Record<string, CategoryConfig> = {
  "commodities/energy": {
    eyebrowKey: "pages.categories.commoditiesEnergy.eyebrow",
    titleKey: "pages.categories.commoditiesEnergy.title",
    descriptionKey: "pages.categories.commoditiesEnergy.description",
    icon: "⚡",
    items: [
      { nameKey: "pages.categoriesItems.commodities.energy.wti", value: "$82.40", change: -0.42 },
      { nameKey: "pages.categoriesItems.commodities.energy.brent", value: "$85.20", change: -0.35 },
      { nameKey: "pages.categoriesItems.commodities.energy.naturalGas", value: "$2.85", change: 1.2 },
      { nameKey: "pages.categoriesItems.commodities.energy.coal", value: "$185.50", change: 0.15 },
    ],
    features: [
      { key: "pages.categories.commoditiesEnergy.features.spotPrices" },
      { key: "pages.categories.commoditiesEnergy.features.futuresContracts" },
      { key: "pages.categories.commoditiesEnergy.features.supplyDemandAnalysis" },
      { key: "pages.categories.commoditiesEnergy.features.geopoliticalImpacts" },
    ],
    insights: [
      { key: "pages.categories.commoditiesEnergy.insights.opec" },
      { key: "pages.categories.commoditiesEnergy.insights.usInventory" },
      { key: "pages.categories.commoditiesEnergy.insights.globalDemand" },
      { key: "pages.categories.commoditiesEnergy.insights.seasonalPatterns" },
    ],
    cta: {
      eyebrowKey: "categorypage.h14",
      titleKey: "categorypage.h15",
      descriptionKey: "categorypage.ctaDescription",
      buttonKey: "categorypage.openUserPanel",
    },
    metricLabels: {
      itemsCount: "categorypage.h3",
      updatesDaily: "categorypage.h4",
      coverage: "categorypage.h6",
    },
    metricValues: {
      itemsCountDefault: "categorypage.multiple",
      updatesDaily: "categorypage.h5",
      coverage: "categorypage.h7",
    },
  },
  "commodities/metals": {
    eyebrowKey: "pages.categories.commoditiesMetals.eyebrow",
    titleKey: "pages.categories.commoditiesMetals.title",
    descriptionKey: "pages.categories.commoditiesMetals.description",
    icon: "💎",
    items: [
      { nameKey: "pages.categoriesItems.commodities.metals.gold", value: "$2,045/oz", change: 0.55 },
      { nameKey: "pages.categoriesItems.commodities.metals.silver", value: "$24.35/oz", change: 0.8 },
      { nameKey: "pages.categoriesItems.commodities.metals.copper", value: "$3.82/lb", change: -0.25 },
      { nameKey: "pages.categoriesItems.commodities.metals.platinum", value: "$1,025/oz", change: 0.1 },
    ],
    features: [
      { key: "pages.categories.commoditiesMetals.features.preciousMetals" },
      { key: "pages.categories.commoditiesMetals.features.industrialMetals" },
      { key: "pages.categories.commoditiesMetals.features.futuresPricing" },
      { key: "pages.categories.commoditiesMetals.features.safeHavenFlows" },
    ],
    insights: [
      { key: "pages.categories.commoditiesMetals.insights.usdStrength" },
      { key: "pages.categories.commoditiesMetals.insights.fedPolicyImpact" },
      { key: "pages.categories.commoditiesMetals.insights.industrialDemand" },
      { key: "pages.categories.commoditiesMetals.insights.inflationHedge" },
    ],
    cta: {
      eyebrowKey: "categorypage.h14",
      titleKey: "categorypage.h15",
      descriptionKey: "categorypage.ctaDescription",
      buttonKey: "categorypage.openUserPanel",
    },
    metricLabels: {
      itemsCount: "categorypage.h3",
      updatesDaily: "categorypage.h4",
      coverage: "categorypage.h6",
    },
    metricValues: {
      itemsCountDefault: "categorypage.multiple",
      updatesDaily: "categorypage.h5",
      coverage: "categorypage.h7",
    },
  },
  "commodities/agriculture": {
    eyebrowKey: "pages.categories.commoditiesAgriculture.eyebrow",
    titleKey: "pages.categories.commoditiesAgriculture.title",
    descriptionKey: "pages.categories.commoditiesAgriculture.description",
    icon: "🌾",
    items: [
      { nameKey: "pages.categoriesItems.commodities.agriculture.wheat", value: "$718.50", change: -1.2 },
      { nameKey: "pages.categoriesItems.commodities.agriculture.corn", value: "$485.25", change: 0.45 },
      { nameKey: "pages.categoriesItems.commodities.agriculture.soybeans", value: "$1,245.75", change: -0.85 },
      { nameKey: "pages.categoriesItems.commodities.agriculture.sugar", value: "$21.45", change: 0.3 },
    ],
    features: [
      { key: "pages.categories.commoditiesAgriculture.features.cropCycles" },
      { key: "pages.categories.commoditiesAgriculture.features.weatherImpacts" },
      { key: "pages.categories.commoditiesAgriculture.features.supplyEstimates" },
      { key: "pages.categories.commoditiesAgriculture.features.seasonalTrends" },
    ],
    insights: [
      { key: "pages.categories.commoditiesAgriculture.insights.harvestReports" },
      { key: "pages.categories.commoditiesAgriculture.insights.weatherPatterns" },
      { key: "pages.categories.commoditiesAgriculture.insights.globalSupply" },
      { key: "pages.categories.commoditiesAgriculture.insights.demandShifts" },
    ],
    cta: {
      eyebrowKey: "categorypage.h14",
      titleKey: "categorypage.h15",
      descriptionKey: "categorypage.ctaDescription",
      buttonKey: "categorypage.openUserPanel",
    },
    metricLabels: {
      itemsCount: "categorypage.h3",
      updatesDaily: "categorypage.h4",
      coverage: "categorypage.h6",
    },
    metricValues: {
      itemsCountDefault: "categorypage.multiple",
      updatesDaily: "categorypage.h5",
      coverage: "categorypage.h7",
    },
  },
  "commodities/industrial": {
    eyebrowKey: "pages.categories.commoditiesIndustrial.eyebrow",
    titleKey: "pages.categories.commoditiesIndustrial.title",
    descriptionKey: "pages.categories.commoditiesIndustrial.description",
    icon: "🏭",
    items: [
      { nameKey: "pages.categoriesItems.commodities.industrial.lithium", value: "$520/ton", change: 2.1 },
      { nameKey: "pages.categoriesItems.commodities.industrial.steel", value: "$485/ton", change: -0.6 },
      { nameKey: "pages.categoriesItems.commodities.industrial.aluminum", value: "$2,450/ton", change: 0.35 },
      { nameKey: "pages.categoriesItems.commodities.industrial.uranium", value: "$85.50", change: 1.45 },
    ],
    features: [
      { key: "pages.categories.commoditiesIndustrial.features.energyTransition" },
      { key: "pages.categories.commoditiesIndustrial.features.manufacturingDemand" },
      { key: "pages.categories.commoditiesIndustrial.features.evDemand" },
      { key: "pages.categories.commoditiesIndustrial.features.techUsage" },
    ],
    insights: [
      { key: "pages.categories.commoditiesIndustrial.insights.greenTransition" },
      { key: "pages.categories.commoditiesIndustrial.insights.supplyChain" },
      { key: "pages.categories.commoditiesIndustrial.insights.demandCycle" },
      { key: "pages.categories.commoditiesIndustrial.insights.technologyTrends" },
    ],
    cta: {
      eyebrowKey: "categorypage.h14",
      titleKey: "categorypage.h15",
      descriptionKey: "categorypage.ctaDescription",
      buttonKey: "categorypage.openUserPanel",
    },
    metricLabels: {
      itemsCount: "categorypage.h3",
      updatesDaily: "categorypage.h4",
      coverage: "categorypage.h6",
    },
    metricValues: {
      itemsCountDefault: "categorypage.multiple",
      updatesDaily: "categorypage.h5",
      coverage: "categorypage.h7",
    },
  },
  "news/regions": {
    eyebrowKey: "pages.categories.newsRegions.eyebrow",
    titleKey: "pages.categories.newsRegions.title",
    descriptionKey: "pages.categories.newsRegions.description",
    icon: "🌍",
    items: [],
    features: [
      { key: "pages.categories.newsRegions.features.americasNews" },
      { key: "pages.categories.newsRegions.features.europeCoverage" },
      { key: "pages.categories.newsRegions.features.asiaPacific" },
      { key: "pages.categories.newsRegions.features.emeaUpdates" },
    ],
    insights: [
      { key: "pages.categories.newsRegions.insights.regionalGdp" },
      { key: "pages.categories.newsRegions.insights.earningsSeason" },
      { key: "pages.categories.newsRegions.insights.centralBanks" },
      { key: "pages.categories.newsRegions.insights.tradePolicies" },
    ],
    cta: {
      eyebrowKey: "categorypage.h14",
      titleKey: "categorypage.h15",
      descriptionKey: "categorypage.ctaDescription",
      buttonKey: "categorypage.openUserPanel",
    },
    metricLabels: {
      itemsCount: "categorypage.h3",
      updatesDaily: "categorypage.h4",
      coverage: "categorypage.h6",
    },
    metricValues: {
      itemsCountDefault: "categorypage.multiple",
      updatesDaily: "categorypage.h5",
      coverage: "categorypage.h7",
    },
  },
  "news/sectors": {
    eyebrowKey: "pages.categories.newsSectors.eyebrow",
    titleKey: "pages.categories.newsSectors.title",
    descriptionKey: "pages.categories.newsSectors.description",
    icon: "📈",
    items: [],
    features: [
      { key: "pages.categories.newsSectors.features.techCoverage" },
      { key: "pages.categories.newsSectors.features.financialNews" },
      { key: "pages.categories.newsSectors.features.healthcareUpdates" },
      { key: "pages.categories.newsSectors.features.energySector" },
    ],
    insights: [
      { key: "pages.categories.newsSectors.insights.earningsReports" },
      { key: "pages.categories.newsSectors.insights.industryTrends" },
      { key: "pages.categories.newsSectors.insights.maActivity" },
      { key: "pages.categories.newsSectors.insights.regulatoryNews" },
    ],
    cta: {
      eyebrowKey: "categorypage.h14",
      titleKey: "categorypage.h15",
      descriptionKey: "categorypage.ctaDescription",
      buttonKey: "categorypage.openUserPanel",
    },
    metricLabels: {
      itemsCount: "categorypage.h3",
      updatesDaily: "categorypage.h4",
      coverage: "categorypage.h6",
    },
    metricValues: {
      itemsCountDefault: "categorypage.multiple",
      updatesDaily: "categorypage.h5",
      coverage: "categorypage.h7",
    },
  },
  "news/crypto": {
    eyebrowKey: "pages.categories.newsCrypto.eyebrow",
    titleKey: "pages.categories.newsCrypto.title",
    descriptionKey: "pages.categories.newsCrypto.description",
    icon: "₿",
    items: [],
    features: [
      { key: "pages.categories.newsCrypto.features.priceMovements" },
      { key: "pages.categories.newsCrypto.features.regulation" },
      { key: "pages.categories.newsCrypto.features.onChainData" },
      { key: "pages.categories.newsCrypto.features.exchangeNews" },
    ],
    insights: [
      { key: "pages.categories.newsCrypto.insights.regulatoryUpdates" },
      { key: "pages.categories.newsCrypto.insights.protocolNews" },
      { key: "pages.categories.newsCrypto.insights.marketSentiment" },
      { key: "pages.categories.newsCrypto.insights.developerActivity" },
    ],
    cta: {
      eyebrowKey: "categorypage.h14",
      titleKey: "categorypage.h15",
      descriptionKey: "categorypage.ctaDescription",
      buttonKey: "categorypage.openUserPanel",
    },
    metricLabels: {
      itemsCount: "categorypage.h3",
      updatesDaily: "categorypage.h4",
      coverage: "categorypage.h6",
    },
    metricValues: {
      itemsCountDefault: "categorypage.multiple",
      updatesDaily: "categorypage.h5",
      coverage: "categorypage.h7",
    },
  },
  "news/alerts": {
    eyebrowKey: "pages.categories.newsAlerts.eyebrow",
    titleKey: "pages.categories.newsAlerts.title",
    descriptionKey: "pages.categories.newsAlerts.description",
    icon: "🚨",
    items: [],
    features: [
      { key: "pages.categories.newsAlerts.features.breakingNews" },
      { key: "pages.categories.newsAlerts.features.marketMoving" },
      { key: "pages.categories.newsAlerts.features.criticalAlerts" },
      { key: "pages.categories.newsAlerts.features.watchlistAlerts" },
    ],
    insights: [
      { key: "pages.categories.newsAlerts.insights.earningsSurprises" },
      { key: "pages.categories.newsAlerts.insights.economicData" },
      { key: "pages.categories.newsAlerts.insights.policyChanges" },
      { key: "pages.categories.newsAlerts.insights.macroEvents" },
    ],
    cta: {
      eyebrowKey: "categorypage.h14",
      titleKey: "categorypage.h15",
      descriptionKey: "categorypage.ctaDescription",
      buttonKey: "categorypage.openUserPanel",
    },
    metricLabels: {
      itemsCount: "categorypage.h3",
      updatesDaily: "categorypage.h4",
      coverage: "categorypage.h6",
    },
    metricValues: {
      itemsCountDefault: "categorypage.multiple",
      updatesDaily: "categorypage.h5",
      coverage: "categorypage.h7",
    },
  },
};

const CategoryPage: React.FC = () => {
  const { t } = useI18n();
  const tx = (key: string) => translateStatic(t, key, key);
  const params = useParams<{ "*"?: string }>();
  const path = params["*"] || "news/alerts";
  const config = categoryConfigs[path];

  if (!config) {
    return (
      <div className="page intelligence-page">
        <div className="section-heading">
          <p className="eyebrow">{t("categorypage.h0")}</p>
          <h1>{t("categorypage.h1")}</h1>
          <p>{t("categorypage.h2")}</p>
        </div>
        <Link to="/dashboard" className="primary-action" style={{ textDecoration: "none" }}>
          {t("categorypage.backToDashboard")}
        </Link>
      </div>
    );
  }

  return (
    <div className="page intelligence-page">
      <section className="coverage-hero">
        <div>
          <p className="eyebrow">{tx(config.eyebrowKey)}</p>
          <h1>{tx(config.titleKey)}</h1>
          <p>{tx(config.descriptionKey)}</p>
        </div>

        <div className="metric-strip">
          <div className="metric-tile">
            <span>{tx(config.metricLabels.itemsCount)}</span>
            <strong>{config.items.length || tx(config.metricValues.itemsCountDefault)}</strong>
          </div>
          <div className="metric-tile">
            <span>{tx(config.metricLabels.updatesDaily)}</span>
            <strong>{tx(config.metricValues.updatesDaily)}</strong>
          </div>
          <div className="metric-tile">
            <span>{tx(config.metricLabels.coverage)}</span>
            <strong>{tx(config.metricValues.coverage)}</strong>
          </div>
        </div>
      </section>

      {config.items.length > 0 && (
        <section style={{ marginBottom: "48px" }}>
          <div style={{ marginBottom: "24px" }}>
            <p className="eyebrow">{t("categorypage.h8")}</p>
            <h2>{t("categorypage.h9")}</h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "12px",
            }}
          >
            {config.items.map((item) => (
              <div
                key={item.nameKey}
                style={{
                  padding: "16px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "6px",
                  backgroundColor: "#f8fafc",
                }}
              >
                <p style={{ fontSize: "12px", fontWeight: 600, color: "#475569", marginBottom: "8px" }}>
                  {tx(item.nameKey)}
                </p>
                <strong style={{ fontSize: "18px", display: "block" }}>{item.value}</strong>
                <em
                  style={{
                    fontSize: "12px",
                    fontStyle: "normal",
                    fontWeight: 600,
                    color: item.change >= 0 ? "#059669" : "#dc2626",
                    display: "block",
                    marginTop: "4px",
                  }}
                >
                  {item.change >= 0 ? "+" : ""}
                  {item.change.toFixed(2)}%
                </em>
              </div>
            ))}
          </div>
        </section>
      )}

      <section style={{ marginBottom: "48px" }}>
        <div style={{ marginBottom: "24px" }}>
          <p className="eyebrow">{t("categorypage.h10")}</p>
          <h2>{t("categorypage.h11")}</h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "12px",
          }}
        >
          {config.features.map((feature) => (
            <div
              key={feature.key}
              style={{
                padding: "16px",
                border: "1px solid #e2e8f0",
                borderRadius: "6px",
                backgroundColor: "#fff",
              }}
            >
              <strong style={{ display: "block", marginBottom: "8px" }}>{tx(feature.key)}</strong>
              <p style={{ fontSize: "12px", color: "#475569" }}>{tx("categorypage.featureDescription")}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: "48px" }}>
        <div style={{ marginBottom: "24px" }}>
          <p className="eyebrow">{t("categorypage.h12")}</p>
          <h2>{t("categorypage.h13")}</h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "12px",
          }}
        >
          {config.insights.map((insight) => (
            <div
              key={insight.key}
              style={{
                padding: "16px",
                border: "2px solid #A27841",
                borderRadius: "6px",
                backgroundColor: "rgba(162, 120, 65, 0.05)",
              }}
            >
              <strong style={{ color: "#A27841" }}>{tx(insight.key)}</strong>
              <p style={{ fontSize: "12px", color: "#475569", marginTop: "8px" }}>{tx("categorypage.insightDescription")}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        style={{
          marginTop: "48px",
          padding: "32px",
          backgroundColor: "rgba(162, 120, 65, 0.08)",
          borderRadius: "8px",
          border: "1px solid rgba(162, 120, 65, 0.2)",
          textAlign: "center",
        }}
      >
        <p className="eyebrow">{tx(config.cta.eyebrowKey)}</p>
        <h3>{tx(config.cta.titleKey)}</h3>
        <p style={{ color: "#475569", marginTop: "8px", marginBottom: "16px" }}>{tx(config.cta.descriptionKey)}</p>
        <Link to="/user" className="primary-action" style={{ textDecoration: "none" }}>
          {tx(config.cta.buttonKey)}
        </Link>
      </section>
    </div>
  );
};

export default CategoryPage;
