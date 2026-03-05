import http from '@/lib/http'
import type { PaginatedResponse } from '@/types/api.types'
import type { Locacao } from '../types/locacao.types'

const BASE = '/v1/locacao'

export const locacaoService = {
  async list(page = 1): Promise<PaginatedResponse<Locacao>> {
    const { data } = await http.get<PaginatedResponse<Locacao>>(BASE, {
      params: { page },
    })
    return data
  },

  async show(id: number): Promise<Locacao> {
    const { data } = await http.get<{ data: Locacao }>(`${BASE}/${id}`)
    return data.data
  },

  async create(payload: Record<string, unknown>): Promise<Locacao> {
    const { data } = await http.post<{ data: Locacao }>(BASE, payload)
    return data.data
  },

  async update(id: number, payload: Record<string, unknown>): Promise<Locacao> {
    const { data } = await http.put<{ data: Locacao }>(`${BASE}/${id}`, payload)
    return data.data
  },

  async remove(id: number): Promise<void> {
    await http.delete(`${BASE}/${id}`)
  },
}
