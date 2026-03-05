import http from '@/lib/http'
import type { Marca } from '@/modules/marcas/types/marca.types'
import type { PaginatedResponse } from '@/types/api.types'

const BASE = '/v1/marca'

export const marcaService = {
  async list(page = 1): Promise<PaginatedResponse<Marca>> {
    const { data } = await http.get<PaginatedResponse<Marca>>(BASE, {
      params: { page },
    })
    return data
  },

  async show(id: number): Promise<Marca> {
    const { data } = await http.get<Marca>(`${BASE}/${id}`)
    return data
  },

  async create(formData: FormData): Promise<Marca> {
    const { data } = await http.post<Marca>(BASE, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  async update(id: number, formData: FormData): Promise<Marca> {
    formData.append('_method', 'PUT')
    const { data } = await http.post<Marca>(`${BASE}/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  async remove(id: number): Promise<void> {
    await http.delete(`${BASE}/${id}`)
  },
}
