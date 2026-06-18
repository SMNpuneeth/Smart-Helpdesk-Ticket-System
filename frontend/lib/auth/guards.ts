import { ROLES, type Role } from "@/lib/constants"

export function hasRole(
  currentRole: Role | undefined | null,
  allowed: Role | readonly Role[],
): boolean {
  if (!currentRole) return false
  const list = Array.isArray(allowed) ? allowed : [allowed as Role]
  return list.includes(currentRole)
}

export const isAdmin = (role: Role | undefined | null) => hasRole(role, ROLES.ADMIN)
export const isAgent = (role: Role | undefined | null) => hasRole(role, ROLES.AGENT)
export const isEmployee = (role: Role | undefined | null) =>
  hasRole(role, ROLES.EMPLOYEE)
export const isAgentOrAdmin = (role: Role | undefined | null) =>
  hasRole(role, [ROLES.AGENT, ROLES.ADMIN])
