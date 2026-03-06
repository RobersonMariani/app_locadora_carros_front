export interface Multa {
  id: number
  locacao_id: number
  carro_id: number
  cliente_id: number
  valor: number
  data_infracao: string
  descricao: string
  codigo_infracao: string | null
  pontos: number | null
  status: string
  status_label: string
  data_pagamento: string | null
  observacoes: string | null
  created_at: string
  updated_at: string
}

export const MULTA_STATUS_OPCOES = [
  { value: 'pendente', label: 'Pendente' },
  { value: 'paga', label: 'Paga' },
  { value: 'contestada', label: 'Contestada' },
  { value: 'cancelada', label: 'Cancelada' },
]
