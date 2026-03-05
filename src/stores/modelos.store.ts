import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { modeloService } from '@/modules/modelos/services/modelo.service'
import type { Modelo } from '@/modules/modelos/types/modelo.types'
import type { PaginationMeta } from '@/types/api.types'

export const useModelosStore = defineStore('modelos', () => {
  const modelos = ref<Modelo[]>([])
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

  async function fetchModelos(page = 1) {
    loading.value = true
    try {
      const response = await modeloService.list(page)
      modelos.value = response.data
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

  async function deleteModelo(id: number) {
    await modeloService.remove(id)
    modelos.value = modelos.value.filter((m) => m.id !== id)
  }

  return {
    modelos,
    loading,
    pagination,
    hasPages,
    hasPrevious,
    hasNext,
    fetchModelos,
    deleteModelo,
  }
})
