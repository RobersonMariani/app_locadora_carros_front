import { ref } from 'vue'
import { defineStore } from 'pinia'
import { clienteService } from '@/modules/clientes/services/cliente.service'
import type { Cliente } from '@/modules/clientes/types/cliente.types'
import type { PaginationMeta } from '@/types/api.types'

export const useClientesStore = defineStore('clientes', () => {
  const clientes = ref<Cliente[]>([])
  const loading = ref(false)
  const meta = ref<PaginationMeta>({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
  })

  async function fetchClientes(page = 1) {
    loading.value = true
    try {
      const { data } = await clienteService.list(page)
      clientes.value = data.data
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

  async function deleteCliente(id: number) {
    await clienteService.remove(id)
  }

  return { clientes, loading, meta, fetchClientes, deleteCliente }
})
