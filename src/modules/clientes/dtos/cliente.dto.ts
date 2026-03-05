import { z } from 'zod'

export const createClienteSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório').max(30, 'Nome deve ter no máximo 30 caracteres'),
  cpf: z.string().min(11, 'CPF é obrigatório').max(14, 'CPF deve ter no máximo 14 caracteres'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  telefone: z.string().max(20, 'Telefone deve ter no máximo 20 caracteres').optional().or(z.literal('')),
  data_nascimento: z.string().optional().or(z.literal('')),
  cnh: z.string().max(20, 'CNH deve ter no máximo 20 caracteres').optional().or(z.literal('')),
})

export const updateClienteSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório').max(30, 'Nome deve ter no máximo 30 caracteres').optional(),
  cpf: z.string().min(11, 'CPF é obrigatório').max(14, 'CPF deve ter no máximo 14 caracteres').optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  telefone: z.string().max(20, 'Telefone deve ter no máximo 20 caracteres').optional().or(z.literal('')),
  data_nascimento: z.string().optional().or(z.literal('')),
  cnh: z.string().max(20, 'CNH deve ter no máximo 20 caracteres').optional().or(z.literal('')),
})

export type CreateClienteDto = z.infer<typeof createClienteSchema>
export type UpdateClienteDto = z.infer<typeof updateClienteSchema>
