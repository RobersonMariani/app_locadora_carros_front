<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { CurrencyDollarIcon } from '@heroicons/vue/24/outline'
import AppButton from '@/components/ui/AppButton.vue'
import AppModal from '@/components/ui/AppModal.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import { usePagination } from '@/composables/usePagination'
import { usePagamentosStore } from '@/stores/pagamentos.store'
import { useUiStore } from '@/stores/ui.store'
import { formatDate } from '@/lib/date'
import type { Pagamento } from '../types/pagamento.types'

const router = useRouter()
const pagamentosStore = usePagamentosStore()
const uiStore = useUiStore()
const { meta, hasPages, hasPrevious, hasNext, setMeta, goToPage } = usePagination()

const deleteModalOpen = ref(false)
const pagamentoToDelete = ref<Pagamento | null>(null)

async function loadPagamentos(page = 1) {
  await pagamentosStore.fetchItems(page)
  setMeta(pagamentosStore.meta)
}

function openDeleteModal(pagamento: Pagamento) {
  pagamentoToDelete.value = pagamento
  deleteModalOpen.value = true
}

function closeDeleteModal() {
  deleteModalOpen.value = false
  pagamentoToDelete.value = null
}

async function confirmDelete() {
  if (!pagamentoToDelete.value) return
  try {
    await pagamentosStore.deleteItem(pagamentoToDelete.value.id)
    uiStore.notify('success', 'Pagamento excluído com sucesso.')
    closeDeleteModal()
    await loadPagamentos(meta.value.current_page)
  } catch {
    uiStore.notify('error', 'Erro ao excluir pagamento.')
  }
}

function goPrev() {
  const page = goToPage(meta.value.current_page - 1)
  loadPagamentos(page)
}

function goNext() {
  const page = goToPage(meta.value.current_page + 1)
  loadPagamentos(page)
}

function formatCurrency(valor: number) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

onMounted(() => loadPagamentos(1))
</script>

<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-surface-900">Pagamentos</h1>
        <p class="mt-1 text-sm text-surface-500">Gerencie os pagamentos das locações</p>
      </div>
      <AppButton @click="router.push({ name: 'pagamentos.create' })"> Novo Pagamento </AppButton>
    </div>

    <div class="rounded-2xl border border-surface-200 bg-white shadow-sm">
      <div v-if="pagamentosStore.loading" class="flex justify-center p-8">
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

      <div v-else-if="pagamentosStore.items.length === 0" class="p-8 text-center">
        <CurrencyDollarIcon class="mx-auto h-12 w-12 text-surface-400" />
        <p class="mt-2 text-surface-500">Nenhum pagamento cadastrado.</p>
      </div>

      <div v-else class="min-w-full overflow-x-auto">
        <table class="min-w-full divide-y divide-surface-200">
          <thead class="bg-surface-50/80">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-surface-500"
              >
                Locação
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-surface-500"
              >
                Valor
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-surface-500"
              >
                Tipo
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-surface-500"
              >
                Método
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-surface-500"
              >
                Status
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-surface-500"
              >
                Data
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
              v-for="pagamento in pagamentosStore.items"
              :key="pagamento.id"
              class="transition-colors hover:bg-surface-50"
            >
              <td class="whitespace-nowrap px-6 py-4 text-sm text-surface-900">
                #{{ pagamento.locacao_id }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-surface-900">
                {{ formatCurrency(pagamento.valor) }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-surface-500">
                {{ pagamento.tipo_label }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-surface-500">
                {{ pagamento.metodo_pagamento_label }}
              </td>
              <td class="whitespace-nowrap px-6 py-4">
                <StatusBadge
                  v-if="pagamento.status"
                  :status="pagamento.status as 'pendente' | 'pago' | 'cancelado'"
                  :label="pagamento.status_label"
                />
                <span v-else class="text-surface-400">—</span>
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-surface-500">
                {{ formatDate(pagamento.data_pagamento) }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-right text-sm">
                <AppButton
                  variant="ghost"
                  size="sm"
                  @click="router.push({ name: 'pagamentos.edit', params: { id: pagamento.id } })"
                >
                  Editar
                </AppButton>
                <AppButton
                  variant="danger"
                  size="sm"
                  class="ml-2"
                  @click="openDeleteModal(pagamento)"
                >
                  Excluir
                </AppButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        v-if="hasPages"
        class="flex items-center justify-between border-t border-surface-200 px-6 py-3"
      >
        <p class="text-sm text-surface-500">
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
      title="Excluir pagamento"
      max-width="sm"
      @close="closeDeleteModal"
    >
      <p v-if="pagamentoToDelete" class="text-surface-600">
        Tem certeza que deseja excluir o pagamento de
        <strong>{{ formatCurrency(pagamentoToDelete.valor) }}</strong> (Locação
        #{{ pagamentoToDelete.locacao_id }})?
      </p>
      <div class="mt-6 flex justify-end gap-2">
        <AppButton variant="secondary" @click="closeDeleteModal">Cancelar</AppButton>
        <AppButton variant="danger" @click="confirmDelete">Excluir</AppButton>
      </div>
    </AppModal>
  </div>
</template>
