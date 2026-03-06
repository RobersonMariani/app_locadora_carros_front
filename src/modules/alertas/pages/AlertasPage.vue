<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  BellAlertIcon,
  WrenchScrewdriverIcon,
  BanknotesIcon,
  ExclamationCircleIcon,
} from '@heroicons/vue/24/outline'
import AppButton from '@/components/ui/AppButton.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import { usePagination } from '@/composables/usePagination'
import { useAlertaStore } from '@/stores/alerta.store'
import { useUiStore } from '@/stores/ui.store'
import { formatDateTime } from '@/lib/date'
import type { Alerta } from '../types/alerta.types'

const alertaStore = useAlertaStore()
const uiStore = useUiStore()
const { meta, hasPages, hasPrevious, hasNext, setMeta, goToPage } = usePagination()

const filtroTipo = ref<string>('')
const filtroLido = ref<string>('')

const tipoOptions = [
  { value: '', label: 'Todos os tipos' },
  { value: 'locacao_atrasada', label: 'Locação atrasada' },
  { value: 'manutencao_proxima', label: 'Manutenção próxima' },
  { value: 'manutencao_vencida', label: 'Manutenção vencida' },
  { value: 'multa_pendente', label: 'Multa pendente' },
  { value: 'inadimplencia', label: 'Inadimplência' },
]

const lidoOptions = [
  { value: '', label: 'Todos' },
  { value: 'true', label: 'Lidos' },
  { value: 'false', label: 'Não lidos' },
]

async function loadAlertas(page = 1) {
  const params: { tipo?: string; lido?: boolean } = {}
  if (filtroTipo.value) params.tipo = filtroTipo.value
  if (filtroLido.value !== '') params.lido = filtroLido.value === 'true'
  await alertaStore.fetchAlertas(page, params)
  setMeta(alertaStore.meta)
}

function aplicarFiltros() {
  loadAlertas(1)
}

async function handleMarcarLido(alerta: Alerta) {
  if (alerta.lido) return
  try {
    await alertaStore.marcarLido(alerta.id)
    uiStore.notify('success', 'Alerta marcado como lido.')
  } catch {
    uiStore.notify('error', 'Erro ao marcar alerta como lido.')
  }
}

function getTipoIcon(tipo: string) {
  const t = tipo?.toLowerCase() ?? ''
  if (t.includes('atrasad') || t.includes('inadimpl')) return ExclamationCircleIcon
  if (t.includes('manutencao')) return WrenchScrewdriverIcon
  if (t.includes('multa')) return BanknotesIcon
  return BellAlertIcon
}

function getTipoColor(tipo: string): string {
  const t = tipo?.toLowerCase() ?? ''
  if (t.includes('atrasad') || t.includes('inadimpl')) return 'bg-danger-50 text-danger-600'
  if (t.includes('manutencao')) return 'bg-warning-50 text-warning-600'
  if (t.includes('multa')) return 'bg-warning-50 text-warning-600'
  return 'bg-primary-50 text-primary-600'
}

function goPrev() {
  const page = goToPage(meta.value.current_page - 1)
  loadAlertas(page)
}

function goNext() {
  const page = goToPage(meta.value.current_page + 1)
  loadAlertas(page)
}

onMounted(() => {
  loadAlertas(1)
})
</script>

<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-surface-900">Alertas</h1>
        <p class="mt-1 text-sm text-surface-500">Central de notificações e avisos</p>
      </div>
    </div>

    <div class="mb-6 flex flex-wrap items-end gap-4 rounded-2xl border border-surface-200 bg-white p-4 shadow-sm">
      <div class="min-w-[180px]">
        <label class="mb-1 block text-xs font-medium text-surface-500">Tipo</label>
        <AppSelect
          v-model="filtroTipo"
          :options="tipoOptions"
          placeholder="Todos os tipos"
        />
      </div>
      <div class="min-w-[140px]">
        <label class="mb-1 block text-xs font-medium text-surface-500">Status</label>
        <AppSelect
          v-model="filtroLido"
          :options="lidoOptions"
          placeholder="Todos"
        />
      </div>
      <AppButton variant="secondary" @click="aplicarFiltros"> Filtrar </AppButton>
    </div>

    <div class="rounded-2xl border border-surface-200 bg-white shadow-sm">
      <div v-if="alertaStore.loading" class="flex justify-center p-8">
        <svg
          class="h-8 w-8 animate-spin text-primary-500"
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

      <div v-else-if="alertaStore.alertas.length === 0" class="p-8 text-center">
        <BellAlertIcon class="mx-auto h-12 w-12 text-surface-400" />
        <p class="mt-2 text-surface-500">Nenhum alerta encontrado.</p>
      </div>

      <div v-else class="divide-y divide-surface-200">
        <div
          v-for="alerta in alertaStore.alertas"
          :key="alerta.id"
          :class="[
            'flex items-start gap-4 px-6 py-4 transition-colors',
            alerta.lido ? 'bg-white hover:bg-surface-50' : 'bg-primary-50/20 hover:bg-primary-50/40',
          ]"
        >
          <div
            :class="[
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
              getTipoColor(alerta.tipo),
            ]"
          >
            <component :is="getTipoIcon(alerta.tipo)" class="h-5 w-5" />
          </div>
          <div class="min-w-0 flex-1">
            <div class="flex items-start justify-between gap-4">
              <div>
                <p :class="['font-medium', alerta.lido ? 'text-surface-600' : 'text-surface-900']">
                  {{ alerta.titulo }}
                </p>
                <p class="mt-0.5 text-sm text-surface-500">{{ alerta.descricao }}</p>
                <div class="mt-2 flex items-center gap-3 text-xs text-surface-400">
                  <span class="rounded-full bg-surface-100 px-2 py-0.5">{{ alerta.tipo_label }}</span>
                  <span>{{ formatDateTime(alerta.data_alerta) }}</span>
                </div>
              </div>
              <AppButton
                v-if="!alerta.lido"
                variant="ghost"
                size="sm"
                @click="handleMarcarLido(alerta)"
              >
                Marcar como lido
              </AppButton>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="hasPages"
        class="flex items-center justify-between border-t border-surface-200 px-6 py-3"
      >
        <p class="text-sm text-surface-600">
          Página {{ meta.current_page }} de {{ meta.last_page }} ({{ meta.total }} registros)
        </p>
        <div class="flex gap-2">
          <AppButton variant="secondary" size="sm" :disabled="!hasPrevious" @click="goPrev">
            Anterior
          </AppButton>
          <AppButton variant="secondary" size="sm" :disabled="!hasNext" @click="goNext">
            Próxima
          </AppButton>
        </div>
      </div>
    </div>
  </div>
</template>
