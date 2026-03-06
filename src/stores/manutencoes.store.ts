import { ref } from 'vue'
import { defineStore } from 'pinia'
import { manutencaoService } from '@/modules/manutencoes/services/manutencao.service'
import type { Manutencao } from '@/modules/manutencoes/types/manutencao.types'
import type { PaginationMeta } from '@/types/api.types'

export const useManutencoesStore = defineStore('manutencoes', () => {
  const items = ref<Manutencao[]>([])
  const loading = ref(false)
  const meta = ref<PaginationMeta>({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
  })

  async function fetchItems(
    page = 1,
    params?: { tipo?: string; status?: string; carro_id?: number }
  ) {
    loading.value = true
    try {
      const response = await manutencaoService.list({ page, ...params })
      items.value = response.data ?? []
      meta.value = {
        current_page: response.current_page ?? 1,
        last_page: response.last_page ?? 1,
        per_page: response.per_page ?? 15,
        total: response.total ?? 0,
      }
    } finally {
      loading.value = false
    }
  }

  async function deleteItem(id: number) {
    await manutencaoService.remove(id)
  }

  return { items, meta, loading, fetchItems, deleteItem }
})
