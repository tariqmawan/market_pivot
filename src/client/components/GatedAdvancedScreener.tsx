import React, { Suspense } from "react";
import PageLoader from "./PageLoader";
import { FeatureGate } from "../subscription";

const AdvancedScreenerPage = React.lazy(() => import("../pages/AdvancedScreenerPage"));

/**
 * Gates the Advanced Screener behind the Pro plan. Lazy-loads the actual
 * page module so free users don't pay the bundle cost.
 */
export const GatedAdvancedScreener: React.FC = () => (
  <FeatureGate feature="advanced_screener">
    <Suspense fallback={<PageLoader />}>
      <AdvancedScreenerPage />
    </Suspense>
  </FeatureGate>
);
