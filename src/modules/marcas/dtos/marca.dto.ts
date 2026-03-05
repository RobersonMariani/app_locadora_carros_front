import { z } from 'zod'

export const createMarcaSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório').max(30, 'Nome deve ter no máximo 30 caracteres'),
  imagem: z.instanceof(File, { message: 'Imagem é obrigatória' }),
})

export type CreateMarcaDto = z.infer<typeof createMarcaSchema>

export const updateMarcaSchema = z.object({
  nome: z
    .string()
    .min(1, 'Nome é obrigatório')
    .max(30, 'Nome deve ter no máximo 30 caracteres')
    .optional(),
  imagem: z.instanceof(File).optional(),
})

export type UpdateMarcaDto = z.infer<typeof updateMarcaSchema>
