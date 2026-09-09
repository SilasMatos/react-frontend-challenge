import { z } from 'zod'

/**
 * Regras do case: e-mail válido e senha com **mais de** 6 caracteres.
 * Usado tanto no `<LoginForm>` (validação on-blur + on-submit) quanto no
 * `mutationFn` como última linha de defesa.
 */
export const loginSchema = z.object({
  email: z.email('Informe um e-mail válido.'),
  password: z
    .string()
    .min(7, 'A senha precisa ter mais de 6 caracteres.'),
})

export type LoginInput = z.infer<typeof loginSchema>
