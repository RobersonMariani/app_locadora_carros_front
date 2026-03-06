import http from '@/lib/http'
import type { Alerta } from '@/modules/alertas/types/alerta.types'
import type { PaginatedResponse } from '@/types/api.types'

const BASE = '/v1/alerta'

export interface AlertaListParams {
  page?: number
  per_page?: number
  tipo?: string
  lido?: boolean
}

export const alertaService = {
  list(params?: AlertaListParams) {
    return http.get<PaginatedResponse<Alerta>>(BASE, { params })
  },

  count() {
    return http.get<{ count: number }>(`${BASE}/count`)
  },

  marcarComoLido(id: number) {
    return http.patch<Alerta>(`${BASE}/${id}/lido`)
  },

  marcarTodosComoLidos() {
    return http.patch<{ marcados: number }>(`${BASE}/lidos`)
  },
}
