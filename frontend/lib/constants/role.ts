export const ROLES = {
  EMPLOYEE: "employee",
  AGENT: "agent",
  ADMIN: "admin",
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

export const ROLE_OPTIONS: Role[] = [ROLES.EMPLOYEE, ROLES.AGENT, ROLES.ADMIN]

export const ROLE_LABELS: Record<Role, string> = {
  employee: "Employee",
  agent: "Agent",
  admin: "Admin",
}

export function isRole(value: unknown): value is Role {
  return value === ROLES.EMPLOYEE || value === ROLES.AGENT || value === ROLES.ADMIN
}
