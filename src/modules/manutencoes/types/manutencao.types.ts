export interface Manutencao {
  id: number
  carro_id: number
  tipo: string
  tipo_label: string
  descricao: string
  valor: number
  km_manutencao: number
  data_manutencao: string
  data_proxima: string | null
  fornecedor: string | null
  status: string
  status_label: string
  observacoes: string | null
  created_at: string
  updated_at: string
}

export const MANUTENCAO_TIPO_OPCOES = [
  { value: 'preventiva', label: 'Preventiva' },
  { value: 'corretiva', label: 'Corretiva' },
  { value: 'revisao', label: 'Revisão' },
]

export const MANUTENCAO_STATUS_OPCOES = [
  { value: 'agendada', label: 'Agendada' },
  { value: 'em_andamento', label: 'Em Andamento' },
  { value: 'concluida', label: 'Concluída' },
  { value: 'cancelada', label: 'Cancelada' },
]
