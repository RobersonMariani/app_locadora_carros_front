export interface Carro {
  id: number
  modelo_id: number
  placa: string
  cor: string
  ano_fabricacao: number
  ano_modelo: number
  renavam: string | null
  disponivel: boolean
  km: number
  combustivel: string | null
  combustivel_label: string | null
  cambio: string | null
  cambio_label: string | null
  categoria: string | null
  categoria_label: string | null
  ar_condicionado: boolean
  diaria_padrao: number | null
  modelo?: { id: number; nome: string; marca_id: number }
  created_at: string
  updated_at: string
}
