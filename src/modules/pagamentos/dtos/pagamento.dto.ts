import { z } from 'zod'

export const createPagamentoSchema = z.object({
  locacao_id: z.coerce.number().min(1, 'Locação é obrigatória'),
  valor: z.coerce.number().min(0.01, 'Valor deve ser maior que zero'),
  tipo: z.string().min(1, 'Tipo é obrigatório'),
  metodo_pagamento: z.string().min(1, 'Método de pagamento é obrigatório'),
  status: z.string().optional(),
  data_pagamento: z.string().min(1, 'Data do pagamento é obrigatória'),
  observacoes: z.string().optional().or(z.literal('')),
})

export const updatePagamentoSchema = z.object({
  locacao_id: z.coerce.number().min(1).optional(),
  valor: z.coerce.number().min(0.01).optional(),
  tipo: z.string().optional(),
  metodo_pagamento: z.string().optional(),
  status: z.string().optional(),
  data_pagamento: z.string().optional(),
  observacoes: z.string().optional().or(z.literal('')),
})

export type CreatePagamentoDto = z.infer<typeof createPagamentoSchema>
export type UpdatePagamentoDto = z.infer<typeof updatePagamentoSchema>
