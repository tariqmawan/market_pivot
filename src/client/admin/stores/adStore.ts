import { createCrudStore, type CrudEntity } from "../lib/createCrudStore";

export type AdPlacement =
  | "homepage_hero"
  | "dashboard_top"
  | "sidebar"
  | "article_inline"
  | "footer";

export type AdStatus = "draft" | "scheduled" | "active" | "paused" | "expired";

export interface AdminAdCampaign extends CrudEntity {
  name: string;
  advertiser: string;
  placement: AdPlacement;
  bannerImageUrl: string;
  destinationUrl: string;
  altText: string;
  status: AdStatus;
  startDate: string;
  endDate: string;
  dailyBudget: number;
  impressionsToday: number;
  impressionsTotal: number;
  clicksToday: number;
  clicksTotal: number;
  revenueToday: number;
  revenueTotal: number;
  cpm: number;
  cpc: number;
  targetRegions: string[];
  targetDevices: ("desktop" | "tablet" | "mobile")[];
  notes: string;
}

const today = new Date().toISOString().split("T")[0];
const inDays = (d: number) => {
  const date = new Date();
  date.setDate(date.getDate() + d);
  return date.toISOString().split("T")[0];
};

const seedCampaigns: AdminAdCampaign[] = [
  {
    id: "ad-finvest-2026",
    name: "FinVest Q3 Push",
    advertiser: "FinVest Capital",
    placement: "homepage_hero",
    bannerImageUrl: "/ads/finvest-hero.png",
    destinationUrl: "https://finvest.example/signup",
    altText: "Trade smarter with FinVest Capital",
    status: "active",
    startDate: inDays(-30),
    endDate: inDays(60),
    dailyBudget: 1200,
    impressionsToday: 84200,
    impressionsTotal: 2480000,
    clicksToday: 612,
    clicksTotal: 18420,
    revenueToday: 142.5,
    revenueTotal: 4280.4,
    cpm: 1.6,
    cpc: 0.18,
    targetRegions: ["North America", "Europe"],
    targetDevices: ["desktop", "tablet", "mobile"],
    notes: "Highest-priority creative.",
    createdAt: Date.now() - 35 * 86400000,
    updatedAt: Date.now() - 86400000,
  },
  {
    id: "ad-coinbase-pro",
    name: "Coinbase Pro Awareness",
    advertiser: "Coinbase",
    placement: "dashboard_top",
    bannerImageUrl: "/ads/coinbase-pro.png",
    destinationUrl: "https://coinbase.example/pro",
    altText: "Upgrade to Coinbase Pro",
    status: "active",
    startDate: inDays(-15),
    endDate: inDays(45),
    dailyBudget: 800,
    impressionsToday: 52400,
    impressionsTotal: 740000,
    clicksToday: 418,
    clicksTotal: 6125,
    revenueToday: 84.2,
    revenueTotal: 1220.6,
    cpm: 1.4,
    cpc: 0.2,
    targetRegions: ["North America"],
    targetDevices: ["desktop"],
    notes: "",
    createdAt: Date.now() - 20 * 86400000,
    updatedAt: Date.now() - 86400000,
  },
  {
    id: "ad-trading-edu",
    name: "TradingEdu Bootcamp",
    advertiser: "TradingEdu",
    placement: "sidebar",
    bannerImageUrl: "/ads/trading-edu.png",
    destinationUrl: "https://tradingedu.example/bootcamp",
    altText: "Master the markets in 6 weeks",
    status: "scheduled",
    startDate: inDays(7),
    endDate: inDays(60),
    dailyBudget: 400,
    impressionsToday: 0,
    impressionsTotal: 0,
    clicksToday: 0,
    clicksTotal: 0,
    revenueToday: 0,
    revenueTotal: 0,
    cpm: 1.2,
    cpc: 0.15,
    targetRegions: ["Asia", "Europe"],
    targetDevices: ["mobile", "tablet"],
    notes: "Pending creative approval",
    createdAt: Date.now() - 2 * 86400000,
    updatedAt: Date.now(),
  },
  {
    id: "ad-quanta-fund",
    name: "Quanta Hedge Fund",
    advertiser: "Quanta",
    placement: "article_inline",
    bannerImageUrl: "/ads/quanta-fund.png",
    destinationUrl: "https://quanta.example/funds",
    altText: "Quanta — Systematic Strategies",
    status: "paused",
    startDate: inDays(-60),
    endDate: inDays(0),
    dailyBudget: 600,
    impressionsToday: 0,
    impressionsTotal: 980000,
    clicksToday: 0,
    clicksTotal: 8200,
    revenueToday: 0,
    revenueTotal: 1620,
    cpm: 1.5,
    cpc: 0.2,
    targetRegions: ["North America", "Europe", "Middle East"],
    targetDevices: ["desktop"],
    notes: "Paused pending FCA review",
    createdAt: Date.now() - 65 * 86400000,
    updatedAt: Date.now() - 5 * 86400000,
  },
];

void today;

export const useAdCampaignAdminStore = createCrudStore<AdminAdCampaign>({
  name: "mp-admin-ad-campaigns",
  idPrefix: "ad",
  seed: seedCampaigns,
});
