export type LocacaoStatus = 'reservada' | 'ativa' | 'finalizada' | 'cancelada'

export interface Locacao {
  id: number
  status: string
  status_label: string
  atrasada: boolean
  valor_total: number | null
  observacoes: string | null
  cliente_id: number
  carro_id: number
  data_inicio_periodo: string
  data_final_previsto_periodo: string
  data_final_realizado_periodo: string | null
  valor_diaria: number
  km_inicial: number
  km_final: number | null
  cliente?: { id: number; nome: string }
  carro?: { id: number; placa: string; modelo_id: number }
  created_at: string
  updated_at: string
}
