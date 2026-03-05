import { ref } from 'vue'
import { defineStore } from 'pinia'
import { pagamentoService } from '@/modules/pagamentos/services/pagamento.service'
import type { Pagamento } from '@/modules/pagamentos/types/pagamento.types'
import type { PaginationMeta } from '@/types/api.types'

export const usePagamentosStore = defineStore('pagamentos', () => {
  const items = ref<Pagamento[]>([])
  const loading = ref(false)
  const meta = ref<PaginationMeta>({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
  })
  const selectedId = ref<number | null>(null)

  async function fetchItems(page = 1, params?: Record<string, unknown>) {
    loading.value = true
    try {
      const { data } = await pagamentoService.list({ page, ...params })
      items.value = data.data
      meta.value = {
        current_page: data.current_page,
        last_page: data.last_page,
        per_page: data.per_page,
        total: data.total,
      }
    } finally {
      loading.value = false
    }
  }

  async function deleteItem(id: number) {
    await pagamentoService.delete(id)
  }

  return { items, meta, loading, selectedId, fetchItems, deleteItem }
})
