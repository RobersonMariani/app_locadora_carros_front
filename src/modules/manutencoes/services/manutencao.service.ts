import http from '@/lib/http'
import type { Manutencao } from '@/modules/manutencoes/types/manutencao.types'
import type { CreateManutencaoDto, UpdateManutencaoDto } from '@/modules/manutencoes/dtos/manutencao.dto'
import type { PaginatedResponse } from '@/types/api.types'

const BASE = '/v1/manutencao'

export const manutencaoService = {
  async list(params?: {
    page?: number
    per_page?: number
    tipo?: string
    status?: string
    carro_id?: number
  }): Promise<PaginatedResponse<Manutencao>> {
    const { data } = await http.get<PaginatedResponse<Manutencao>>(BASE, { params })
    return data
  },

  async show(id: number): Promise<Manutencao> {
    const { data } = await http.get<Manutencao | { data: Manutencao }>(`${BASE}/${id}`)
    return (data as { data?: Manutencao }).data ?? (data as Manutencao)
  },

  async create(payload: CreateManutencaoDto): Promise<Manutencao> {
    const { data } = await http.post<Manutencao>(BASE, payload)
    return data
  },

  async update(id: number, payload: UpdateManutencaoDto): Promise<Manutencao> {
    const { data } = await http.put<Manutencao>(`${BASE}/${id}`, payload)
    return data
  },

  async remove(id: number): Promise<void> {
    await http.delete(`${BASE}/${id}`)
  },

  async listByCarro(carroId: number, params?: { tipo?: string; status?: string }): Promise<Manutencao[]> {
    const { data } = await http.get<{ data: Manutencao[] } | Manutencao[]>(`/v1/carro/${carroId}/manutencao`, {
      params,
    })
    return Array.isArray(data) ? data : (data as { data: Manutencao[] }).data ?? []
  },

  async proximas(): Promise<Manutencao[]> {
    const { data } = await http.get<{ data: Manutencao[] } | Manutencao[]>(`${BASE}/proximas`)
    return Array.isArray(data) ? data : (data as { data: Manutencao[] }).data ?? []
  },
}
