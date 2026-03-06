import { ref } from 'vue'
import { defineStore } from 'pinia'
import { multaService } from '@/modules/multas/services/multa.service'
import type { Multa } from '@/modules/multas/types/multa.types'
import type { PaginationMeta } from '@/types/api.types'

export const useMultasStore = defineStore('multas', () => {
  const items = ref<Multa[]>([])
  const loading = ref(false)
  const meta = ref<PaginationMeta>({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
  })

  async function fetchItems(page = 1, params?: { status?: string }) {
    loading.value = true
    try {
      const response = await multaService.list({ page, ...params })
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
    await multaService.remove(id)
  }

  return { items, meta, loading, fetchItems, deleteItem }
})
