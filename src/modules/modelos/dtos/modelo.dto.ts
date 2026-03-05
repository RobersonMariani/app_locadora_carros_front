import { z } from 'zod'

export const createModeloSchema = z.object({
  marca_id: z.number().min(1, 'Marca é obrigatória'),
  nome: z
    .string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .max(30, 'Nome deve ter no máximo 30 caracteres'),
  imagem: z.instanceof(File, { message: 'Imagem é obrigatória' }),
  numero_portas: z.number().min(1, 'Mínimo 1 porta').max(5, 'Máximo 5 portas'),
  lugares: z.number().min(1, 'Mínimo 1 lugar').max(20, 'Máximo 20 lugares'),
  air_bag: z.boolean(),
  abs: z.boolean(),
})

export type CreateModeloDto = z.infer<typeof createModeloSchema>

export const updateModeloSchema = z.object({
  marca_id: z.number().min(1).optional(),
  nome: z.string().min(3).max(30).optional(),
  imagem: z.instanceof(File).optional(),
  numero_portas: z.number().min(1).max(5).optional(),
  lugares: z.number().min(1).max(20).optional(),
  air_bag: z.boolean().optional(),
  abs: z.boolean().optional(),
})

export type UpdateModeloDto = z.infer<typeof updateModeloSchema>
