<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { BellIcon } from '@heroicons/vue/24/outline'
import { alertaService } from '@/modules/alertas/services/alerta.service'
import { useAlertaStore } from '@/stores/alerta.store'
import type { Alerta } from '@/modules/alertas/types/alerta.types'
import { formatDateTime } from '@/lib/date'

const router = useRouter()
const alertaStore = useAlertaStore()
const dropdownOpen = ref(false)
const recentAlertas = ref<Alerta[]>([])
const loadingRecent = ref(false)

async function loadRecentAlertas() {
  loadingRecent.value = true
  try {
    const { data } = await alertaService.list({ per_page: 5 })
    recentAlertas.value = data.data ?? []
  } catch {
    recentAlertas.value = []
  } finally {
    loadingRecent.value = false
  }
}

function openDropdown() {
  dropdownOpen.value = true
  loadRecentAlertas()
}

function closeDropdown() {
  dropdownOpen.value = false
}

async function handleMarcarLido(alerta: Alerta) {
  if (alerta.lido) return
  try {
    await alertaStore.marcarLido(alerta.id)
    alerta.lido = true
  } catch {
    // Silently fail
  }
}

async function handleMarcarTodosLidos() {
  try {
    await alertaStore.marcarTodosLidos()
    recentAlertas.value = recentAlertas.value.map((a) => ({ ...a, lido: true }))
    closeDropdown()
  } catch {
    // Silently fail
  }
}

function goToAlertas() {
  closeDropdown()
  router.push({ name: 'alertas' })
}

function getTipoIconClass(tipo: string): string {
  const t = tipo?.toLowerCase() ?? ''
  if (t.includes('atrasad') || t.includes('inadimpl')) return 'text-danger-600'
  if (t.includes('manutencao')) return 'text-warning-600'
  if (t.includes('multa')) return 'text-warning-600'
  return 'text-primary-600'
}

onMounted(() => {
  alertaStore.fetchCount()
  alertaStore.startCountInterval()
})

onUnmounted(() => {
  alertaStore.stopCountInterval()
})
</script>

<template>
  <div class="relative">
    <button
      type="button"
      class="relative flex items-center justify-center rounded-xl p-2 text-surface-500 transition-colors hover:bg-surface-100 hover:text-surface-700"
      @click="openDropdown"
    >
      <BellIcon class="h-5 w-5" />
      <span
        v-if="alertaStore.alertasNaoLidos > 0"
        class="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger-500 px-1 text-[10px] font-bold text-white"
      >
        {{ alertaStore.alertasNaoLidos > 99 ? '99+' : alertaStore.alertasNaoLidos }}
      </span>
    </button>

    <Transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="scale-95 opacity-0"
      enter-to-class="scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="scale-100 opacity-100"
      leave-to-class="scale-95 opacity-0"
    >
      <div
        v-if="dropdownOpen"
        class="absolute right-0 top-full z-50 mt-1 w-80 rounded-xl border border-surface-200 bg-white shadow-xl shadow-surface-200/50"
      >
        <div class="flex items-center justify-between border-b border-surface-100 px-4 py-3">
          <span class="text-sm font-semibold text-surface-900">Alertas</span>
          <button
            v-if="alertaStore.alertasNaoLidos > 0"
            type="button"
            class="text-xs font-medium text-primary-600 hover:text-primary-700"
            @click="handleMarcarTodosLidos"
          >
            Marcar todos como lidos
          </button>
        </div>

        <div class="max-h-72 overflow-y-auto">
          <div v-if="loadingRecent" class="flex justify-center p-6">
            <svg
              class="h-6 w-6 animate-spin text-primary-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
          <div
            v-else-if="recentAlertas.length === 0"
            class="p-6 text-center text-sm text-surface-500"
          >
            Nenhum alerta
          </div>
          <button
            v-else
            v-for="alerta in recentAlertas"
            :key="alerta.id"
            type="button"
            :class="[
              'flex w-full flex-col gap-1 border-b border-surface-50 px-4 py-3 text-left transition-colors last:border-b-0',
              alerta.lido ? 'bg-white hover:bg-surface-50' : 'bg-primary-50/30 hover:bg-primary-50/50',
            ]"
            @click="handleMarcarLido(alerta); goToAlertas()"
          >
            <div class="flex items-start gap-2">
              <span
                :class="['mt-0.5 h-2 w-2 shrink-0 rounded-full', alerta.lido ? 'bg-surface-300' : 'bg-primary-500']"
              />
              <div class="min-w-0 flex-1">
                <p :class="['truncate text-sm font-medium', alerta.lido ? 'text-surface-600' : 'text-surface-900']">
                  {{ alerta.titulo }}
                </p>
                <p class="line-clamp-2 text-xs text-surface-500">{{ alerta.descricao }}</p>
                <p class="mt-1 text-[10px] text-surface-400">{{ formatDateTime(alerta.data_alerta) }}</p>
              </div>
            </div>
          </button>
        </div>

        <div class="border-t border-surface-100 p-2">
          <button
            type="button"
            class="w-full rounded-lg px-3 py-2 text-center text-sm font-medium text-primary-600 transition-colors hover:bg-primary-50"
            @click="goToAlertas"
          >
            Ver todos os alertas
          </button>
        </div>
      </div>
    </Transition>

    <div
      v-if="dropdownOpen"
      class="fixed inset-0 z-40"
      @click="closeDropdown"
    />
  </div>
</template>
