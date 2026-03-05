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
  modelo?: { id: number; nome: string; marca_id: number }
  created_at: string
  updated_at: string
}
