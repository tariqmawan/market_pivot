import React from "react";
import { Link } from "react-router-dom";
import { useFeatureAccess } from "./hooks";
import { getFeatureRule } from "./featureMatrix";
import { PLANS } from "./plans";
import { useI18n } from "../i18n";

export interface FeatureGateProps {
  /** Feature key from the feature matrix. */
  feature: string;
  /** Content to render when the user has access. */
  children: React.ReactNode;
  /**
   * Optional fallback content. When omitted, an <UpgradePrompt/> is rendered
   * for premium features, and children render untouched for free features.
   */
  fallback?: React.ReactNode;
  /**
   * When true, the gate hides children entirely on lock instead of showing
   * an upgrade prompt. Useful for partial UI like buttons in dense toolbars.
   */
  silent?: boolean;
}

const lockSvg = (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

/**
 * Renders children if the current plan covers the feature. Otherwise
 * renders a graceful upgrade prompt with a CTA to /pricing.
 *
 * Usage:
 *   <FeatureGate feature="advanced_screener">
 *     <AdvancedScreenerPanel />
 *   </FeatureGate>
 */
export const FeatureGate: React.FC<FeatureGateProps> = ({ feature, children, fallback, silent }) => {
  const access = useFeatureAccess(feature);
  if (access.allowed) return <>{children}</>;
  if (silent) return null;
  if (fallback !== undefined) return <>{fallback}</>;
  return <UpgradePrompt feature={feature} />;
};

export interface UpgradePromptProps {
  feature: string;
  variant?: "card" | "banner" | "inline";
  requiredPlan?: string;
}

export const UpgradePrompt: React.FC<UpgradePromptProps> = ({ feature, variant = "card" }) => {
  const { t } = useI18n();
  const rule = getFeatureRule(feature);
  const requiredPlan = rule?.requires ?? "pro";
  const planName = PLANS[requiredPlan as keyof typeof PLANS]?.name ?? "Pro";
  const description = t(
    `subscription.features.${feature}.description`,
    rule?.description ?? t("subscription.upgrade.defaultDescription")
  );
  const planNameText = t(`subscription.plans.${requiredPlan}`, planName);

  if (variant === "inline") {
    return (
      <span className="mp-upgrade-inline">
        <Link to="/pricing" className="mp-upgrade-link">
          {t("subscription.upgrade.upgradeToPlan", "", { plan: planNameText })}
        </Link>
      </span>
    );
  }

  if (variant === "banner") {
    return (
      <div className="mp-upgrade-banner" role="status">
        <strong>{t("subscription.upgrade.planFeature", "", { plan: planNameText })}</strong>
        <span>{description}</span>
        <Link to="/pricing" className="primary-action">
          {t("subscription.upgrade.upgrade")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mp-upgrade-card" role="status" aria-live="polite">
      <div className="mp-upgrade-icon">{lockSvg}</div>
      <p className="eyebrow">{t("subscription.upgrade.planLabel", "", { plan: planNameText })}</p>
      <h3>{t("subscription.upgrade.requiresPlan", "", { plan: planNameText })}</h3>
      <p>{description}</p>
      <div className="mp-upgrade-actions">
        <Link to="/pricing" className="primary-action">
          {t("subscription.upgrade.seePlans")}
        </Link>
        <Link to="/pricing" className="secondary-action">
          {t("subscription.upgrade.compareFeatures")}
        </Link>
      </div>
    </div>
  );
};

export interface PlanBadgeProps {
  plan: string;
  variant?: "free" | "pro" | "enterprise";
  size?: "sm" | "md";
}

/** Small colored chip that identifies a plan tier in UI. */
export const PlanBadge: React.FC<PlanBadgeProps> = ({ plan, variant, size = "sm" }) => {
  const lower = (variant ?? plan).toLowerCase();
  return (
    <span className={`mp-plan-badge mp-plan-badge--${lower} mp-plan-badge--${size}`}>
      {plan}
    </span>
  );
};
