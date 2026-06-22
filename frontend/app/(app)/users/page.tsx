"use client"

import { useMemo, useState } from "react"
import { LockKeyhole, Plus, RefreshCcw, ShieldCheck, UserPlus, Trash2 } from "lucide-react"
import * as React from "react"
import { toast } from "sonner"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  DialogRoot,
  DialogTrigger,
  DialogDescription,
  DialogOverlay,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SelectContent, SelectItem, SelectRoot, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { EmptyState } from "@/components/ui/empty-state"
import { ErrorState } from "@/components/ui/error-state"
import { ConfirmDialog } from "@/components/ui/dialog"
import {
  ROLE_OPTIONS,
  ROLES,
  type Role,
} from "@/lib/constants"
import { PermissionGate } from "@/components/auth/permission-gate"
import { useAuth } from "@/lib/hooks/use-auth"
import { useUsers, useCreateUser, useUpdateUserRole, useResetPassword, useDeleteUser } from "@/lib/hooks/use-users"
import { adminCreateUserSchema, resetPasswordSchema, type AdminCreateUserInput, type ResetPasswordInput, type UserRoleUpdateInput } from "@/lib/schemas"
import { userRoleUpdateSchema } from "@/lib/schemas"
import { z } from "zod"

const schemaRole = z.enum(ROLE_OPTIONS)

function roleLabel(role: Role) {
  switch (role) {
    case ROLES.ADMIN:
      return "Admin"
    case ROLES.AGENT:
      return "Agent"
    default:
      return "Employee"
  }
}

type ResetState = {
  open: boolean
  userId: number | null
}

type CreateForm = AdminCreateUserInput

export default function UsersPage() {
  const { user } = useAuth()
  const canManage = user?.role === ROLES.ADMIN

  const usersQuery = useUsers(canManage)
  const createUser = useCreateUser()

  const [roleBusyId, setRoleBusyId] = useState<number | null>(null)
  const [resetState, setResetState] = useState<ResetState>({ open: false, userId: null })
  const resetUserId = resetState.userId ?? 0

  const [pickedNewPassword, setPickedNewPassword] = useState<string>("")

  const updateRoleMutation = useUpdateUserRole(resetUserId) // dummy; we’ll re-instantiate per call below
  const resetMutation = useResetPassword(resetUserId) // dummy; we’ll re-instantiate per call below

  // Since hooks require stable ids, we’ll use per-action mutations by keeping ids in state:
  const roleMutation = useUpdateUserRole(roleBusyId ?? 0)
  const pwdMutation = useResetPassword(resetState.userId ?? 0)
  
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null)
  const deleteMutation = useDeleteUser()

  const createForm = useForm<CreateForm>({
    resolver: zodResolver(adminCreateUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: ROLES.EMPLOYEE,
    },
  })

  const submitCreate = createForm.handleSubmit(async (values) => {
    try {
      await createUser.mutateAsync(values)
      toast.success("User created.")
      createForm.reset()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to create user")
    }
  })

  const resetForm = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { new_password: "" },
  })

  const submitReset = resetForm.handleSubmit(async (values) => {
    if (!resetState.userId) return
    try {
      await pwdMutation.mutateAsync(values)
      toast.success("Password reset successful.")
      setResetState({ open: false, userId: null })
      resetForm.reset()
      setPickedNewPassword("")
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to reset password")
    }
  })

  const resetDialogOpen = resetState.open && !!resetState.userId

  const rows = useMemo(() => {
    return usersQuery.data ?? []
  }, [usersQuery.data])

  if (!canManage) {
    return (
      <PermissionGate allow={ROLES.ADMIN}>
        <div />
      </PermissionGate>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-muted-foreground" />
            <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
          </div>
          <p className="text-sm text-muted-foreground">Manage employees, agents, and admins.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => usersQuery.refetch()}
            disabled={usersQuery.isLoading}
          >
            {usersQuery.isLoading ? <Spinner className="mr-2" /> : <RefreshCcw className="size-4 mr-1" />}
            Refresh
          </Button>
        </div>
      </div>

      {/* Create user */}
      <Card>

        <CardHeader>
          <CardTitle className="text-base">Create user</CardTitle>
        </CardHeader>

        <CardContent>
          <form className="space-y-4" onSubmit={submitCreate} noValidate>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Jane Doe" {...createForm.register("name")} />
                {createForm.formState.errors.name && (
                  <p className="text-xs text-destructive">{createForm.formState.errors.name.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@company.com" {...createForm.register("email")} />
                {createForm.formState.errors.email && (
                  <p className="text-xs text-destructive">{createForm.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="role">Role</Label>
                <SelectRoot
                  value={createForm.watch("role")}
                  onValueChange={(value) => createForm.setValue("role", value as Role, { shouldValidate: true })}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLE_OPTIONS.map((r) => (
                      <SelectItem key={r} value={r}>
                        {roleLabel(r)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </SelectRoot>
                {createForm.formState.errors.role && (
                  <p className="text-xs text-destructive">{createForm.formState.errors.role.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">Temporary password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="At least 3 characters"
                  {...createForm.register("password")}
                />
                {createForm.formState.errors.password && (
                  <p className="text-xs text-destructive">{createForm.formState.errors.password.message}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <Button
                type="button"
                variant="ghost"
                onClick={() => createForm.reset()}
                disabled={createUser.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createUser.isPending}>
                {createUser.isPending && <Spinner className="mr-2" />}
                {createUser.isPending ? "Creating…" : "Create user"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* List */}
      {usersQuery.isLoading ? (
        <div className="space-y-3">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[72px] w-full" />
          ))}
        </div>
      ) : usersQuery.isError ? (
        <ErrorState
          title="Could not load users"
          description={usersQuery.error instanceof Error ? usersQuery.error.message : undefined}
          onRetry={() => usersQuery.refetch()}
        />
      ) : rows.length === 0 ? (
        <EmptyState
          icon={<UserPlus className="size-5" />}
          title="No users found"
          description="Create your first user to get started."
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">User directory</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[220px]">Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="w-[140px]">Role</TableHead>
                    <TableHead className="w-[220px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {rows.map((u) => {
                    const isSelf = u.id === user?.user_id
                    return (
                      <TableRow key={u.id}>
                        <TableCell>
                          <div className="font-medium text-sm">{u.name}</div>
                          <div className="text-xs text-muted-foreground">User #{u.id}{isSelf ? " · (you)" : ""}</div>
                        </TableCell>

                        <TableCell className="text-muted-foreground">{u.email}</TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="capitalize">
                              {roleLabel(u.role)}
                            </Badge>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex flex-wrap items-center gap-2">
                            <SelectRoot
                              value={u.role}
                              onValueChange={async (value) => {
                                if (!roleMutation.mutateAsync) return
                                if (!u.id) return
                                try {
                                  setRoleBusyId(u.id)
                                  const nextRole = value as Role
                                  await roleMutation.mutateAsync({ role: nextRole })
                                  toast.success("Role updated.")
                                } catch (e) {
                                  toast.error(e instanceof Error ? e.message : "Failed to update role")
                                } finally {
                                  setRoleBusyId(null)
                                }
                              }}
                            >
                              <SelectTrigger className="h-9 w-[170px]">
                                <SelectValue placeholder="Change role" />
                              </SelectTrigger>
                              <SelectContent>
                                {ROLE_OPTIONS.filter((r) => r !== u.role).map((r) => (
                                  <SelectItem key={r} value={r}>
                                    {roleLabel(r)}
                                  </SelectItem>
                                ))}
                                {ROLE_OPTIONS.map((r) => (
                                  r === u.role ? (
                                    <SelectItem key={`${r}-current`} value={r} disabled>
                                      {roleLabel(r)}
                                    </SelectItem>
                                  ) : null
                                ))}
                              </SelectContent>
                            </SelectRoot>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setResetState({ open: true, userId: u.id })
                                resetForm.reset({ new_password: "" })
                              }}
                              disabled={pwdMutation.isPending || resetDialogOpen}
                            >
                              <LockKeyhole className="size-4 mr-1" />
                              Reset password
                            </Button>

                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => setDeleteUserId(u.id)}
                              disabled={isSelf || deleteMutation.isPending || u.role === ROLES.ADMIN}
                            >
                              <Trash2 className="size-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reset password dialog */}
      <DialogRoot
        open={resetDialogOpen}
        onOpenChange={(open) => {
          setResetState({ open, userId: open ? resetState.userId : null })
          if (!open) resetForm.reset({ new_password: "" })
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset password</DialogTitle>
            <DialogDescription>
              This will generate a new temporary password for the user.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="new_password">New password</Label>
            <Input
              id="new_password"
              type="password"
              placeholder="At least 3 characters"
              {...resetForm.register("new_password")}
              onChange={(e) => setPickedNewPassword(e.target.value)}
            />
            {resetForm.formState.errors.new_password && (
              <p className="text-xs text-destructive">{resetForm.formState.errors.new_password.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              After reset, the user will sign in with the new password.
            </p>
          </div>

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => {
                setResetState({ open: false, userId: null })
                resetForm.reset({ new_password: "" })
              }}
              disabled={pwdMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={() => submitReset()}
              disabled={pwdMutation.isPending || !resetForm.watch("new_password")}
            >
              {pwdMutation.isPending && <Spinner className="mr-2" />}
              {pwdMutation.isPending ? "Resetting…" : "Reset password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>

      <ConfirmDialog
        open={deleteUserId !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteUserId(null)
        }}
        title="Delete User"
        description="Are you sure you want to delete this user? This will permanently remove their account, raised tickets, and comments."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        destructive
        loading={deleteMutation.isPending}
        onConfirm={async () => {
          if (!deleteUserId) return
          try {
            await deleteMutation.mutateAsync(deleteUserId)
            toast.success("User deleted successfully.")
            setDeleteUserId(null)
          } catch (e) {
            toast.error(e instanceof Error ? e.message : "Failed to delete user")
          }
        }}
      />
    </div>
  )
}
