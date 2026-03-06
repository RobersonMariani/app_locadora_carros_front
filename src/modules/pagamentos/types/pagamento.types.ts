export interface Pagamento {
  id: number
  locacao_id: number
  valor: number
  tipo: string
  tipo_label: string
  metodo_pagamento: string
  metodo_pagamento_label: string
  status: string
  status_label: string
  data_pagamento: string
  observacoes: string | null
  created_at: string
}

export const PAGAMENTO_STATUS = [
  { value: 'pendente', label: 'Pendente' },
  { value: 'pago', label: 'Pago' },
  { value: 'cancelado', label: 'Cancelado' },
]

export const PAGAMENTO_TIPOS = [
  { value: 'diaria', label: 'Diária' },
  { value: 'multa_atraso', label: 'Multa por Atraso' },
  { value: 'km_extra', label: 'KM Extra' },
  { value: 'dano', label: 'Dano' },
  { value: 'desconto', label: 'Desconto' },
]

export const METODOS_PAGAMENTO = [
  { value: 'dinheiro', label: 'Dinheiro' },
  { value: 'credito', label: 'Cartão de Crédito' },
  { value: 'debito', label: 'Cartão de Débito' },
  { value: 'pix', label: 'PIX' },
]
