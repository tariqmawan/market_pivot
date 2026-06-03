import React from "react";
import { Link } from "react-router-dom";
import { useFeatureAccess } from "./hooks";
import { getFeatureRule } from "./featureMatrix";
import { PLANS } from "./plans";

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
  const rule = getFeatureRule(feature);
  const requiredPlan = rule?.requires ?? "pro";
  const planName = PLANS[requiredPlan as keyof typeof PLANS]?.name ?? "Pro";
  const description = rule?.description ?? "Unlock this feature with a paid plan.";

  if (variant === "inline") {
    return (
      <span className="mp-upgrade-inline">
        <Link to="/pricing" className="mp-upgrade-link">
          Upgrade to {planName}
        </Link>
      </span>
    );
  }

  if (variant === "banner") {
    return (
      <div className="mp-upgrade-banner" role="status">
        <strong>{planName} feature</strong>
        <span>{description}</span>
        <Link to="/pricing" className="primary-action">
          Upgrade
        </Link>
      </div>
    );
  }

  return (
    <div className="mp-upgrade-card" role="status" aria-live="polite">
      <div className="mp-upgrade-icon">{lockSvg}</div>
      <p className="eyebrow">{planName} plan</p>
      <h3>This feature requires {planName}</h3>
      <p>{description}</p>
      <div className="mp-upgrade-actions">
        <Link to="/pricing" className="primary-action">
          See plans
        </Link>
        <Link to="/pricing" className="secondary-action">
          Compare features
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
