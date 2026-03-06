<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppButton from '@/components/ui/AppButton.vue'
import AppModal from '@/components/ui/AppModal.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import { usePagination } from '@/composables/usePagination'
import { useMultasStore } from '@/stores/multas.store'
import { useUiStore } from '@/stores/ui.store'
import { formatDate } from '@/lib/date'
import { MULTA_STATUS_OPCOES } from '@/modules/multas/types/multa.types'
import type { Multa } from '@/modules/multas/types/multa.types'

const router = useRouter()
const multasStore = useMultasStore()
const uiStore = useUiStore()
const { meta, hasPages, hasPrevious, hasNext, setMeta, goToPage } = usePagination()

const statusFilter = ref('')
const deleteModalOpen = ref(false)
const multaToDelete = ref<Multa | null>(null)

async function loadMultas(page = 1) {
  await multasStore.fetchItems(page, statusFilter.value ? { status: statusFilter.value } : undefined)
  setMeta(multasStore.meta)
}

function openDeleteModal(multa: Multa) {
  multaToDelete.value = multa
  deleteModalOpen.value = true
}

function closeDeleteModal() {
  deleteModalOpen.value = false
  multaToDelete.value = null
}

async function confirmDelete() {
  if (!multaToDelete.value) return
  try {
    await multasStore.deleteItem(multaToDelete.value.id)
    uiStore.notify('success', 'Multa excluída com sucesso.')
    closeDeleteModal()
    await loadMultas(meta.value.current_page)
  } catch {
    uiStore.notify('error', 'Erro ao excluir multa.')
  }
}

function goPrev() {
  const page = goToPage(meta.value.current_page - 1)
  loadMultas(page)
}

function goNext() {
  const page = goToPage(meta.value.current_page + 1)
  loadMultas(page)
}

function formatCurrency(valor: number) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function onFilterChange() {
  loadMultas(1)
}

onMounted(() => loadMultas(1))
</script>

<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-surface-900">Multas</h1>
        <p class="mt-1 text-sm text-surface-500">Controle de multas de trânsito</p>
      </div>
      <AppButton @click="router.push({ name: 'multas.create' })"> Nova Multa </AppButton>
    </div>

    <div class="mb-4 flex gap-4">
      <div class="w-48">
        <AppSelect
          v-model="statusFilter"
          label="Status"
          placeholder="Todos"
          :options="[{ value: '', label: 'Todos' }, ...MULTA_STATUS_OPCOES]"
          @update:model-value="onFilterChange"
        />
      </div>
    </div>

    <div class="rounded-2xl border border-surface-200 bg-white shadow-sm">
      <div v-if="multasStore.loading" class="p-8 text-center text-surface-500">Carregando...</div>

      <div v-else-if="multasStore.items.length === 0" class="p-8 text-center text-surface-500">
        Nenhuma multa cadastrada.
      </div>

      <div v-else class="min-w-full divide-y divide-surface-200 overflow-x-auto">
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
                Descrição
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-surface-500"
              >
                Valor
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-surface-500"
              >
                Data Infração
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-surface-500"
              >
                Status
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
              v-for="multa in multasStore.items"
              :key="multa.id"
              class="transition-colors hover:bg-surface-50"
            >
              <td class="whitespace-nowrap px-6 py-4 text-sm text-surface-900">
                #{{ multa.locacao_id }}
              </td>
              <td class="max-w-xs truncate px-6 py-4 text-sm text-surface-900" :title="multa.descricao">
                {{ multa.descricao }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-surface-900">
                {{ formatCurrency(multa.valor) }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-surface-500">
                {{ formatDate(multa.data_infracao) }}
              </td>
              <td class="whitespace-nowrap px-6 py-4">
                <span
                  :class="[
                    'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
                    multa.status === 'paga' ? 'bg-green-100 text-green-800' : '',
                    multa.status === 'pendente' ? 'bg-amber-100 text-amber-800' : '',
                    multa.status === 'contestada' ? 'bg-blue-100 text-blue-800' : '',
                    multa.status === 'cancelada' ? 'bg-red-100 text-red-800' : '',
                  ]"
                >
                  {{ multa.status_label }}
                </span>
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-right text-sm">
                <AppButton
                  variant="ghost"
                  size="sm"
                  @click="router.push({ name: 'multas.edit', params: { id: multa.id } })"
                >
                  Editar
                </AppButton>
                <AppButton
                  variant="danger"
                  size="sm"
                  class="ml-2"
                  @click="openDeleteModal(multa)"
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
      title="Excluir multa"
      max-width="sm"
      @close="closeDeleteModal"
    >
      <p v-if="multaToDelete" class="text-surface-600">
        Tem certeza que deseja excluir a multa de
        <strong>{{ formatCurrency(multaToDelete.valor) }}</strong> ({{ multaToDelete.descricao }})?
      </p>
      <div class="mt-6 flex justify-end gap-2">
        <AppButton variant="secondary" @click="closeDeleteModal">Cancelar</AppButton>
        <AppButton variant="danger" @click="confirmDelete">Excluir</AppButton>
      </div>
    </AppModal>
  </div>
</template>
