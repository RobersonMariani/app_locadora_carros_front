export interface Vistoria {
  id: number
  locacao_id: number
  tipo: string
  tipo_label: string
  combustivel_nivel: string
  combustivel_nivel_label: string
  km_registrado: number
  observacoes: string | null
  realizado_por: number
  data_vistoria: string
  created_at: string
  updated_at: string
}
