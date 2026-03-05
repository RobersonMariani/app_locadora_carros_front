import http from '@/lib/http'
import type { Carro } from '@/modules/carros/types/carro.types'
import type { CreateCarroDto, UpdateCarroDto } from '@/modules/carros/dtos/carro.dto'
import type { PaginatedResponse } from '@/types/api.types'

const BASE = '/v1/carro'

export const carroService = {
  async list(page = 1, perPage?: number): Promise<PaginatedResponse<Carro>> {
    const { data } = await http.get<PaginatedResponse<Carro>>(BASE, {
      params: { page, ...(perPage != null && { per_page: perPage }) },
    })
    return data
  },

  async show(id: number): Promise<Carro> {
    const { data } = await http.get<Carro>(`${BASE}/${id}`)
    return data
  },

  async create(payload: CreateCarroDto): Promise<Carro> {
    const { data } = await http.post<Carro>(BASE, payload)
    return data
  },

  async update(id: number, payload: UpdateCarroDto): Promise<Carro> {
    const { data } = await http.put<Carro>(`${BASE}/${id}`, payload)
    return data
  },

  async remove(id: number): Promise<void> {
    await http.delete(`${BASE}/${id}`)
  },
}
