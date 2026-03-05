import { ref } from 'vue'
import { defineStore } from 'pinia'
import { locacaoService } from '@/modules/locacoes/services/locacao.service'
import type { Locacao } from '@/modules/locacoes/types/locacao.types'
import type { PaginationMeta } from '@/types/api.types'

export const useLocacoesStore = defineStore('locacoes', () => {
  const locacoes = ref<Locacao[]>([])
  const loading = ref(false)
  const meta = ref<PaginationMeta>({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
  })

  async function fetchLocacoes(page = 1) {
    loading.value = true
    try {
      const response = await locacaoService.list(page)
      locacoes.value = response.data
      meta.value = {
        current_page: response.current_page,
        last_page: response.last_page,
        per_page: response.per_page,
        total: response.total,
      }
    } finally {
      loading.value = false
    }
  }

  async function deleteLocacao(id: number) {
    await locacaoService.remove(id)
  }

  return { locacoes, loading, meta, fetchLocacoes, deleteLocacao }
})
