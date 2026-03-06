export interface Cliente {
  id: number
  nome: string
  cpf: string
  email: string | null
  telefone: string | null
  data_nascimento: string | null
  cnh: string | null
  endereco: string | null
  cidade: string | null
  estado: string | null
  cep: string | null
  bloqueado: boolean
  motivo_bloqueio: string | null
  created_at: string
  updated_at: string
}
