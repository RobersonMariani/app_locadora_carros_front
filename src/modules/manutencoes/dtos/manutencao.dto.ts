import { z } from 'zod'

export const createManutencaoSchema = z.object({
  carro_id: z.coerce.number().min(1, 'Carro é obrigatório'),
  tipo: z.string().min(1, 'Tipo é obrigatório'),
  descricao: z.string().min(1, 'Descrição é obrigatória').max(255, 'Descrição deve ter no máximo 255 caracteres'),
  valor: z.coerce.number().min(0, 'Valor deve ser maior ou igual a zero'),
  km_manutencao: z.coerce.number().int('KM deve ser um número inteiro').min(0, 'KM deve ser maior ou igual a 0'),
  data_manutencao: z.string().min(1, 'Data da manutenção é obrigatória'),
  status: z.string().min(1, 'Status é obrigatório'),
  data_proxima: z.string().optional().nullable(),
  fornecedor: z.string().max(100).optional().nullable(),
  observacoes: z.string().max(1000).optional().nullable(),
})

export const updateManutencaoSchema = z.object({
  carro_id: z.coerce.number().min(1).optional(),
  tipo: z.string().optional(),
  descricao: z.string().min(1).max(255).optional(),
  valor: z.coerce.number().min(0).optional(),
  km_manutencao: z.coerce.number().int().min(0).optional(),
  data_manutencao: z.string().optional(),
  status: z.string().optional(),
  data_proxima: z.string().optional().nullable(),
  fornecedor: z.string().max(100).optional().nullable(),
  observacoes: z.string().max(1000).optional().nullable(),
})

export type CreateManutencaoDto = z.infer<typeof createManutencaoSchema>
export type UpdateManutencaoDto = z.infer<typeof updateManutencaoSchema>
