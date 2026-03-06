import http from '@/lib/http'
import type { Multa } from '@/modules/multas/types/multa.types'
import type { CreateMultaDto, UpdateMultaDto } from '@/modules/multas/dtos/multa.dto'
import type { PaginatedResponse } from '@/types/api.types'

const BASE = '/v1/multa'

export const multaService = {
  async list(params?: {
    page?: number
    per_page?: number
    status?: string
  }): Promise<PaginatedResponse<Multa>> {
    const { data } = await http.get<PaginatedResponse<Multa>>(BASE, { params })
    return data
  },

  async show(id: number): Promise<Multa> {
    const { data } = await http.get<Multa | { data: Multa }>(`${BASE}/${id}`)
    return (data as { data?: Multa }).data ?? (data as Multa)
  },

  async create(payload: CreateMultaDto): Promise<Multa> {
    const { data } = await http.post<Multa>(BASE, payload)
    return data
  },

  async update(id: number, payload: UpdateMultaDto): Promise<Multa> {
    const { data } = await http.put<Multa>(`${BASE}/${id}`, payload)
    return data
  },

  async remove(id: number): Promise<void> {
    await http.delete(`${BASE}/${id}`)
  },

  async listByLocacao(locacaoId: number, params?: { status?: string }): Promise<Multa[]> {
    const { data } = await http.get<{ data: Multa[] } | Multa[]>(`/v1/locacao/${locacaoId}/multa`, {
      params,
    })
    return Array.isArray(data) ? data : (data as { data: Multa[] }).data ?? []
  },

  async listByCliente(clienteId: number, params?: { status?: string }): Promise<Multa[]> {
    const { data } = await http.get<{ data: Multa[] } | Multa[]>(`/v1/cliente/${clienteId}/multa`, {
      params,
    })
    return Array.isArray(data) ? data : (data as { data: Multa[] }).data ?? []
  },
}
