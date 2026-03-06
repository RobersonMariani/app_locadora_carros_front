import { z } from 'zod'

export const createCarroSchema = z.object({
  modelo_id: z.number().min(1, 'Modelo é obrigatório'),
  placa: z.string().min(1, 'Placa é obrigatória').max(10, 'Placa deve ter no máximo 10 caracteres'),
  cor: z.string().min(1, 'Cor é obrigatória').max(30, 'Cor deve ter no máximo 30 caracteres'),
  ano_fabricacao: z.coerce.number().int().min(1900, 'Ano de fabricação inválido'),
  ano_modelo: z.coerce.number().int().min(1900, 'Ano do modelo inválido'),
  renavam: z
    .union([z.string().max(30), z.literal(''), z.null()])
    .optional()
    .transform((s) => (!s || s === '' ? null : s)),
  disponivel: z.boolean(),
  km: z.coerce.number().int('KM deve ser um número inteiro').min(0, 'KM é obrigatório'),
  combustivel: z.string().optional(),
  cambio: z.string().optional(),
  categoria: z.string().optional(),
  ar_condicionado: z.boolean().optional(),
  diaria_padrao: z.number().min(0).optional().nullable(),
})

export type CreateCarroDto = z.infer<typeof createCarroSchema>

export const updateCarroSchema = z.object({
  modelo_id: z.number().optional(),
  placa: z.string().min(1).max(10).optional(),
  disponivel: z.boolean().optional(),
  km: z.number().int().optional(),
  combustivel: z.string().optional(),
  cambio: z.string().optional(),
  categoria: z.string().optional(),
  ar_condicionado: z.boolean().optional(),
  diaria_padrao: z.number().min(0).optional().nullable(),
})

export type UpdateCarroDto = z.infer<typeof updateCarroSchema>
