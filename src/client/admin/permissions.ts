import type { Permission } from "./types";
import { isAdminRole } from "../lib/roles";

export const PERMISSIONS = {
  DASHBOARD_VIEW: "dashboard:view",
  USERS_VIEW: "users:view",
  USERS_EDIT: "users:edit",
  USERS_ROLE: "users:role",
  MARKET_VIEW: "market:view",
  MARKET_EDIT: "market:edit",
  NEWS_VIEW: "news:view",
  NEWS_EDIT: "news:edit",
  BILLING_VIEW: "billing:view",
  BILLING_EDIT: "billing:edit",
  API_VIEW: "api:view",
  API_EDIT: "api:edit",
  SEO_EDIT: "seo:edit",
  ADS_EDIT: "ads:edit",
  AUDIT_VIEW: "audit:view",
} as const;

const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  super_admin: Object.values(PERMISSIONS),
  admin: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.USERS_VIEW,
    PERMISSIONS.USERS_EDIT,
    PERMISSIONS.USERS_ROLE,
    PERMISSIONS.MARKET_VIEW,
    PERMISSIONS.MARKET_EDIT,
    PERMISSIONS.NEWS_VIEW,
    PERMISSIONS.NEWS_EDIT,
    PERMISSIONS.BILLING_VIEW,
    PERMISSIONS.BILLING_EDIT,
    PERMISSIONS.API_VIEW,
    PERMISSIONS.API_EDIT,
    PERMISSIONS.SEO_EDIT,
    PERMISSIONS.ADS_EDIT,
    PERMISSIONS.AUDIT_VIEW,
  ],
  editor: [PERMISSIONS.DASHBOARD_VIEW, PERMISSIONS.MARKET_VIEW, PERMISSIONS.NEWS_VIEW, PERMISSIONS.NEWS_EDIT, PERMISSIONS.SEO_EDIT],
  analyst: [PERMISSIONS.DASHBOARD_VIEW, PERMISSIONS.MARKET_VIEW, PERMISSIONS.NEWS_VIEW, PERMISSIONS.AUDIT_VIEW],
  user: [],
};

export function canAccessAdmin(role: string): boolean {
  return isAdminRole(role);
}

export function hasPermission(role: string, permission: Permission): boolean {
  return (ROLE_PERMISSIONS[role] ?? []).includes(permission);
}
