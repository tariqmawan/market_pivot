import { ROLES, type UserRole } from "./roles";

export const PERMISSIONS = {
  DASHBOARD_VIEW: "dashboard:view",
  USERS_VIEW: "users:view",
  USERS_EDIT: "users:edit",
  USERS_ROLE: "users:role",
  USERS_IMPERSONATE: "users:impersonate",
  MARKET_VIEW: "market:view",
  MARKET_EDIT: "market:edit",
  NEWS_VIEW: "news:view",
  NEWS_EDIT: "news:edit",
  CALENDAR_EDIT: "calendar:edit",
  BILLING_VIEW: "billing:view",
  BILLING_EDIT: "billing:edit",
  API_VIEW: "api:view",
  API_EDIT: "api:edit",
  SEO_EDIT: "seo:edit",
  ADS_EDIT: "ads:edit",
  SETTINGS_EDIT: "settings:edit",
  AUDIT_VIEW: "audit:view",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS),
  [ROLES.ADMIN]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.USERS_VIEW,
    PERMISSIONS.USERS_EDIT,
    PERMISSIONS.USERS_ROLE,
    PERMISSIONS.MARKET_VIEW,
    PERMISSIONS.MARKET_EDIT,
    PERMISSIONS.NEWS_VIEW,
    PERMISSIONS.NEWS_EDIT,
    PERMISSIONS.CALENDAR_EDIT,
    PERMISSIONS.BILLING_VIEW,
    PERMISSIONS.BILLING_EDIT,
    PERMISSIONS.API_VIEW,
    PERMISSIONS.API_EDIT,
    PERMISSIONS.SEO_EDIT,
    PERMISSIONS.ADS_EDIT,
    PERMISSIONS.AUDIT_VIEW,
  ],
  [ROLES.EDITOR]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.MARKET_VIEW,
    PERMISSIONS.NEWS_VIEW,
    PERMISSIONS.NEWS_EDIT,
    PERMISSIONS.CALENDAR_EDIT,
    PERMISSIONS.SEO_EDIT,
  ],
  [ROLES.ANALYST]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.MARKET_VIEW,
    PERMISSIONS.NEWS_VIEW,
    PERMISSIONS.AUDIT_VIEW,
  ],
  [ROLES.USER]: [],
};

/** Staff roles that may access admin console (editor+ for limited panels) */
export const STAFF_ROLES: UserRole[] = [
  ROLES.SUPER_ADMIN,
  ROLES.ADMIN,
  ROLES.EDITOR,
  ROLES.ANALYST,
];

export function hasPermission(role: string, permission: Permission): boolean {
  const perms = ROLE_PERMISSIONS[role as UserRole];
  return Array.isArray(perms) && perms.includes(permission);
}

export function hasAnyPermission(role: string, permissions: Permission[]): boolean {
  return permissions.some((p) => hasPermission(role, p));
}

export function getPermissionsForRole(role: string): Permission[] {
  return ROLE_PERMISSIONS[role as UserRole] ?? [];
}
