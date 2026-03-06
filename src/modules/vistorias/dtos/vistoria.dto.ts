import { z } from 'zod'

export const createVistoriaSchema = z.object({
  tipo: z.string().min(1, 'Tipo é obrigatório'),
  combustivel_nivel: z.string().min(1, 'Nível de combustível é obrigatório'),
  km_registrado: z.coerce.number().int('KM deve ser um número inteiro').min(0, 'KM deve ser maior ou igual a 0'),
  observacoes: z.string().optional().nullable(),
  data_vistoria: z.string().min(1, 'Data da vistoria é obrigatória'),
})

export type CreateVistoriaDto = z.infer<typeof createVistoriaSchema>
