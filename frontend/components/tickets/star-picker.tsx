"use client"

import { Star } from "lucide-react"
import * as React from "react"

import { cn } from "@/lib/utils"
import { RATING_VALUES, type RatingValue } from "@/lib/schemas"

interface StarPickerProps {
  value: number
  onChange?: (next: RatingValue) => void
  size?: number
  readOnly?: boolean
  className?: string
  ariaLabel?: string
}

/**
 * Five-star picker. When read-only, renders the static ★★★★☆ pattern used
 * elsewhere in the app (e.g. ticket detail). When interactive, hover state
 * previews the value and clicking commits it.
 */
export function StarPicker({
  value,
  onChange,
  size = 22,
  readOnly = false,
  className,
  ariaLabel = "Rating",
}: StarPickerProps) {
  const [hover, setHover] = React.useState<RatingValue | null>(null)
  const display = (hover ?? (value as number) ?? 0) as number

  return (
    <div
      role={readOnly ? "img" : "radiogroup"}
      aria-label={ariaLabel}
      className={cn("inline-flex items-center gap-1", className)}
      onMouseLeave={() => setHover(null)}
    >
      {RATING_VALUES.map((star) => {
        const filled = star <= display
        const interactive = !readOnly && !!onChange
        return (
          <button
            key={star}
            type="button"
            role={interactive ? "radio" : undefined}
            aria-checked={interactive ? value === star : undefined}
            aria-label={`${star} star${star === 1 ? "" : "s"}`}
            disabled={readOnly}
            onMouseEnter={() => interactive && setHover(star)}
            onFocus={() => interactive && setHover(star)}
            onBlur={() => setHover(null)}
            onClick={() => interactive && onChange?.(star)}
            className={cn(
              "rounded-sm transition-colors",
              interactive && "cursor-pointer hover:scale-105",
              readOnly && "cursor-default",
            )}
          >
            <Star
              className={cn(
                "transition-colors",
                filled
                  ? "fill-amber-400 text-amber-400"
                  : "text-muted-foreground/40",
              )}
              style={{ width: size, height: size }}
            />
          </button>
        )
      })}
    </div>
  )
}