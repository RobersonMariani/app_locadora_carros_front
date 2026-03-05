import { z } from 'zod'

export const createClienteSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório').max(30, 'Nome deve ter no máximo 30 caracteres'),
})

export const updateClienteSchema = createClienteSchema

export type CreateClienteDto = z.infer<typeof createClienteSchema>
export type UpdateClienteDto = z.infer<typeof updateClienteSchema>
