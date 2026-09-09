import type { ComponentProps } from 'react'
import { useForm } from '@tanstack/react-form'
import { twMerge } from 'tailwind-merge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLogin } from '../mutations/use-login'
import { loginSchema } from '../schemas/login-schema'

export interface LoginFormProps
  extends Omit<ComponentProps<'form'>, 'onSubmit'> {
  /** Chamado após o login persistir a sessão com sucesso. */
  onSuccess?: () => void
}

function firstErrorMessage(errors: unknown[]): string | null {
  for (const error of errors) {
    if (typeof error === 'string') return error
    if (error && typeof error === 'object' && 'message' in error) {
      return String((error as { message: unknown }).message)
    }
  }
  return null
}

export function LoginForm({ className, onSuccess, ...props }: LoginFormProps) {
  const loginMutation = useLogin()

  const form = useForm({
    defaultValues: { email: '', password: '' },
    validators: { onBlur: loginSchema, onSubmit: loginSchema },
    onSubmit: async ({ value }) => {
      await loginMutation.mutateAsync(value)
      onSuccess?.()
    },
  })

  return (
    <form
      data-slot="login-form"
      noValidate
      className={twMerge('flex flex-col gap-4', className)}
      onSubmit={(event) => {
        event.preventDefault()
        void form.handleSubmit()
      }}
      {...props}
    >
      <form.Field name="email">
        {(field) => {
          const error = field.state.meta.isTouched
            ? firstErrorMessage(field.state.meta.errors)
            : null
          return (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={field.name}>E-mail</Label>
              <Input
                id={field.name}
                name={field.name}
                type="email"
                autoComplete="email"
                placeholder="voce@exemplo.com"
                value={field.state.value}
                aria-invalid={error != null}
                aria-describedby={error ? `${field.name}-error` : undefined}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
              />
              {error ? (
                <p
                  id={`${field.name}-error`}
                  role="alert"
                  className="text-sm text-destructive"
                >
                  {error}
                </p>
              ) : null}
            </div>
          )
        }}
      </form.Field>

      <form.Field name="password">
        {(field) => {
          const error = field.state.meta.isTouched
            ? firstErrorMessage(field.state.meta.errors)
            : null
          return (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={field.name}>Senha</Label>
              <Input
                id={field.name}
                name={field.name}
                type="password"
                autoComplete="current-password"
                value={field.state.value}
                aria-invalid={error != null}
                aria-describedby={error ? `${field.name}-error` : undefined}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
              />
              {error ? (
                <p
                  id={`${field.name}-error`}
                  role="alert"
                  className="text-sm text-destructive"
                >
                  {error}
                </p>
              ) : null}
            </div>
          )
        }}
      </form.Field>

      {loginMutation.isError ? (
        <p role="alert" className="text-sm text-destructive">
          {loginMutation.error.message}
        </p>
      ) : null}

      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => {
          const busy = isSubmitting || loginMutation.isPending
          return (
            <Button type="submit" size="lg" disabled={busy} className="mt-1">
              {busy ? 'Entrando…' : 'Entrar'}
            </Button>
          )
        }}
      </form.Subscribe>
    </form>
  )
}
