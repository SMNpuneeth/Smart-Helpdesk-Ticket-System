import * as React from "react"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full grid lg:grid-cols-2 bg-background">
      <div className="hidden lg:flex relative overflow-hidden border-r border-border bg-sidebar">
        <div className="absolute inset-0 bg-radial-fade" />
        <div className="absolute inset-0 bg-grid opacity-[0.35] mask-[radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
        <div className="relative z-10 flex flex-col justify-between p-10 w-full">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-foreground text-background">
              <svg viewBox="0 0 24 24" fill="none" className="size-5">
                <path
                  d="M4 6h16v12H4z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
                <path
                  d="M4 10h16M8 14h6"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="font-semibold tracking-tight">Helpdesk Pro</div>
          </div>

          <div className="space-y-6 max-w-md">
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight text-balance">
                Resolve tickets faster, together.
              </h1>
              <p className="text-sm leading-relaxed text-muted-foreground">
                A calm, focused workspace for support teams and the people they serve.
                Track issues, route work, and close the loop — all in one place.
              </p>
            </div>

            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <span className="mt-1 size-1.5 rounded-full bg-emerald-500" />
                <div>
                  <div className="font-medium">Built-in lifecycle</div>
                  <div className="text-muted-foreground">
                    Tickets move through open → assigned → in progress → resolved → closed.
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 size-1.5 rounded-full bg-amber-500" />
                <div>
                  <div className="font-medium">Role-aware</div>
                  <div className="text-muted-foreground">
                    Employees, agents, and admins each get the right tools.
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 size-1.5 rounded-full bg-sky-500" />
                <div>
                  <div className="font-medium">Conversation-first</div>
                  <div className="text-muted-foreground">
                    Every ticket keeps a clean thread of context.
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <div className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Helpdesk Pro · v1.0
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  )
}
