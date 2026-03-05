export interface Modelo {
  id: number
  marca_id: number
  nome: string
  imagem_url: string | null
  numero_portas: number
  lugares: number
  air_bag: boolean
  abs: boolean
  marca?: { id: number; nome: string; imagem_url: string | null }
}
