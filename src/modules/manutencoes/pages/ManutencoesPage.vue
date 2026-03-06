<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppButton from '@/components/ui/AppButton.vue'
import AppModal from '@/components/ui/AppModal.vue'
import AppSelect from '@/components/ui/AppSelect.vue'
import { usePagination } from '@/composables/usePagination'
import { useManutencoesStore } from '@/stores/manutencoes.store'
import { useUiStore } from '@/stores/ui.store'
import { formatDate } from '@/lib/date'
import {
  MANUTENCAO_TIPO_OPCOES,
  MANUTENCAO_STATUS_OPCOES,
} from '@/modules/manutencoes/types/manutencao.types'
import type { Manutencao } from '@/modules/manutencoes/types/manutencao.types'

const router = useRouter()
const manutencoesStore = useManutencoesStore()
const uiStore = useUiStore()
const { meta, hasPages, hasPrevious, hasNext, setMeta, goToPage } = usePagination()

const tipoFilter = ref('')
const statusFilter = ref('')
const deleteModalOpen = ref(false)
const manutencaoToDelete = ref<Manutencao | null>(null)

async function loadManutencoes(page = 1) {
  const params: { tipo?: string; status?: string } = {}
  if (tipoFilter.value) params.tipo = tipoFilter.value
  if (statusFilter.value) params.status = statusFilter.value
  await manutencoesStore.fetchItems(page, params)
  setMeta(manutencoesStore.meta)
}

function openDeleteModal(manutencao: Manutencao) {
  manutencaoToDelete.value = manutencao
  deleteModalOpen.value = true
}

function closeDeleteModal() {
  deleteModalOpen.value = false
  manutencaoToDelete.value = null
}

async function confirmDelete() {
  if (!manutencaoToDelete.value) return
  try {
    await manutencoesStore.deleteItem(manutencaoToDelete.value.id)
    uiStore.notify('success', 'Manutenção excluída com sucesso.')
    closeDeleteModal()
    await loadManutencoes(meta.value.current_page)
  } catch {
    uiStore.notify('error', 'Erro ao excluir manutenção.')
  }
}

function goPrev() {
  const page = goToPage(meta.value.current_page - 1)
  loadManutencoes(page)
}

function goNext() {
  const page = goToPage(meta.value.current_page + 1)
  loadManutencoes(page)
}

function formatCurrency(valor: number) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function onFilterChange() {
  loadManutencoes(1)
}

onMounted(() => loadManutencoes(1))
</script>

<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-surface-900">Manutenções</h1>
        <p class="mt-1 text-sm text-surface-500">Controle de manutenções da frota</p>
      </div>
      <AppButton @click="router.push({ name: 'manutencoes.create' })">
        Nova Manutenção
      </AppButton>
    </div>

    <div class="mb-4 flex gap-4">
      <div class="w-48">
        <AppSelect
          v-model="tipoFilter"
          label="Tipo"
          placeholder="Todos"
          :options="[{ value: '', label: 'Todos' }, ...MANUTENCAO_TIPO_OPCOES]"
          @update:model-value="onFilterChange"
        />
      </div>
      <div class="w-48">
        <AppSelect
          v-model="statusFilter"
          label="Status"
          placeholder="Todos"
          :options="[{ value: '', label: 'Todos' }, ...MANUTENCAO_STATUS_OPCOES]"
          @update:model-value="onFilterChange"
        />
      </div>
    </div>

    <div class="rounded-2xl border border-surface-200 bg-white shadow-sm">
      <div v-if="manutencoesStore.loading" class="p-8 text-center text-surface-500">Carregando...</div>

      <div v-else-if="manutencoesStore.items.length === 0" class="p-8 text-center text-surface-500">
        Nenhuma manutenção cadastrada.
      </div>

      <div v-else class="min-w-full divide-y divide-surface-200 overflow-x-auto">
        <table class="min-w-full divide-y divide-surface-200">
          <thead class="bg-surface-50/80">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-surface-500"
              >
                Carro
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-surface-500"
              >
                Tipo
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
                Data
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
              v-for="manutencao in manutencoesStore.items"
              :key="manutencao.id"
              class="transition-colors hover:bg-surface-50"
            >
              <td class="whitespace-nowrap px-6 py-4 text-sm text-surface-900">
                #{{ manutencao.carro_id }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-surface-500">
                {{ manutencao.tipo_label }}
              </td>
              <td class="max-w-xs truncate px-6 py-4 text-sm text-surface-900" :title="manutencao.descricao">
                {{ manutencao.descricao }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-surface-900">
                {{ formatCurrency(manutencao.valor) }}
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-sm text-surface-500">
                {{ formatDate(manutencao.data_manutencao) }}
              </td>
              <td class="whitespace-nowrap px-6 py-4">
                <span
                  :class="[
                    'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
                    manutencao.status === 'concluida' ? 'bg-green-100 text-green-800' : '',
                    manutencao.status === 'agendada' ? 'bg-amber-100 text-amber-800' : '',
                    manutencao.status === 'em_andamento' ? 'bg-blue-100 text-blue-800' : '',
                    manutencao.status === 'cancelada' ? 'bg-red-100 text-red-800' : '',
                  ]"
                >
                  {{ manutencao.status_label }}
                </span>
              </td>
              <td class="whitespace-nowrap px-6 py-4 text-right text-sm">
                <AppButton
                  variant="ghost"
                  size="sm"
                  @click="router.push({ name: 'manutencoes.edit', params: { id: manutencao.id } })"
                >
                  Editar
                </AppButton>
                <AppButton
                  variant="danger"
                  size="sm"
                  class="ml-2"
                  @click="openDeleteModal(manutencao)"
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
      title="Excluir manutenção"
      max-width="sm"
      @close="closeDeleteModal"
    >
      <p v-if="manutencaoToDelete" class="text-surface-600">
        Tem certeza que deseja excluir a manutenção
        <strong>{{ manutencaoToDelete.descricao }}</strong>?
      </p>
      <div class="mt-6 flex justify-end gap-2">
        <AppButton variant="secondary" @click="closeDeleteModal">Cancelar</AppButton>
        <AppButton variant="danger" @click="confirmDelete">Excluir</AppButton>
      </div>
    </AppModal>
  </div>
</template>
