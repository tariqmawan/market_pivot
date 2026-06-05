import React from "react";
import AdminCrudPage from "../components/ui/AdminCrudPage";
import type { AdminColumn } from "../components/ui/AdminTable";
import type { FormFieldDef } from "../components/ui/AdminFormBuilder";
import type { AdminFilterDef } from "../components/ui/AdminFilters";
import { useCoinAdminStore, type AdminCoin } from "../stores/cryptoStore";
import { useI18n } from "../../i18n";



const CATEGORY_OPTIONS = [
  "Layer 1",
  "Layer 2",
  "DeFi",
  "Stablecoin",
  "Meme",
  "Oracle",
  "Privacy",
  "Gaming",
  "AI",
  "Exchange",
  "Bridge",
  "RWA",
].map((c) => ({ value: c, label: c }));

const CONSENSUS_OPTIONS = [
  "Proof of Work",
  "Proof of Stake",
  "Delegated Proof of Stake",
  "Proof of History",
  "Federated Byzantine Agreement",
  "Tendermint BFT",
  "Avalanche Consensus",
].map((c) => ({ value: c, label: c }));

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "delisted", label: "Delisted" },
  { value: "frozen", label: "Frozen" },
];

const EXCHANGE_OPTIONS = [
  "Binance",
  "Coinbase",
  "Kraken",
  "OKX",
  "Bybit",
  "Gemini",
  "Bitstamp",
  "KuCoin",
  "Crypto.com",
];

const columns: AdminColumn<AdminCoin>[] = [
  { key: "symbol", label: "Sym", width: "80px" },
  { key: "name", label: "Name" },
  { key: "category", label: "Category", width: "120px" },
  { key: "blockchain", label: "Chain", width: "120px" },
  { key: "consensus", label: "Consensus", width: "180px" },
  {
    key: "circulatingSupply",
    label: "Circulating",
    align: "right",
    render: (r) =>
      r.circulatingSupply >= 1e9
        ? `${(r.circulatingSupply / 1e9).toFixed(2)}B`
        : r.circulatingSupply >= 1e6
        ? `${(r.circulatingSupply / 1e6).toFixed(2)}M`
        : r.circulatingSupply.toLocaleString(),
    value: (r) => r.circulatingSupply,
  },
  {
    key: "maxSupply",
    label: "Max",
    align: "right",
    render: (r) =>
      r.maxSupply == null
        ? "∞"
        : r.maxSupply >= 1e9
        ? `${(r.maxSupply / 1e9).toFixed(1)}B`
        : `${(r.maxSupply / 1e6).toFixed(1)}M`,
    value: (r) => r.maxSupply ?? 0,
  },
  {
    key: "status",
    label: "Status",
    width: "100px",
    render: (r) => (
      <span
        style={{
          padding: "3px 8px",
          borderRadius: 6,
          fontSize: 11,
          fontWeight: 800,
          background:
            r.status === "active"
              ? "rgba(16,185,129,0.15)"
              : r.status === "frozen"
              ? "rgba(251,191,36,0.15)"
              : "rgba(239,68,68,0.18)",
          color:
            r.status === "active" ? "#6ee7b7" : r.status === "frozen" ? "#fbbf24" : "#ff9090",
        }}
      >
        {r.status}
      </span>
    ),
  },
];

const filters: AdminFilterDef[] = [
  { key: "category", label: "Category", type: "select", options: CATEGORY_OPTIONS },
  { key: "consensus", label: "Consensus", type: "select", options: CONSENSUS_OPTIONS },
  { key: "status", label: "Status", type: "select", options: STATUS_OPTIONS },
];

const formFields: FormFieldDef<AdminCoin>[] = [
  { key: "symbol", label: "Symbol", type: "text", required: true, placeholder: "BTC" },
  { key: "slug", label: "Slug", type: "text", required: true, placeholder: "bitcoin" },
  { key: "name", label: "Name", type: "text", required: true },
  { key: "category", label: "Category", type: "select", options: CATEGORY_OPTIONS, required: true },
  { key: "blockchain", label: "Blockchain", type: "text", placeholder: "Ethereum" },
  { key: "consensus", label: "Consensus", type: "select", options: CONSENSUS_OPTIONS, required: true },
  { key: "blockTime", label: "Block Time (s)", type: "number", min: 0, step: 0.1 },
  { key: "founder", label: "Founder", type: "text" },
  { key: "launched", label: "Launched (year)", type: "number", min: 2008, max: 2100 },
  { key: "circulatingSupply", label: "Circulating Supply", type: "number", min: 0 },
  { key: "maxSupply", label: "Max Supply (null = infinite)", type: "number", min: 0 },
  { key: "totalSupply", label: "Total Supply", type: "number", min: 0 },
  { key: "ecosystem", label: "Ecosystem Tags", type: "tags" },
  {
    key: "exchangeListings",
    label: "Exchange Listings",
    type: "tags",
    help: `Suggested: ${EXCHANGE_OPTIONS.join(", ")}`,
  },
  { key: "status", label: "Status", type: "select", options: STATUS_OPTIONS, required: true },
  { key: "whitepaperUrl", label: "Whitepaper URL", type: "url" },
  { key: "logo", label: "Logo URL", type: "url" },
  { key: "description", label: "Description", type: "textarea", span: 2 },
];

export default function CryptoAdminPage() {
  const { t } = useI18n();
  const items = useCoinAdminStore((s) => s.items);
  const update = useCoinAdminStore((s) => s.update);

  return (
    <AdminCrudPage<AdminCoin>
      title={t("src_client_admin_pages_cryptoadminpage__l146__h0")}
      subtitle="Coin metadata, supply, consensus, ecosystem, and exchange listings"
      useStore={useCoinAdminStore}
      columns={columns}
      formFields={formFields}
      filters={filters}
      searchKeys={["symbol", "name", "category", "blockchain", "consensus", "founder"]}
      defaultEntry={{
        slug: "",
        symbol: "",
        name: "",
        category: "Layer 1",
        blockchain: "",
        consensus: "Proof of Stake",
        blockTime: 0,
        founder: "",
        launched: null,
        circulatingSupply: 0,
        maxSupply: null,
        totalSupply: 0,
        ecosystem: [],
        exchangeListings: ["Binance", "Coinbase"],
        description: "",
        logo: "",
        status: "active",
        whitepaperUrl: "",
      }}
      analytics={(rows) => {
        const active = rows.filter((r) => r.status === "active").length;
        const layer1 = rows.filter((r) => r.category === "Layer 1").length;
        const stable = rows.filter((r) => r.category === "Stablecoin").length;
        const defi = rows.filter((r) => r.category === "DeFi").length;
        return [
          { label: "Coins Tracked", value: rows.length },
          { label: "Active", value: active, tone: "positive" },
          { label: "Layer 1", value: layer1 },
          { label: "Stablecoins", value: stable },
          { label: "DeFi", value: defi },
        ];
      }}
      extraBulkActions={[
        { label: "Mark Active", onRun: (ids) => ids.forEach((id) => update(id, { status: "active" })) },
        {
          label: "Freeze",
          destructive: true,
          confirm: "Freeze selected coins?",
          onRun: (ids) => ids.forEach((id) => update(id, { status: "frozen" })),
        },
      ]}
      exportName="cryptocurrencies"
      validate={(entry) => {
        const errs: Partial<Record<keyof AdminCoin, string>> = {};
        const sym = entry.symbol.trim().toUpperCase();
        if (!/^[A-Z0-9]{2,10}$/.test(sym))
          errs.symbol = "Symbol must be 2–10 uppercase letters/digits";
        if (items.some((c) => c.symbol.toUpperCase() === sym && c.id !== entry.id))
          errs.symbol = "Symbol already exists";
        if (entry.maxSupply != null && entry.maxSupply < entry.circulatingSupply)
          errs.maxSupply = "Max supply cannot be less than circulating supply";
        return errs;
      }}
    />
  );
}
