import { z } from 'zod'

const dateStringSchema = z
  .string()
  .min(1, 'Data é obrigatória')
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD')

export const createLocacaoSchema = z.object({
  cliente_id: z.number().min(1, 'Cliente é obrigatório'),
  carro_id: z.number().min(1, 'Carro é obrigatório'),
  data_inicio_periodo: dateStringSchema,
  data_final_previsto_periodo: dateStringSchema,
  valor_diaria: z.number().min(0.01, 'Valor diária deve ser maior que zero'),
  km_inicial: z
    .number()
    .int('KM inicial deve ser um número inteiro')
    .min(0, 'KM inicial é obrigatório'),
  observacoes: z.string().optional().or(z.literal('')),
})

export const updateLocacaoSchema = z.object({
  cliente_id: z.number().min(1, 'Cliente é obrigatório').optional(),
  carro_id: z.number().min(1, 'Carro é obrigatório').optional(),
  data_inicio_periodo: dateStringSchema.optional(),
  data_final_previsto_periodo: dateStringSchema.optional(),
  valor_diaria: z.number().min(0.01).optional(),
  km_inicial: z.number().int().min(0).optional(),
  observacoes: z.string().optional().or(z.literal('')),
})

export const finalizarLocacaoSchema = z.object({
  km_final: z.coerce.number().min(0, 'KM final é obrigatório'),
  data_final_realizado_periodo: z.string().min(1, 'Data final realizada é obrigatória'),
})

export type CreateLocacaoDto = z.infer<typeof createLocacaoSchema>
export type UpdateLocacaoDto = z.infer<typeof updateLocacaoSchema>
export type FinalizarLocacaoDto = z.infer<typeof finalizarLocacaoSchema>
