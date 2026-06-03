import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type PositionAssetType = "stock" | "etf" | "crypto" | "forex" | "commodity" | "bond";

export interface Position {
  id: string;
  symbol: string;
  name: string;
  type: PositionAssetType;
  sector: string;
  quantity: number;
  averageCost: number;
  currentPrice: number;
  dividendYield?: number;
  purchaseDate: string;
  notes?: string;
}

export interface Transaction {
  id: string;
  positionId: string;
  type: "buy" | "sell" | "dividend";
  quantity: number;
  price: number;
  date: string;
  notes?: string;
}

export interface Portfolio {
  id: string;
  name: string;
  description: string;
  baseCurrency: "USD" | "EUR" | "GBP" | "JPY" | "INR";
  positions: Position[];
  transactions: Transaction[];
  createdAt: number;
  updatedAt: number;
}

interface PortfolioState {
  portfolios: Portfolio[];
  activePortfolioId: string;
  createPortfolio: (name: string, description?: string, baseCurrency?: Portfolio["baseCurrency"]) => string;
  renamePortfolio: (id: string, name: string) => void;
  deletePortfolio: (id: string) => void;
  setActivePortfolio: (id: string) => void;
  setBaseCurrency: (id: string, currency: Portfolio["baseCurrency"]) => void;
  addPosition: (portfolioId: string, position: Omit<Position, "id">) => void;
  updatePosition: (portfolioId: string, id: string, position: Partial<Position>) => void;
  deletePosition: (portfolioId: string, id: string) => void;
  addTransaction: (portfolioId: string, transaction: Omit<Transaction, "id">) => void;
  getActivePortfolio: () => Portfolio | undefined;
  exportPortfolio: (portfolioId: string, format: "csv" | "json") => string;
}

const SAMPLE_POSITIONS: Position[] = [
  {
    id: "p-1",
    symbol: "AAPL",
    name: "Apple Inc.",
    type: "stock",
    sector: "Technology",
    quantity: 50,
    averageCost: 175.30,
    currentPrice: 192.42,
    dividendYield: 0.51,
    purchaseDate: "2024-08-15",
  },
  {
    id: "p-2",
    symbol: "MSFT",
    name: "Microsoft Corporation",
    type: "stock",
    sector: "Technology",
    quantity: 30,
    averageCost: 380.50,
    currentPrice: 425.18,
    dividendYield: 0.74,
    purchaseDate: "2024-05-22",
  },
  {
    id: "p-3",
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    type: "stock",
    sector: "Technology",
    quantity: 75,
    averageCost: 75.20,
    currentPrice: 122.50,
    dividendYield: 0.03,
    purchaseDate: "2024-02-10",
  },
  {
    id: "p-4",
    symbol: "JPM",
    name: "JPMorgan Chase & Co.",
    type: "stock",
    sector: "Banking",
    quantity: 40,
    averageCost: 165.80,
    currentPrice: 198.45,
    dividendYield: 2.42,
    purchaseDate: "2024-01-12",
  },
  {
    id: "p-5",
    symbol: "BTC",
    name: "Bitcoin",
    type: "crypto",
    sector: "Cryptocurrency",
    quantity: 0.5,
    averageCost: 42000,
    currentPrice: 65000,
    purchaseDate: "2023-11-05",
  },
  {
    id: "p-6",
    symbol: "ETH",
    name: "Ethereum",
    type: "crypto",
    sector: "Cryptocurrency",
    quantity: 4,
    averageCost: 2200,
    currentPrice: 3200,
    purchaseDate: "2024-03-18",
  },
  {
    id: "p-7",
    symbol: "JNH",
    name: "JPMorgan Ultra Short Income ETF",
    type: "etf",
    sector: "Fixed Income",
    quantity: 200,
    averageCost: 50.85,
    currentPrice: 51.40,
    dividendYield: 4.85,
    purchaseDate: "2024-09-01",
  },
  {
    id: "p-8",
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    type: "stock",
    sector: "Technology",
    quantity: 25,
    averageCost: 145.20,
    currentPrice: 175.30,
    dividendYield: 0.45,
    purchaseDate: "2024-06-30",
  },
];

const SAMPLE_TRANSACTIONS: Transaction[] = [
  { id: "t-1", positionId: "p-1", type: "buy", quantity: 50, price: 175.30, date: "2024-08-15" },
  { id: "t-2", positionId: "p-1", type: "dividend", quantity: 0, price: 44.00, date: "2025-02-15" },
  { id: "t-3", positionId: "p-2", type: "buy", quantity: 30, price: 380.50, date: "2024-05-22" },
  { id: "t-4", positionId: "p-2", type: "dividend", quantity: 0, price: 84.00, date: "2024-12-10" },
  { id: "t-5", positionId: "p-3", type: "buy", quantity: 75, price: 75.20, date: "2024-02-10" },
  { id: "t-6", positionId: "p-4", type: "buy", quantity: 40, price: 165.80, date: "2024-01-12" },
  { id: "t-7", positionId: "p-4", type: "dividend", quantity: 0, price: 162.00, date: "2024-10-15" },
  { id: "t-8", positionId: "p-5", type: "buy", quantity: 0.5, price: 42000, date: "2023-11-05" },
  { id: "t-9", positionId: "p-6", type: "buy", quantity: 4, price: 2200, date: "2024-03-18" },
  { id: "t-10", positionId: "p-7", type: "buy", quantity: 200, price: 50.85, date: "2024-09-01" },
  { id: "t-11", positionId: "p-8", type: "buy", quantity: 25, price: 145.20, date: "2024-06-30" },
];

const newId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const DEFAULT_PORTFOLIO: Portfolio = {
  id: "default-portfolio",
  name: "Core Portfolio",
  description: "Long-term growth and income mix",
  baseCurrency: "USD",
  positions: SAMPLE_POSITIONS,
  transactions: SAMPLE_TRANSACTIONS,
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

const formatCsvCell = (value: unknown) => {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.includes(",") || str.includes("\"") || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

export const usePortfolioStore = create<PortfolioState>()(
  persist(
    (set, get) => ({
      portfolios: [DEFAULT_PORTFOLIO],
      activePortfolioId: DEFAULT_PORTFOLIO.id,

      createPortfolio: (name, description = "", baseCurrency = "USD") => {
        const id = newId("pf");
        const portfolio: Portfolio = {
          id,
          name,
          description,
          baseCurrency,
          positions: [],
          transactions: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set((state) => ({ portfolios: [...state.portfolios, portfolio], activePortfolioId: id }));
        return id;
      },

      renamePortfolio: (id, name) =>
        set((state) => ({
          portfolios: state.portfolios.map((pf) =>
            pf.id === id ? { ...pf, name, updatedAt: Date.now() } : pf
          ),
        })),

      deletePortfolio: (id) =>
        set((state) => {
          if (state.portfolios.length <= 1) return state;
          const remaining = state.portfolios.filter((pf) => pf.id !== id);
          return {
            portfolios: remaining,
            activePortfolioId: state.activePortfolioId === id ? remaining[0]?.id ?? "" : state.activePortfolioId,
          };
        }),

      setActivePortfolio: (id) => set({ activePortfolioId: id }),

      setBaseCurrency: (id, currency) =>
        set((state) => ({
          portfolios: state.portfolios.map((pf) =>
            pf.id === id ? { ...pf, baseCurrency: currency, updatedAt: Date.now() } : pf
          ),
        })),

      addPosition: (portfolioId, position) =>
        set((state) => ({
          portfolios: state.portfolios.map((pf) => {
            if (pf.id !== portfolioId) return pf;
            const id = newId("p");
            return {
              ...pf,
              positions: [...pf.positions, { ...position, id }],
              updatedAt: Date.now(),
            };
          }),
        })),

      updatePosition: (portfolioId, id, position) =>
        set((state) => ({
          portfolios: state.portfolios.map((pf) =>
            pf.id === portfolioId
              ? {
                  ...pf,
                  positions: pf.positions.map((p) => (p.id === id ? { ...p, ...position } : p)),
                  updatedAt: Date.now(),
                }
              : pf
          ),
        })),

      deletePosition: (portfolioId, id) =>
        set((state) => ({
          portfolios: state.portfolios.map((pf) =>
            pf.id === portfolioId
              ? {
                  ...pf,
                  positions: pf.positions.filter((p) => p.id !== id),
                  updatedAt: Date.now(),
                }
              : pf
          ),
        })),

      addTransaction: (portfolioId, transaction) =>
        set((state) => ({
          portfolios: state.portfolios.map((pf) => {
            if (pf.id !== portfolioId) return pf;
            const id = newId("t");
            return {
              ...pf,
              transactions: [...pf.transactions, { ...transaction, id }],
              updatedAt: Date.now(),
            };
          }),
        })),

      getActivePortfolio: () => {
        const { portfolios, activePortfolioId } = get();
        return portfolios.find((pf) => pf.id === activePortfolioId);
      },

      exportPortfolio: (portfolioId, format) => {
        const portfolio = get().portfolios.find((pf) => pf.id === portfolioId);
        if (!portfolio) return "";
        if (format === "json") {
          return JSON.stringify(portfolio, null, 2);
        }
        const headers = [
          "Symbol", "Name", "Type", "Sector", "Quantity", "Avg Cost",
          "Current Price", "Market Value", "Cost Basis", "Unrealized P/L",
          "P/L %", "Dividend Yield", "Purchase Date",
        ];
        const rows = portfolio.positions.map((p) => {
          const marketValue = p.quantity * p.currentPrice;
          const costBasis = p.quantity * p.averageCost;
          const pl = marketValue - costBasis;
          const plPct = (pl / costBasis) * 100;
          return [
            p.symbol, p.name, p.type, p.sector, p.quantity, p.averageCost.toFixed(2),
            p.currentPrice.toFixed(2), marketValue.toFixed(2), costBasis.toFixed(2),
            pl.toFixed(2), plPct.toFixed(2), p.dividendYield?.toFixed(2) ?? "0",
            p.purchaseDate,
          ];
        });
        return [headers, ...rows]
          .map((row) => row.map(formatCsvCell).join(","))
          .join("\n");
      },
    }),
    {
      name: "markets-pivot-portfolio",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
