import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { carroService } from '@/modules/carros/services/carro.service'
import type { Carro } from '@/modules/carros/types/carro.types'
import type { PaginationMeta } from '@/types/api.types'

export const useCarrosStore = defineStore('carros', () => {
  const carros = ref<Carro[]>([])
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

  async function fetchCarros(page = 1) {
    loading.value = true
    try {
      const response = await carroService.list(page)
      carros.value = response.data
      const meta = (response as { meta?: PaginationMeta }).meta ?? response
      pagination.value = {
        current_page: meta.current_page ?? 1,
        last_page: meta.last_page ?? 1,
        per_page: meta.per_page ?? 15,
        total: meta.total ?? 0,
      }
    } finally {
      loading.value = false
    }
  }

  async function deleteCarro(id: number) {
    await carroService.remove(id)
    carros.value = carros.value.filter((c) => c.id !== id)
  }

  return {
    carros,
    loading,
    pagination,
    hasPages,
    hasPrevious,
    hasNext,
    fetchCarros,
    deleteCarro,
  }
})
