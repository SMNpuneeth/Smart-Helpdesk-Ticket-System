import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Re-export commonly-used formatters for backwards compatibility
export { formatAbsolute, formatRelative, roleLabel, statusLabel, priorityLabel, initialsOf } from "./utils/format"

