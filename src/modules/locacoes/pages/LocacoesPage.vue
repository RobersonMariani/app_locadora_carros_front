<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppButton from '@/components/ui/AppButton.vue'
import AppModal from '@/components/ui/AppModal.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import FinalizarLocacaoModal from '../components/FinalizarLocacaoModal.vue'
import { usePagination } from '@/composables/usePagination'
import { formatDate } from '@/lib/date'
import { locacaoService } from '../services/locacao.service'
import { useLocacoesStore } from '@/stores/locacoes.store'
import { useUiStore } from '@/stores/ui.store'
import type { Locacao } from '../types/locacao.types'
import type { LocacaoStatus } from '../types/locacao.types'

const router = useRouter()
const locacoesStore = useLocacoesStore()
const uiStore = useUiStore()
const { meta, hasPages, hasPrevious, hasNext, setMeta, goToPage } = usePagination()

const deleteModalOpen = ref(false)
const locacaoToDelete = ref<Locacao | null>(null)
const cancelModalOpen = ref(false)
const locacaoToCancel = ref<Locacao | null>(null)
const finalizarModalOpen = ref(false)
const locacaoToFinalizar = ref<Locacao | null>(null)

async function loadLocacoes(page = 1) {
  await locacoesStore.fetchLocacoes(page)
  setMeta(locacoesStore.meta)
}

function openDeleteModal(locacao: Locacao) {
  locacaoToDelete.value = locacao
  deleteModalOpen.value = true
}

function closeDeleteModal() {
  deleteModalOpen.value = false
  locacaoToDelete.value = null
}

function openCancelModal(locacao: Locacao) {
  locacaoToCancel.value = locacao
  cancelModalOpen.value = true
}

function closeCancelModal() {
  cancelModalOpen.value = false
  locacaoToCancel.value = null
}

function openFinalizarModal(locacao: Locacao) {
  locacaoToFinalizar.value = locacao
  finalizarModalOpen.value = true
}

function closeFinalizarModal() {
  finalizarModalOpen.value = false
  locacaoToFinalizar.value = null
}

async function confirmDelete() {
  if (!locacaoToDelete.value) return
  try {
    await locacoesStore.deleteLocacao(locacaoToDelete.value.id)
    uiStore.notify('success', 'Locação excluída com sucesso.')
    closeDeleteModal()
    await loadLocacoes(meta.value.current_page)
  } catch {
    uiStore.notify('error', 'Erro ao excluir locação.')
  }
}

async function confirmCancel() {
  if (!locacaoToCancel.value) return
  try {
    await locacaoService.cancelar(locacaoToCancel.value.id)
    uiStore.notify('success', 'Locação cancelada com sucesso.')
    closeCancelModal()
    await loadLocacoes(meta.value.current_page)
  } catch {
    uiStore.notify('error', 'Erro ao cancelar locação.')
  }
}

async function handleIniciar(locacao: Locacao) {
  try {
    await locacaoService.iniciar(locacao.id)
    uiStore.notify('success', 'Locação iniciada com sucesso.')
    await loadLocacoes(meta.value.current_page)
  } catch {
    uiStore.notify('error', 'Erro ao iniciar locação.')
  }
}

function onFinalizada() {
  uiStore.notify('success', 'Locação finalizada com sucesso.')
  closeFinalizarModal()
  loadLocacoes(meta.value.current_page)
}

function goPrev() {
  const page = goToPage(meta.value.current_page - 1)
  loadLocacoes(page)
}

function goNext() {
  const page = goToPage(meta.value.current_page + 1)
  loadLocacoes(page)
}

function formatCurrency(valor: number) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function periodoLabel(locacao: Locacao) {
  return `${formatDate(locacao.data_inicio_periodo)} - ${formatDate(locacao.data_final_previsto_periodo)}`
}

onMounted(() => loadLocacoes(1))
</script>

<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-surface-900">Locações</h1>
        <p class="mt-1 text-sm text-surface-500">Controle de locações e devoluções</p>
      </div>
      <AppButton @click="router.push({ name: 'locacoes.create' })"> Nova Locação </AppButton>
    </div>

    <div class="rounded-2xl border border-surface-200 bg-white shadow-sm">
      <div v-if="locacoesStore.loading" class="p-8 text-center text-surface-500">Carregando...</div>

      <div v-else-if="locacoesStore.locacoes.length === 0" class="p-8 text-center text-surface-500">
        Nenhuma locação cadastrada.
      </div>

      <div v-else class="min-w-full divide-y divide-surface-200 overflow-x-auto">
        <table class="min-w-full divide-y divide-surface-200">
          <thead class="bg-surface-50/80">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-surface-500"
              >
                Cliente
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-surface-500"
              >
                Carro
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-surface-500"
              >
                Status
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-surface-500"
              >
                Período
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-surface-500"
              >
                Valor Diária
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-surface-500"
              >
                Valor Total
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-surface-500"
              >
                Ações
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-200 bg-white">
            <tr
              v-for="locacao in locacoesStore.locacoes"
              :key="locacao.id"
              class="transition-colors hover:bg-surface-50"
            >
              <td class="whitespace-nowrap px-6 py-4 text-sm text-surface-900">
                {{ locacao.cliente?.nome ?? '-' }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-surface-900">
                {{ locacao.carro?.placa ?? '-' }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm">
                <StatusBadge
                  :status="(locacao.status as LocacaoStatus)"
                  :label="locacao.status_label"
                />
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-surface-500">
                {{ periodoLabel(locacao) }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-surface-900">
                {{ formatCurrency(locacao.valor_diaria) }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-surface-900">
                {{ locacao.valor_total != null ? formatCurrency(locacao.valor_total) : '-' }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-right text-sm">
                <template v-if="locacao.status === 'reservada'">
                  <AppButton
                    variant="success"
                    size="sm"
                    @click="handleIniciar(locacao)"
                  >
                    Iniciar
                  </AppButton>
                  <AppButton
                    variant="ghost"
                    size="sm"
                    class="ml-2"
                    @click="router.push({ name: 'locacoes.edit', params: { id: locacao.id } })"
                  >
                    Editar
                  </AppButton>
                  <AppButton
                    variant="danger"
                    size="sm"
                    class="ml-2"
                    @click="openCancelModal(locacao)"
                  >
                    Cancelar
                  </AppButton>
                  <AppButton
                    variant="danger"
                    size="sm"
                    class="ml-2"
                    @click="openDeleteModal(locacao)"
                  >
                    Excluir
                  </AppButton>
                </template>
                <template v-else-if="locacao.status === 'ativa'">
                  <AppButton
                    variant="primary"
                    size="sm"
                    @click="openFinalizarModal(locacao)"
                  >
                    Finalizar
                  </AppButton>
                  <AppButton
                    variant="danger"
                    size="sm"
                    class="ml-2"
                    @click="openCancelModal(locacao)"
                  >
                    Cancelar
                  </AppButton>
                </template>
                <template v-else-if="locacao.status === 'finalizada' || locacao.status === 'cancelada'">
                  —
                </template>
              </td>
            </tr>
          </tbody>
        </table>
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

    <AppModal
      :open="deleteModalOpen"
      title="Excluir locação"
      max-width="sm"
      @close="closeDeleteModal"
    >
      <p v-if="locacaoToDelete" class="text-surface-600">
        Tem certeza que deseja excluir esta locação?
        <span v-if="locacaoToDelete.cliente || locacaoToDelete.carro">
          (Cliente: {{ locacaoToDelete.cliente?.nome ?? '-' }}, Carro:
          {{ locacaoToDelete.carro?.placa ?? '-' }})
        </span>
      </p>
      <div class="mt-6 flex justify-end gap-2">
        <AppButton variant="secondary" @click="closeDeleteModal">Cancelar</AppButton>
        <AppButton variant="danger" @click="confirmDelete">Excluir</AppButton>
      </div>
    </AppModal>

    <AppModal
      :open="cancelModalOpen"
      title="Cancelar locação"
      max-width="sm"
      @close="closeCancelModal"
    >
      <p v-if="locacaoToCancel" class="text-surface-600">
        Tem certeza que deseja cancelar esta locação?
        <span v-if="locacaoToCancel.cliente || locacaoToCancel.carro">
          (Cliente: {{ locacaoToCancel.cliente?.nome ?? '-' }}, Carro:
          {{ locacaoToCancel.carro?.placa ?? '-' }})
        </span>
      </p>
      <div class="mt-6 flex justify-end gap-2">
        <AppButton variant="secondary" @click="closeCancelModal">Cancelar</AppButton>
        <AppButton variant="danger" @click="confirmCancel">Cancelar locação</AppButton>
      </div>
    </AppModal>

    <FinalizarLocacaoModal
      :open="finalizarModalOpen"
      :locacao-id="locacaoToFinalizar?.id ?? 0"
      @close="closeFinalizarModal"
      @finalizada="onFinalizada"
    />
  </div>
</template>
