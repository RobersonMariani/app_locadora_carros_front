import http from '@/lib/http'
import type { Vistoria } from '@/modules/vistorias/types/vistoria.types'
import type { CreateVistoriaDto } from '@/modules/vistorias/dtos/vistoria.dto'

export const vistoriaService = {
  async create(locacaoId: number, payload: CreateVistoriaDto): Promise<Vistoria> {
    const { data } = await http.post<Vistoria>(`/v1/locacao/${locacaoId}/vistoria`, payload)
    return data
  },

  async listByLocacao(locacaoId: number): Promise<Vistoria[]> {
    const { data } = await http.get<{ data: Vistoria[] }>(`/v1/locacao/${locacaoId}/vistoria`)
    return Array.isArray(data) ? data : (data as { data: Vistoria[] }).data ?? []
  },
}
