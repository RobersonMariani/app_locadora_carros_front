import http from '@/lib/http'
import type { PaginatedResponse } from '@/types/api.types'
import type { Locacao } from '../types/locacao.types'
import type { FinalizarLocacaoDto } from '../dtos/locacao.dto'

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

  async iniciar(id: number): Promise<Locacao> {
    const { data } = await http.patch<{ data: Locacao }>(`${BASE}/${id}/iniciar`)
    return data.data
  },

  async finalizar(id: number, payload: FinalizarLocacaoDto): Promise<Locacao> {
    const { data } = await http.patch<{ data: Locacao }>(`${BASE}/${id}/finalizar`, payload)
    return data.data
  },

  async cancelar(id: number): Promise<Locacao> {
    const { data } = await http.patch<{ data: Locacao }>(`${BASE}/${id}/cancelar`)
    return data.data
  },
}
