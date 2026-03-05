import http from '@/lib/http'

export interface DashboardResumo {
  total_marcas: number
  total_modelos: number
  total_carros: number
  total_clientes: number
  carros_disponiveis: number
  carros_locados: number
  locacoes_ativas: number
  locacoes_reservadas: number
  faturamento_mes: number
}

export interface LocacaoPorStatus {
  status: string
  label: string
  quantidade: number
}

export interface FaturamentoItem {
  periodo: string
  faturamento: number
  quantidade_locacoes: number
}

export const dashboardService = {
  async getResumo(): Promise<DashboardResumo> {
    const { data } = await http.get('/v1/dashboard/resumo')
    return data.data ?? data
  },
  async getLocacoesPorStatus(): Promise<LocacaoPorStatus[]> {
    const { data } = await http.get('/v1/dashboard/locacoes-por-status')
    return data.data ?? data
  },
  async getFaturamento(periodo = 'mensal'): Promise<FaturamentoItem[]> {
    const { data } = await http.get('/v1/dashboard/faturamento', { params: { periodo } })
    return data.data ?? data
  },
}
