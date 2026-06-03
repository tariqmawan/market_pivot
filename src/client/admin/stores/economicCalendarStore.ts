import { createCrudStore, type CrudEntity } from "../lib/createCrudStore";

export type EventImpact = "low" | "medium" | "high";
export type EventStatus = "scheduled" | "released" | "postponed" | "cancelled";

export interface AdminEconomicEvent extends CrudEntity {
  title: string;
  category: string;
  country: string;
  countryCode: string;
  region: string;
  currency: string;
  impact: EventImpact;
  status: EventStatus;
  scheduledFor: string; // ISO date-time
  consensus: string;
  previous: string;
  actual: string;
  unit: string;
  source: string;
  notes: string;
}

const future = (offsetDays: number, hh = 8, mm = 30) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  d.setHours(hh, mm, 0, 0);
  return d.toISOString().slice(0, 16);
};

const seedEvents: AdminEconomicEvent[] = [
  {
    id: "evt-us-cpi",
    title: "US CPI (YoY)",
    category: "Inflation",
    country: "United States",
    countryCode: "US",
    region: "North America",
    currency: "USD",
    impact: "high",
    status: "scheduled",
    scheduledFor: future(2, 8, 30),
    consensus: "3.1%",
    previous: "3.2%",
    actual: "",
    unit: "% YoY",
    source: "BLS",
    notes: "Headline + core attention",
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 86400000,
  },
  {
    id: "evt-ecb-rate",
    title: "ECB Interest Rate Decision",
    category: "Central Bank",
    country: "Eurozone",
    countryCode: "EU",
    region: "Europe",
    currency: "EUR",
    impact: "high",
    status: "scheduled",
    scheduledFor: future(7, 14, 15),
    consensus: "3.75%",
    previous: "3.75%",
    actual: "",
    unit: "%",
    source: "ECB",
    notes: "Watch the press conference",
    createdAt: Date.now() - 5 * 86400000,
    updatedAt: Date.now() - 86400000,
  },
  {
    id: "evt-jp-bo-jpolicy",
    title: "BOJ Policy Statement",
    category: "Central Bank",
    country: "Japan",
    countryCode: "JP",
    region: "Asia",
    currency: "JPY",
    impact: "high",
    status: "scheduled",
    scheduledFor: future(10, 3, 0),
    consensus: "0.25%",
    previous: "0.25%",
    actual: "",
    unit: "%",
    source: "BoJ",
    notes: "FX volatility likely",
    createdAt: Date.now() - 3 * 86400000,
    updatedAt: Date.now() - 86400000,
  },
  {
    id: "evt-uk-employment",
    title: "UK Employment Change",
    category: "Labor",
    country: "United Kingdom",
    countryCode: "GB",
    region: "Europe",
    currency: "GBP",
    impact: "medium",
    status: "released",
    scheduledFor: future(-1, 7, 0),
    consensus: "75K",
    previous: "62K",
    actual: "84K",
    unit: "Jobs",
    source: "ONS",
    notes: "Beat consensus",
    createdAt: Date.now() - 10 * 86400000,
    updatedAt: Date.now() - 2 * 86400000,
  },
  {
    id: "evt-cn-pmi",
    title: "China Manufacturing PMI",
    category: "PMI",
    country: "China",
    countryCode: "CN",
    region: "Asia",
    currency: "CNY",
    impact: "medium",
    status: "scheduled",
    scheduledFor: future(4, 1, 45),
    consensus: "50.2",
    previous: "49.8",
    actual: "",
    unit: "Index",
    source: "NBS",
    notes: "",
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 86400000,
  },
  {
    id: "evt-us-fomc",
    title: "FOMC Minutes",
    category: "Central Bank",
    country: "United States",
    countryCode: "US",
    region: "North America",
    currency: "USD",
    impact: "high",
    status: "scheduled",
    scheduledFor: future(14, 14, 0),
    consensus: "—",
    previous: "—",
    actual: "",
    unit: "Text",
    source: "Federal Reserve",
    notes: "Markets parse for rate path signals",
    createdAt: Date.now() - 4 * 86400000,
    updatedAt: Date.now() - 86400000,
  },
];

export const useEconomicEventAdminStore = createCrudStore<AdminEconomicEvent>({
  name: "mp-admin-economic-events",
  idPrefix: "evt",
  seed: seedEvents,
});
