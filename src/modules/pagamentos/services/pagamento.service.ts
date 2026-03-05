import http from '@/lib/http'
import type { Pagamento } from '@/modules/pagamentos/types/pagamento.types'
import type { CreatePagamentoDto, UpdatePagamentoDto } from '@/modules/pagamentos/dtos/pagamento.dto'
import type { PaginatedResponse } from '@/types/api.types'

const BASE = '/v1/pagamento'

export const pagamentoService = {
  list(params?: { page?: number; per_page?: number }) {
    return http.get<PaginatedResponse<Pagamento>>(BASE, { params })
  },

  getById(id: number) {
    return http.get<Pagamento>(`${BASE}/${id}`)
  },

  create(data: CreatePagamentoDto) {
    return http.post<Pagamento>(BASE, data)
  },

  update(id: number, data: UpdatePagamentoDto) {
    return http.put<Pagamento>(`${BASE}/${id}`, data)
  },

  delete(id: number) {
    return http.delete(`${BASE}/${id}`)
  },

  getByLocacao(locacaoId: number) {
    return http.get<Pagamento[]>(`/v1/locacao/${locacaoId}/pagamento`)
  },
}
