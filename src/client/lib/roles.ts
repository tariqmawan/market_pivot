export type UserRole = "user" | "admin" | "super_admin" | "editor" | "analyst";

export const ADMIN_ROLES: UserRole[] = ["admin", "super_admin"];

export function isAdminRole(role: string | undefined): boolean {
  return !!role && ADMIN_ROLES.includes(role as UserRole);
}

export function toAuthUser(user: {
  id: string | number;
  email: string;
  name: string;
  role: string;
  avatar?: string;
}) {
  return {
    id: String(user.id),
    email: user.email,
    name: user.name,
    role: user.role as UserRole,
    avatar: user.avatar,
    isAdmin: isAdminRole(user.role),
  };
}
