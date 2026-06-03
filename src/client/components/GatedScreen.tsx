import React from "react";
import { FeatureGate } from "../subscription";

interface GatedScreenProps {
  feature: string;
  children: React.ReactNode;
}

/**
 * Convenience wrapper around <FeatureGate> for whole-page gating.
 * Adds a small page header above the upgrade prompt so locked screens
 * still feel intentional rather than broken.
 */
export const GatedScreen: React.FC<GatedScreenProps> = ({ feature, children }) => (
  <FeatureGate
    feature={feature}
    fallback={
      <div className="page">
        <div className="section-heading">
          <p className="eyebrow">Premium feature</p>
          <h1>Unlock with a Pro plan</h1>
        </div>
      </div>
    }
  >
    {children}
  </FeatureGate>
);
