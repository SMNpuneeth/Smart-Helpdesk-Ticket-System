"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

import { Card, CardContent } from "@/components/ui/card"
import { PriorityBadge } from "@/components/tickets/priority-badge"
import { StatusBadge } from "@/components/tickets/status-badge"
import { cn, formatRelative } from "@/lib/utils"
import type { Ticket } from "@/lib/types"

export function TicketCard({
  ticket,
  href,
}: {
  ticket: Ticket
  href: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
    >
      <Link href={href} className="block group">
        <Card className="transition-all hover:border-foreground/20 hover:shadow-sm hover:-translate-y-px">
          <CardContent className="p-4 md:p-5">
            <div className="flex items-start gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-muted-foreground tabular-nums">
                    #{ticket.id}
                  </span>
                  <StatusBadge status={ticket.status} />
                  <PriorityBadge priority={ticket.priority} />
                </div>
                <h3 className="font-medium text-foreground leading-snug truncate">
                  {ticket.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                  {ticket.description}
                </p>
              </div>

              <div className="flex flex-col items-end gap-1 text-xs text-muted-foreground shrink-0">
                <time
                  title={new Date(ticket.updated_at).toLocaleString()}
                  dateTime={ticket.updated_at}
                >
                  Updated {formatRelative(ticket.updated_at)}
                </time>
                {ticket.assigned_to && (
                  <span className="rounded-md bg-muted px-1.5 py-0.5 text-[11px]">
                    Assigned
                  </span>
                )}
              </div>
            </div>

            <div
              className={cn(
                "mt-3 flex items-center gap-1 text-xs font-medium text-muted-foreground",
                "opacity-0 group-hover:opacity-100 transition-opacity",
              )}
            >
              View ticket
              <ArrowRight className="size-3.5" />
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}