import React from "react";
import { FeatureGate } from "../subscription";
import { useI18n } from "../i18n";



interface GatedScreenProps {
  feature: string;
  children: React.ReactNode;
}

/**
 * Convenience wrapper around <FeatureGate> for whole-page gating.
 * Adds a small page header above the upgrade prompt so locked screens
 * still feel intentional rather than broken.
 */
export const GatedScreen: React.FC<GatedScreenProps> = ({ feature, children }) => {
  const { t } = useI18n();
  return (
  <FeatureGate
    feature={feature}
    fallback={
      <div className="page">
        <div className="section-heading">
          <p className="eyebrow">{t("gatedscreen.h0")}</p>
          <h1>{t("gatedscreen.h1")}</h1>
        </div>
      </div>
    }
  >
    {children}
  </FeatureGate>
  );
};
