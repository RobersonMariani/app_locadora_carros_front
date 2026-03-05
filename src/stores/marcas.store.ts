import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { marcaService } from '@/modules/marcas/services/marca.service'
import type { Marca } from '@/modules/marcas/types/marca.types'
import type { PaginationMeta } from '@/types/api.types'

export const useMarcasStore = defineStore('marcas', () => {
  const marcas = ref<Marca[]>([])
  const loading = ref(false)
  const pagination = ref<PaginationMeta>({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
  })

  const hasPages = computed(() => pagination.value.last_page > 1)
  const hasPrevious = computed(() => pagination.value.current_page > 1)
  const hasNext = computed(() => pagination.value.current_page < pagination.value.last_page)

  async function fetchMarcas(page = 1) {
    loading.value = true
    try {
      const response = await marcaService.list(page)
      marcas.value = response.data
      pagination.value = {
        current_page: response.current_page,
        last_page: response.last_page,
        per_page: response.per_page,
        total: response.total,
      }
    } finally {
      loading.value = false
    }
  }

  async function deleteMarca(id: number) {
    await marcaService.remove(id)
    marcas.value = marcas.value.filter((m) => m.id !== id)
  }

  return {
    marcas,
    loading,
    pagination,
    hasPages,
    hasPrevious,
    hasNext,
    fetchMarcas,
    deleteMarca,
  }
})
