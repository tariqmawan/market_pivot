export type Permission =
  | "dashboard:view"
  | "users:view"
  | "users:edit"
  | "users:role"
  | "market:view"
  | "market:edit"
  | "news:view"
  | "news:edit"
  | "billing:view"
  | "billing:edit"
  | "api:view"
  | "api:edit"
  | "seo:edit"
  | "ads:edit"
  | "calendar:view"
  | "calendar:edit"
  | "audit:view";

export interface DashboardStats {
  users: { total: number; active: number };
  subscriptions: { active: number };
  revenue: { mrrEstimate: number };
  market: {
    exchanges: number;
    cryptos: number;
    currencies: number;
    regions: number;
    sectors: number;
    commodities: number;
  };
  content: { news: number; events: number };
  sync: { running: number };
  apiUsage: { requestsToday: number };
  traffic: { pageviews24h: number };
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  isEmailVerified: boolean;
  lastLoginAt: string | null;
  created_at: string;
}

export interface Paginated<T> {
  items: T[];
  pagination: { page: number; limit: number; total: number; pages: number };
}
