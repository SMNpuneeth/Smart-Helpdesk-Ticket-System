import { ROLES, ROLE_LABELS, type Role } from "@/lib/constants"
import { cn } from "@/lib/utils"

const ROLE_STYLES: Record<Role, string> = {
  [ROLES.EMPLOYEE]: "bg-zinc-500/10 text-zinc-700 dark:text-zinc-300 border-zinc-500/20",
  [ROLES.AGENT]: "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/25",
  [ROLES.ADMIN]: "bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-500/25",
}

export function RoleBadge({
  role,
  className,
}: {
  role: Role
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium leading-none whitespace-nowrap capitalize",
        ROLE_STYLES[role],
        className,
      )}
    >
      {ROLE_LABELS[role]}
    </span>
  )
}