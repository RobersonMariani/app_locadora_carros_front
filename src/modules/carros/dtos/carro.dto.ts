import { z } from 'zod'

export const createCarroSchema = z.object({
  modelo_id: z.number().min(1, 'Modelo é obrigatório'),
  placa: z.string().min(1, 'Placa é obrigatória').max(10, 'Placa deve ter no máximo 10 caracteres'),
  disponivel: z.boolean(),
  km: z.number().int('KM deve ser um número inteiro').min(0, 'KM é obrigatório'),
})

export type CreateCarroDto = z.infer<typeof createCarroSchema>

export const updateCarroSchema = z.object({
  modelo_id: z.number().optional(),
  placa: z.string().min(1).max(10).optional(),
  disponivel: z.boolean().optional(),
  km: z.number().int().optional(),
})

export type UpdateCarroDto = z.infer<typeof updateCarroSchema>
