export interface Alerta {
  id: number
  tipo: string
  tipo_label: string
  titulo: string
  descricao: string
  referencia_type: string | null
  referencia_id: number | null
  lido: boolean
  data_alerta: string
  created_at: string
  updated_at: string
}
