import { z } from 'zod'

export const createMultaSchema = z.object({
  locacao_id: z.coerce.number().min(1, 'Locação é obrigatória'),
  carro_id: z.coerce.number().min(1, 'Carro é obrigatório'),
  cliente_id: z.coerce.number().min(1, 'Cliente é obrigatório'),
  valor: z.coerce.number().min(0.01, 'Valor deve ser maior que zero'),
  data_infracao: z.string().min(1, 'Data da infração é obrigatória'),
  descricao: z.string().min(1, 'Descrição é obrigatória').max(255, 'Descrição deve ter no máximo 255 caracteres'),
  status: z.string().min(1, 'Status é obrigatório'),
  codigo_infracao: z.string().max(20).optional().nullable(),
  pontos: z.coerce.number().int().min(0).max(21).optional().nullable(),
  data_pagamento: z.string().optional().nullable(),
  observacoes: z.string().max(1000).optional().nullable(),
})

export const updateMultaSchema = z.object({
  locacao_id: z.coerce.number().min(1).optional(),
  carro_id: z.coerce.number().min(1).optional(),
  cliente_id: z.coerce.number().min(1).optional(),
  valor: z.coerce.number().min(0.01).optional(),
  data_infracao: z.string().optional(),
  descricao: z.string().min(1).max(255).optional(),
  status: z.string().optional(),
  codigo_infracao: z.string().max(20).optional().nullable(),
  pontos: z.coerce.number().int().min(0).max(21).optional().nullable(),
  data_pagamento: z.string().optional().nullable(),
  observacoes: z.string().max(1000).optional().nullable(),
})

export type CreateMultaDto = z.infer<typeof createMultaSchema>
export type UpdateMultaDto = z.infer<typeof updateMultaSchema>
