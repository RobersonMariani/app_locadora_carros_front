import http from '@/lib/http'
import type { Modelo } from '@/modules/modelos/types/modelo.types'
import type { PaginatedResponse } from '@/types/api.types'

const BASE = '/v1/modelo'

export const modeloService = {
  async list(page = 1, perPage = 100): Promise<PaginatedResponse<Modelo>> {
    const { data } = await http.get<PaginatedResponse<Modelo>>(BASE, {
      params: { page, per_page: perPage },
    })
    return data
  },

  async show(id: number): Promise<Modelo> {
    const { data } = await http.get<Modelo>(`${BASE}/${id}`)
    return data
  },

  async create(formData: FormData): Promise<Modelo> {
    const { data } = await http.post<Modelo>(BASE, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  async update(id: number, formData: FormData): Promise<Modelo> {
    formData.append('_method', 'PUT')
    const { data } = await http.post<Modelo>(`${BASE}/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  async remove(id: number): Promise<void> {
    await http.delete(`${BASE}/${id}`)
  },
}
