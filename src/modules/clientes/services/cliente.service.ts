import http from '@/lib/http'
import type { Cliente } from '@/modules/clientes/types/cliente.types'
import type { CreateClienteDto, UpdateClienteDto } from '@/modules/clientes/dtos/cliente.dto'
import type { PaginatedResponse } from '@/types/api.types'

const BASE = '/v1/cliente'

export const clienteService = {
  list(page = 1, perPage?: number) {
    return http.get<PaginatedResponse<Cliente>>(BASE, {
      params: { page, ...(perPage != null && { per_page: perPage }) },
    })
  },

  show(id: number) {
    return http.get<Cliente>(`${BASE}/${id}`)
  },

  create(data: CreateClienteDto) {
    return http.post<Cliente>(BASE, data)
  },

  update(id: number, data: UpdateClienteDto) {
    return http.put<Cliente>(`${BASE}/${id}`, data)
  },

  remove(id: number) {
    return http.delete(`${BASE}/${id}`)
  },
}
