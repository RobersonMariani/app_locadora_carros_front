import { z } from 'zod'

const dateStringSchema = z
  .string()
  .min(1, 'Data é obrigatória')
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD')

const optionalDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD')
  .optional()
  .nullable()
  .or(z.literal(''))

export const createLocacaoSchema = z.object({
  cliente_id: z.number().min(1, 'Cliente é obrigatório'),
  carro_id: z.number().min(1, 'Carro é obrigatório'),
  data_inicio_periodo: dateStringSchema,
  data_final_previsto_periodo: dateStringSchema,
  data_final_realizado_periodo: optionalDateSchema,
  valor_diaria: z.number().min(0.01, 'Valor diária deve ser maior que zero'),
  km_inicial: z
    .number()
    .int('KM inicial deve ser um número inteiro')
    .min(0, 'KM inicial é obrigatório'),
  km_final: z
    .number()
    .int('KM final deve ser um número inteiro')
    .min(0, 'KM final deve ser maior ou igual a zero')
    .optional()
    .nullable(),
})

export const updateLocacaoSchema = z.object({
  cliente_id: z.number().min(1, 'Cliente é obrigatório').optional(),
  carro_id: z.number().min(1, 'Carro é obrigatório').optional(),
  data_inicio_periodo: dateStringSchema.optional(),
  data_final_previsto_periodo: dateStringSchema.optional(),
  data_final_realizado_periodo: optionalDateSchema,
  valor_diaria: z.number().min(0.01).optional(),
  km_inicial: z.number().int().min(0).optional(),
  km_final: z.number().int().min(0).optional().nullable(),
})

export type CreateLocacaoDto = z.infer<typeof createLocacaoSchema>
export type UpdateLocacaoDto = z.infer<typeof updateLocacaoSchema>
