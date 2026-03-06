import { ref } from 'vue'
import { defineStore } from 'pinia'
import { alertaService } from '@/modules/alertas/services/alerta.service'
import type { Alerta } from '@/modules/alertas/types/alerta.types'
import type { PaginationMeta } from '@/types/api.types'

const COUNT_INTERVAL_MS = 60_000

export const useAlertaStore = defineStore('alerta', () => {
  const alertas = ref<Alerta[]>([])
  const alertasNaoLidos = ref(0)
  const loading = ref(false)
  const meta = ref<PaginationMeta>({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
  })

  async function fetchCount() {
    try {
      const { data } = await alertaService.count()
      alertasNaoLidos.value = data.count ?? data
    } catch {
      // Silently fail - count is non-critical
    }
  }

  async function fetchAlertas(page = 1, params?: { tipo?: string; lido?: boolean; per_page?: number }) {
    loading.value = true
    try {
      const { data } = await alertaService.list({ page, ...params })
      alertas.value = data.data ?? []
      const paginationMeta = (data as { meta?: PaginationMeta }).meta
      if (paginationMeta) {
        meta.value = {
          current_page: paginationMeta.current_page,
          last_page: paginationMeta.last_page,
          per_page: paginationMeta.per_page,
          total: paginationMeta.total,
        }
      } else {
        meta.value = {
          current_page: (data as { current_page?: number }).current_page ?? 1,
          last_page: (data as { last_page?: number }).last_page ?? 1,
          per_page: (data as { per_page?: number }).per_page ?? 15,
          total: (data as { total?: number }).total ?? 0,
        }
      }
    } finally {
      loading.value = false
    }
  }

  async function marcarLido(id: number) {
    await alertaService.marcarComoLido(id)
    const alerta = alertas.value.find((a) => a.id === id)
    if (alerta && !alerta.lido) {
      alerta.lido = true
      alertasNaoLidos.value = Math.max(0, alertasNaoLidos.value - 1)
    }
    await fetchCount()
  }

  async function marcarTodosLidos() {
    const { data } = await alertaService.marcarTodosComoLidos()
    const marcados = data.marcados ?? 0
    alertasNaoLidos.value = 0
    alertas.value.forEach((a) => {
      a.lido = true
    })
    return marcados
  }

  let countIntervalId: ReturnType<typeof setInterval> | null = null

  function startCountInterval() {
    if (countIntervalId) return
    countIntervalId = setInterval(fetchCount, COUNT_INTERVAL_MS)
  }

  function stopCountInterval() {
    if (countIntervalId) {
      clearInterval(countIntervalId)
      countIntervalId = null
    }
  }

  return {
    alertas,
    alertasNaoLidos,
    loading,
    meta,
    fetchCount,
    fetchAlertas,
    marcarLido,
    marcarTodosLidos,
    startCountInterval,
    stopCountInterval,
  }
})
