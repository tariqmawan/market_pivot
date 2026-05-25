/** Server-side role definitions — never trust client-sent role without validation */

export const ROLES = {
  USER: "user",
  ADMIN: "admin",
  SUPER_ADMIN: "super_admin",
  EDITOR: "editor",
  ANALYST: "analyst",
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

export const ALL_ROLES: UserRole[] = Object.values(ROLES);

/** Full admin dashboard access */
export const ADMIN_ROLES: UserRole[] = [ROLES.ADMIN, ROLES.SUPER_ADMIN];

/** Staff roles — limited admin console (permission-gated) */
export const STAFF_ROLES: UserRole[] = [
  ROLES.SUPER_ADMIN,
  ROLES.ADMIN,
  ROLES.EDITOR,
  ROLES.ANALYST,
];

export function isStaffRole(role: string): boolean {
  return STAFF_ROLES.includes(role as UserRole);
}

/** Privileged roles assignable only by super_admin or setup secret */
export const PRIVILEGED_ROLES: UserRole[] = [ROLES.ADMIN, ROLES.SUPER_ADMIN];

export function isValidRole(value: unknown): value is UserRole {
  return typeof value === "string" && ALL_ROLES.includes(value as UserRole);
}

export function isAdminRole(role: string): boolean {
  return ADMIN_ROLES.includes(role as UserRole);
}

export function isSuperAdmin(role: string): boolean {
  return role === ROLES.SUPER_ADMIN;
}

/**
 * Public registration always resolves to "user".
 * Admin is only granted when ADMIN_SETUP_SECRET matches (dev/bootstrap).
 * Never reads req.body.role directly.
 */
export function resolveRegistrationRole(adminSetupSecret?: unknown): UserRole {
  const configured = process.env.ADMIN_SETUP_SECRET;
  if (
    configured &&
    typeof adminSetupSecret === "string" &&
    adminSetupSecret.length > 0 &&
    adminSetupSecret === configured
  ) {
    return ROLES.ADMIN;
  }
  return ROLES.USER;
}

/** Who may assign `targetRole` to another user */
export function canAssignRole(actorRole: string, targetRole: UserRole): boolean {
  if (!isValidRole(targetRole)) return false;
  if (targetRole === ROLES.USER || targetRole === ROLES.EDITOR || targetRole === ROLES.ANALYST) {
    return isAdminRole(actorRole);
  }
  // admin / super_admin
  return actorRole === ROLES.SUPER_ADMIN;
}
